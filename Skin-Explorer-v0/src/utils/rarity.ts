export const getRarityColor = (rarity?: string): string => {
  if (!rarity || rarity === "kNoRarity") return ""

  switch (rarity.toLowerCase()) {
    case "kepic":
    case "epic":
      return "#3bdcf5" // Cyan/Light Blue
    case "klegendary":
    case "legendary":
      return "#f90a01" // Red
    case "kultimate":
    case "ultimate":
      return "#e99839" // Orange
    case "kmythic":
    case "mythic":
      return "#f203e1" // Magenta/Pink
    case "kexalted":
    case "exalted":
      return "#dde179" // Yellow-Green
    case "ktranscendent":
    case "transcendent":
      return "#efe9f7" // Light Purple
    default:
      return ""
  }
}

export const getRarityName = (rarity?: string): string => {
  if (!rarity || rarity === "kNoRarity") return ""

  switch (rarity.toLowerCase()) {
    case "kepic":
      return "Epic"
    case "klegendary":
      return "Legendary"
    case "kultimate":
      return "Ultimate"
    case "kmythic":
      return "Mythic"
    case "kexalted":
      return "Exalted"
    case "ktranscendent":
      return "Transcendent"
    default:
      return rarity.replace("k", "").replace("K", "")
  }
}

export const formatSkinName = (name: string): string => {
  if (!name || name === "default") return "Classic"
  return name
}
