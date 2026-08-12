import { create } from "zustand"
import {
  defaultConfig,
  type HeaderFooterConfig,
  type LastPageConfig,
  type RegionConfig,
} from "@/lib/types"

interface UtmOverride {
  source: boolean
  medium: boolean
}

interface ConfigStore {
  config: HeaderFooterConfig
  footerUtmOverride: UtmOverride
  lastPageUtmOverride: UtmOverride
  updateRegion: (region: "header" | "footer", patch: Partial<RegionConfig>) => void
  updateLastPage: (patch: Partial<LastPageConfig>) => void
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: defaultConfig,
  footerUtmOverride: { source: false, medium: false },
  lastPageUtmOverride: { source: false, medium: false },

  updateRegion: (region, patch) =>
    set((state) => {
      const config: HeaderFooterConfig = {
        ...state.config,
        [region]: { ...state.config[region], ...patch },
      }

      if (region === "header") {
        if ("utmSource" in patch && !state.footerUtmOverride.source) {
          config.footer = { ...config.footer, utmSource: patch.utmSource! }
        }
        if ("utmMedium" in patch && !state.footerUtmOverride.medium) {
          config.footer = { ...config.footer, utmMedium: patch.utmMedium! }
        }
        if ("utmSource" in patch && !state.lastPageUtmOverride.source) {
          config.lastPage = { ...config.lastPage, rightUtmSource: patch.utmSource! }
        }
        if ("utmMedium" in patch && !state.lastPageUtmOverride.medium) {
          config.lastPage = { ...config.lastPage, rightUtmMedium: patch.utmMedium! }
        }
        return { config }
      }

      // region === "footer": manual edits decouple it from header's auto-sync
      if ("utmSource" in patch || "utmMedium" in patch) {
        return {
          config,
          footerUtmOverride: {
            source: state.footerUtmOverride.source || "utmSource" in patch,
            medium: state.footerUtmOverride.medium || "utmMedium" in patch,
          },
        }
      }
      return { config }
    }),

  updateLastPage: (patch) =>
    set((state) => {
      const config: HeaderFooterConfig = {
        ...state.config,
        lastPage: { ...state.config.lastPage, ...patch },
      }

      if ("rightUtmSource" in patch || "rightUtmMedium" in patch) {
        return {
          config,
          lastPageUtmOverride: {
            source: state.lastPageUtmOverride.source || "rightUtmSource" in patch,
            medium: state.lastPageUtmOverride.medium || "rightUtmMedium" in patch,
          },
        }
      }
      return { config }
    }),
}))
