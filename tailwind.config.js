/** @type {import('tailwindcss').Config} */
module.exports = {
  // 关键：指定需要扫描的文件路径（适配 Vue CLI 项目结构）
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}" // 扫描 src 下所有 vue/js/ts 文件
  ],
  theme: {
    extend: {}, // 可在这里自定义主题（如颜色、字体）
  },
  plugins: [],
}