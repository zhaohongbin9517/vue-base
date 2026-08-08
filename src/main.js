import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import './styles.css'
import './assets/css/main.css' // 引入 main 样式
import '@vue-flow/core/dist/style.css' // 核心样式
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
// import '@vue-flow/node-resizer/dist/style.css'


// 备份原生警告方法
const originalWarn = console.warn
// 重写 warn 过滤指定弃用警告
console.warn = function (...args) {
  // 匹配 checkbox label 弃用 + button text 弃用警告
  const isDeprecatedWarn = true
//   args.some(arg => 
//     typeof arg === 'string' && (
//       arg.includes('label act as value is about to be deprecated') || // checkbox 警告
//       arg.includes('type.text is about to be deprecated') // button 警告
//     )
//   )
  // 非目标警告才输出
  if (!isDeprecatedWarn) {
    originalWarn.apply(console, args)
  }
}

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')