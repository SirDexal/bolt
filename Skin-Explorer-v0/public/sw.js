const CACHE_NAME = "skin-explorer-v1.0.0"
const STATIC_CACHE = "skin-explorer-static-v1.0.0"
const DYNAMIC_CACHE = "skin-explorer-dynamic-v1.0.0"
const IMAGE_CACHE = "skin-explorer-images-v1.0.0"

// Static assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/favicon.png",
  "/icons/epic.png",
  "/icons/legendary.png",
  "/icons/mythic.png",
  "/icons/ultimate.png",
  "/icons/exalted.png",
  "/icons/transcendent.png",
]

// API endpoints to cache
const API_ENDPOINTS = [
  "https://ddragon.leagueoflegends.com/api/versions.json",
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skinlines.json",
  "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/skinlines.json",
]

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
  NETWORK_ONLY: "network-only",
  CACHE_ONLY: "cache-only",
}

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...")

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches
        .open(STATIC_CACHE)
        .then((cache) => {
          console.log("[SW] Caching static assets")
          return cache.addAll(STATIC_ASSETS)
        }),

      // Cache initial API data
      caches
        .open(DYNAMIC_CACHE)
        .then((cache) => {
          console.log("[SW] Caching initial API data")
          return Promise.allSettled(
            API_ENDPOINTS.map((url) =>
              fetch(url)
                .then((response) => (response.ok ? cache.put(url, response) : null))
                .catch((err) => console.log(`[SW] Failed to cache ${url}:`, err)),
            ),
          )
        }),
    ]).then(() => {
      console.log("[SW] Installation complete")
      // Force activation of new service worker
      return self.skipWaiting()
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...")

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== IMAGE_CACHE) {
                console.log("[SW] Deleting old cache:", cacheName)
                return caches.delete(cacheName)
              }
            }),
          )
        }),

      // Take control of all clients
      self.clients.claim(),
    ]).then(() => {
      console.log("[SW] Activation complete")
    }),
  )
})

// Fetch event - handle all network requests
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Handle different types of requests
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request))
  } else if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request))
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request))
  } else {
    event.respondWith(handleOtherRequest(request))
  }
})

// Check if request is for static assets
function isStaticAsset(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname === "/" ||
      url.pathname.endsWith(".html") ||
      url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".ico") ||
      url.pathname.startsWith("/icons/"))
  )
}

// Check if request is for API data
function isAPIRequest(url) {
  return url.hostname === "ddragon.leagueoflegends.com" || url.hostname === "raw.communitydragon.org"
}

// Check if request is for images
function isImageRequest(url) {
  return (
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.includes("/champion/splash/") ||
    url.pathname.includes("/champion-splashes/") ||
    url.pathname.includes("/champion-chroma-images/") ||
    url.pathname.includes("/champion-icons/")
  )
}

// Handle static assets - Cache First strategy
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request, { cacheName: STATIC_CACHE })
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log("[SW] Static asset fetch failed:", error)
    return new Response("Offline", { status: 503, statusText: "Service Unavailable" })
  }
}

// Handle API requests - Stale While Revalidate strategy
async function handleAPIRequest(request) {
  const url = request.url

  try {
    // Get from cache first
    const cachedResponse = await caches.match(request, { cacheName: DYNAMIC_CACHE })

    // Start network request in background
    const networkPromise = fetch(request)
      .then(async (networkResponse) => {
        if (networkResponse.ok) {
          const cache = await caches.open(DYNAMIC_CACHE)

          // Cache with expiration metadata
          const responseToCache = networkResponse.clone()
          const headers = new Headers(responseToCache.headers)
          headers.set("sw-cached-at", Date.now().toString())

          const responseWithMetadata = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers,
          })

          cache.put(request, responseWithMetadata)

          // Notify clients of updated data
          notifyClientsOfUpdate(url)
        }
        return networkResponse
      })
      .catch((error) => {
        console.log("[SW] Network request failed:", error)
        return null
      })

    // Return cached response immediately if available
    if (cachedResponse) {
      // Check if cache is stale (older than 5 minutes for API data)
      const cachedAt = cachedResponse.headers.get("sw-cached-at")
      const isStale = !cachedAt || Date.now() - Number.parseInt(cachedAt) > 5 * 60 * 1000

      if (!isStale) {
        return cachedResponse
      }

      // Return stale cache but update in background
      networkPromise.catch(() => {}) // Prevent unhandled rejection
      return cachedResponse
    }

    // No cache available, wait for network
    const networkResponse = await networkPromise
    return (
      networkResponse ||
      new Response('{"error": "Offline"}', {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    )
  } catch (error) {
    console.log("[SW] API request failed:", error)
    return new Response('{"error": "Service unavailable"}', {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// Handle image requests - Cache First with long expiration
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request, { cacheName: IMAGE_CACHE })
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE)

      // Add cache headers for long-term storage
      const headers = new Headers(networkResponse.headers)
      headers.set("sw-cached-at", Date.now().toString())

      const responseToCache = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: headers,
      })

      cache.put(request, responseToCache)
    }
    return networkResponse
  } catch (error) {
    console.log("[SW] Image fetch failed:", error)

    // Return placeholder image for failed image requests
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <text x="50%" y="50%" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="16">
          Image Unavailable Offline
        </text>
      </svg>`,
      {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-cache",
        },
      },
    )
  }
}

// Handle other requests - Network First
async function handleOtherRequest(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    return (
      cachedResponse ||
      new Response("Offline", {
        status: 503,
        statusText: "Service Unavailable",
      })
    )
  }
}

// Notify clients of data updates
function notifyClientsOfUpdate(url) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "DATA_UPDATED",
        url: url,
        timestamp: Date.now(),
      })
    })
  })
}

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  const { type, data } = event.data

  switch (type) {
    case "SKIP_WAITING":
      self.skipWaiting()
      break

    case "CLEAR_CACHE":
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break

    case "GET_CACHE_STATUS":
      getCacheStatus().then((status) => {
        event.ports[0].postMessage(status)
      })
      break

    default:
      console.log("[SW] Unknown message type:", type)
  }
})

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  return Promise.all(cacheNames.map((name) => caches.delete(name)))
}

// Get cache status information
async function getCacheStatus() {
  const cacheNames = await caches.keys()
  const status = {}

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    status[cacheName] = {
      count: keys.length,
      size: await getCacheSize(cache),
    }
  }

  return status
}

// Calculate cache size
async function getCacheSize(cache) {
  const keys = await cache.keys()
  let totalSize = 0

  for (const key of keys) {
    const response = await cache.match(key)
    if (response) {
      const blob = await response.blob()
      totalSize += blob.size
    }
  }

  return totalSize
}

// Background sync for updating cache
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(updateCacheInBackground())
  }
})

// Update cache in background
async function updateCacheInBackground() {
  console.log("[SW] Background sync: Updating cache...")

  try {
    const cache = await caches.open(DYNAMIC_CACHE)

    // Update version data
    const versionsResponse = await fetch("https://ddragon.leagueoflegends.com/api/versions.json")
    if (versionsResponse.ok) {
      cache.put("https://ddragon.leagueoflegends.com/api/versions.json", versionsResponse)
    }

    console.log("[SW] Background sync completed")
  } catch (error) {
    console.log("[SW] Background sync failed:", error)
  }
}

console.log("[SW] Service Worker loaded")
