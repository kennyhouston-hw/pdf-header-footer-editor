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

const FONT_URL = "/fonts/PTSans-Regular.ttf"
const LOGO_URL = "/images/logo.svg"
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

let cachedLogoPngBytes: ArrayBuffer | null = null

async function loadLogoPngBytes(): Promise<ArrayBuffer> {
  if (!cachedLogoPngBytes) {
    const res = await fetch(LOGO_URL)
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
      const canvas = document.createElement("canvas")
      canvas.width = LOGO_RASTER_SIZE
      canvas.height = LOGO_RASTER_SIZE
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas 2D недоступен")
      ctx.drawImage(image, 0, 0, LOGO_RASTER_SIZE, LOGO_RASTER_SIZE)
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Не удалось конвертировать логотип в PNG"))),
          "image/png",
        ),
      )
      cachedLogoPngBytes = await blob.arrayBuffer()
    } finally {
      URL.revokeObjectURL(svgUrl)
    }
  }
  return cachedLogoPngBytes
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
  y: number,
) {
  if (!region.enabled || !region.text.trim()) return
  const { width } = page.getSize()
  const textWidth = font.widthOfTextAtSize(region.text, region.fontSize)
  const x = xForAlign(region.align, width, textWidth, region.marginPt)
  const ascent = region.fontSize * 0.8
  const descent = region.fontSize * 0.2

  let linkRect: [number, number, number, number] = [x, y - descent, x + textWidth, y + ascent]

  if (region.containerEnabled) {
    const padding = region.containerPaddingPt
    const boxWidth = textWidth + padding * 2
    const boxHeight = ascent + descent + padding * 2
    const boxX = x - padding
    const boxBottom = y - descent - padding
    const boxTop = boxBottom + boxHeight
    page.drawSvgPath(roundedRectPath(boxWidth, boxHeight, region.containerBorderRadius), {
      x: boxX,
      y: boxTop,
      color: hexToRgb(region.containerBackground),
      borderColor: region.containerBorderWidth > 0 ? hexToRgb(region.containerBorderColor) : undefined,
      borderWidth: region.containerBorderWidth > 0 ? region.containerBorderWidth : undefined,
    })
    linkRect = [boxX, boxBottom, boxX + boxWidth, boxTop]
  }

  page.drawText(region.text, {
    x,
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
  const marginPt = 24
  const stripPaddingPt = 16
  const logoSize = 28
  const logoTextGap = 12
  const color = hexToRgb("#666666")
  const rightText = config.rightText.trim()
  const rightTextWidth = rightText ? font.widthOfTextAtSize(rightText, fontSize) : 0
  const gapPt = 12

  let logoImage: PDFImage | null = null
  if (config.showLogo) {
    const logoBytes = await loadLogoPngBytes()
    logoImage = await pdfDoc.embedPng(logoBytes)
  }

  const leftTextX = marginPt + (logoImage ? logoSize + logoTextGap : 0)
  const leftMaxWidth = width - leftTextX - marginPt - (rightTextWidth > 0 ? rightTextWidth + gapPt : 0)

  const leftLines = config.leftText.trim()
    ? layoutMultilineText(config.leftText.trim(), {
        alignment: TextAlignment.Left,
        fontSize,
        font,
        bounds: { x: 0, y: 0, width: leftMaxWidth, height: 1_000_000 },
      }).lines
    : []
  const ascent = font.heightAtSize(fontSize, { descender: false })
  const totalHeight = font.heightAtSize(fontSize)
  const descent = totalHeight - ascent
  const lineHeight = totalHeight * 1.2

  const lineCount = Math.max(leftLines.length, 1)
  const textVisualHeight = leftLines.length > 0 || rightText ? totalHeight + (lineCount - 1) * lineHeight : 0
  const contentHeight = Math.max(textVisualHeight, logoImage ? logoSize : 0, totalHeight)
  const stripHeight = contentHeight + stripPaddingPt * 2

  const page = pdfDoc.addPage([width, stripHeight])

  if (logoImage) {
    const logoY = stripHeight / 2 - logoSize / 2
    page.drawImage(logoImage, { x: marginPt, y: logoY, width: logoSize, height: logoSize })
  }

  const firstBaseline = stripHeight / 2 + textVisualHeight / 2 - ascent

  leftLines.forEach((line, idx) => {
    page.drawText(line.text, {
      x: leftTextX,
      y: firstBaseline - idx * lineHeight,
      size: fontSize,
      font,
      color,
    })
  })

  if (rightText) {
    const x = width - marginPt - rightTextWidth
    const y = stripHeight / 2 - (ascent - descent) / 2
    page.drawText(rightText, { x, y, size: fontSize, font, color })

    const rightLinkUrl = buildLinkUrl(config.rightLinkUrl, config.rightUtmSource, config.rightUtmMedium)
    if (rightLinkUrl) {
      addLinkAnnotation(page, rightLinkUrl, [x, y - descent, x + rightTextWidth, y + ascent])
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

  for (const page of pdfDoc.getPages()) {
    const { height } = page.getSize()
    drawRegion(page, config.header, font, height - config.header.marginPt - config.header.fontSize)
    drawRegion(page, config.footer, font, config.footer.marginPt)
  }

  await drawLastPage(pdfDoc, font, config.lastPage)

  return pdfDoc.save()
}
