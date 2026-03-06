<template>
  <div class="page-wrapper">
    <el-container class="layout-container">
      <el-aside width="200px" class="aside">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          router
        >
          <el-sub-menu index="user-manage" popper-class="custom-submenu">
            <template #title>
              <div class="menu-title-wrapper">
                <el-icon class="menu-icon"><User /></el-icon>
                <span class="menu-text">用户管理</span>
              </div>
            </template>
            <el-menu-item v-if="canRead1" index="/user-center/users" class="sub-menu-item">
              <span class="sub-menu-text">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/user-center/change-password" class="sub-menu-item">
              <span class="sub-menu-text">密码修改</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu v-if="canRead2" index="role-manage" popper-class="custom-submenu">
            <template #title>
              <div class="menu-title-wrapper">
                <el-icon class="menu-icon"><UserFilled /></el-icon>
                <span class="sub-menu-text">角色管理</span>
              </div>
            </template>
            <el-menu-item index="/user-center/roles" class="sub-menu-item">
              <span class="sub-menu-text">角色管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu v-if="canRead3" index="auth-manage" popper-class="custom-submenu">
            <template #title>
              <div class="menu-title-wrapper">
                <el-icon class="menu-icon"><Key /></el-icon>
                <span class="sub-menu-text">授权管理</span>
              </div>
            </template>
            <el-menu-item index="/user-center/auth" class="sub-menu-item">
              <span class="sub-menu-text">授权管理</span>
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
import { User, UserFilled, Key } from '@element-plus/icons-vue'
import { hasAuthPermission } from '@/api/userUtils/auth'

const canRead1 = computed(() => hasAuthPermission('user_manage:read'))
const canRead2 = computed(() => hasAuthPermission('role:read'))
const canRead3 = computed(() => hasAuthPermission('auth:read'))

const route = useRoute()

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.page-wrapper {
  height: 100vh;
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
