import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Split react/react-dom to a separate chunk
            if (id.includes("react")) return "react-vendor"
            // Split video libraries separately
            if (
              id.includes("react-player") ||
              id.includes("wistia") ||
              id.includes("youtube") ||
              id.includes("mux") ||
              id.includes("vimeo")
            )
              return "video-players"

            return "vendor" // generic vendor chunk
          }
        },
      },
    },
  },
})
