import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // GitHub Pages 部署需要设置 base 路径
  base: '/stock-query-app/',
  
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
        start_url: '/stock-query-app/',
        icons: [
          {
            src: '/stock-query-app/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/stock-query-app/icon-512x512.png',
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
    // 确保生成 _redirects 或 404.html 用于 SPA
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
