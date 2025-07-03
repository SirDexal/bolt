"use client"

import type React from "react"
import type { SkinCardProps } from "../types"
import { getSkinSplashUrl, getSkinSplashFallbackUrl, getSkinNumFromId } from "../services/api"
import { formatSkinName, getRarityColor, getRarityName } from "../utils/rarity"
import ImageWithFallback from "./ImageWithFallback"

interface ExtendedSkinCardProps extends SkinCardProps {
  viewMode: "grid" | "list"
  currentPatch: string
}

const SkinCard: React.FC<ExtendedSkinCardProps> = ({
  skin,
  champion,
  detailedData,
  seriesName,
  onChromaClick,
  viewMode,
  currentPatch,
}) => {
  const primaryImageUrl = getSkinSplashUrl(champion.id, skin.num)
  const fallbackImageUrl = getSkinSplashFallbackUrl(champion.key, skin.id)
  const skinName = formatSkinName(skin.name)

  // Use the chromas boolean from championFull.json (primary source)
  const hasChromasFromChampionData = skin.chromas === true
  const chromaCount = detailedData?.chromas?.length || 0
  const shouldShowChromaButton = hasChromasFromChampionData || chromaCount > 0

  const getRarityInfo = (rarity?: string) => {
    if (!rarity || rarity === "kNoRarity") return { name: "", color: "#666", icon: "" }

    const rarityName = getRarityName(rarity)
    const rarityColor = getRarityColor(rarity)

    switch (rarity.toLowerCase()) {
      case "kepic":
      case "epic":
        return { name: rarityName, color: rarityColor, icon: "/icons/epic.png" }
      case "klegendary":
      case "legendary":
        return { name: rarityName, color: rarityColor, icon: "/icons/legendary.png" }
      case "kultimate":
      case "ultimate":
        return { name: rarityName, color: rarityColor, icon: "/icons/ultimate.png" }
      case "kmythic":
      case "mythic":
        return { name: rarityName, color: rarityColor, icon: "/icons/mythic.png" }
      case "kexalted":
      case "exalted":
        return { name: rarityName, color: rarityColor, icon: "/icons/exalted.png" }
      case "ktranscendent":
      case "transcendent":
        return { name: rarityName, color: rarityColor, icon: "/icons/transcendent.png" }
      default:
        return { name: "", color: "#666", icon: "" }
    }
  }

  const rarityInfo = getRarityInfo(detailedData?.rarity)

  if (viewMode === "grid") {
    return (
      <div
        className="group relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer w-full"
        style={{
          aspectRatio: "16/10",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        }}
        onClick={shouldShowChromaButton ? onChromaClick : undefined}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)"
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.5)"
          e.currentTarget.style.borderColor = "var(--primary-color)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)"
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Background Image Layer */}
        <ImageWithFallback
          primarySrc={primaryImageUrl}
          fallbackSrc={fallbackImageUrl}
          alt={`${champion.name} - ${skinName}`}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
        />

        {/* Gradient Overlays */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 50%),
              linear-gradient(to left, rgba(0, 0, 0, 0.3) 0%, transparent 40%)
            `,
          }}
        />

        {/* Top Left Indicators Container - Side by Side with Persistent Glow */}
        <div className="absolute top-2 left-2 flex items-center space-x-2 z-20">
          {/* Chroma Indicator - ALWAYS FIRST (Priority to left) with Persistent Glow */}
          {shouldShowChromaButton && (
            <div
              className="chroma-indicator px-3 py-1.5 rounded-lg text-xs font-bold transition-transform duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.85))",
                color: "var(--primary-color)",
                border: "2px solid var(--primary-color)",
                backdropFilter: "blur(10px)",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "0.5px",
                textShadow: "0 0 8px var(--primary-color), 0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              ✨ CHROMA
            </div>
          )}

          {/* Enhanced Legacy Indicator - SECOND (Right of chroma) with Persistent Glow */}
          {detailedData?.isLegacy && (
            <div
              className="legacy-indicator px-3 py-1.5 rounded-lg text-xs font-bold transition-transform duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, rgba(139, 69, 19, 0.95), rgba(160, 82, 45, 0.85))",
                color: "#FFD700",
                border: "2px solid #CD853F",
                backdropFilter: "blur(10px)",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "0.5px",
                textShadow: "0 0 8px #FFD700, 0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              👑 LEGACY
            </div>
          )}
        </div>

        {/* Rarity Icon - Top Right */}
        {rarityInfo.name && (
          <div className={`absolute top-2 right-2 rarity-icon-small ${rarityInfo.name.toLowerCase()}`}></div>
        )}

        {/* Compact Bottom Info Panel */}
        <div
          className="absolute bottom-2 left-2 right-2 p-2 rounded-md"
          style={{
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Skin Name */}
          <h3
            className="text-sm font-bold mb-1 leading-tight"
            style={{
              color: "#ffffff",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
              letterSpacing: "0.3px",
            }}
          >
            {skinName}
          </h3>

          {/* Single Line Info */}
          <div className="flex items-center justify-between text-xs">
            {/* Left - Skin Number */}
            <span
              className="font-semibold"
              style={{
                color: "var(--primary-color)",
                letterSpacing: "0.3px",
              }}
            >
              Skin ID: {getSkinNumFromId(skin.id, champion.key)}
            </span>

            {/* Right - Series */}
            <span className="text-white font-medium truncate ml-2" title={seriesName || "Classic"}>
              {seriesName || "Classic"}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // List View with Updated Rarity Colors
  return (
    <div
      className="group relative flex items-center overflow-hidden rounded-lg w-full transition-all duration-300 cursor-pointer
                 border border-[var(--primary-color-border)] shadow-md hover:shadow-xl hover:border-[var(--primary-color)]"
      style={{
        height: "100px",
        background: "var(--item-bg)",
        margin: "2px",
      }}
      onClick={shouldShowChromaButton ? onChromaClick : undefined}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--item-hover-bg)"
        e.currentTarget.style.borderColor = "var(--primary-color)"
        e.currentTarget.style.boxShadow = "0 4px 15px var(--primary-color-active-bg)"
        e.currentTarget.style.marginTop = "0px"
        e.currentTarget.style.marginBottom = "4px"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--item-bg)"
        e.currentTarget.style.borderColor = "var(--primary-color-border)"
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)"
        e.currentTarget.style.marginTop = "2px"
        e.currentTarget.style.marginBottom = "2px"
      }}
    >
      {/* MAXIMUM VISIBILITY: Highly Visible Background Image */}
      <ImageWithFallback
        primarySrc={primaryImageUrl}
        fallbackSrc={fallbackImageUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-top opacity-85 group-hover:opacity-95 transition-opacity duration-300"
        style={{
          filter: "brightness(1.3) contrast(1.2) saturate(1.1)", // Maximum enhancement
        }}
      />

      {/* MINIMAL: Very Light Overlay - Only for Text Readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.3) 100%)
          `,
        }}
      />

      {/* Content Container with Maximum Text Contrast */}
      <div className="relative flex items-center justify-between h-full w-full px-4 sm:px-6 z-10">
        {/* Left Section: Skin Information with Strong Text Shadows */}
        <div className="flex-1 min-w-0 pr-4">
          <h3
            className="text-lg font-bold truncate"
            title={skinName}
            style={{
              color: "#ffffff",
              textShadow: "0 0 12px rgba(0, 0, 0, 1), 0 2px 8px rgba(0, 0, 0, 0.9), 0 4px 12px rgba(0, 0, 0, 0.8)", // Maximum text shadow
              fontWeight: "900",
            }}
          >
            {skinName}
          </h3>

          {/* Info Row with Enhanced Indicators */}
          <div className="flex items-center space-x-3 text-sm mt-2">
            {/* Skin ID */}
            <div className="flex items-center space-x-1.5" title={`Skin ID: ${skin.id}`}>
              <span
                className="font-semibold"
                style={{
                  color: "var(--primary-color)",
                  textShadow: "0 0 8px rgba(0, 0, 0, 1), 0 2px 6px rgba(0, 0, 0, 0.9)", // Maximum text shadow
                  fontWeight: "900",
                }}
              >
                #{getSkinNumFromId(skin.id, champion.key)}
              </span>
            </div>

            {/* Series */}
            {seriesName && (
              <div className="flex items-center space-x-1.5" title={`Series: ${seriesName}`}>
                <span
                  className="font-medium truncate"
                  style={{
                    color: "#ffffff", // Pure white for maximum contrast
                    textShadow: "0 0 10px rgba(0, 0, 0, 1), 0 2px 6px rgba(0, 0, 0, 0.9), 0 4px 8px rgba(0, 0, 0, 0.8)", // Maximum text shadow
                    fontWeight: "800",
                  }}
                >
                  {seriesName}
                </span>
              </div>
            )}

            {/* Enhanced Indicators Container - Side by Side with Persistent Glow */}
            <div className="flex items-center space-x-2">
              {/* Enhanced Chroma Indicator - PRIORITY LEFT with Persistent Glow */}
              {shouldShowChromaButton && (
                <div
                  className="chroma-indicator px-3 py-1 rounded-lg text-xs font-bold transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(0, 0, 0, 0.95))", // Darker background
                    color: "var(--primary-color)",
                    border: "2px solid var(--primary-color)",
                    backdropFilter: "blur(12px)",
                    fontWeight: "900",
                    letterSpacing: "0.5px",
                    textShadow: "0 0 8px var(--primary-color), 0 2px 6px rgba(0, 0, 0, 1)",
                    zIndex: 15,
                    boxShadow: "0 0 20px rgba(0, 0, 0, 0.8)", // Added shadow for better separation
                  }}
                >
                  ✨ CHROMA
                </div>
              )}

              {/* Enhanced Legacy Indicator - RIGHT OF CHROMA with Persistent Glow */}
              {detailedData?.isLegacy && (
                <div
                  className="legacy-indicator px-3 py-1 rounded-lg text-xs font-bold transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(139, 69, 19, 0.98), rgba(160, 82, 45, 0.95))", // Darker background
                    color: "#FFD700",
                    border: "2px solid #CD853F",
                    backdropFilter: "blur(12px)",
                    fontWeight: "900",
                    letterSpacing: "0.5px",
                    textShadow: "0 0 8px #FFD700, 0 2px 6px rgba(0, 0, 0, 1)",
                    zIndex: 15,
                    boxShadow: "0 0 20px rgba(0, 0, 0, 0.8)", // Added shadow for better separation
                  }}
                >
                  👑 LEGACY
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Rarity Only */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Rarity Badge with Updated Colors */}
          {rarityInfo.name && (
            <div
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(0, 0, 0, 0.9)", // Darker background for maximum contrast
                backdropFilter: "blur(12px)",
                border: "2px solid var(--primary-color-border)",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.8)", // Added shadow for better separation
              }}
              title={`${rarityInfo.name} Rarity`}
            >
              <div className={`rarity-icon-small ${rarityInfo.name.toLowerCase()}`}></div>
              <span
                className="text-xs uppercase font-semibold"
                style={{
                  color: rarityInfo.color, // Using the new rarity colors
                  textShadow: "0 0 6px rgba(0, 0, 0, 1), 0 2px 4px rgba(0, 0, 0, 0.9)", // Maximum text shadow
                  fontWeight: "900",
                }}
              >
                {rarityInfo.name}
              </span>
            </div>
          )}

          {/* Rarity Icon (for smaller screens) */}
          {rarityInfo.name && (
            <div
              className={`rarity-icon sm:hidden ${rarityInfo.name.toLowerCase()}`}
              title={`${rarityInfo.name} Rarity`}
              style={{ width: "28px", height: "28px" }}
            ></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SkinCard
