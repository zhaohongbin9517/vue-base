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
      '/ac': {
        target: 'http://127.0.0.1:8267',
        changeOrigin: true
      },
      '/login': {
        target: 'http://127.0.0.1:8267',
        changeOrigin: true
      },
      '/behavior_file': {
        target: 'http://127.0.0.1:8326',
        changeOrigin: true
      },
      '/snapshot': {
        target: 'http://127.0.0.1:8326',
        changeOrigin: true
      },
      '/behavior': {
        target: 'http://127.0.0.1:8326',
        changeOrigin: true
      },
      '/behavior_tree': {
        target: 'http://127.0.0.1:8326',
        changeOrigin: true
      }
    }
  }
})
