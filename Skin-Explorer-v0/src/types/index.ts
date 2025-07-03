export interface Champion {
  id: string
  key: string
  name: string
  title: string
  image: {
    full: string
  }
  skins: Skin[]
  lore?: string
}

export interface Skin {
  id: string
  num: number
  name: string
  chromas?: boolean
}

export interface DetailedSkinData {
  id: number
  rarity?: string
  isLegacy?: boolean
  skinLines?: { id: number }[]
  chromas?: ChromaData[]
}

export interface ChromaData {
  id: string
  name: string
}

export type ThemeType = "purple" | "gold"

export interface AppState {
  availablePatches: string[]
  allChampionDetails: Record<string, Champion>
  allDetailedSkinsData: Map<string, DetailedSkinData>
  allSkinLinesData: Map<number, string>
  selectedChampion: Champion | null
  selectedSkin: Skin | null
  isLoading: boolean
  currentPatch: string
  selectedTheme: ThemeType
  isSettingsOpen: boolean
  isChromaModalOpen: boolean
  searchQuery: string
  loadingMessage: string
}

export interface SkinCardProps {
  skin: Skin
  champion: Champion
  detailedData?: DetailedSkinData
  seriesName?: string
  onChromaClick: () => void
}

export interface ChromaModalProps {
  isOpen: boolean
  onClose: () => void
  skin: Skin | null
  champion: Champion | null
  chromas: ChromaData[]
}
