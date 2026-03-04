<template>
  <div class="page-wrapper">
    <el-container class="layout-container">
      <el-aside width="200px" class="aside">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          router
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="1" popper-class="custom-submenu">
            <template #title>
              <div class="menu-title-wrapper">
                <el-icon class="menu-icon"><setting /></el-icon>
                <span class="menu-text">通用配置</span>
              </div>
            </template>
            <el-menu-item index="/config/plan" class="sub-menu-item">
              <span class="sub-menu-text">计划配置</span>
            </el-menu-item>
            <el-menu-item index="/config/result" class="sub-menu-item">
              <span class="sub-menu-text">结果配置</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2" popper-class="custom-submenu">
            <template #title>
              <div class="menu-title-wrapper">
                <el-icon class="menu-icon"><icon-menu /></el-icon>
                <span class="menu-text">计量配置</span>
              </div>
            </template>
            <el-menu-item index="/config/all-station" class="sub-menu-item">
              <span class="sub-menu-text">计量站一览</span>
            </el-menu-item>
            <el-menu-item index="/config/all-meter" class="sub-menu-item">
              <span class="sub-menu-text">配置一览</span>
            </el-menu-item>
            <el-menu-item index="/config/meter" class="sub-menu-item">
              <span class="sub-menu-text">修改配置</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3" popper-class="custom-submenu">
            <template #title>
              <div class="menu-title-wrapper">
                <el-icon class="menu-icon"><icon-menu /></el-icon>
                <span class="menu-text">测试</span>
              </div>
            </template>
            <el-menu-item index="/config/vue-test-temp" class="sub-menu-item">
              <span class="sub-menu-text">Vue测试组件</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Menu as IconMenu, Setting } from '@element-plus/icons-vue'

export default {
  name: 'MenuIndex',
  components: {
    IconMenu,
    Setting
  },
  mounted() {
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log('打开:', key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log('关闭:', key, keyPath)
    }
  }
}
</script>

<style scoped>
.page-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-title {
  height: 50px;
  line-height: 50px;
  background-color: #cfdcea;
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  border-radius: 8px;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-logo {
  height: 32px;
  width: auto;
}

.layout-container {
  flex: 1;
}

.aside {
  background: linear-gradient(180deg, #f5f7fa 0%, #e4e7ed 100%);
  border-right: none;
  border-radius: 12px;
  margin: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
  background: #ffffff;
}

/* 子菜单展开时的ul背景色 */
:deep(.el-menu--inline) {
  background-color: #ffffff !important;
}

/* 子菜单项背景色 */
:deep(.el-menu-item) {
  background-color: #ffffff;
}

/* 子菜单容器背景色 */
:deep(.el-sub-menu .el-menu) {
  background-color: #ffffff;
}

/* 菜单标题包装器样式 */
.menu-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 菜单图标样式 */
.menu-icon {
  font-size: 18px;
  color: #409eff;
  transition: all 0.3s ease;
}

/* 菜单文字样式 */
.menu-text {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

/* 子菜单项样式 */
.sub-menu-item {
  display: flex;
  align-items: center;
  padding-left: 40px !important;
  transition: all 0.3s ease;
}

/* 子菜单文字 */
.sub-menu-text {
  font-size: 14px;
  color: #606266;
}

/* 子菜单项悬停效果 */
.sub-menu-item:hover {
  background-color: #ecf5ff !important;
}

.sub-menu-item:hover .sub-menu-text {
  color: #409eff;
}

/* 选中状态的子菜单项 */
.sub-menu-item.is-active {
  background-color: #ecf5ff !important;
}

.sub-menu-item.is-active .sub-menu-text {
  color: #409eff;
  font-weight: 500;
}

.main {
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  padding: 24px;
  border-radius: 12px;
  margin: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: auto;
}
</style>
