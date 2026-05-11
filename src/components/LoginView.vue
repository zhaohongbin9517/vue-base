<template>
  <div class="login-page">
    <div class="login-overlay">
      <div class="login-panel">
        <div class="login-brand">
          <img :src="logo" alt="logo" class="login-brand__logo" />
          <div>
            <h1 class="login-brand__title">任务系统</h1>
            <p class="login-brand__subtitle">用户登录</p>
          </div>
        </div>

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
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
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

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const getRedirectPath = () => {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    return redirect
  }
  return '/task-manager/taskManager'
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
  background: #ffffff;
}

.login-overlay {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.login-panel {
  width: min(480px, 92vw);
  border-radius: 18px;
  padding: 26px 28px 22px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.1);
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
}

.login-brand__logo {
  width: 48px;
  height: 48px;
}

.login-brand__title {
  margin: 0;
  color: #303133;
  font-size: 20px;
  line-height: 1.2;
}

.login-brand__subtitle {
  margin: 4px 0 0;
  color: rgba(48, 49, 51, 0.75);
  font-size: 13px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.login-form :deep(.el-input__wrapper) {
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.login-form :deep(.el-input__inner) {
  color: #303133;
}

.login-form__extra {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 18px;
}

.login-form__extra :deep(.el-checkbox__label) {
  color: rgba(48, 49, 51, 0.86);
}

.login-form__submit {
  width: 100%;
  height: 44px;
  font-weight: 600;
  letter-spacing: 2px;
}
</style>
