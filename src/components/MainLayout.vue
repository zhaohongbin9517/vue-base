<template>
  <div class="page-wrapper">
    <div class="page-title">
        <div class="page-content" @click="handleTitleClick">
            <img src="@/assets/logo.png" alt="logo" class="title-logo" />
            <span>计量配置管理</span>
        </div>
        <!-- 用户管理，显示在页面右上角 --> 
        <div class="user-management">
            <el-dropdown trigger="click" @command="handleUserMenuCommand">
            <span class="user-avatar">
                <el-icon class="avatar-icon"><user /></el-icon>
                <span class="user-name">{{ userName }}</span>
                <el-icon class="arrow-icon"><arrow-down /></el-icon>
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
    </div>
    <div>
        <router-view />
    </div>
  </div>
</template>

<script>
import { User, Setting,Back,  ArrowDown } from '@element-plus/icons-vue'
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
  mounted() {
    this.userName = getDisplayName() || '未登录用户'
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log('打开:', key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log('关闭:', key, keyPath)
    },
    handleTitleClick() {
      // 判断当前路由是否在config下
      if (!this.$route.path.startsWith('/config')) {
        this.$router.push('/')
      }
    },
    handleUserMenuCommand(command) {
      switch (command) {
        case 'userManager':
          // console.log('点击了用户管理')
          this.$router.push('/user-center/users')
          break
        case 'logout':
          // console.log('点击了退出登录')
          clearAuthSession()
          this.$router.push('/login')
          break
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

.page-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-title {
  height: 50px;
  line-height: 50px;
  background-color: #cfdcea;
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin: 10px;
}

/* 用户管理样式 */
.user-management {
  margin: 0;
}

.user-avatar {
  display: flex;
  margin-top: 5px;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  /*background-color: rgba(64, 158, 255, 0.1); */
}

.avatar-icon {
  font-size: 24px;
  color: #409eff;
}

.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.arrow-icon {
  font-size: 12px;
  color: #909399;
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
