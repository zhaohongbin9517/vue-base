<template>
  <div class="page-wrapper">
    <div class="page-title">计量配置管理</div>
    <el-container class="layout-container">
      <el-aside width="200px" class="aside">
        <el-menu
          default-active="1"
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
            <el-menu-item index="1-1" @click="handleMenuClick('计划配置')">计划配置</el-menu-item>
            <el-menu-item index="1-2" @click="handleMenuClick('结果配置')">结果配置</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>
              <span>计量配置</span>
            </template>
            <el-menu-item index="2-1" @click="handleMenuClick('计量配置')">计量配置</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main class="main">
          <div class="content-area">
            <h2>{{ currentMenu }}</h2>
            <p>这是 {{ currentMenu }} 的内容区域</p>
          </div>
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
  data() {
    return {
      currentMenu: '计划配置',
      // tableData: [
      //   {
      //     date: '2016-05-02',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄',
      //   }
      // ]
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
    },
    handleMenuClick(menuName) {
      console.log('点击菜单:', menuName)
      this.currentMenu = menuName
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

.content-area {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: 300px;
}

.content-area h2 {
  margin-bottom: 16px;
  color: #303133;
}

.content-area p {
  color: #606266;
}
</style>
