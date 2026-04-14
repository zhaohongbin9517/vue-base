const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pages: {
    index: {
      entry: 'src/main.js',
      title: '任务管理' // 自定义标题
    }
  },
  transpileDependencies: true,
  outputDir: 'dist',
  assetsDir: 'static',
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
        target: 'http://127.0.0.1:8501',
        changeOrigin: true
      },
      '/login': {
        target: 'http://127.0.0.1:8501',
        changeOrigin: true
      },
      '/api': {
        target: 'http://127.0.0.1:8501',
        changeOrigin: true
      }
    }
  }
})
