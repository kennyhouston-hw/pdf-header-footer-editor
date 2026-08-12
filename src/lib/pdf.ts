import {
  layoutMultilineText,
  PDFDocument,
  PDFString,
  rgb,
  TextAlignment,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import type { Align, HeaderFooterConfig, LastPageConfig, RegionConfig } from "@/lib/types"
import { buildLinkUrl } from "@/lib/url"

const FONT_URL = `${import.meta.env.BASE_URL}fonts/GolosText-Regular.ttf`
const LOGO_URL = `${import.meta.env.BASE_URL}images/logo.svg`
const LOGO_MONO_URL = `${import.meta.env.BASE_URL}images/logo-mono.svg`
const LOGO_RASTER_SIZE = 256

let cachedFontBytes: ArrayBuffer | null = null

async function loadFontBytes(): Promise<ArrayBuffer> {
  if (!cachedFontBytes) {
    const res = await fetch(FONT_URL)
    if (!res.ok) throw new Error("Не удалось загрузить шрифт для встраивания")
    cachedFontBytes = await res.arrayBuffer()
  }
  return cachedFontBytes
}

const svgPngCache = new Map<string, Promise<ArrayBuffer>>()

function loadSvgAsPngBytes(url: string): Promise<ArrayBuffer> {
  let cached = svgPngCache.get(url)
  if (!cached) {
    cached = rasterizeSvgToPng(url)
    svgPngCache.set(url, cached)
  }
  return cached
}

async function rasterizeSvgToPng(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Не удалось загрузить логотип")
  const svgText = await res.text()
  const svgUrl = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml" }))
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("Не удалось отрисовать логотип"))
      img.src = svgUrl
    })
    const aspect = image.naturalWidth / image.naturalHeight
    const canvas = document.createElement("canvas")
    canvas.width = aspect >= 1 ? LOGO_RASTER_SIZE : Math.round(LOGO_RASTER_SIZE * aspect)
    canvas.height = aspect >= 1 ? Math.round(LOGO_RASTER_SIZE / aspect) : LOGO_RASTER_SIZE
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas 2D недоступен")
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Не удалось конвертировать логотип в PNG"))),
        "image/png",
      ),
    )
    return await blob.arrayBuffer()
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

function fontMetrics(font: PDFFont, fontSize: number) {
  const ascent = font.heightAtSize(fontSize, { descender: false })
  const descent = font.heightAtSize(fontSize) - ascent
  return { ascent, descent }
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "")
  const r = parseInt(normalized.substring(0, 2), 16) / 255
  const g = parseInt(normalized.substring(2, 4), 16) / 255
  const b = parseInt(normalized.substring(4, 6), 16) / 255
  return rgb(r, g, b)
}

function xForAlign(align: Align, pageWidth: number, textWidth: number, marginPt: number) {
  if (align === "left") return marginPt
  if (align === "right") return pageWidth - marginPt - textWidth
  return (pageWidth - textWidth) / 2
}

function roundedRectPath(width: number, height: number, radius: number) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))
  if (r === 0) return `M0,0 H${width} V${height} H0 Z`
  return [
    `M${r},0`,
    `H${width - r}`,
    `A${r},${r} 0 0 1 ${width},${r}`,
    `V${height - r}`,
    `A${r},${r} 0 0 1 ${width - r},${height}`,
    `H${r}`,
    `A${r},${r} 0 0 1 0,${height - r}`,
    `V${r}`,
    `A${r},${r} 0 0 1 ${r},0`,
    "Z",
  ].join(" ")
}

function addLinkAnnotation(page: PDFPage, url: string, rect: [number, number, number, number]) {
  const context = page.doc.context
  const linkAnnotationRef = context.register(
    context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: rect,
      Border: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: PDFString.of(url),
      },
    }),
  )
  page.node.addAnnot(linkAnnotationRef)
}

