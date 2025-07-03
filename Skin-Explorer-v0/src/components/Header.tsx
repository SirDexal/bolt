"use client"

import type React from "react"
import { Settings } from "lucide-react"

interface HeaderProps {
  onSettingsClick: () => void
  loadingMessage: string
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, loadingMessage }) => {
  return (
    <header
      className="border-b shadow-lg"
      style={{
        background: `linear-gradient(135deg, var(--background-gradient-start) 0%, var(--background-gradient-mid) 50%, var(--background-gradient-end) 100%)`,
        borderColor: "var(--primary-color-border)",
      }}
    >
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between w-full max-w-none">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg border"
              style={{
                background: "var(--primary-color-hover-bg)",
                borderColor: "var(--primary-color-border)",
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}favicon.png`}
                alt="SirDexal's Logo"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  // Fallback to a simple div with initials if favicon.png is not found
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  const fallback = document.createElement("div")
                  fallback.className = "h-10 w-10 rounded flex items-center justify-center text-sm font-bold"
                  fallback.style.background = "var(--primary-color)"
                  fallback.style.color = "var(--text-color-button)"
                  fallback.textContent = "SD"
                  target.parentNode?.appendChild(fallback)
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-color-headings)" }}>
                SirDexal's Skin Explorer
              </h1>
              <p style={{ color: "var(--text-color-secondary)" }} className="text-sm">
                League of Legends Champion Skins
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {loadingMessage && (
              <div className="flex items-center space-x-2" style={{ color: "var(--text-color-main)" }}>
                <div
                  className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full"
                  style={{ borderColor: "var(--primary-color)" }}
                ></div>
                <span className="text-sm">{loadingMessage}</span>
              </div>
            )}

            <button
              onClick={onSettingsClick}
              className="transition-all duration-200"
              style={{
                color: "var(--text-color-main)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary-color)"
                e.currentTarget.style.transform = "scale(1.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-color-main)"
                e.currentTarget.style.transform = "scale(1)"
              }}
              title="Settings"
            >
              <Settings className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
