"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Trash2, RefreshCw, Database, Wifi, WifiOff } from "lucide-react"
import { serviceWorkerManager, formatCacheSize, getTotalCacheSize, getTotalCacheCount } from "../utils/serviceWorker"

interface CacheStatus {
  [cacheName: string]: {
    count: number
    size: number
  }
}

const CacheManager: React.FC = () => {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    loadCacheStatus()

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Listen for service worker updates
    serviceWorkerManager.on("updateAvailable", () => setUpdateAvailable(true))

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadCacheStatus = async () => {
    setIsLoading(true)
    try {
      const status = await serviceWorkerManager.getCacheStatus()
      setCacheStatus(status)
    } catch (error) {
      console.error("Failed to load cache status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCache = async () => {
    setIsLoading(true)
    try {
      const success = await serviceWorkerManager.clearCache()
      if (success) {
        setCacheStatus({})
        // Show success message
        console.log("Cache cleared successfully")
      }
    } catch (error) {
      console.error("Failed to clear cache:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateApp = async () => {
    await serviceWorkerManager.skipWaiting()
  }

  const totalSize = getTotalCacheSize(cacheStatus)
  const totalCount = getTotalCacheCount(cacheStatus)

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-lg"
            style={{
              background: "var(--primary-color-hover-bg)",
              border: "1px solid var(--primary-color-border)",
            }}
          >
            <Database className="h-5 w-5" style={{ color: "var(--primary-color)" }} />
          </div>
          <div>
            <h4 className="font-semibold" style={{ color: "var(--text-color-headings)" }}>
              Cache Management
            </h4>
            <p className="text-sm" style={{ color: "var(--text-color-secondary)" }}>
              {totalCount} items • {formatCacheSize(totalSize)}
            </p>
          </div>
        </div>

        {/* Online/Offline Status */}
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <div className="flex items-center space-x-2 text-green-400">
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Online</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-orange-400">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Cache Details */}
      {Object.keys(cacheStatus).length > 0 && (
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            background: "var(--item-bg)",
            border: "1px solid var(--primary-color-border)",
          }}
        >
          {Object.entries(cacheStatus).map(([cacheName, cache]) => (
            <div key={cacheName} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: "var(--text-color-main)" }}>
                  {cacheName.replace("skin-explorer-", "").replace("-v1.0.0", "")}
                </p>
                <p className="text-xs" style={{ color: "var(--text-color-secondary)" }}>
                  {cache.count} items
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: "var(--primary-color)" }}>
                  {formatCacheSize(cache.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={loadCacheStatus}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200"
          style={{
            background: "var(--primary-color-hover-bg)",
            border: "1px solid var(--primary-color-border)",
            color: "var(--text-color-main)",
          }}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>

        <button
          onClick={clearCache}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-sm font-medium">Clear Cache</span>
        </button>
      </div>

      {/* Update Available */}
      {updateAvailable && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))",
            border: "1px solid rgba(34, 197, 94, 0.3)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-400">Update Available</p>
              <p className="text-sm text-green-300">A new version of the app is ready</p>
            </div>
            <button
              onClick={updateApp}
              className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
            >
              Update Now
            </button>
          </div>
        </div>
      )}

      {/* Offline Notice */}
      {!isOnline && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(251, 146, 60, 0.1)",
            border: "1px solid rgba(251, 146, 60, 0.3)",
          }}
        >
          <p className="text-orange-400 font-medium">Offline Mode</p>
          <p className="text-sm text-orange-300">You're viewing cached content. Some features may be limited.</p>
        </div>
      )}
    </div>
  )
}

export default CacheManager
