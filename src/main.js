import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import './styles.css'
import './assets/css/tailwind.css' // 引入 Tailwind 样式
import './assets/iconfont/iconfont.css'
import SvgIcon from './components/SvgIcon.vue'
// 引入中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

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
app.use(ElementPlus, {
  locale: zhCn
})

// 👇 全局注册
app.component('svg-icon', SvgIcon)

app.use(router)
app.mount('#app')
