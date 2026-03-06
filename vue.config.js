const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    client: {
      // 完全禁用 overlay 弹窗（推荐，开发时看控制台日志即可）
      overlay: false,
      // 如果你想保留错误弹窗、只隐藏警告：
      // overlay: {
      //   warnings: false,
      //   errors: true
      // }
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
  }
})
