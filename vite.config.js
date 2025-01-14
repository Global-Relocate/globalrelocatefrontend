import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

// Access the environment variables
const viteApiUrl = process.env.VITE_API_URL;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define VITE_API_URL to avoid direct exposure in the frontend
    "process.env.VITE_API_URL": JSON.stringify(viteApiUrl),
  },
  build: {
    // Optional: Disable sourcemap generation to avoid exposing environment variables in source maps
    sourcemap: false,
  },
})
