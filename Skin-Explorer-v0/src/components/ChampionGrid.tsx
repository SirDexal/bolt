"use client"

import type React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react"
import type { Champion } from "../types"
import { getChampionIconUrl } from "../services/api"

interface ChampionGridProps {
  champions: Champion[]
  selectedChampion: Champion | null
  currentPatch: string
  searchQuery: string
  onChampionSelect: (champion: Champion) => void
  onSearchChange: (query: string) => void
  isLoading: boolean
}

const ChampionGrid: React.FC<ChampionGridProps> = ({
  champions,
  selectedChampion,
  currentPatch,
  searchQuery,
  onChampionSelect,
  onSearchChange,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [minSkins, setMinSkins] = useState(0)
  const [maxSkins, setMaxSkins] = useState(50)
  const [sortBy, setSortBy] = useState<"name" | "skins">("name")
  const filterPopupRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  // Calculate skin count range
  const skinCounts = useMemo(() => {
    const counts = champions.map((c) => c.skins?.length || 0)
    return {
      min: Math.min(...counts),
      max: Math.max(...counts),
    }
  }, [champions])

  // Update max skins when champions change
  useEffect(() => {
    setMaxSkins(skinCounts.max)
  }, [skinCounts.max])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterPopupRef.current &&
        !filterPopupRef.current.contains(event.target as Node) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilterPopup(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter and sort champions
  const filteredChampions = useMemo(() => {
    const filtered = champions.filter((champion) => {
      const matchesSearch = champion.name.toLowerCase().includes(searchQuery.toLowerCase())
      const skinCount = champion.skins?.length || 0
      const matchesSkinCount = skinCount >= minSkins && skinCount <= maxSkins
      return matchesSearch && matchesSkinCount
    })

    // Sort champions
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else {
        return (b.skins?.length || 0) - (a.skins?.length || 0)
      }
    })

    return filtered
  }, [champions, searchQuery, minSkins, maxSkins, sortBy])

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="h-12 bg-slate-700/50 rounded-2xl animate-pulse"></div>
      <div className="h-16 bg-slate-700/50 rounded-2xl animate-pulse"></div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-700/30 rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="w-80 h-full bg-slate-900/50 border-r border-slate-700/50 p-4">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div
      className="w-80 h-full flex flex-col relative"
      style={{
        background: "var(--panel-bg)",
        borderRight: "1px solid var(--primary-color-border)",
        boxShadow: "var(--box-shadow-panel)",
        backdropFilter: "blur(10px)",
        zIndex: 10,
      }}
    >
      {/* Header with Search and Compact Filter */}
      <div className="p-5 border-b space-y-4" style={{ borderColor: "var(--primary-color-border)" }}>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4" style={{ color: "var(--text-color-secondary)" }} />
          <input
            type="text"
            placeholder="Search champions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm transition-all focus:outline-none"
            style={{
              background: "var(--input-bg)",
              color: "var(--text-color-main)",
              border: "1px solid var(--primary-color-border)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            }}
            onFocus={(e) => {
              e.target.style.background = "var(--item-bg)"
              e.target.style.borderColor = "var(--primary-color-focus-border)"
              e.target.style.boxShadow = "0 4px 20px var(--primary-color-active-bg)"
            }}
            onBlur={(e) => {
              e.target.style.background = "var(--input-bg)"
              e.target.style.borderColor = "var(--primary-color-border)"
              e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.5)"
            }}
          />
        </div>

        {/* Compact Filter Button */}
        <div className="flex items-center justify-between">
          <div className="relative" ref={filterPopupRef}>
            <button
              ref={filterButtonRef}
              onClick={() => setShowFilterPopup(!showFilterPopup)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300"
              style={{
                background: showFilterPopup ? "var(--primary-color-active-bg)" : "var(--primary-color-hover-bg)",
                border: "1px solid var(--primary-color-border)",
                color: "var(--text-color-main)",
              }}
            >
              <SlidersHorizontal className="h-4 w-4" style={{ color: "var(--primary-color)" }} />
              <span className="text-sm font-medium">Filter</span>
            </button>

            {/* Right-side Filter Popup - Back to relative positioning */}
            {showFilterPopup && (
              <div
                className="absolute left-full top-0 ml-2 w-72 rounded-2xl border shadow-2xl p-4 custom-scrollbar"
                style={{
                  background: "var(--modal-content-bg)",
                  borderColor: "var(--primary-color-border)",
                  boxShadow: "0 20px 40px var(--primary-color-active-bg)",
                  backdropFilter: "blur(15px)",
                  zIndex: 999999,
                  maxHeight: "calc(100vh - 200px)",
                  overflowY: "auto",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: "var(--text-color-headings)" }}>
                    Filter Champions
                  </h3>
                  <button
                    onClick={() => setShowFilterPopup(false)}
                    className="p-1 rounded-lg transition-colors"
                    style={{
                      background: "var(--item-bg)",
                      color: "var(--text-color-secondary)",
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Skin Count Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: "var(--text-color-main)" }}>
                      Skin Count: {minSkins} - {maxSkins}
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs w-8" style={{ color: "var(--text-color-secondary)" }}>
                          Min
                        </span>
                        <input
                          type="range"
                          min={skinCounts.min}
                          max={skinCounts.max}
                          value={minSkins}
                          onChange={(e) => setMinSkins(Number(e.target.value))}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider-themed"
                          style={{
                            background: `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${(minSkins / skinCounts.max) * 100}%, var(--primary-color-border) ${(minSkins / skinCounts.max) * 100}%, var(--primary-color-border) 100%)`,
                            WebkitAppearance: "none",
                            appearance: "none",
                          }}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs w-8" style={{ color: "var(--text-color-secondary)" }}>
                          Max
                        </span>
                        <input
                          type="range"
                          min={skinCounts.min}
                          max={skinCounts.max}
                          value={maxSkins}
                          onChange={(e) => setMaxSkins(Number(e.target.value))}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider-themed"
                          style={{
                            background: `linear-gradient(to right, var(--primary-color-border) 0%, var(--primary-color-border) ${(maxSkins / skinCounts.max) * 100}%, var(--primary-color) ${(maxSkins / skinCounts.max) * 100}%, var(--primary-color) 100%)`,
                            WebkitAppearance: "none",
                            appearance: "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: "var(--text-color-main)" }}>
                      Sort by
                    </label>
                    <div className="flex space-x-2">
                      {[
                        { value: "name", label: "Name" },
                        { value: "skins", label: "Skin Count" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value as "name" | "skins")}
                          className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200"
                          style={{
                            background:
                              sortBy === option.value
                                ? "var(--primary-color-active-bg)"
                                : "var(--primary-color-hover-bg)",
                            color: sortBy === option.value ? "var(--primary-color)" : "var(--text-color-secondary)",
                            border: `1px solid ${
                              sortBy === option.value ? "var(--primary-color)" : "var(--primary-color-border)"
                            }`,
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results Count */}
                  <div
                    className="text-xs text-center py-2 px-3 rounded-lg"
                    style={{
                      background: "var(--primary-color-hover-bg)",
                      color: "var(--primary-color)",
                    }}
                  >
                    {filteredChampions.length} of {champions.length} champions
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className="text-xs px-2 py-1 rounded-lg"
            style={{
              background: "var(--primary-color-hover-bg)",
              color: "var(--primary-color)",
            }}
          >
            {filteredChampions.length} champions
          </div>
        </div>

        {/* Champions Header Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300"
          style={{
            background: "var(--primary-color-hover-bg)",
            border: "1px solid var(--primary-color-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--primary-color-active-bg)"
            e.currentTarget.style.borderColor = "var(--primary-color-darker)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--primary-color-hover-bg)"
            e.currentTarget.style.borderColor = "var(--primary-color-border)"
          }}
        >
          <div className="flex items-center space-x-3">
            {selectedChampion ? (
              <>
                <img
                  src={getChampionIconUrl(currentPatch, selectedChampion.image.full) || "/placeholder.svg"}
                  alt={selectedChampion.name}
                  className="w-10 h-10 rounded-lg border-2"
                  style={{ borderColor: "var(--primary-color-border)" }}
                />
                <div className="text-left">
                  <p className="font-bold" style={{ color: "var(--text-color-inverted)" }}>
                    {selectedChampion.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-color-secondary)" }}>
                    {selectedChampion.title}
                  </p>
                </div>
              </>
            ) : (
              <p style={{ color: "var(--primary-color)" }} className="font-bold text-lg">
                Champions
              </p>
            )}
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            style={{ color: "var(--primary-color)" }}
          />
        </button>
      </div>

      {/* Champion List - FIXED: Added proper scrolling back */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "flex-1" : "max-h-0 opacity-0"}`}>
        <div className="p-4 h-full overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {filteredChampions.map((champion) => (
              <button
                key={champion.id}
                onClick={() => {
                  onChampionSelect(champion)
                  setIsExpanded(false)
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 relative overflow-hidden min-h-[65px] group"
                style={{
                  background:
                    selectedChampion?.id === champion.id
                      ? `linear-gradient(135deg, var(--primary-color-gradient-start), var(--primary-color-gradient-end))`
                      : "var(--item-bg)",
                  border:
                    selectedChampion?.id === champion.id ? "2px solid var(--primary-color)" : "2px solid transparent",
                  backdropFilter: "blur(5px)",
                  boxShadow: selectedChampion?.id === champion.id ? "var(--box-shadow-selected)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (selectedChampion?.id !== champion.id) {
                    e.currentTarget.style.background = "var(--item-hover-bg)"
                    e.currentTarget.style.borderColor = "var(--primary-color-border)"
                    e.currentTarget.style.boxShadow = "var(--box-shadow-item-hover)"
                    e.currentTarget.style.transform = "translateX(5px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChampion?.id !== champion.id) {
                    e.currentTarget.style.background = "var(--item-bg)"
                    e.currentTarget.style.borderColor = "transparent"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <img
                  src={getChampionIconUrl(currentPatch, champion.image.full) || "/placeholder.svg"}
                  alt={champion.name}
                  className="w-11 h-11 rounded-lg border-2 transition-all duration-300 flex-shrink-0"
                  style={{
                    borderColor:
                      selectedChampion?.id === champion.id ? "var(--primary-color)" : "var(--primary-color-border)",
                    boxShadow: selectedChampion?.id === champion.id ? "0 0 15px var(--primary-color-darker)" : "none",
                  }}
                  loading="lazy"
                />
                <div className="text-left flex-1">
                  <p
                    className="font-bold text-sm leading-tight"
                    style={{
                      color: "var(--text-color-inverted)",
                      textShadow:
                        selectedChampion?.id === champion.id
                          ? "0 0 8px var(--primary-color-darker)"
                          : "0 1px 3px rgba(0,0,0,0.8)",
                    }}
                  >
                    {champion.name}
                  </p>
                </div>

                {/* ADDED: Skin Count Display */}
                <div className="flex flex-col items-end space-y-1">
                  <div
                    className="px-2 py-1 rounded-lg text-xs font-bold"
                    style={{
                      background: "var(--primary-color-hover-bg)",
                      color: "var(--primary-color)",
                      border: "1px solid var(--primary-color-border)",
                    }}
                  >
                    {champion.skins?.length || 0} skins
                  </div>
                </div>

                {/* Selected checkmark */}
                {selectedChampion?.id === champion.id && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "var(--checkmark-bg)",
                      color: "var(--checkmark-color)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredChampions.length === 0 && searchQuery && (
            <div className="text-center py-8" style={{ color: "var(--text-color-secondary)" }}>
              <p>No champions found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChampionGrid
