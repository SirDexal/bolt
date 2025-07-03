"use client"

import type React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import type { Champion, Skin, DetailedSkinData } from "../types"
import SkinCard from "./SkinCard"
import { List, SlidersHorizontal, X, LayoutGrid, ChevronDown, Check } from "lucide-react"
import { getPreference, savePreference } from "../utils/storage"

interface SkinGridProps {
  champion: Champion | null
  allDetailedSkinsData: Map<string, DetailedSkinData>
  allSkinLinesData: Map<number, string>
  currentPatch: string
  onChromaClick: (skin: Skin, champion: Champion) => void
}

const SkinGrid: React.FC<SkinGridProps> = ({
  champion,
  allDetailedSkinsData,
  allSkinLinesData,
  currentPatch,
  onChromaClick,
}) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">(getPreference("viewMode", "grid"))
  const [rarityFilter, setRarityFilter] = useState<string>(getPreference("filterSettings", {}).rarityFilter || "all")
  const [legacyFilter, setLegacyFilter] = useState<string>(getPreference("filterSettings", {}).legacyFilter || "all")
  const [chromaFilter, setChromaFilter] = useState<string>(getPreference("filterSettings", {}).chromaFilter || "all")

  // Dropdown states
  const [isRarityDropdownOpen, setIsRarityDropdownOpen] = useState(false)
  const [isLegacyDropdownOpen, setIsLegacyDropdownOpen] = useState(false)
  const [isChromaDropdownOpen, setIsChromaDropdownOpen] = useState(false)

  // Dropdown position states
  const [rarityDropdownPosition, setRarityDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [legacyDropdownPosition, setLegacyDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [chromaDropdownPosition, setChromaDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  const filterPopupRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const rarityButtonRef = useRef<HTMLButtonElement>(null)
  const legacyButtonRef = useRef<HTMLButtonElement>(null)
  const chromaButtonRef = useRef<HTMLButtonElement>(null)

  // Calculate dropdown position
  const calculateDropdownPosition = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      return {
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      }
    }
    return { top: 0, left: 0, width: 0 }
  }

  // Popup'ı dışarı tıklayarak kapatma efekti
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is on any dropdown button
      const isDropdownButtonClick =
        (rarityButtonRef.current && rarityButtonRef.current.contains(target)) ||
        (legacyButtonRef.current && legacyButtonRef.current.contains(target)) ||
        (chromaButtonRef.current && chromaButtonRef.current.contains(target))

      // Check if click is in any dropdown menu
      const isInDropdownMenu =
        document.querySelector('[data-dropdown-menu="rarity"]')?.contains(target) ||
        document.querySelector('[data-dropdown-menu="legacy"]')?.contains(target) ||
        document.querySelector('[data-dropdown-menu="chroma"]')?.contains(target)

      // Close filter popup only if click is outside popup, dropdown buttons, AND dropdown menus
      if (
        filterPopupRef.current &&
        !filterPopupRef.current.contains(target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(target) &&
        !isDropdownButtonClick &&
        !isInDropdownMenu
      ) {
        setShowFilterPopup(false)
      }

      // Close individual dropdowns when clicking outside their buttons and menus
      if (isRarityDropdownOpen && rarityButtonRef.current && !rarityButtonRef.current.contains(target)) {
        const rarityMenu = document.querySelector('[data-dropdown-menu="rarity"]')
        if (!rarityMenu || !rarityMenu.contains(target)) {
          setIsRarityDropdownOpen(false)
        }
      }

      if (isLegacyDropdownOpen && legacyButtonRef.current && !legacyButtonRef.current.contains(target)) {
        const legacyMenu = document.querySelector('[data-dropdown-menu="legacy"]')
        if (!legacyMenu || !legacyMenu.contains(target)) {
          setIsLegacyDropdownOpen(false)
        }
      }

      if (isChromaDropdownOpen && chromaButtonRef.current && !chromaButtonRef.current.contains(target)) {
        const chromaMenu = document.querySelector('[data-dropdown-menu="chroma"]')
        if (!chromaMenu || !chromaMenu.contains(target)) {
          setIsChromaDropdownOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isRarityDropdownOpen, isLegacyDropdownOpen, isChromaDropdownOpen])

  // Save view mode preference
  useEffect(() => {
    savePreference("viewMode", viewMode)
  }, [viewMode])

  // Save filter preferences
  useEffect(() => {
    const filterSettings = {
      rarityFilter,
      legacyFilter,
      chromaFilter,
    }
    savePreference("filterSettings", filterSettings)
  }, [rarityFilter, legacyFilter, chromaFilter])

  const rarityOrder = {
    kNoRarity: 0,
    kEpic: 1,
    kLegendary: 2,
    kMythic: 3,
    kUltimate: 4,
    kExalted: 5, // Added Exalted
    kTranscendent: 6,
  }

  // Updated dropdown options with Exalted
  const rarityOptions = [
    { value: "all", label: "All Rarities" },
    { value: "no-rarity", label: "No Rarity" },
    { value: "kEpic", label: "Epic" },
    { value: "kLegendary", label: "Legendary" },
    { value: "kMythic", label: "Mythic" },
    { value: "kUltimate", label: "Ultimate" },
    { value: "kExalted", label: "Exalted" }, // Added Exalted
    { value: "kTranscendent", label: "Transcendent" },
  ]

  const legacyOptions = [
    { value: "all", label: "All Skins" },
    { value: "legacy", label: "Legacy Only" },
    { value: "non-legacy", label: "Non-Legacy Only" },
  ]

  const chromaOptions = [
    { value: "all", label: "All Skins" },
    { value: "with-chromas", label: "With Chromas" },
    { value: "without-chromas", label: "Without Chromas" },
  ]

  // Handle dropdown toggle with position calculation
  const handleRarityToggle = () => {
    if (!isRarityDropdownOpen) {
      setRarityDropdownPosition(calculateDropdownPosition(rarityButtonRef))
    }
    setIsRarityDropdownOpen(!isRarityDropdownOpen)
  }

  const handleLegacyToggle = () => {
    if (!isLegacyDropdownOpen) {
      setLegacyDropdownPosition(calculateDropdownPosition(legacyButtonRef))
    }
    setIsLegacyDropdownOpen(!isLegacyDropdownOpen)
  }

  const handleChromaToggle = () => {
    if (!isChromaDropdownOpen) {
      setChromaDropdownPosition(calculateDropdownPosition(chromaButtonRef))
    }
    setIsChromaDropdownOpen(!isChromaDropdownOpen)
  }

  // Filtrelenmiş kostümlerin hesaplandığı memoized fonksiyon
  const filteredSkins = useMemo(() => {
    if (!champion?.skins) return []

    return champion.skins
      .filter((skin) => {
        const detailedData = allDetailedSkinsData.get(skin.id)

        // Nadirlik filtresi
        if (rarityFilter !== "all") {
          const skinRarity = detailedData?.rarity || "kNoRarity"
          if (rarityFilter === "no-rarity" && skinRarity !== "kNoRarity") return false
          if (rarityFilter !== "no-rarity" && skinRarity !== rarityFilter) return false
        }

        // Miras (Legacy) filtresi
        if (legacyFilter !== "all") {
          const isLegacy = detailedData?.isLegacy || false
          if (legacyFilter === "legacy" && !isLegacy) return false
          if (legacyFilter === "non-legacy" && isLegacy) return false
        }

        // Renk (Chroma) filtresi
        if (chromaFilter !== "all") {
          const hasChromasFromChampionData = skin.chromas === true
          const chromaCount = detailedData?.chromas?.length || 0
          const hasChromasFromDetailedData = chromaCount > 0
          const hasAnyChromasData = hasChromasFromChampionData || hasChromasFromDetailedData

          if (chromaFilter === "with-chromas" && !hasAnyChromasData) return false
          if (chromaFilter === "without-chromas" && hasAnyChromasData) return false
        }

        return true
      })
      .sort((a, b) => {
        // Önce kostüm numarasına göre sırala
        if (a.num !== b.num) {
          return a.num - b.num
        }

        // Eğer numaralar eşitse, nadirliğe göre sırala
        const aData = allDetailedSkinsData.get(a.id)
        const bData = allDetailedSkinsData.get(b.id)
        const aRarity = aData?.rarity || "kNoRarity"
        const bRarity = bData?.rarity || "kNoRarity"

        return (rarityOrder[aRarity] || 0) - (rarityOrder[bRarity] || 0)
      })
  }, [champion, allDetailedSkinsData, rarityFilter, legacyFilter, chromaFilter])

  // Görünüm moduna göre grid class'ını belirler
  const getGridClass = () => {
    if (viewMode === "list") {
      return "flex flex-col gap-3"
    }
    return "grid grid-cols-3 gap-6"
  }

  // Custom Dropdown Button Component
  const DropdownButton: React.FC<{
    value: string
    options: { value: string; label: string }[]
    isOpen: boolean
    onToggle: () => void
    buttonRef: React.RefObject<HTMLButtonElement>
    placeholder: string
  }> = ({ value, options, isOpen, onToggle, buttonRef, placeholder }) => {
    const selectedOption = options.find((opt) => opt.value === value)

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent event bubbling
      onToggle()
    }

    return (
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300 flex items-center justify-between text-left"
        style={{
          background: isOpen ? "var(--item-hover-bg)" : "var(--input-bg)",
          borderColor: isOpen ? "var(--primary-color)" : "var(--primary-color-border)",
          color: "var(--text-color-main)",
          border: "2px solid",
          boxShadow: isOpen ? "0 8px 25px var(--primary-color-active-bg)" : "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        <span className="text-sm font-medium">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--primary-color)" }}
        />
      </button>
    )
  }

  // Fixed Dropdown Menu Component
  const FixedDropdownMenu: React.FC<{
    isOpen: boolean
    position: { top: number; left: number; width: number }
    options: { value: string; label: string }[]
    value: string
    onChange: (value: string) => void
    onClose: () => void
    dataAttribute: string
  }> = ({ isOpen, position, options, value, onChange, onClose, dataAttribute }) => {
    if (!isOpen) return null

    const handleOptionClick = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation() // Prevent event bubbling
      onChange(optionValue)
      onClose()
    }

    return (
      <div
        data-dropdown-menu={dataAttribute}
        className="fixed rounded-xl border-2 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar"
        style={{
          background: "var(--modal-content-bg)",
          borderColor: "var(--primary-color-border)",
          boxShadow: "0 20px 40px var(--primary-color-active-bg)",
          backdropFilter: "blur(15px)",
          zIndex: 9999999,
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
        }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={(e) => handleOptionClick(option.value, e)}
            className="w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group first:rounded-t-xl last:rounded-b-xl text-sm"
            style={{
              background:
                value === option.value
                  ? `linear-gradient(135deg, var(--primary-color-gradient-start), var(--primary-color-gradient-end))`
                  : "transparent",
              color: "var(--text-color-main)",
            }}
            onMouseEnter={(e) => {
              if (value !== option.value) {
                e.currentTarget.style.background = "var(--item-hover-bg)"
              }
            }}
            onMouseLeave={(e) => {
              if (value !== option.value) {
                e.currentTarget.style.background = "transparent"
              }
            }}
          >
            <span className="font-medium">{option.label}</span>
            {value === option.value && <Check className="h-4 w-4" style={{ color: "var(--primary-color)" }} />}
          </button>
        ))}
      </div>
    )
  }

  // Yüklenme iskeleti (skeleton) bileşeni
  const LoadingSkeleton = () => (
    <div className={getGridClass()}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden border animate-pulse"
          style={{
            background: "var(--item-bg)",
            borderColor: "var(--primary-color-border)",
            width: "100%",
            height: viewMode === "grid" ? "240px" : "80px",
          }}
        >
          <div className="w-full h-full" style={{ background: "var(--primary-color-hover-bg)" }} />
        </div>
      ))}
    </div>
  )

  // Şampiyon seçilmemişse gösterilecek ekran
  if (!champion) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ color: "var(--text-color-secondary)" }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color-headings)" }}>
            Select a Champion
          </h2>
          <p>Choose a champion from the left panel to explore their skins</p>
        </div>
      </div>
    )
  }

  // Şampiyonun kostümü yoksa veya yükleniyorsa iskelet göster
  if (!champion.skins || champion.skins.length === 0) {
    return <LoadingSkeleton />
  }

  return (
    <>
      <div className="space-y-6 h-full flex flex-col" style={{ zIndex: 1 }}>
        {/* Header Alanı */}
        <div className="border-b pb-4 flex-shrink-0" style={{ borderColor: "var(--primary-color-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-color-headings)" }}>
                {champion.name} <span style={{ color: "var(--text-color-secondary)" }}>- {champion.title}</span>
              </h2>
              <p style={{ color: "var(--text-color-secondary)" }} className="mt-1">
                {filteredSkins.length} of {champion.skins.length} skins
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 p-1 rounded-xl" style={{ background: "var(--item-bg)" }}>
                <button
                  onClick={() => setViewMode("grid")}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{
                    background: viewMode === "grid" ? "var(--primary-color-active-bg)" : "transparent",
                    color: viewMode === "grid" ? "var(--primary-color)" : "var(--text-color-secondary)",
                  }}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{
                    background: viewMode === "list" ? "var(--primary-color-active-bg)" : "transparent",
                    color: viewMode === "list" ? "var(--primary-color)" : "var(--text-color-secondary)",
                  }}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <button
                ref={filterButtonRef}
                onClick={() => setShowFilterPopup(!showFilterPopup)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300"
                style={{
                  background: showFilterPopup ? "var(--primary-color-active-bg)" : "var(--primary-color-hover-bg)",
                  border: "1px solid var(--primary-color-border)",
                  color: "var(--text-color-main)",
                }}
              >
                <SlidersHorizontal className="h-4 w-4" style={{ color: "var(--primary-color)" }} />
                <span className="font-medium">Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* KAYDIRMA VE GENİŞLEME ALANI (Clipping/Kesilme sorununu çözen kısım) */}
        <div
          className="flex-1 custom-scrollbar"
          style={{
            overflowY: "auto",
            overflowX: "visible",
            margin: "0 -24px",
            padding: "20px 24px",
          }}
        >
          <div
            className={getGridClass()}
            style={{
              position: "relative",
            }}
          >
            {filteredSkins.map((skin) => {
              const detailedData = allDetailedSkinsData.get(skin.id)
              const seriesName = detailedData?.skinLines?.[0]
                ? allSkinLinesData.get(detailedData.skinLines[0].id)
                : undefined

              return (
                // z-index yöneticisi (kartların üst üste binmesini engeller)
                <div
                  key={skin.id}
                  className="relative"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.zIndex = "20"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.zIndex = "1"
                  }}
                  style={{ zIndex: 1 }}
                >
                  <SkinCard
                    skin={skin}
                    champion={champion}
                    detailedData={detailedData}
                    seriesName={seriesName}
                    viewMode={viewMode}
                    currentPatch={currentPatch}
                    onChromaClick={() => onChromaClick(skin, champion)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Filter Popup with Custom Dropdown Buttons */}
      {showFilterPopup && (
        <div
          ref={filterPopupRef}
          className="fixed rounded-2xl border shadow-2xl p-5"
          style={{
            background: "var(--modal-content-bg)",
            borderColor: "var(--primary-color-border)",
            boxShadow: "0 20px 40px var(--primary-color-active-bg)",
            backdropFilter: "blur(15px)",
            zIndex: 999999,
            right: "20px",
            top: "120px",
            width: "600px",
            maxHeight: "calc(100vh - 160px)",
            overflowY: "visible", // Changed from auto to visible
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg" style={{ color: "var(--text-color-headings)" }}>
              Filter Skins
            </h3>
            <button
              onClick={() => setShowFilterPopup(false)}
              className="p-2 rounded-lg transition-colors"
              style={{
                background: "var(--item-bg)",
                color: "var(--text-color-secondary)",
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-5">
            <div className="space-y-3">
              <label className="block text-sm font-semibold" style={{ color: "var(--text-color-headings)" }}>
                Rarity
              </label>
              <DropdownButton
                value={rarityFilter}
                options={rarityOptions}
                isOpen={isRarityDropdownOpen}
                onToggle={handleRarityToggle}
                buttonRef={rarityButtonRef}
                placeholder="Select Rarity"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold" style={{ color: "var(--text-color-headings)" }}>
                Legacy Status
              </label>
              <DropdownButton
                value={legacyFilter}
                options={legacyOptions}
                isOpen={isLegacyDropdownOpen}
                onToggle={handleLegacyToggle}
                buttonRef={legacyButtonRef}
                placeholder="Select Legacy Status"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold" style={{ color: "var(--text-color-headings)" }}>
                Chroma Availability
              </label>
              <DropdownButton
                value={chromaFilter}
                options={chromaOptions}
                isOpen={isChromaDropdownOpen}
                onToggle={handleChromaToggle}
                buttonRef={chromaButtonRef}
                placeholder="Select Chroma Filter"
              />
            </div>
          </div>

          <div
            className="p-4 rounded-xl text-center"
            style={{ background: "var(--primary-color-hover-bg)", border: "1px solid var(--primary-color-border)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--primary-color)" }}>
              Showing {filteredSkins.length} of {champion.skins.length} skins
            </p>
          </div>
        </div>
      )}

      {/* Fixed Position Dropdown Menus */}
      <FixedDropdownMenu
        isOpen={isRarityDropdownOpen}
        position={rarityDropdownPosition}
        options={rarityOptions}
        value={rarityFilter}
        onChange={setRarityFilter}
        onClose={() => setIsRarityDropdownOpen(false)}
        dataAttribute="rarity"
      />

      <FixedDropdownMenu
        isOpen={isLegacyDropdownOpen}
        position={legacyDropdownPosition}
        options={legacyOptions}
        value={legacyFilter}
        onChange={setLegacyFilter}
        onClose={() => setIsLegacyDropdownOpen(false)}
        dataAttribute="legacy"
      />

      <FixedDropdownMenu
        isOpen={isChromaDropdownOpen}
        position={chromaDropdownPosition}
        options={chromaOptions}
        value={chromaFilter}
        onChange={setChromaFilter}
        onClose={() => setIsChromaDropdownOpen(false)}
        dataAttribute="chroma"
      />
    </>
  )
}

export default SkinGrid
