<template>
  <div class="config-layout">
    <!-- 侧边导航 -->
    <aside class="config-sider">
      <div class="config-sider__head">
        <span class="editorial-caption">Index</span>
        <span class="config-sider__line"></span>
      </div>
      <el-menu
        :default-active="$route.path"
        class="config-menu"
        router
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1" popper-class="editorial-submenu">
          <template #title>
            <span class="config-menu__group">通用配置</span>
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
            <span class="config-menu__group">计量配置</span>
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
        </el-sub-menu>

        <el-sub-menu index="3" popper-class="editorial-submenu">
          <template #title>
            <span class="config-menu__group">Web 配置</span>
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
            <span class="config-menu__group">导航</span>
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
          <el-menu-item index="/custom-submenu/behavior-tree-manage" @click="handleJumpHtml('behavior-tree-manage')">
            <span class="config-menu__item">行为树管理</span>
          </el-menu-item>
          <el-menu-item index="/custom-submenu/server-control" @click="handleJumpHtml('server-control')">
            <span class="config-menu__item">服务控制</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="5" popper-class="editorial-submenu">
          <template #title>
            <span class="config-menu__group">日志</span>
          </template>
          <el-menu-item index="/config/logs">
            <span class="config-menu__item">日志查看</span>
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

export default {
  name: 'MenuIndex',
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
  width: 220px;
  flex-shrink: 0;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-hair);
  padding: var(--space-5) 0;
  overflow-y: auto;
}

.config-sider__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-5) var(--space-4);
}
.config-sider__line {
  flex: 1;
  height: 1px;
  background: var(--border-hair);
}

.config-menu {
  border-right: none !important;
  padding: 0 var(--space-2);
}

/* 菜单分组标题 */
.config-menu :deep(.el-sub-menu__title) {
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
.config-menu :deep(.el-sub-menu__title:hover) {
  background: transparent;
  color: var(--ink-1);
}
.config-menu__group {
  font-family: var(--font-serif);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: inherit;
  font-weight: 600;
}

/* 菜单项 */
.config-menu :deep(.el-menu-item) {
  font-family: var(--font-serif);
  color: var(--ink-3);
  height: 38px;
  line-height: 38px;
  padding-left: var(--space-5) !important;
  border-radius: 0;
  transition: all var(--duration) var(--ease);
}
.config-menu :deep(.el-menu-item:hover) {
  background: transparent;
  color: var(--ink-1);
}
.config-menu :deep(.el-menu-item.is-active) {
  background: transparent;
  color: var(--ink-1);
  font-weight: 600;
  position: relative;
}
.config-menu :deep(.el-menu-item.is-active)::before {
  content: '';
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 50%;
  background: var(--ink-1);
}
.config-menu__item {
  font-family: var(--font-serif);
  font-size: 0.875rem;
  color: inherit;
}

/* 展开子菜单容器 */
.config-menu :deep(.el-menu--inline) {
  background: transparent !important;
}

/* ============ 内容区 ============ */
.config-content {
  flex: 1;
  overflow: auto;
  padding: var(--space-7) var(--space-8);
}
</style>
