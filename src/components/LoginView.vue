<template>
  <div class="login-page">
    <div class="login-grid">
      <!-- 左侧：期刊式品牌区 -->
      <aside class="login-masthead">
        <div class="masthead-top">
          <span class="masthead-meta">Vol. 01 · Issue 01</span>
          <span class="masthead-meta">{{ today }}</span>
        </div>
        <div class="masthead-body">
          <p class="masthead-kicker">METROLOGY · CONFIG</p>
          <h1 class="masthead-title">计量<br/>配置<br/><em>管理</em></h1>
          <p class="masthead-lead">
            精密计量，始于配置。<br/>
            在这里定义每一处参数，校准每一次流转。
          </p>
        </div>
        <div class="masthead-foot">
          <span class="masthead-rule"></span>
          <p class="masthead-note">Authorized Information System</p>
        </div>
      </aside>

      <!-- 右侧：登录表单 -->
      <main class="login-formside">
        <div class="login-card editorial-fade-in">
          <header class="login-card__head">
            <img :src="logo" alt="logo" class="login-card__logo" />
            <div>
              <p class="editorial-caption">Sign In</p>
              <h2 class="login-card__title">用户登录</h2>
            </div>
          </header>

          <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form" @submit.prevent>
            <el-form-item prop="account">
              <el-input
                v-model="loginForm.account"
                size="large"
                placeholder="账号"
                :prefix-icon="User"
                clearable
                @keyup.enter="submitLogin"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                size="large"
                placeholder="密码"
                :prefix-icon="Lock"
                show-password
                @keyup.enter="submitLogin"
              />
            </el-form-item>

            <div class="login-form__extra">
              <el-checkbox v-model="rememberUser">记住账号</el-checkbox>
            </div>

            <el-button class="login-form__submit" type="primary" size="large" :loading="loading" @click="submitLogin">
              登 录
            </el-button>
          </el-form>

          <footer class="login-card__foot">
            <span>© {{ year }} 计量管理系统</span>
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import logo from '../assets/logo.png'
import { loginByPassword } from '@/api/login/auth'
import { getRememberedUser, hasAuthSession, setAuthSession, setRememberedUser } from '@/api/userUtils/auth'
import { getFirstAuthorizedPath, refreshAuthPermissions } from '@/api/userUtils/access-control'

const router = useRouter()
const route = useRoute()

const loginFormRef = ref(null)
const loading = ref(false)
const rememberUser = ref(true)
const loginForm = reactive({
  account: '',
  password: ''
})

// 期刊式日期展示
const now = new Date()
const year = now.getFullYear()
const today = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[now.getMonth()]} ${now.getDate()}, ${year}`
})

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const getRedirectPath = () => {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    return redirect
  }
  return '/config'
}

const submitLogin = async () => {
  try {
    await loginFormRef.value?.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    const res = await loginByPassword({
      username: loginForm.account.trim(),
      password: loginForm.password.trim()
    })

    if (res?.result !== 'ok') {
      ElMessage({
        message: '用户名或密码输入有误',
        type: 'warning'
      })
      return
    }

    const content = res?.content || {}
    const token = [content.token_type, content.token].filter(Boolean).join(' ').trim() || String(content.token || '')

    if (!token) {
      ElMessage({
        message: '登录成功但未返回 token',
        type: 'warning'
      })
      return
    }

    setAuthSession({
      token,
      username: content.username || loginForm.account.trim(),
      alias: content.alias || ''
    })
    await refreshAuthPermissions(true)
    setRememberedUser(loginForm.account.trim(), rememberUser.value)

    const redirectPath = getRedirectPath()
    const fallbackPath = getFirstAuthorizedPath()
    router.replace(fallbackPath === '/403' ? '/403' : redirectPath)
  } catch (error) {
    ElMessage({
      message: '登录请求失败，请稍后重试',
      type: 'error'
    }),
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (hasAuthSession()) {
    await refreshAuthPermissions()
    router.replace(getFirstAuthorizedPath())
    return
  }

  const remembered = getRememberedUser()
  rememberUser.value = remembered.enabled
  loginForm.account = remembered.username
})
</script>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-canvas);
}

/* —— 双栏网格：左品牌 / 右表单 —— */
.login-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}
@media (max-width: 880px) {
  .login-grid {
    grid-template-columns: 1fr;
  }
  .login-masthead {
    display: none;
  }
}

/* ============ 左侧：期刊式刊头 ============ */
.login-masthead {
  position: relative;
  padding: var(--space-7) var(--space-8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-hair);
  overflow: hidden;
}

/* 装饰性大号背景字 */
.login-masthead::before {
  content: 'M';
  position: absolute;
  right: -40px;
  bottom: -120px;
  font-family: var(--font-display);
  font-size: 520px;
  font-weight: 900;
  line-height: 1;
  color: var(--ink-1);
  opacity: 0.03;
  pointer-events: none;
}

.masthead-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.masthead-meta {
  font-family: var(--font-serif);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.masthead-body {
  position: relative;
  z-index: 1;
}
.masthead-kicker {
  font-family: var(--font-serif);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--highlight);
  margin-bottom: var(--space-4);
  font-weight: 600;
}
.masthead-title {
  font-family: var(--font-display);
  font-size: 5rem;
  font-weight: 800;
  line-height: 0.95;
  color: var(--ink-1);
  letter-spacing: -0.03em;
  margin: 0 0 var(--space-6);
}
.masthead-title em {
  font-style: italic;
  font-weight: 500;
  color: var(--ink-3);
}
.masthead-lead {
  font-family: var(--font-serif);
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--ink-2);
  max-width: 360px;
  margin: 0;
}

.masthead-foot {
  position: relative;
  z-index: 1;
}
.masthead-rule {
  display: block;
  width: 48px;
  height: 2px;
  background: var(--ink-1);
  margin-bottom: var(--space-3);
}
.masthead-note {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.875rem;
  color: var(--ink-3);
  margin: 0;
}

/* ============ 右侧：登录表单 ============ */
.login-formside {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.login-card {
  width: min(400px, 100%);
  background: var(--bg-surface);
}

.login-card__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-7);
}
.login-card__logo {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
}
.login-card__title {
  font-family: var(--font-display);
  font-size: 1.625rem;
  font-weight: 600;
  color: var(--ink-1);
  margin: 4px 0 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: var(--space-5);
}
.login-form :deep(.el-input__wrapper) {
  padding: 4px 12px;
}

.login-form__extra {
  display: flex;
  justify-content: flex-start;
  margin-bottom: var(--space-5);
}
.login-form__extra :deep(.el-checkbox__label) {
  font-family: var(--font-serif);
  color: var(--ink-2);
  font-size: 0.875rem;
}

.login-form__submit {
  width: 100%;
  height: 48px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9375rem;
  letter-spacing: 0.3em;
  border-radius: var(--radius-sm);
}

.login-card__foot {
  margin-top: var(--space-7);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-hair);
  text-align: center;
  font-family: var(--font-serif);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--ink-4);
}
</style>
