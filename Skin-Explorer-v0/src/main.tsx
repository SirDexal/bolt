import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { serviceWorkerManager } from "./utils/serviceWorker.ts"

// Register service worker
serviceWorkerManager.register().then((registered) => {
  if (registered) {
    console.log("✅ Service Worker registered successfully")

    // Listen for updates
    serviceWorkerManager.on("updateAvailable", () => {
      console.log("🔄 App update available")
      // You can show a notification to user here
    })

    // Listen for data updates
    serviceWorkerManager.on("dataUpdated", (data) => {
      console.log("📡 Data updated:", data.url)
      // You can refresh specific components here
    })
  } else {
    console.log("❌ Service Worker registration failed")
  }
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)