function drawRegion(
  page: PDFPage,
  region: RegionConfig,
  font: PDFFont,
  anchor: "top" | "bottom",
  logoImage: PDFImage | null,
) {
  if (!region.enabled || !region.text.trim()) return
  const { width, height } = page.getSize()
  const textWidth = font.widthOfTextAtSize(region.text, region.fontSize)
  const { ascent, descent } = fontMetrics(font, region.fontSize)

  const showLogo = region.showLogo && logoImage !== null
  const logoHeight = showLogo ? region.fontSize * 1.5 : 0
  const logoWidth = showLogo ? logoHeight * (logoImage!.width / logoImage!.height) : 0
  const logoGap = showLogo ? region.fontSize * 0.5 : 0

  const totalWidth = logoWidth + logoGap + textWidth
  const padTop = region.containerEnabled ? region.containerPaddingTop : 0
  const padRight = region.containerEnabled ? region.containerPaddingRight : 0
  const padBottom = region.containerEnabled ? region.containerPaddingBottom : 0
  const padLeft = region.containerEnabled ? region.containerPaddingLeft : 0

  const outerWidth = totalWidth + padLeft + padRight
  const boxX = xForAlign(region.align, width, outerWidth, region.marginPt)
  const startX = boxX + padLeft
  const textX = startX + logoWidth + logoGap

  // The outer box (text/logo + container padding) is anchored to marginPt, not the raw text —
  // so a container's padding never bleeds past the configured margin.
  const contentHeight = Math.max(ascent + descent, logoHeight)
  const outerHeight = contentHeight + padTop + padBottom
  const boxBottom = anchor === "top" ? height - region.marginPt - outerHeight : region.marginPt
  const boxTop = boxBottom + outerHeight
  const centerY = boxBottom + padBottom + contentHeight / 2
  const y = centerY - (ascent - descent) / 2

  let linkRect: [number, number, number, number] = [
    startX,
    centerY - contentHeight / 2,
    startX + totalWidth,
    centerY + contentHeight / 2,
  ]

  if (region.containerEnabled) {
    page.drawSvgPath(roundedRectPath(outerWidth, outerHeight, region.containerBorderRadius), {
      x: boxX,
      y: boxTop,
      color: hexToRgb(region.containerBackground),
      borderColor: region.containerBorderWidth > 0 ? hexToRgb(region.containerBorderColor) : undefined,
      borderWidth: region.containerBorderWidth > 0 ? region.containerBorderWidth : undefined,
    })
    linkRect = [boxX, boxBottom, boxX + outerWidth, boxTop]
  }

  if (showLogo) {
    page.drawImage(logoImage!, {
      x: startX,
      y: centerY - logoHeight / 2,
      width: logoWidth,
      height: logoHeight,
    })
  }

  page.drawText(region.text, {
    x: textX,
    y,
    size: region.fontSize,
    font,
    color: hexToRgb(region.color),
  })

  const regionLinkUrl = buildLinkUrl(region.linkUrl, region.utmSource, region.utmMedium)
  if (regionLinkUrl) {
    addLinkAnnotation(page, regionLinkUrl, linkRect)
  }
}

