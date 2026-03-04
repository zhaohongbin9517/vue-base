<template>
  <div class="user-page-card-wrap">
    <el-card class="password-card">
      <template #header>
        <div class="password-card__header">
          <span>密码修改</span>
          <el-button type="primary" @click="save" :loading="submitting">保存</el-button>
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
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import md5 from 'js-md5'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
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
.user-page-card-wrap {
  padding: 0 0 12px;
}

.password-card {
  width: min(720px, 100%);
  margin: 0 auto;
}

.password-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.password-form {
  width: min(520px, 100%);
}
</style>
