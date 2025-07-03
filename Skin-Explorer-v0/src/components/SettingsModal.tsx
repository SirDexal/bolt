"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Palette, Package, Crown, Sparkles, ChevronDown, Check } from "lucide-react"
import type { ThemeType } from "../types"
import CacheManager from "./CacheManager"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  availablePatches: string[]
  currentPatch: string
  selectedTheme: ThemeType
  onPatchChange: (patch: string) => void
  onThemeChange: (theme: ThemeType) => void
  onApplySettings: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  availablePatches,
  currentPatch,
  selectedTheme,
  onPatchChange,
  onThemeChange,
  onApplySettings,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"general" | "cache">("general")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!isOpen) return null

  const themes = [
    {
      id: "purple" as ThemeType,
      name: "Purple",
      icon: Sparkles,
      preview: "linear-gradient(135deg, #bb86fc, #8a2be2)",
      description: "Mystical purple theme",
    },
    {
      id: "gold" as ThemeType,
      name: "Gold",
      icon: Crown,
      preview: "linear-gradient(135deg, #ffd700, #ff8c00)",
      description: "Luxurious gold theme",
    },
  ]

  const tabs = [
    { id: "general", label: "General", icon: Package },
    { id: "cache", label: "Cache & Storage", icon: Package },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(15px)",
      }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      {/* Wider modal for tabs */}
      <div
        className="relative rounded-3xl border shadow-2xl w-full max-w-5xl transform transition-all duration-300 scale-100"
        style={{
          background: "var(--modal-content-bg)",
          borderColor: "var(--primary-color-border)",
          boxShadow: "0 25px 50px var(--primary-color-active-bg)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{
            borderColor: "var(--primary-color-border)",
            background: `linear-gradient(135deg, var(--primary-color-gradient-start), var(--primary-color-gradient-end))`,
          }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="p-3 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Package className="h-6 w-6" style={{ color: "var(--text-color-inverted)" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-color-inverted)" }}>
                Settings
              </h2>
              <p className="text-sm opacity-80" style={{ color: "var(--text-color-inverted)" }}>
                Customize your League of Legends Skin Explorer experience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-xl transition-all duration-200"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              color: "var(--text-color-inverted)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
              e.currentTarget.style.transform = "scale(1.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b" style={{ borderColor: "var(--primary-color-border)" }}>
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "general" | "cache")}
                  className="flex items-center space-x-2 px-6 py-4 transition-all duration-200"
                  style={{
                    background: activeTab === tab.id ? "var(--primary-color-hover-bg)" : "transparent",
                    color: activeTab === tab.id ? "var(--primary-color)" : "var(--text-color-secondary)",
                    borderBottom: activeTab === tab.id ? "2px solid var(--primary-color)" : "2px solid transparent",
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "general" && (
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Theme Selection */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: "var(--primary-color-hover-bg)",
                      border: "1px solid var(--primary-color-border)",
                    }}
                  >
                    <Palette className="h-6 w-6" style={{ color: "var(--primary-color)" }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" style={{ color: "var(--text-color-headings)" }}>
                      Theme Selection
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text-color-secondary)" }}>
                      Choose your preferred color scheme
                    </p>
                  </div>
                </div>

                {/* Theme Cards */}
                <div className="space-y-4">
                  {themes.map((theme) => {
                    const Icon = theme.icon
                    const isSelected = selectedTheme === theme.id

                    return (
                      <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        className="w-full p-5 rounded-2xl border-2 transition-all duration-300 group"
                        style={{
                          borderColor: isSelected ? "var(--primary-color)" : "var(--primary-color-border)",
                          background: isSelected
                            ? `linear-gradient(135deg, var(--primary-color-gradient-start), var(--primary-color-gradient-end))`
                            : "var(--item-bg)",
                          transform: isSelected ? "scale(1.02)" : "scale(1)",
                          boxShadow: isSelected
                            ? "0 8px 25px var(--primary-color-active-bg)"
                            : "0 4px 15px rgba(0,0,0,0.3)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = "scale(1.02)"
                            e.currentTarget.style.borderColor = "var(--primary-color)"
                            e.currentTarget.style.boxShadow = "0 8px 25px var(--primary-color-active-bg)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = "scale(1)"
                            e.currentTarget.style.borderColor = "var(--primary-color-border)"
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)"
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                              style={{
                                background: theme.preview,
                                borderColor: "rgba(255, 255, 255, 0.3)",
                              }}
                            >
                              <Icon className="h-8 w-8 text-white drop-shadow-lg" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-lg" style={{ color: "var(--text-color-inverted)" }}>
                                {theme.name}
                              </p>
                              <p className="text-sm opacity-80" style={{ color: "var(--text-color-secondary)" }}>
                                {theme.description}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                              style={{
                                background: "var(--checkmark-bg)",
                                color: "var(--checkmark-color)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                              }}
                            >
                              <Check className="h-5 w-5 font-bold" />
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Column - Patch Selection */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: "var(--primary-color-hover-bg)",
                      border: "1px solid var(--primary-color-border)",
                    }}
                  >
                    <Package className="h-6 w-6" style={{ color: "var(--primary-color)" }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" style={{ color: "var(--text-color-headings)" }}>
                      Game Patch
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text-color-secondary)" }}>
                      Select the League of Legends patch version
                    </p>
                  </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-6 py-4 rounded-2xl border-2 focus:outline-none transition-all duration-300 flex items-center justify-between"
                    style={{
                      background: isDropdownOpen ? "var(--item-hover-bg)" : "var(--input-bg)",
                      borderColor: isDropdownOpen ? "var(--primary-color)" : "var(--primary-color-border)",
                      color: "var(--text-color-main)",
                      boxShadow: isDropdownOpen
                        ? "0 8px 25px var(--primary-color-active-bg)"
                        : "0 4px 15px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ background: "var(--primary-color)" }} />
                      <div className="text-left">
                        <span className="font-medium text-lg">{currentPatch}</span>
                        {currentPatch === "PBE" && (
                          <span
                            className="ml-3 px-3 py-1 rounded-lg text-sm font-semibold"
                            style={{
                              background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
                              color: "#ffffff",
                              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                            }}
                          >
                            BETA
                          </span>
                        )}
                        {currentPatch === availablePatches[1] && currentPatch !== "PBE" && (
                          <span
                            className="ml-3 px-3 py-1 rounded-lg text-sm font-semibold"
                            style={{
                              background: "var(--primary-color-hover-bg)",
                              color: "var(--primary-color)",
                            }}
                          >
                            Latest
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-6 w-6 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                      style={{ color: "var(--primary-color)" }}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 rounded-2xl border-2 shadow-2xl z-50 max-h-64 overflow-y-auto custom-scrollbar"
                      style={{
                        background: "var(--modal-content-bg)",
                        borderColor: "var(--primary-color-border)",
                        boxShadow: "0 20px 40px var(--primary-color-active-bg)",
                        backdropFilter: "blur(15px)",
                      }}
                    >
                      {availablePatches.map((patch, index) => (
                        <button
                          key={patch}
                          onClick={() => {
                            onPatchChange(patch)
                            setIsDropdownOpen(false)
                          }}
                          className="w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group first:rounded-t-2xl last:rounded-b-2xl"
                          style={{
                            background:
                              currentPatch === patch
                                ? `linear-gradient(135deg, var(--primary-color-gradient-start), var(--primary-color-gradient-end))`
                                : "transparent",
                            color: "var(--text-color-main)",
                          }}
                          onMouseEnter={(e) => {
                            if (currentPatch !== patch) {
                              e.currentTarget.style.background = "var(--item-hover-bg)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPatch !== patch) {
                              e.currentTarget.style.background = "transparent"
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                currentPatch === patch ? "scale-125" : "scale-100"
                              }`}
                              style={{
                                background:
                                  currentPatch === patch ? "var(--primary-color)" : "var(--primary-color-border)",
                              }}
                            />
                            <div>
                              <span className="font-medium">{patch}</span>
                              {patch === "PBE" && (
                                <span
                                  className="ml-2 px-2 py-1 rounded-lg text-xs font-semibold"
                                  style={{
                                    background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
                                    color: "#ffffff",
                                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                  }}
                                >
                                  BETA
                                </span>
                              )}
                              {index === 0 && patch !== "PBE" && (
                                <span
                                  className="ml-2 px-2 py-1 rounded-lg text-xs font-semibold"
                                  style={{
                                    background: "var(--primary-color-hover-bg)",
                                    color: "var(--primary-color)",
                                  }}
                                >
                                  Latest
                                </span>
                              )}
                            </div>
                          </div>

                          {currentPatch === patch && (
                            <Check className="h-5 w-5" style={{ color: "var(--primary-color)" }} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "var(--primary-color-hover-bg)",
                    border: "1px solid var(--primary-color-border)",
                  }}
                >
                  <p className="text-sm" style={{ color: "var(--text-color-main)" }}>
                    <strong>Note:</strong> Changing the patch will reload all champion and skin data. This may take a
                    few moments.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cache" && (
            <div className="max-w-2xl mx-auto">
              <CacheManager />
            </div>
          )}

          {/* Apply Button - Only show for general tab */}
          {activeTab === "general" && (
            <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--primary-color-border)" }}>
              <button
                onClick={onApplySettings}
                className="w-full px-8 py-4 font-bold rounded-2xl transition-all duration-300 text-lg relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, var(--primary-color), var(--primary-color-darker))`,
                  color: "#ffffff",
                  border: "2px solid var(--primary-color)",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  boxShadow: "0 8px 25px var(--primary-color-active-bg)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"
                  e.currentTarget.style.boxShadow = "0 15px 40px var(--primary-color-active-bg)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.boxShadow = "0 8px 25px var(--primary-color-active-bg)"
                }}
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <Package className="h-6 w-6" />
                  <span>Apply Settings & Reload Data</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
