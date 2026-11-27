import { readdirSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/** Exposes the list of recorded voice files (public/audio/*.mp3) as `virtual:audio-list`. */
function audioList(): Plugin {
  const id = 'virtual:audio-list';
  return {
    name: 'audio-list',
    resolveId: (s) => (s === id ? '\0' + id : undefined),
    load(s) {
      if (s !== '\0' + id) return;
      let files: string[] = [];
      try {
        files = readdirSync('public/audio').filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4));
      } catch { /* no folder yet */ }
      return `export default ${JSON.stringify(files)};`;
    },
  };
}

export default defineConfig({
  base: '/kebun-ceria/',
  plugins: [
    audioList(),
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
        orientation: 'landscape',
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
