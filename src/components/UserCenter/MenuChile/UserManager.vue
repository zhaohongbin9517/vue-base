<template>
  <div class="user-manager-config">
    <div v-if=false class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><User /></el-icon>
        用户管理
      </h2>
      <p class="page-desc">管理系统用户信息</p>
    </div>

    <!-- 按钮区域 -->
    <div class="button-area">
      <el-button type="primary" @click="openAddDialog" :icon="Plus">
        新增用户
      </el-button>
    </div>

    <!-- 用户管理表格 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>用户列表</span>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableData" border class="config-table" stripe>
        <el-table-column prop="user_name" label="用户名" min-width="200" />
        <el-table-column prop="alias" label="用户别名" min-width="200" />
        <el-table-column label="操作" width="280" align="center">
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
import { User, Document, Plus } from '@element-plus/icons-vue'
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
.user-manager-config {
  padding: 24px;
  background: #f5f7fa;
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
}

.user-manager-config::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.user-manager-config {
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

.button-area {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-start;
}

.config-card {
  margin-bottom: 24px;
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

.config-table {
  margin-top: 16px;
}
</style>
