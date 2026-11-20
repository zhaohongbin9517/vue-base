<template>
  <div class="config-layout">
    <!-- 侧边导航 -->
    <aside class="config-sider">
      <el-menu
        :default-active="$route.path"
        class="config-menu"
        router
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1" popper-class="editorial-submenu">
          <template #title>
            <el-icon class="config-menu__icon"><Setting /></el-icon>
            <span class="config-menu__group">通用配置</span>
            <span class="config-menu__count">2</span>
          </template>
          <el-menu-item index="/config/plan">
            <span class="config-menu__item">计划配置</span>
          </el-menu-item>
          <el-menu-item index="/config/result">
            <span class="config-menu__item">结果配置</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2" popper-class="editorial-submenu">
          <template #title>
            <el-icon class="config-menu__icon"><DataLine /></el-icon>
            <span class="config-menu__group">计量配置</span>
            <span class="config-menu__count">4</span>
          </template>
          <el-menu-item index="/config/all-station">
            <span class="config-menu__item">计量站一览</span>
          </el-menu-item>
          <el-menu-item index="/config/all-meter">
            <span class="config-menu__item">配置一览</span>
          </el-menu-item>
          <el-menu-item index="/config/meter">
            <span class="config-menu__item">修改配置</span>
          </el-menu-item>
          <el-menu-item index="/config/meter-tag">
            <span class="config-menu__item">参数点配置</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3" popper-class="editorial-submenu">
          <template #title>
            <el-icon class="config-menu__icon"><Monitor /></el-icon>
            <span class="config-menu__group">Web 配置</span>
            <span class="config-menu__count">4</span>
          </template>
          <el-menu-item index="/config/measure-web-ws">
            <span class="config-menu__item">WS 配置</span>
          </el-menu-item>
          <!-- <el-menu-item index="/config/measure-web-temp">
            <span class="config-menu__item">显示模板配置</span>
          </el-menu-item> -->
          <el-menu-item index="/config/changelog" @click="handleJumpHtml('changelog')">
            <span class="config-menu__item">变更日志</span>
          </el-menu-item>
          <el-menu-item index="/config/template-config-versions" @click="handleJumpHtml('template-config/versions')">
            <span class="config-menu__item">模板版本管理</span>
          </el-menu-item>
          <el-menu-item index="/config/template-config" @click="handleJumpHtml('template-config')">
            <span class="config-menu__item">模板配置管理</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4" popper-class="editorial-submenu">
          <template #title>
            <el-icon class="config-menu__icon"><Compass /></el-icon>
            <span class="config-menu__group">导航</span>
            <span class="config-menu__count">6</span>
          </template>
          <el-menu-item index="/custom-submenu/measure-manage" @click="handleJumpHtml('measure-manage')">
            <span class="config-menu__item">计量站监控</span>
          </el-menu-item>
          <el-menu-item index="/custom-submenu/batch-operator" @click="handleJumpHtml('batch-operator')">
            <span class="config-menu__item">计划管理</span>
          </el-menu-item>
          <el-menu-item index="/custom-submenu/measure-control" @click="handleJumpHtml('measure-control')">
            <span class="config-menu__item">计量监控</span>
          </el-menu-item>
          <el-menu-item index="/custom-submenu/history-data-splitpanes" @click="handleJumpHtml('history-data-splitpanes')">
            <span class="config-menu__item">结果监控</span>
          </el-menu-item>
          <el-menu-item index="/custom-submenu/user-log" @click="handleJumpHtml('user-log')">
            <span class="config-menu__item">用户日志</span>
          </el-menu-item>
          <el-menu-item index="/custom-submenu/behavior-tree-manage" @click="handleJumpHtml('behavior-tree-manage')">
            <span class="config-menu__item">行为树管理</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="5" popper-class="editorial-submenu">
          <template #title>
            <el-icon class="config-menu__icon"><Lock /></el-icon>
            <span class="config-menu__group">权限配置</span>
            <span class="config-menu__count">1</span>
          </template>
          <el-menu-item index="/config/data-permission">
            <span class="config-menu__item">数据权限</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="6" popper-class="editorial-submenu">
          <template #title>
            <el-icon class="config-menu__icon"><SetUp /></el-icon>
            <span class="config-menu__group">计量站控制</span>
            <span class="config-menu__count">1</span>
          </template>
          <el-menu-item index="/config/controller-op">
            <span class="config-menu__item">操作</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="7" popper-class="editorial-submenu">
          <template #title>
            <el-icon class="config-menu__icon"><TrendCharts /></el-icon>
            <span class="config-menu__group">数据监控</span>
            <span class="config-menu__count">1</span>
          </template>
          <el-menu-item index="/config/data-update">
            <span class="config-menu__item">数据更新总览</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <!-- 内容区 -->
    <main class="config-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { getAuthToken, getAuthUser, getAuthAlias, getAuthPermissionKeys } from '@/api/userUtils/auth'
import { getWebPort } from '@/api/configUtils/config'
import { Setting, DataLine, Monitor, Compass, Lock, SetUp, TrendCharts } from '@element-plus/icons-vue'

