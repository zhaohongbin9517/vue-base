import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Vite 配置：替代原 vue.config.js
export default defineConfig({
  plugins: [vue()],
  // 部署基础路径，保持与原 publicPath: './' 一致，便于子目录部署
  base: './',
  resolve: {
    alias: {
      // @ -> src，保持与 jsconfig.json 一致
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // 与原 vue-cli-service serve 默认端口一致
    port: 8080,
    open: false,
    // 禁用 overlay 弹窗（与原 devServer.client.overlay: false 一致）
    hmr: {
      overlay: false
    },
    proxy: {
      '/tmms_config': {
        target: 'http://127.0.0.1:8267',
        changeOrigin: true
      },
      '/meter_general': {
        target: 'http://127.0.0.1:8267',
        changeOrigin: true
      },
      '/ac': {
        target: 'http://127.0.0.1:8267',
        changeOrigin: true
      },
      '/login': {
        target: 'http://127.0.0.1:8267',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    // element-plus 全量引入打包后较大，放宽告警阈值
    chunkSizeWarningLimit: 1500,
    target: 'es2015',
    // 静态资源路径使用相对路径（与 base: './' 配合）
    assetsInlineLimit: 4096
  }
})
