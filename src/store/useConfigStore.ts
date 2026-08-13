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
  lastPageUtmOverride: UtmOverride
  updateRegion: (patch: Partial<RegionConfig>) => void
  updateLastPage: (patch: Partial<LastPageConfig>) => void
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: defaultConfig,
  lastPageUtmOverride: { source: false, medium: false },

  updateRegion: (patch) =>
    set((state) => {
      const config: HeaderFooterConfig = {
        ...state.config,
        region: { ...state.config.region, ...patch },
      }

      if ("utmSource" in patch && !state.lastPageUtmOverride.source) {
        config.lastPage = { ...config.lastPage, rightUtmSource: patch.utmSource! }
      }
      if ("utmMedium" in patch && !state.lastPageUtmOverride.medium) {
        config.lastPage = { ...config.lastPage, rightUtmMedium: patch.utmMedium! }
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
