export type Align = "left" | "center" | "right"
export type VerticalPosition = "top" | "bottom"
export type LastPageMode = "lastPage" | "everyPage"

export interface RegionConfig {
  enabled: boolean
  text: string
  align: Align
  position: VerticalPosition
  fontSize: number
  color: string
  marginPt: number
  showLogo: boolean
  linkUrl: string
  utmSource: string
  utmMedium: string
  containerEnabled: boolean
  containerBackground: string
  containerBorderColor: string
  containerBorderWidth: number
  containerBorderRadius: number
  containerPaddingTop: number
  containerPaddingRight: number
  containerPaddingBottom: number
  containerPaddingLeft: number
}

export interface LastPageConfig {
  enabled: boolean
  mode: LastPageMode
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  stripBackground: string
  stripBorderRadius: number
  showLogo: boolean
  leftText: string
  leftFontSize: number
  leftColor: string
  rightText: string
  rightLinkUrl: string
  rightUtmSource: string
  rightUtmMedium: string
  rightFontSize: number
  rightColor: string
  rightContainerEnabled: boolean
  rightContainerBackground: string
  rightContainerBorderColor: string
  rightContainerBorderWidth: number
  rightContainerBorderRadius: number
  rightContainerPaddingTop: number
  rightContainerPaddingRight: number
  rightContainerPaddingBottom: number
  rightContainerPaddingLeft: number
}

export interface HeaderFooterConfig {
  region: RegionConfig
  lastPage: LastPageConfig
}

export const defaultRegionConfig = (overrides: Partial<RegionConfig> = {}): RegionConfig => ({
  enabled: false,
  text: "",
  align: "right",
  position: "top",
  fontSize: 10,
  color: "#000000",
  marginPt: 16,
  showLogo: true,
  linkUrl: "https://hwschool.online/",
  utmSource: "",
  utmMedium: "",
  containerEnabled: true,
  containerBackground: "#ffffff",
  containerBorderColor: "#e5e5e5",
  containerBorderWidth: 1,
  containerBorderRadius: 10,
  containerPaddingTop: 6,
  containerPaddingRight: 8,
  containerPaddingBottom: 6,
  containerPaddingLeft: 8,
  ...overrides,
})

export const defaultLastPageConfig = (
  overrides: Partial<LastPageConfig> = {},
): LastPageConfig => ({
  enabled: true,
  mode: "lastPage",
  paddingTop: 16,
  paddingRight: 16,
  paddingBottom: 16,
  paddingLeft: 16,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  stripBackground: "#ffffff",
  stripBorderRadius: 0,
  showLogo: true,
  leftText: "Материал разработан методической командой детской онлайн-школы Hello World",
  leftFontSize: 10,
  leftColor: "#666666",
  rightText: "Перейти на сайт",
  rightLinkUrl: "https://hwschool.online/",
  rightUtmSource: "",
  rightUtmMedium: "",
  rightFontSize: 10,
  rightColor: "#ffffff",
  rightContainerEnabled: true,
  rightContainerBackground: "#155DFC",
  rightContainerBorderColor: "#155DFC",
  rightContainerBorderWidth: 1,
  rightContainerBorderRadius: 8,
  rightContainerPaddingTop: 6,
  rightContainerPaddingRight: 10,
  rightContainerPaddingBottom: 6,
  rightContainerPaddingLeft: 10,
  ...overrides,
})

export const defaultConfig: HeaderFooterConfig = {
  region: defaultRegionConfig({ text: "hwschool.online", enabled: true, position: "top" }),
  lastPage: defaultLastPageConfig(),
}
