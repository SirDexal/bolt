const DDRAGON_BASE_URL = 'https://ddragon.leagueoflegends.com';
const CDRAGON_BASE_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1';

export const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
};

export const getLatestPatch = async (): Promise<string[]> => {
  try {
    const versions = await fetchWithRetry(`${DDRAGON_BASE_URL}/api/versions.json`);
    return versions;
  } catch (error) {
    console.error('Failed to fetch patch versions:', error);
    return ['14.10.1']; // Fallback
  }
};

export const fetchAllChampionDetails = async (patch: string) => {
  try {
    const url = `${DDRAGON_BASE_URL}/cdn/${patch}/data/en_US/championFull.json`;
    const response = await fetchWithRetry(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch champion details:', error);
    throw error;
  }
};

export const fetchAllDetailedSkinsData = async () => {
  try {
    const url = `${CDRAGON_BASE_URL}/skins.json`;
    const response = await fetchWithRetry(url);
    
    const skinMap = new Map();
    
    // Handle both object and array responses
    let skinsToProcess;
    if (typeof response === 'object' && response !== null) {
      if (Array.isArray(response)) {
        skinsToProcess = response;
      } else {
        // If it's an object, convert to array of values
        skinsToProcess = Object.values(response);
      }
    } else {
      console.error('Unexpected response format:', typeof response);
      return new Map();
    }
    
    skinsToProcess.forEach((skin: any) => {
      if (skin && typeof skin.id === 'number') {
        skinMap.set(skin.id.toString(), {
          id: skin.id,
          rarity: skin.rarity,
          isLegacy: skin.isLegacy || false,
          skinLines: skin.skinLines || [],
          chromas: skin.chromas || []
        });
      }
    });
    
    return skinMap;
  } catch (error) {
    console.error('Failed to fetch detailed skin data:', error);
    return new Map();
  }
};

export const fetchAllSkinLines = async () => {
  try {
    const url = `${CDRAGON_BASE_URL}/skinlines.json`;
    const response = await fetchWithRetry(url);
    
    const skinLinesMap = new Map();
    
    if (Array.isArray(response)) {
      response.forEach((skinLine: any) => {
        if (skinLine && skinLine.id && skinLine.name) {
          skinLinesMap.set(skinLine.id, skinLine.name);
        }
      });
    } else {
      console.error('Expected array for skinlines, got:', typeof response);
    }
    
    return skinLinesMap;
  } catch (error) {
    console.error('Failed to fetch skin lines:', error);
    return new Map();
  }
};

export const getChampionIconUrl = (patch: string, imageFile: string): string => {
  return `${DDRAGON_BASE_URL}/cdn/${patch}/img/champion/${imageFile}`;
};

export const getSkinSplashUrl = (championId: string, skinNum: number): string => {
  return `${DDRAGON_BASE_URL}/cdn/img/champion/splash/${championId}_${skinNum}.jpg`;
};

export const getSkinSplashFallbackUrl = (championKey: string, skinId: string): string => {
  return `${CDRAGON_BASE_URL}/champion-splashes/${championKey}/${skinId}.jpg`;
};

export const getChromaThumbnailUrl = (championKey: string, chromaId: string): string => {
  return `${CDRAGON_BASE_URL}/champion-chroma-images/${championKey}/${chromaId}.png`;
};

// Helper function to extract skin number from full skin ID
export const getSkinNumFromId = (fullSkinId: string, championKey: string): string => {
  const champIdStr = championKey.toString();
  const fullSkinIdStr = fullSkinId.toString();

  if (fullSkinIdStr.startsWith(champIdStr)) {
    const remainingPart = fullSkinIdStr.substring(champIdStr.length);
    return parseInt(remainingPart, 10).toString();
  }
  
  return parseInt(fullSkinIdStr, 10).toString();
};