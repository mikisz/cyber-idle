import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['icons/192.png', 'icons/512.png'],
      manifest: {
        name: 'Cyber Idle',
        short_name: 'CyberIdle',
        theme_color: '#0d0f14',
        icons: [
          {
            src: 'icons/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
