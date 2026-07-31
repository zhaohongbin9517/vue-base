<template>
  <div class="layout-wrapper">
    <header class="layout-header">
      <div class="layout-header__brand" @click="handleTitleClick">
        <img src="@/assets/logo.png" alt="logo" class="layout-header__logo" />
        <div class="layout-header__title-group">
          <span class="layout-header__kicker">METROLOGY</span>
          <span class="layout-header__title">计量配置管理</span>
        </div>
      </div>

      <nav class="layout-header__nav">
        <span class="layout-header__date">{{ dateLabel }}</span>
      </nav>

      <div class="layout-header__user">
        <el-dropdown trigger="click" @command="handleUserMenuCommand">
          <span class="user-trigger">
            <span class="user-trigger__avatar">{{ userInitial }}</span>
            <span class="user-trigger__name">{{ userName }}</span>
            <el-icon class="user-trigger__arrow"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="userManager">
                <el-icon><setting /></el-icon>
                <span>用户管理</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><back /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <main class="layout-main">
      <router-view />
    </main>
  </div>
</template>

<script>
import { User, Setting, Back, ArrowDown } from '@element-plus/icons-vue'
import { getDisplayName, clearAuthSession } from '@/api/userUtils/auth'

export default {
  name: 'MainLayout',
  components: {
    User,
    Setting,
    Back,
    ArrowDown
  },
  data() {
    return {
      userName: ''
    }
  },
  computed: {
    userInitial() {
      const name = this.userName || '?'
      return name.charAt(0).toUpperCase()
    },
    dateLabel() {
      const d = new Date()
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} · 周${weekdays[d.getDay()]}`
    }
  },
  mounted() {
    this.userName = getDisplayName() || '未登录用户'
  },
  methods: {
    handleTitleClick() {
      if (!this.$route.path.startsWith('/config')) {
        this.$router.push('/')
      }
    },
    handleUserMenuCommand(command) {
      switch (command) {
        case 'userManager':
          this.$router.push('/user-center/users')
          break
        case 'logout':
          clearAuthSession()
          this.$router.push('/login')
          break
      }
    }
  }
}
</script>

<style scoped>
.layout-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-canvas);
}

/* ============ 顶部栏：极简编辑风 ============ */
.layout-header {
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-hair);
  position: relative;
}

/* 顶部底部双线装饰 */
.layout-header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 1px;
  background: var(--border-hair);
}

.layout-header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  transition: opacity var(--duration) var(--ease);
}
.layout-header__brand:hover {
  opacity: 0.7;
}

.layout-header__logo {
  height: 32px;
  width: auto;
}

.layout-header__title-group {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.layout-header__kicker {
  font-family: var(--font-serif);
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  color: var(--ink-4);
  font-weight: 600;
}
.layout-header__title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ink-1);
  letter-spacing: -0.01em;
}

.layout-header__nav {
  flex: 1;
  display: flex;
  justify-content: center;
}
.layout-header__date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--ink-4);
}

/* ============ 用户区 ============ */
.layout-header__user {
  display: flex;
  align-items: center;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  transition: background var(--duration) var(--ease);
}
.user-trigger:hover {
  background: var(--bg-subtle);
}

.user-trigger__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ink-1);
  color: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.875rem;
}

.user-trigger__name {
  font-family: var(--font-serif);
  font-size: 0.875rem;
  color: var(--ink-2);
  font-weight: 500;
}

.user-trigger__arrow {
  font-size: 0.75rem;
  color: var(--ink-4);
  transition: transform var(--duration) var(--ease);
}

/* ============ 主内容区 ============ */
.layout-main {
  flex: 1;
  overflow: auto;
}
</style>