export default {
  name: 'MenuIndex',
  components: { Setting, DataLine, Monitor, Compass, Lock, SetUp, TrendCharts },
  data() {
    return {
      webPort: '',
      configWebPort: '',
      behavior_web_port: '',
      server_control_web_port: '',
    }
  },
  mounted() {
    getWebPort().then(res => {
      this.webPort = res.measure_web
      this.configWebPort = res.config_web
      this.behavior_web_port = res.behavior_web_port
      this.server_control_web_port = res.server_control_web_port
    })
  },
  methods: {
    handleJumpHtml(pageName) {
      //获取ip
      let ip = window.location.hostname
      
      // 获取本地缓存的认证信息
      const authToken = getAuthToken()
      const authUser = getAuthUser()
      const authAlias = getAuthAlias()
      const authPermissionKeys = getAuthPermissionKeys()

      // 构建包含认证信息的URL参数
      let url = ''
      // 根据页面名称构建URL
      switch (pageName) {
        case 'behavior-tree-manage':
          if(this.behavior_web_port === 'null' || this.behavior_web_port === '') return
          url = `http://${ip}:${this.behavior_web_port}/`
          break;
        case 'server-control':
          if(this.server_control_web_port === 'null' || this.server_control_web_port === '') return
          url = `http://${ip}:${this.server_control_web_port}/`
          break;
        default:
          url = `http://${ip}:${this.webPort}/#/${pageName}`
          break;
      }
      if (authToken) {
            // 处理token，删除前缀"Bearer "
            const processedToken = authToken.replace(/^Bearer\s+/i, '')
            // 在URL中添加认证信息参数
            const authInfo = encodeURIComponent(JSON.stringify({
              token: processedToken,
              user: authUser,
              alias: authAlias,
              permissionKeys: authPermissionKeys
            }))
            url = `${url}?authInfo=${authInfo}`
      }
      // 打开新窗口
      window.open(url, '_blank')
    },
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
.config-layout {
  height: calc(100vh - 64px);
  display: flex;
  background: var(--bg-canvas);
}

/* ============ 侧边导航 ============ */
.config-sider {
  width: 208px;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #eceef1;
  padding: 14px 0;
  overflow-y: auto;
}

.config-menu {
  border-right: none !important;
  padding: 0 10px;
  --el-menu-bg-color: transparent;
  --el-menu-hover-bg-color: transparent;
  --el-menu-text-color: #3f4650;
  --el-menu-active-color: #1f2329;
}

/* 菜单分组标题 */
.config-menu :deep(.el-sub-menu) {
  margin-bottom: 6px;
}
.config-menu :deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
  height: 42px;
  line-height: 42px;
  padding: 0 8px !important;
  border-radius: 6px;
  color: #1f2329;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  transition: background 0.15s ease;
}
.config-menu :deep(.el-sub-menu__title:hover) {
  background: #f7f8fa;
  color: #1f2329;
}
.config-menu__icon {
  font-size: 15px;
  color: #4b5563;
  margin-right: 8px;
}
.config-menu__group {
  color: #1f2329;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  white-space: nowrap;
}
.config-menu__count {
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 0 5px;
  border-radius: 4px;
  background: #f2f3f5;
  color: #9aa1ab;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}
.config-menu :deep(.el-sub-menu__icon-arrow) {
  position: static;
  top: auto;
  right: auto;
  margin: 0 0 0 8px;
  font-size: 12px;
  color: #aab0b9;
}

/* 分组标题选中态：组内有子项激活时 */
.config-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  position: relative;
  background: #eef5ff;
}
.config-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  border-radius: 2px;
  background: #2f7df6;
}
.config-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title .config-menu__icon),
.config-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title .config-menu__group) {
  color: #1a73e8;
}
.config-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title .config-menu__count) {
  background: #dbe9ff;
  color: #2f7df6;
}
.config-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title .el-sub-menu__icon-arrow) {
  color: #5b8de0;
}

/* 展开子菜单容器 */
.config-menu :deep(.el-menu--inline) {
  position: relative;
  background: transparent !important;
  padding: 4px 0 2px;
}

/* 菜单项：左边缘与分组标题文字起始位置对齐 */
.config-menu :deep(.el-menu-item) {
  height: 36px;
  line-height: 34px;
  margin: 0 0 6px 15px;
  padding: 0 12px !important;
  background: #f8f9fa;
  border: 1px solid #eef0f3;
  border-radius: 6px;
  color: #3f4650;
  font-family: inherit;
  font-size: 13px;
  letter-spacing: 0;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.config-menu :deep(.el-menu-item:last-child) {
  margin-bottom: 0;
}
.config-menu :deep(.el-menu-item:hover) {
  background: #f2f4f7;
  border-color: #e3e7ec;
  color: #1f2329;
}
.config-menu :deep(.el-menu-item.is-active) {
  background: #e8f1fe;
  border-color: #a9caf7;
  color: #1a73e8;
  font-weight: 600;
}
.config-menu :deep(.el-menu-item.is-active) .config-menu__item {
  color: #1a73e8;
}
/* 隐藏全局菜单的左侧高亮竖条，选中态由蓝色卡片描边表达 */
.config-menu :deep(.el-menu-item.is-active)::before {
  display: none;
}
.config-menu__item {
  font-family: inherit;
  font-size: 13px;
  color: inherit;
}

/* ============ 内容区 ============ */
.config-content {
  flex: 1;
  overflow: auto;
  padding: var(--space-7) var(--space-8);
}
</style>
