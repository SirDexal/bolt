"use client"

// App.tsx

import { useState, useEffect } from "react"
import Header from "./components/Header"
import ChampionGrid from "./components/ChampionGrid"
import SkinGrid from "./components/SkinGrid"
import ChromaModal from "./components/ChromaModal"
import SettingsModal from "./components/SettingsModal"
import type { Champion, Skin, AppState, ThemeType } from "./types"
import { getLatestPatch, fetchAllChampionDetails, fetchAllDetailedSkinsData, fetchAllSkinLines } from "./services/api"
import { getPreference, savePreference } from "./utils/storage"

function App() {
  const [state, setState] = useState<AppState>({
    availablePatches: [],
    allChampionDetails: {},
    allDetailedSkinsData: new Map(),
    allSkinLinesData: new Map(),
    selectedChampion: null,
    selectedSkin: null,
    isLoading: true,
    currentPatch: "",
    selectedTheme: "purple",
    isSettingsOpen: false,
    isChromaModalOpen: false,
    searchQuery: "",
    loadingMessage: "We are getting latest info...",
  })

  const [chromaModalData, setChromaModalData] = useState<{
    skin: Skin | null
    champion: Champion | null
    chromas: any[]
  }>({
    skin: null,
    champion: null,
    chromas: [],
  })

  // Load saved preferences on app start
  useEffect(() => {
    const savedTheme = getPreference("selectedTheme", "purple")
    const savedPatch = getPreference("currentPatch", "")

    setState((prev) => ({
      ...prev,
      selectedTheme: savedTheme,
      currentPatch: savedPatch,
    }))
  }, [])

  // Apply theme to CSS variables
  useEffect(() => {
    const applyTheme = (theme: ThemeType) => {
      const root = document.documentElement

      if (theme === "gold") {
        // Modern Gold theme colors - Made darker
        root.style.setProperty("--primary-color", "#f59e0b")
        root.style.setProperty("--primary-color-darker", "rgba(245, 158, 11, 0.8)")
        root.style.setProperty("--primary-color-hover-bg", "rgba(245, 158, 11, 0.12)")
        root.style.setProperty("--primary-color-active-bg", "rgba(245, 158, 11, 0.2)")
        root.style.setProperty("--primary-color-border", "rgba(245, 158, 11, 0.25)")
        root.style.setProperty("--primary-color-focus-border", "#f59e0b")
        root.style.setProperty("--primary-color-gradient-start", "rgba(245, 158, 11, 0.15)")
        root.style.setProperty("--primary-color-gradient-end", "rgba(251, 191, 36, 0.1)")

        // Icon and indicator colors
        root.style.setProperty("--icon-fill-color", "#f59e0b")
        root.style.setProperty("--indicator-bg-color", "rgba(245, 158, 11, 0.9)")
        root.style.setProperty("--checkmark-bg", "rgba(245, 158, 11, 0.95)")
        root.style.setProperty("--checkmark-color", "#ffffff")

        // Text colors - Slightly dimmed
        root.style.setProperty("--text-color-headings", "#f59e0b")
        root.style.setProperty("--text-color-button", "#ffffff")
        root.style.setProperty("--text-color-main", "#e2e8f0")
        root.style.setProperty("--text-color-secondary", "#94a3b8")

        // Modern background colors for gold theme - Much darker
        root.style.setProperty("--background-gradient-start", "#0c0a09")
        root.style.setProperty("--background-gradient-mid", "#1c1917")
        root.style.setProperty("--background-gradient-end", "#292524")
        root.style.setProperty("--panel-bg", "rgba(12, 10, 9, 0.98)")
        root.style.setProperty("--item-bg", "rgba(28, 25, 23, 0.85)")
        root.style.setProperty("--item-hover-bg", "rgba(41, 37, 36, 0.9)")
        root.style.setProperty("--input-bg", "rgba(12, 10, 9, 0.95)")
        root.style.setProperty("--modal-content-bg", "rgba(28, 25, 23, 0.99)")

        // Box shadows for gold theme - Slightly reduced
        root.style.setProperty("--box-shadow-panel", "0 20px 50px rgba(245, 158, 11, 0.12)")
        root.style.setProperty("--box-shadow-item-hover", "0 8px 25px rgba(245, 158, 11, 0.15)")
        root.style.setProperty("--box-shadow-selected", "0 12px 35px rgba(245, 158, 11, 0.25)")
        root.style.setProperty(
          "--box-shadow-title-photo",
          "0 0 20px 3px rgba(245, 158, 11, 0.25), 0 4px 12px rgba(0,0,0,0.8)",
        )
        root.style.setProperty("--box-shadow-skin-card-hover", "0 20px 60px rgba(245, 158, 11, 0.2)")

        // Scrollbar colors for gold theme - Darker
        root.style.setProperty("--scrollbar-track", "rgba(12, 10, 9, 0.5)")
        root.style.setProperty("--scrollbar-thumb", "rgba(245, 158, 11, 0.5)")
        root.style.setProperty("--scrollbar-thumb-hover", "rgba(245, 158, 11, 0.7)")
        root.style.setProperty("--scrollbar-thumb-active", "#f59e0b")
      } else {
        // Purple theme colors are already updated in CSS - reset to default
        root.style.setProperty("--primary-color", "#8b5cf6")
        root.style.setProperty("--primary-color-darker", "rgba(139, 92, 246, 0.8)")
        root.style.setProperty("--primary-color-hover-bg", "rgba(139, 92, 246, 0.12)")
        root.style.setProperty("--primary-color-active-bg", "rgba(139, 92, 246, 0.2)")
        root.style.setProperty("--primary-color-border", "rgba(139, 92, 246, 0.25)")
        root.style.setProperty("--primary-color-focus-border", "#8b5cf6")
        root.style.setProperty("--primary-color-gradient-start", "rgba(139, 92, 246, 0.15)")
        root.style.setProperty("--primary-color-gradient-end", "rgba(168, 85, 247, 0.1)")

        // Icon and indicator colors
        root.style.setProperty("--icon-fill-color", "#8b5cf6")
        root.style.setProperty("--indicator-bg-color", "rgba(139, 92, 246, 0.9)")
        root.style.setProperty("--checkmark-bg", "rgba(139, 92, 246, 0.95)")
        root.style.setProperty("--checkmark-color", "#ffffff")

        // Text colors
        root.style.setProperty("--text-color-headings", "#8b5cf6")
        root.style.setProperty("--text-color-button", "#ffffff")
        root.style.setProperty("--text-color-main", "#e2e8f0")
        root.style.setProperty("--text-color-secondary", "#94a3b8")

        // Background colors
        root.style.setProperty("--background-gradient-start", "#020617")
        root.style.setProperty("--background-gradient-mid", "#0f172a")
        root.style.setProperty("--background-gradient-end", "#1e293b")
        root.style.setProperty("--panel-bg", "rgba(2, 6, 23, 0.98)")
        root.style.setProperty("--item-bg", "rgba(15, 23, 42, 0.85)")
        root.style.setProperty("--item-hover-bg", "rgba(30, 41, 59, 0.9)")
        root.style.setProperty("--input-bg", "rgba(2, 6, 23, 0.95)")
        root.style.setProperty("--modal-content-bg", "rgba(15, 23, 42, 0.99)")

        // Box shadows
        root.style.setProperty("--box-shadow-panel", "0 20px 50px rgba(139, 92, 246, 0.12)")
        root.style.setProperty("--box-shadow-item-hover", "0 8px 25px rgba(139, 92, 246, 0.15)")
        root.style.setProperty("--box-shadow-selected", "0 12px 35px rgba(139, 92, 246, 0.25)")
        root.style.setProperty(
          "--box-shadow-title-photo",
          "0 0 20px 3px rgba(139, 92, 246, 0.25), 0 4px 12px rgba(0,0,0,0.8)",
        )
        root.style.setProperty("--box-shadow-skin-card-hover", "0 20px 60px rgba(139, 92, 246, 0.2)")

        // Scrollbar colors
        root.style.setProperty("--scrollbar-track", "rgba(2, 6, 23, 0.5)")
        root.style.setProperty("--scrollbar-thumb", "rgba(139, 92, 246, 0.5)")
        root.style.setProperty("--scrollbar-thumb-hover", "rgba(139, 92, 246, 0.7)")
        root.style.setProperty("--scrollbar-thumb-active", "#8b5cf6")
      }
    }

    applyTheme(state.selectedTheme)
    // Save theme preference whenever it changes
    savePreference("selectedTheme", state.selectedTheme)
  }, [state.selectedTheme])

  useEffect(() => {
    initializeApp()
  }, [])

  // Handle ESC key for closing modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (state.isSettingsOpen) {
          setState((prev) => ({ ...prev, isSettingsOpen: false }))
        } else if (state.isChromaModalOpen) {
          setState((prev) => ({ ...prev, isChromaModalOpen: false }))
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state.isSettingsOpen, state.isChromaModalOpen])

  const initializeApp = async () => {
    try {
      setState((prev) => ({ ...prev, loadingMessage: "We are getting latest info..." }))

      const patches = await getLatestPatch()
      const savedPatch = getPreference("currentPatch", "")
      const latestPatch = savedPatch && patches.includes(savedPatch) ? savedPatch : patches[0]

      setState((prev) => ({
        ...prev,
        availablePatches: patches,
        currentPatch: latestPatch,
        loadingMessage: latestPatch === "PBE" ? "Fetching PBE data..." : "Fetching current patch data...",
      }))

      const isPBE = latestPatch === "PBE"
      const [championDetails, detailedSkinsData, skinLinesData] = await Promise.all([
        fetchAllChampionDetails(latestPatch),
        fetchAllDetailedSkinsData(isPBE),
        fetchAllSkinLines(isPBE),
      ])

      setState((prev) => ({
        ...prev,
        allChampionDetails: championDetails,
        allDetailedSkinsData: detailedSkinsData,
        allSkinLinesData: skinLinesData,
        isLoading: false,
        loadingMessage: "",
      }))

      // Save the patch preference
      savePreference("currentPatch", latestPatch)
    } catch (error) {
      console.error("Failed to initialize app:", error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: "Failed to load data. Please try again.",
      }))
    }
  }

  const handleChampionSelect = (champion: Champion) => {
    setState((prev) => ({ ...prev, selectedChampion: champion }))
    // Save last selected champion
    savePreference("lastSelectedChampion", champion.id)
  }

  const handleSearchChange = (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }))
  }

  const handleChromaClick = (skin: Skin, champion: Champion) => {
    const skinDetails = state.allDetailedSkinsData.get(skin.id)
    const chromas = skinDetails?.chromas || []

    setChromaModalData({ skin, champion, chromas })
    setState((prev) => ({ ...prev, isChromaModalOpen: true }))
  }

  const handleSettingsApply = async () => {
    setState((prev) => ({
      ...prev,
      isSettingsOpen: false,
      isLoading: true,
      loadingMessage: prev.currentPatch === "PBE" ? "Loading PBE data..." : "Loading new patch data...",
    }))

    try {
      const isPBE = state.currentPatch === "PBE"
      const [championDetails, detailedSkinsData, skinLinesData] = await Promise.all([
        fetchAllChampionDetails(state.currentPatch),
        fetchAllDetailedSkinsData(isPBE),
        fetchAllSkinLines(isPBE),
      ])

      setState((prev) => ({
        ...prev,
        allChampionDetails: championDetails,
        allDetailedSkinsData: detailedSkinsData,
        allSkinLinesData: skinLinesData,
        selectedChampion: null,
        isLoading: false,
        loadingMessage: "",
      }))

      // Save patch preference
      savePreference("currentPatch", state.currentPatch)
    } catch (error) {
      console.error("Failed to reload data:", error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: "Failed to reload data. Please try again.",
      }))
    }
  }

  const handleThemeChange = (theme: ThemeType) => {
    setState((prev) => ({ ...prev, selectedTheme: theme }))
    // Theme preference is saved in the useEffect above
  }

  const handlePatchChange = (patch: string) => {
    setState((prev) => ({ ...prev, currentPatch: patch }))
    // Patch preference is saved when settings are applied
  }

  const champions = Object.values(state.allChampionDetails)

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, var(--background-gradient-start) 0%, var(--background-gradient-mid) 50%, var(--background-gradient-end) 100%)`,
        color: "var(--text-color-main)",
      }}
    >
      <Header
        onSettingsClick={() => setState((prev) => ({ ...prev, isSettingsOpen: true }))}
        loadingMessage={state.loadingMessage}
      />

      <div className="flex h-[calc(100vh-80px)]">
        <ChampionGrid
          champions={champions}
          selectedChampion={state.selectedChampion}
          currentPatch={state.currentPatch}
          searchQuery={state.searchQuery}
          onChampionSelect={handleChampionSelect}
          onSearchChange={handleSearchChange}
          isLoading={state.isLoading}
        />

        <div className="flex-1 p-6">
          <SkinGrid
            champion={state.selectedChampion}
            allDetailedSkinsData={state.allDetailedSkinsData}
            allSkinLinesData={state.allSkinLinesData}
            currentPatch={state.currentPatch}
            onChromaClick={handleChromaClick}
          />
        </div>
      </div>

      <SettingsModal
        isOpen={state.isSettingsOpen}
        onClose={() => setState((prev) => ({ ...prev, isSettingsOpen: false }))}
        availablePatches={state.availablePatches}
        currentPatch={state.currentPatch}
        selectedTheme={state.selectedTheme}
        onPatchChange={handlePatchChange}
        onThemeChange={handleThemeChange}
        onApplySettings={handleSettingsApply}
      />

      <ChromaModal
        isOpen={state.isChromaModalOpen}
        onClose={() => setState((prev) => ({ ...prev, isChromaModalOpen: false }))}
        skin={chromaModalData.skin}
        champion={chromaModalData.champion}
        chromas={chromaModalData.chromas}
        currentPatch={state.currentPatch}
      />
    </div>
  )
}

export default App
