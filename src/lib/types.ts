export type Align = "left" | "center" | "right"

export interface RegionConfig {
  enabled: boolean
  text: string
  align: Align
  fontSize: number
  color: string
  marginPt: number
  linkUrl: string
  utmSource: string
  utmMedium: string
  containerEnabled: boolean
  containerBackground: string
  containerBorderColor: string
  containerBorderWidth: number
  containerBorderRadius: number
  containerPaddingPt: number
}

export interface LastPageConfig {
  enabled: boolean
  showLogo: boolean
  leftText: string
  rightText: string
  rightLinkUrl: string
  rightUtmSource: string
  rightUtmMedium: string
}

export interface HeaderFooterConfig {
  header: RegionConfig
  footer: RegionConfig
  lastPage: LastPageConfig
}

export const defaultRegionConfig = (overrides: Partial<RegionConfig> = {}): RegionConfig => ({
  enabled: false,
  text: "",
  align: "right",
  fontSize: 10,
  color: "#ffffff",
  marginPt: 24,
  linkUrl: "https://hwschool.online/",
  utmSource: "",
  utmMedium: "",
  containerEnabled: true,
  containerBackground: "#000000",
  containerBorderColor: "#cccccc",
  containerBorderWidth: 0,
  containerBorderRadius: 6,
  containerPaddingPt: 6,
  ...overrides,
})

export const defaultLastPageConfig = (
  overrides: Partial<LastPageConfig> = {},
): LastPageConfig => ({
  enabled: true,
  showLogo: true,
  leftText: "Материал разработан методической командой детской онлайн-школы Hello World.",
  rightText: "hwschool.online",
  rightLinkUrl: "https://hwschool.online/",
  rightUtmSource: "",
  rightUtmMedium: "",
  ...overrides,
})

export const defaultConfig: HeaderFooterConfig = {
  header: defaultRegionConfig({ text: "hwschool.online", enabled: true }),
  footer: defaultRegionConfig({ text: "" }),
  lastPage: defaultLastPageConfig(),
}
