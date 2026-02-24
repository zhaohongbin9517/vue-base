<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <el-menu
        default-active="1"
        class="el-menu-vertical"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>导航一</span>
          </template>
          <el-menu-item-group>
            <template #title><span>分组一</span></template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title><span>选项4</span></template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <template #title>导航二</template>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><setting /></el-icon>
          <template #title>导航三</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- <el-header class="header">
        <div class="header-right">
          <el-icon class="header-icon"><setting /></el-icon>
          <span>王小虎</span>
        </div>
      </el-header>
      <el-main class="main">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180" />
          <el-table-column prop="name" label="姓名" width="180" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </el-main> -->
    </el-container>
  </el-container>
</template>

<script>
import { Menu as IconMenu, Setting } from '@element-plus/icons-vue'

export default {
  name: 'NavMenu',
  components: {
    IconMenu,
    Setting
  },
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        }
      ]
    }
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
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.header {
  background-color: #b3c0d1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.header-icon {
  font-size: 18px;
  cursor: pointer;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
