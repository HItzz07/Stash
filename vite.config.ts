import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Stash Notes',
        short_name: 'Stash',
        description: 'Minimalist capture & forget notes app',
        theme_color: '#fbf9f6',
        background_color: '#fbf9f6',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  // server: {
  //   host: true, // This exposes the app to your Local IP (e.g., 192.168.x.x)
  //   port: 5173, // Optional: Fix the port if you want
  // }
  // // server: {
  // //   host: true, // Network access allow karne ke liye
  // //   allowedHosts: [
  // //     'bf7529d69f95.ngrok-free.app',
  // //     'ngrok-free.app', // Ngrok ke domains allow karne ke liye
  // //     // 'all'             // Ya fir sab kuch allow karne ke liye 'all' likh sakte ho
  // //   ]
  // // }

  server: {
    host: '0.0.0.0', // This forces Vite to listen on ALL network IPs
    port: 5173,
    strictPort: true, // Ensures it doesn't switch ports randomly
    cors: true, // Enables CORS for external access
    allowedHosts: ['.ngrok-free.app', 'localhost'] // Note the dot prefix for wildcards if supported, or just list specific
  }
})
