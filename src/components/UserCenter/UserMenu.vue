<template>
  <div class="user-layout">
    <aside class="user-sider">
      <div class="user-sider__head">
        <span class="editorial-caption">User Center</span>
        <span class="user-sider__line"></span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="user-menu"
        router
      >
        <el-sub-menu v-if="canRead1" index="user-manage" popper-class="editorial-submenu">
          <template #title>
            <span class="user-menu__group">账户</span>
          </template>
          <el-menu-item index="/user-center/users">
            <span class="user-menu__item">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/user-center/change-password">
            <span class="user-menu__item">密码修改</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="canRead2" index="role-manage" popper-class="editorial-submenu">
          <template #title>
            <span class="user-menu__group">角色</span>
          </template>
          <el-menu-item index="/user-center/roles">
            <span class="user-menu__item">角色管理</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="canRead3" index="auth-manage" popper-class="editorial-submenu">
          <template #title>
            <span class="user-menu__group">授权</span>
          </template>
          <el-menu-item index="/user-center/auth">
            <span class="user-menu__item">授权管理</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <main class="user-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { hasAuthPermission } from '@/api/userUtils/auth'

const canRead1 = computed(() => hasAuthPermission('user_manage:read'))
const canRead2 = computed(() => hasAuthPermission('role:read'))
const canRead3 = computed(() => hasAuthPermission('auth:read'))

const route = useRoute()

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.user-layout {
  height: calc(100vh - 64px);
  display: flex;
  background: var(--bg-canvas);
}

.user-sider {
  width: 220px;
  flex-shrink: 0;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-hair);
  padding: var(--space-5) 0;
  overflow-y: auto;
}

.user-sider__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-5) var(--space-4);
}
.user-sider__line {
  flex: 1;
  height: 1px;
  background: var(--border-hair);
}

.user-menu {
  border-right: none !important;
  padding: 0 var(--space-2);
}

.user-menu :deep(.el-sub-menu__title) {
  font-family: var(--font-serif);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  padding-left: var(--space-4) !important;
}
.user-menu :deep(.el-sub-menu__title:hover) {
  background: transparent;
  color: var(--ink-1);
}
.user-menu__group {
  font-family: var(--font-serif);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: inherit;
  font-weight: 600;
}

.user-menu :deep(.el-menu-item) {
  font-family: var(--font-serif);
  color: var(--ink-3);
  height: 38px;
  line-height: 38px;
  padding-left: var(--space-5) !important;
  border-radius: 0;
  transition: all var(--duration) var(--ease);
}
.user-menu :deep(.el-menu-item:hover) {
  background: transparent;
  color: var(--ink-1);
}
.user-menu :deep(.el-menu-item.is-active) {
  background: transparent;
  color: var(--ink-1);
  font-weight: 600;
  position: relative;
}
.user-menu :deep(.el-menu-item.is-active)::before {
  content: '';
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 50%;
  background: var(--ink-1);
}
.user-menu__item {
  font-family: var(--font-serif);
  font-size: 0.875rem;
  color: inherit;
}

.user-menu :deep(.el-menu--inline) {
  background: transparent !important;
}

.user-content {
  flex: 1;
  overflow: auto;
  padding: var(--space-7) var(--space-8);
}
</style>
