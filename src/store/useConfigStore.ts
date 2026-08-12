import { create } from "zustand"
import {
  defaultConfig,
  type HeaderFooterConfig,
  type LastPageConfig,
  type RegionConfig,
} from "@/lib/types"

interface ConfigStore {
  config: HeaderFooterConfig
  updateRegion: (region: "header" | "footer", patch: Partial<RegionConfig>) => void
  updateLastPage: (patch: Partial<LastPageConfig>) => void
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: defaultConfig,
  updateRegion: (region, patch) =>
    set((state) => ({
      config: {
        ...state.config,
        [region]: { ...state.config[region], ...patch },
      },
    })),
  updateLastPage: (patch) =>
    set((state) => ({
      config: {
        ...state.config,
        lastPage: { ...state.config.lastPage, ...patch },
      },
    })),
}))
