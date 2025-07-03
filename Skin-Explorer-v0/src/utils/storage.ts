// Local storage utilities for persisting user preferences

interface UserPreferences {
    selectedTheme: "purple" | "gold"
    currentPatch: string
    viewMode: "grid" | "list"
    lastSelectedChampion?: string
    filterSettings?: {
      rarityFilter: string
      legacyFilter: string
      chromaFilter: string
      minSkins: number
      maxSkins: number
      sortBy: "name" | "skins"
    }
  }
  
  const STORAGE_KEYS = {
    USER_PREFERENCES: "skin-explorer-preferences",
    CACHE_VERSION: "skin-explorer-cache-version",
    LAST_UPDATE: "skin-explorer-last-update",
  } as const
  
  // Get user preferences from localStorage
  export const getUserPreferences = (): Partial<UserPreferences> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Failed to load user preferences:", error)
      return {}
    }
  }
  
  // Save user preferences to localStorage
  export const saveUserPreferences = (preferences: Partial<UserPreferences>): void => {
    try {
      const existing = getUserPreferences()
      const updated = { ...existing, ...preferences }
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated))
      console.log("User preferences saved:", updated)
    } catch (error) {
      console.error("Failed to save user preferences:", error)
    }
  }
  
  // Get specific preference with fallback
  export const getPreference = <K extends keyof UserPreferences>(
    key: K,
    fallback: UserPreferences[K],
  ): UserPreferences[K] => {
    const preferences = getUserPreferences()
    return preferences[key] ?? fallback
  }
  
  // Save specific preference
  export const savePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void => {
    saveUserPreferences({ [key]: value })
  }
  
  // Clear all preferences
  export const clearUserPreferences = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES)
      console.log("User preferences cleared")
    } catch (error) {
      console.error("Failed to clear user preferences:", error)
    }
  }
  
  // Cache version management
  export const getCacheVersion = (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CACHE_VERSION)
    } catch (error) {
      console.error("Failed to get cache version:", error)
      return null
    }
  }
  
  export const setCacheVersion = (version: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CACHE_VERSION, version)
    } catch (error) {
      console.error("Failed to set cache version:", error)
    }
  }
  
  // Last update timestamp
  export const getLastUpdate = (): number => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE)
      return stored ? Number.parseInt(stored, 10) : 0
    } catch (error) {
      console.error("Failed to get last update:", error)
      return 0
    }
  }
  
  export const setLastUpdate = (timestamp: number = Date.now()): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, timestamp.toString())
    } catch (error) {
      console.error("Failed to set last update:", error)
    }
  }
  
  // Export storage utilities
  export const storage = {
    getUserPreferences,
    saveUserPreferences,
    getPreference,
    savePreference,
    clearUserPreferences,
    getCacheVersion,
    setCacheVersion,
    getLastUpdate,
    setLastUpdate,
  }
  
  export default storage
  