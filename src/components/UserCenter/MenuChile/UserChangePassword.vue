<template>
  <div class="user-password-config">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Lock /></el-icon>
        密码修改
      </h2>
      <p class="page-desc">修改当前用户密码</p>
    </div>

    <!-- 密码修改表单 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>密码修改</span>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="password-form">
        <el-form-item prop="oldPsd" label="老密码：">
          <el-input v-model="form.oldPsd" type="password" show-password />
        </el-form-item>
        <el-form-item prop="newPsd" label="新密码：">
          <el-input v-model="form.newPsd" type="password" show-password />
        </el-form-item>
        <el-form-item prop="newPsd2" label="确认密码：">
          <el-input v-model="form.newPsd2" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" :loading="submitting" style="margin-left: 120px;">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import md5 from 'js-md5'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Lock, Document } from '@element-plus/icons-vue'
import { acUpdatePasswd } from '@/api/userUtils/userCenter'
import { getAuthUser } from '@/api/userUtils/auth'

const formRef = ref(null)
const submitting = ref(false)
const form = reactive({
  oldPsd: '',
  newPsd: '',
  newPsd2: ''
})

const rules = {
  oldPsd: [{ required: true, message: '不能为空', trigger: 'blur' }],
  newPsd: [{ required: true, message: '不能为空', trigger: 'blur' }],
  newPsd2: [{ required: true, message: '不能为空', trigger: 'blur' }]
}

const resetForm = () => {
  form.oldPsd = ''
  form.newPsd = ''
  form.newPsd2 = ''
}

const save = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  if (form.newPsd !== form.newPsd2) {
    ElMessage({ message: '两次密码不一致', type: 'warning' })
    return
  }

  const userName = getAuthUser()
  if (!userName) {
    ElMessage({ message: '未获取到当前登录用户', type: 'warning' })
    return
  }

  submitting.value = true
  try {
    const res = await acUpdatePasswd({
      user_name: userName.trim(),
      old_passwd: md5(form.oldPsd.trim()),
      new_passwd: md5(form.newPsd.trim())
    })

    if (res?.result !== 'ok') {
      if (res?.content === 'old_passwd_err') {
        ElMessage({ message: '原密码有误，修改失败', type: 'warning' })
      } else {
        ElMessage({ message: '密码修改失败', type: 'warning' })
      }
      return
    }

    resetForm()
    ElMessage({ message: '密码修改成功', type: 'success' })
  } catch {
    ElMessage({ message: '密码修改请求失败', type: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.user-password-config {
  padding: 24px;
  background: #f5f7fa;
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
}

.user-password-config::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.user-password-config {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.page-header {
  margin-bottom: 24px;
  text-align: center;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-icon {
  font-size: 26px;
  color: #409eff;
}

.page-desc {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.config-card {
  margin-bottom: 24px;
  width: min(720px, 100%);
  margin: 0 auto;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.header-icon {
  color: #409eff;
}

.password-form {
  width: min(520px, 100%);
}
</style>
