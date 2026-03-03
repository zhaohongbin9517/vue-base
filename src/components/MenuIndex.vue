<template>
  <div class="page-wrapper">
    <div class="page-title">
      <img src="@/assets/logo.png" alt="logo" class="title-logo" />
      <span>计量配置管理</span>
    </div>
    <el-container class="layout-container">
      <el-aside width="200px" class="aside">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
        >
          <el-sub-menu index="1" popper-class="custom-submenu">
            <template #title>
              <div class="menu-title-wrapper">
                <el-icon class="menu-icon"><setting /></el-icon>
                <span class="menu-text">通用配置</span>
              </div>
            </template>
            <el-menu-item index="plan" class="sub-menu-item">
              <span class="sub-menu-text">计划配置</span>
            </el-menu-item>
            <el-menu-item index="result" class="sub-menu-item">
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
            <el-menu-item index="allMeter" class="sub-menu-item">
              <span class="sub-menu-text">配置一览</span>
            </el-menu-item>
            <el-menu-item index="changMeter" class="sub-menu-item">
              <span class="sub-menu-text">修改配置</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main class="main">
          <component :is="currentComponent" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Menu as IconMenu, Setting } from '@element-plus/icons-vue'
import BlankConfig from './BlankConfig.vue'
import PlanConfig from './PlanConfig.vue'
import ResultConfig from './ResultConfig.vue'
import MeterConfig from './MeterConfig.vue'
import AllMeterConfig from './AllMeterConfig.vue'

export default {
  name: 'MenuIndex',
  components: {
    IconMenu,
    Setting,
    BlankConfig,
    PlanConfig,
    ResultConfig,
    MeterConfig,
    AllMeterConfig
  },
  data() {
    return {
      activeMenu: '',
      currentComponent: 'BlankConfig'
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log('打开:', key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log('关闭:', key, keyPath)
    },
    handleSelect(index, indexPath) {
      console.log('选中菜单:', index, indexPath)
      this.activeMenu = index
      switch (index) {
        case 'plan':
          this.currentComponent = 'PlanConfig'
          break
        case 'result':
          this.currentComponent = 'ResultConfig'
          break
        case 'changMeter':
          this.currentComponent = 'MeterConfig'
          break
        case 'allMeter':
          this.currentComponent = 'AllMeterConfig'
          break
        default:
          this.currentComponent = 'BlankConfig'
      }
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
