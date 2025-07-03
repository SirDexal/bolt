// Service Worker registration and management utilities

interface ServiceWorkerMessage {
    type: string
    data?: any
    url?: string
    timestamp?: number
  }
  
  interface CacheStatus {
    [cacheName: string]: {
      count: number
      size: number
    }
  }
  
  class ServiceWorkerManager {
    private registration: ServiceWorkerRegistration | null = null
    private updateAvailable = false
    private listeners: { [key: string]: Function[] } = {}
  
    constructor() {
      this.setupMessageListener()
    }
  
    // Register service worker
    async register(): Promise<boolean> {
      if (!("serviceWorker" in navigator)) {
        console.log("Service Worker not supported")
        return false
      }
  
      try {
        this.registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
          scope: import.meta.env.BASE_URL,
        })
  
        console.log("Service Worker registered:", this.registration.scope)
  
        // Handle updates
        this.registration.addEventListener("updatefound", () => {
          const newWorker = this.registration!.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                this.updateAvailable = true
                this.emit("updateAvailable")
              }
            })
          }
        })
  
        // Handle controller change
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          this.emit("controllerChange")
          window.location.reload()
        })
  
        return true
      } catch (error) {
        console.error("Service Worker registration failed:", error)
        return false
      }
    }
  
    // Setup message listener for SW messages
    private setupMessageListener() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.addEventListener("message", (event) => {
          const message: ServiceWorkerMessage = event.data
          this.handleServiceWorkerMessage(message)
        })
      }
    }
  
    // Handle messages from service worker
    private handleServiceWorkerMessage(message: ServiceWorkerMessage) {
      switch (message.type) {
        case "DATA_UPDATED":
          this.emit("dataUpdated", { url: message.url, timestamp: message.timestamp })
          break
        default:
          console.log("Unknown SW message:", message)
      }
    }
  
    // Update service worker
    async update(): Promise<void> {
      if (this.registration) {
        await this.registration.update()
      }
    }
  
    // Skip waiting and activate new service worker
    async skipWaiting(): Promise<void> {
      if (this.registration && this.registration.waiting) {
        this.registration.waiting.postMessage({ type: "SKIP_WAITING" })
      }
    }
  
    // Clear all caches
    async clearCache(): Promise<boolean> {
      return new Promise((resolve) => {
        if (this.registration && this.registration.active) {
          const messageChannel = new MessageChannel()
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data.success)
          }
  
          this.registration.active.postMessage({ type: "CLEAR_CACHE" }, [messageChannel.port2])
        } else {
          resolve(false)
        }
      })
    }
  
    // Get cache status
    async getCacheStatus(): Promise<CacheStatus> {
      return new Promise((resolve) => {
        if (this.registration && this.registration.active) {
          const messageChannel = new MessageChannel()
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data)
          }
  
          this.registration.active.postMessage({ type: "GET_CACHE_STATUS" }, [messageChannel.port2])
        } else {
          resolve({})
        }
      })
    }
  
    // Check if app is running offline
    isOffline(): boolean {
      return !navigator.onLine
    }
  
    // Event emitter methods
    on(event: string, callback: Function) {
      if (!this.listeners[event]) {
        this.listeners[event] = []
      }
      this.listeners[event].push(callback)
    }
  
    off(event: string, callback: Function) {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
      }
    }
  
    private emit(event: string, data?: any) {
      if (this.listeners[event]) {
        this.listeners[event].forEach((callback) => callback(data))
      }
    }
  
    // Get registration status
    getRegistration(): ServiceWorkerRegistration | null {
      return this.registration
    }
  
    // Check if update is available
    isUpdateAvailable(): boolean {
      return this.updateAvailable
    }
  }
  
  // Create singleton instance
  export const serviceWorkerManager = new ServiceWorkerManager()
  
  // Utility functions
  export const formatCacheSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }
  
  export const getTotalCacheSize = (cacheStatus: CacheStatus): number => {
    return Object.values(cacheStatus).reduce((total, cache) => total + cache.size, 0)
  }
  
  export const getTotalCacheCount = (cacheStatus: CacheStatus): number => {
    return Object.values(cacheStatus).reduce((total, cache) => total + cache.count, 0)
  }
  