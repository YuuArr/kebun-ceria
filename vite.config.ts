import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/kebun-ceria/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'Kebun Ceria',
        short_name: 'Kebun Ceria',
        description: 'Permainan belajar membaca, berhitung, warna dan bentuk untuk anak 2–5 tahun.',
        lang: 'id',
        start_url: '/kebun-ceria/',
        scope: '/kebun-ceria/',
        display: 'fullscreen',
        orientation: 'any',
        theme_color: '#7CC36E',
        background_color: '#FFF8E7',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}', 'audio/*.mp3'],
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/audio/') && url.pathname.endsWith('.mp3'),
            handler: 'CacheFirst',
            options: { cacheName: 'kc-audio', expiration: { maxEntries: 300 } },
          },
        ],
      },
    }),
  ],
});
