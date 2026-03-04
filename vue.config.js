const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/tmms_config': {
        target: 'http://127.0.0.1:8169',
        changeOrigin: true
      },
      '/meter_general': {
        target: 'http://127.0.0.1:8169',
        changeOrigin: true
      },
      '/ac': {
        target: 'http://127.0.0.1:8169',
        changeOrigin: true
      },
      '/login': {
        target: 'http://127.0.0.1:8169',
        changeOrigin: true
      }
    }
  }
})
