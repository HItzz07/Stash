import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
      ],

      manifest: {
        name: 'Stash',
        short_name: 'Stash',
        description: 'Offline-first notes',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fbf9f6',
        theme_color: '#fbf9f6',
      },

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        // 🔥 CRITICAL FOR REACT ROUTER OFFLINE
        navigateFallback: '/',

        runtimeCaching: [
          {
            // HTML / navigation
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
            },
          },
          {
            // JS / CSS / Fonts / Icons
            urlPattern: /\.(?:js|css|woff2|png|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets',
              expiration: {
                maxEntries: 100,
              },
            },
          },
        ],
      },
    }),
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
