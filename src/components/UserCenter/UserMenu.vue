<template>
  <el-container class="user-center-layout">
    <el-aside width="260px" class="user-center-layout__aside">
      <el-menu
        class="user-center-menu"
        :default-active="activeMenu"
        router
      >
        <el-sub-menu index="user-manage">
          <template #title>用户管理</template>
          <el-menu-item index="/user-center/users">用户管理</el-menu-item>
          <el-menu-item index="/user-center/change-password">密码修改</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/user-center/roles">角色管理</el-menu-item>
        <el-menu-item index="/user-center/auth">授权管理</el-menu-item>
      </el-menu>
    </el-aside>

    <el-main class="user-center-layout__main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.user-center-layout {
  width: 100%;
  min-height: calc(100vh - 80px);
}

.user-center-layout__aside {
  padding: 0 0 0 12px;
  box-sizing: border-box;
}

.user-center-menu {
  height: 100%;
  border-right: none;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(31, 45, 61, 0.06);
}

.user-center-menu :deep(.el-menu-item.is-active) {
  background: #ecf5ff;
}

.user-center-layout__main {
  padding: 0 16px 16px;
  box-sizing: border-box;
}

@media (max-width: 960px) {
  .user-center-layout {
    display: block;
  }

  .user-center-layout__aside {
    width: 100%;
    padding: 0 12px;
  }

  .user-center-layout__main {
    padding: 12px;
  }
}
</style>
