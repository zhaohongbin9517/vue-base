<template>
  <div class="page-wrapper">
    <div class="page-title">计量配置管理</div>
    <el-container class="layout-container">
      <el-aside width="200px" class="aside">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><setting /></el-icon>
              <span>通用配置</span>
            </template>
            <el-menu-item index="plan">计划配置</el-menu-item>
            <el-menu-item index="result">结果配置</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>
              <span>计量配置</span>
            </template>
            <el-menu-item index="meter">计量配置</el-menu-item>
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

export default {
  name: 'MenuIndex',
  components: {
    IconMenu,
    Setting,
    BlankConfig,
    PlanConfig,
    ResultConfig,
    MeterConfig
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
        case 'meter':
          this.currentComponent = 'MeterConfig'
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
  background-color: #409eff;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.layout-container {
  flex: 1;
}

.aside {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