async function drawLastPage(pdfDoc: PDFDocument, font: PDFFont, config: LastPageConfig) {
  if (!config.enabled) return

  const existingPages = pdfDoc.getPages()
  const width = existingPages.length > 0 ? existingPages[existingPages.length - 1].getSize().width : 595.28

  const fontSize = 10
  const marginPt = config.marginPt
  const stripPaddingPt = 16
  const logoHeight = 32
  const logoTextGap = 12
  const leftColor = hexToRgb("#666666")
  const rightColor = hexToRgb(config.rightColor)
  const rightText = config.rightText.trim()
  const rightTextWidth = rightText ? font.widthOfTextAtSize(rightText, config.rightFontSize) : 0
  const gapPt = 60

  const rightPadTop = config.rightContainerEnabled ? config.rightContainerPaddingTop : 0
  const rightPadRight = config.rightContainerEnabled ? config.rightContainerPaddingRight : 0
  const rightPadBottom = config.rightContainerEnabled ? config.rightContainerPaddingBottom : 0
  const rightPadLeft = config.rightContainerEnabled ? config.rightContainerPaddingLeft : 0
  const rightOuterWidth = rightTextWidth + rightPadLeft + rightPadRight

  let logoImage: PDFImage | null = null
  if (config.showLogo) {
    const logoBytes = await loadSvgAsPngBytes(LOGO_URL)
    logoImage = await pdfDoc.embedPng(logoBytes)
  }
  const logoWidth = logoImage ? logoHeight * (logoImage.width / logoImage.height) : 0

  const leftTextX = marginPt + (logoImage ? logoWidth + logoTextGap : 0)
  const leftMaxWidth = width - leftTextX - marginPt - (rightText ? rightOuterWidth + gapPt : 0)

  const leftLines = config.leftText.trim()
    ? layoutMultilineText(config.leftText.trim(), {
        alignment: TextAlignment.Left,
        fontSize,
        font,
        bounds: { x: 0, y: 0, width: leftMaxWidth, height: 1_000_000 },
      }).lines
    : []
  const { ascent, descent } = fontMetrics(font, fontSize)
  const totalHeight = ascent + descent
  const lineHeight = totalHeight * 1.2

  const { ascent: rightAscent, descent: rightDescent } = fontMetrics(font, config.rightFontSize)
  const rightTotalHeight = rightAscent + rightDescent
  const rightBlockHeight = rightText ? rightTotalHeight + rightPadTop + rightPadBottom : 0

  const lineCount = Math.max(leftLines.length, 1)
  const textVisualHeight = leftLines.length > 0 || rightText ? totalHeight + (lineCount - 1) * lineHeight : 0
  const contentHeight = Math.max(textVisualHeight, logoImage ? logoHeight : 0, totalHeight, rightBlockHeight)
  const stripHeight = contentHeight + stripPaddingPt * 2

  const page = pdfDoc.addPage([width, stripHeight])

  if (logoImage) {
    const logoY = stripHeight / 2 - logoHeight / 2
    page.drawImage(logoImage, { x: marginPt, y: logoY, width: logoWidth, height: logoHeight })
  }

  const firstBaseline = stripHeight / 2 + textVisualHeight / 2 - ascent

  leftLines.forEach((line, idx) => {
    page.drawText(line.text, {
      x: leftTextX,
      y: firstBaseline - idx * lineHeight,
      size: fontSize,
      font,
      color: leftColor,
    })
  })

  if (rightText) {
    const boxX = width - marginPt - rightOuterWidth
    const x = boxX + rightPadLeft
    const y = stripHeight / 2 - (rightAscent - rightDescent) / 2

    let linkRect: [number, number, number, number] = [x, y - rightDescent, x + rightTextWidth, y + rightAscent]

    if (config.rightContainerEnabled) {
      const boxHeight = rightTotalHeight + rightPadTop + rightPadBottom
      const boxBottom = y - rightDescent - rightPadBottom
      const boxTop = boxBottom + boxHeight
      page.drawSvgPath(roundedRectPath(rightOuterWidth, boxHeight, config.rightContainerBorderRadius), {
        x: boxX,
        y: boxTop,
        color: hexToRgb(config.rightContainerBackground),
        borderColor:
          config.rightContainerBorderWidth > 0 ? hexToRgb(config.rightContainerBorderColor) : undefined,
        borderWidth: config.rightContainerBorderWidth > 0 ? config.rightContainerBorderWidth : undefined,
      })
      linkRect = [boxX, boxBottom, boxX + rightOuterWidth, boxTop]
    }

    page.drawText(rightText, { x, y, size: config.rightFontSize, font, color: rightColor })

    const rightLinkUrl = buildLinkUrl(config.rightLinkUrl, config.rightUtmSource, config.rightUtmMedium)
    if (rightLinkUrl) {
      addLinkAnnotation(page, rightLinkUrl, linkRect)
    }
  }
}

export async function applyHeaderFooter(
  fileBytes: ArrayBuffer,
  config: HeaderFooterConfig,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBytes)
  pdfDoc.registerFontkit(fontkit)

  const fontBytes = await loadFontBytes()
  const font = await pdfDoc.embedFont(fontBytes, { subset: true })

  let regionLogoImage: PDFImage | null = null
  if (config.header.showLogo || config.footer.showLogo) {
    const logoBytes = await loadSvgAsPngBytes(LOGO_MONO_URL)
    regionLogoImage = await pdfDoc.embedPng(logoBytes)
  }

  for (const page of pdfDoc.getPages()) {
    drawRegion(page, config.header, font, "top", regionLogoImage)
    drawRegion(page, config.footer, font, "bottom", regionLogoImage)
  }

  await drawLastPage(pdfDoc, font, config.lastPage)

  return pdfDoc.save()
}
