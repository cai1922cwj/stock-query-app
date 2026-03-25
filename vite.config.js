import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages 仓库名
const repoName = 'stock-query-app'

export default defineConfig({
  // GitHub Pages 部署需要设置 base 路径
  base: `/${repoName}/`,
  
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '股票查询APP',
        shortName: '股票查询',
        description: '实时股票行情查询工具',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: `/${repoName}/`,
        scope: `/${repoName}/`,
        icons: [
          {
            src: `/${repoName}/icon-192x192.png`,
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: `/${repoName}/icon-512x512.png`,
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name][extname]`
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name][extname]`
          }
          return `assets/[name][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
