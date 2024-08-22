import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add server configuration to expose it to the network
  server: {
    host: true,  // Expose the server to the network
    port: 5173,  // Use the same port as before
    // Optional: Add a strict port to ensure Vite doesn't fall back to a different port
    strictPort: true,
  },
})
