<template>
  <div class="user-page-card-wrap">
    <el-card>
      <template #header>
        <div class="user-page-toolbar">
          <el-button type="primary" @click="openAddDialog">新增</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="user_name" label="用户名" />
        <el-table-column prop="alias" label="用户别名" />
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" type="info" :disabled="isSystemUser(row)" @click="openEditDialog(row)">
                编辑
              </el-button>
              <el-button size="small" type="warning" :disabled="isSystemUser(row)" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button size="small" type="primary" :disabled="isSystemUser(row)" @click="openResetDialog(row)">
                重置密码
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="addDialogVisible" title="增加用户" width="450px" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px">
        <el-form-item prop="user_name" label="帐号：">
          <el-input v-model="addForm.user_name" />
        </el-form-item>
        <el-form-item prop="alias" label="帐号别名：">
          <el-input v-model="addForm.alias" />
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input v-model="addForm.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveAddUser">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="resetDialogVisible" title="重置密码" width="450px" :close-on-click-modal="false">
      <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" label-width="120px">
        <el-form-item prop="user_name" label="帐号：">
          <el-input v-model="resetForm.user_name" disabled />
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input v-model="resetForm.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveResetPassword">重置</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editDialogVisible" title="编辑" width="450px" :close-on-click-modal="false">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item prop="user_name" label="帐号：">
          <el-input v-model="editForm.user_name" disabled />
        </el-form-item>
        <el-form-item prop="alias" label="帐号别名：">
          <el-input v-model="editForm.alias" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveEditUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import md5 from 'js-md5'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { acAddUser, acDelUser, acGetAllUsers, acResetPasswd, acUpdateUser } from '@/api/userUtils/userCenter'

const loading = ref(false)
const saving = ref(false)
const tableData = ref([])

const addDialogVisible = ref(false)
const resetDialogVisible = ref(false)
const editDialogVisible = ref(false)

const addFormRef = ref(null)
const resetFormRef = ref(null)
const editFormRef = ref(null)

const addForm = reactive({ user_name: '', alias: '', password: '' })
const resetForm = reactive({ user_name: '', password: '' })
const editForm = reactive({ user_name: '', alias: '' })

const requiredRule = [{ required: true, message: '不能为空', trigger: 'blur' }]
const addRules = {
  user_name: requiredRule,
  alias: requiredRule,
  password: requiredRule
}
const resetRules = {
  user_name: requiredRule,
  password: requiredRule
}
const editRules = {
  user_name: requiredRule,
  alias: requiredRule
}

const isSystemUser = (row) => row?.user_name === 'configtazh'

const resetAddForm = () => {
  addForm.user_name = ''
  addForm.alias = ''
  addForm.password = ''
  addFormRef.value?.clearValidate()
}

const resetResetForm = () => {
  resetForm.user_name = ''
  resetForm.password = ''
  resetFormRef.value?.clearValidate()
}

const resetEditForm = () => {
  editForm.user_name = ''
  editForm.alias = ''
  editFormRef.value?.clearValidate()
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await acGetAllUsers()
    if (res?.result === 'ok') {
      tableData.value = Array.isArray(res.content) ? res.content : []
      return
    }
    ElMessage({ message: '数据读取失败', type: 'warning' })
    tableData.value = []
  } catch {
    tableData.value = []
    ElMessage({ message: '数据读取失败', type: 'error' })
  } finally {
    loading.value = false
  }
}

const openAddDialog = () => {
  resetAddForm()
  addDialogVisible.value = true
}

const openResetDialog = (row) => {
  resetResetForm()
  resetForm.user_name = row.user_name
  resetDialogVisible.value = true
}

const openEditDialog = (row) => {
  resetEditForm()
  editForm.user_name = row.user_name
  editForm.alias = row.alias || ''
  editDialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除用户 ${row.user_name} 吗？`, '删除确认', {
      type: 'warning'
    })
  } catch {
    return
  }

  try {
    const res = await acDelUser({ user_name: row.user_name })
    if (res?.result === 'ok') {
      ElMessage({ message: '数据删除成功', type: 'success' })
      await loadData()
      return
    }
    ElMessage({ message: '数据删除失败', type: 'warning' })
  } catch {
    ElMessage({ message: '数据删除失败', type: 'error' })
  }
}

const saveAddUser = async () => {
  try {
    await addFormRef.value?.validate()
  } catch {
    return
  }

  saving.value = true
  try {
    const res = await acAddUser({
      user_name: addForm.user_name.trim(),
      alias: addForm.alias.trim(),
      passwd: md5(addForm.password.trim())
    })

    if (res?.result === 'ok') {
      addDialogVisible.value = false
      resetAddForm()
      ElMessage({ message: '添加用户成功', type: 'success' })
      await loadData()
      return
    }

    if (res?.content === 'user_exist') {
      ElMessage({ message: '用户名已存在，添加用户失败', type: 'warning' })
      return
    }

    ElMessage({ message: '添加用户失败', type: 'warning' })
  } catch {
    ElMessage({ message: '添加用户失败', type: 'error' })
  } finally {
    saving.value = false
  }
}

const saveResetPassword = async () => {
  try {
    await resetFormRef.value?.validate()
  } catch {
    return
  }

  saving.value = true
  try {
    const res = await acResetPasswd({
      user_name: resetForm.user_name.trim(),
      passwd: md5(resetForm.password.trim())
    })

    if (res?.result === 'ok') {
      resetDialogVisible.value = false
      resetResetForm()
      ElMessage({ message: '重置密码成功', type: 'success' })
      return
    }

    if (res?.content === 'not_found_user') {
      ElMessage({ message: '该用户不存在', type: 'warning' })
      return
    }

    ElMessage({ message: '重置密码失败', type: 'warning' })
  } catch {
    ElMessage({ message: '重置密码失败', type: 'error' })
  } finally {
    saving.value = false
  }
}

const saveEditUser = async () => {
  try {
    await editFormRef.value?.validate()
  } catch {
    return
  }

  saving.value = true
  try {
    const res = await acUpdateUser({
      user_name: editForm.user_name.trim(),
      alias: editForm.alias.trim()
    })

    if (res?.result === 'ok') {
      editDialogVisible.value = false
      resetEditForm()
      ElMessage({ message: '修改成功', type: 'success' })
      await loadData()
      return
    }

    ElMessage({ message: '修改失败', type: 'warning' })
  } catch {
    ElMessage({ message: '修改失败', type: 'error' })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-page-card-wrap {
  padding-bottom: 12px;
}

.user-page-toolbar {
  display: flex;
  justify-content: flex-start;
}
</style>
