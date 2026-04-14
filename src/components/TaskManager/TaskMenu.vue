<template>
  <div class="page-wrapper">
    <el-container class="layout-container">
      <el-aside width="200px" class="aside">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          router
        >
          <el-sub-menu
            v-for="item in menuItem"
            :key="item.name"
            :index="item.name"
            popper-class="custom-submenu"
          >
            <template #title>
              <div class="menu-title-wrapper">
                <el-icon class="menu-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="menu-text">{{ item.name }}</span>
              </div>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.name"
              :index="child.command || '/'"
              class="sub-menu-item"
            >
              <el-icon v-if="child.icon" class="sub-menu-icon">
                <component :is="child.icon" />
              </el-icon>
              <span class="sub-menu-text">{{ child.name }}</span>
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

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Postcard, SetUp, FolderRemove, HelpFilled, QuestionFilled } from '@element-plus/icons-vue'

const route = useRoute()

const menuItem = [
  {
    icon: Postcard,
    name: '任务管理',
    children: [
      { icon: Postcard,  name: '任务管理' , command: '/task-manager/taskManager'},
      { icon: SetUp,  name: '配置管理' ,command: '/task-manager/configManager' },
      { icon: FolderRemove,  name: '文件管理' ,command: '/task-manager/fileManager' },
      { icon: HelpFilled,  name: '插件管理' ,command: '/task-manager/pluginManager' }
    ]
  },
  {
    icon: Postcard,
    name: '系统说明',
    children: [
      { icon: QuestionFilled,  name: '系统说明' ,command: '/task-manager/systemDescription' },
    ]
  },
]

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.page-wrapper {
  height: 85vh;
  display: flex;
  flex-direction: column;
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

.sub-menu-icon {
  font-size: 16px;
  color: #409eff;
  margin-right: 8px;
}

/* 子菜单项悬停效果 */
.sub-menu-item:hover {
  background-color: #ecf5ff !important;
}

.sub-menu-item:hover .sub-menu-text {
  color: #409eff;
}

.sub-menu-item:hover .sub-menu-icon {
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

.sub-menu-item.is-active .sub-menu-icon {
  color: #409eff;
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
