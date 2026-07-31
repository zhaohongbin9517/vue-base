<template>
  <div class="user-roles-config">
    <div v-if=false class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><User /></el-icon>
        角色管理
      </h2>
      <p class="page-desc">管理系统角色和权限</p>
    </div>

    <!-- 按钮区域 -->
    <div v-if="canLicenseWrite" class="button-area">
      <el-button type="primary" @click="openAddRoleDialog" :icon="Plus">
        新增角色
      </el-button>
    </div>

    <!-- 角色管理表格 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>角色列表</span>
        </div>
      </template>

      <el-table v-loading="loading" stripe :data="tableData" style="width: 100%" border>
        <el-table-column prop="role" min-width="160" label="角色" />
        <el-table-column v-if="canLicenseWrite" label="操作" align="center" width="260">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" type="primary" :disabled="isSystemRole(row)" @click="openAuthRoleDialog(row)">
                授权
              </el-button>
              <el-button size="small" type="info" :disabled="isSystemRole(row)" @click="handleDeleteRole(row)">
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="addDialogVisible" title="新增角色" width="640px" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px">
        <el-form-item prop="role" label="角色：">
          <el-input v-model="addForm.role" />
        </el-form-item>
        <el-form-item label="权限：">
          <el-tree
            ref="addTreeRef"
            :data="featureTree"
            :props="treeProps"
            node-key="key"
            show-checkbox
            default-expand-all
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveAddRole">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editDialogVisible" title="角色授权" width="640px" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="角色：">
          <el-input v-model="editForm.role" disabled />
        </el-form-item>
        <el-form-item label="权限：">
          <el-tree
            ref="editTreeRef"
            :data="featureTree"
            :props="treeProps"
            node-key="key"
            show-checkbox
            default-expand-all
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveRoleAuth">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Document, Plus } from '@element-plus/icons-vue'
import { acBatchGrantRole, acDeleteRole, acGetAllRoles, acGetFeatures, acGetRoleAccess } from '@/api/userUtils/userCenter'
import {
  accessItemsToCheckedKeys,
  asArray,
  buildPermissionPayload,
  deepClone,
  isOkResult,
  treeProps
} from '@/utils/permission-utils'

import { computed } from 'vue'
import { hasAuthPermission } from '@/api/userUtils/auth'
const canLicenseWrite = computed(() => hasAuthPermission('role:write'))

const loading = ref(false)
const saving = ref(false)
const tableData = ref([])
const featureTree = ref([])

const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addFormRef = ref(null)
const addTreeRef = ref(null)
const editTreeRef = ref(null)

const addForm = reactive({ role: '' })
const editForm = reactive({ role: '' })

const roleNameValidator = (_rule, value, callback) => {
  if (!value || !String(value).trim()) {
    callback(new Error('不能为空'))
    return
  }
  if (!/^[_a-zA-Z0-9]+$/.test(String(value).trim())) {
    callback(new Error('只能由英文字母、数字和下划线组成'))
    return
  }
  callback()
}

const addRules = {
  role: [{ validator: roleNameValidator, trigger: 'blur' }]
}

const isSystemRole = (row) => row?.role === 'sys_admin'

const loadRoles = async () => {
  loading.value = true
  try {
    const res = await acGetAllRoles()
    if (isOkResult(res)) {
      tableData.value = asArray(res.content)
      return
    }
    tableData.value = []
    ElMessage({ message: '角色数据读取失败', type: 'warning' })
  } catch {
    tableData.value = []
    ElMessage({ message: '角色数据读取失败', type: 'error' })
  } finally {
    loading.value = false
  }
}

const loadFeatures = async () => {
  try {
    const res = await acGetFeatures()
    if (isOkResult(res)) {
      featureTree.value = deepClone(res.content)
      return
    }
    featureTree.value = []
  } catch {
    featureTree.value = []
  }
}

const clearAddForm = async () => {
  addForm.role = ''
  addFormRef.value?.clearValidate()
  await nextTick()
  addTreeRef.value?.setCheckedKeys([])
}

const openAddRoleDialog = async () => {
  addDialogVisible.value = true
  await clearAddForm()
}

const openAuthRoleDialog = async (row) => {
  editForm.role = row.role
  editDialogVisible.value = true
  await nextTick()
  editTreeRef.value?.setCheckedKeys([])
  await loadRoleAccess(row.role)
}

const loadRoleAccess = async (role) => {
  try {
    const res = await acGetRoleAccess({ role })
    const checkedKeys = isOkResult(res) ? accessItemsToCheckedKeys(res.content) : []
    await nextTick()
    editTreeRef.value?.setCheckedKeys(checkedKeys)
  } catch {
    await nextTick()
    editTreeRef.value?.setCheckedKeys([])
    ElMessage({ message: '读取角色权限失败', type: 'error' })
  }
}

const saveAddRole = async () => {
  try {
    await addFormRef.value?.validate()
  } catch {
    return
  }

  saving.value = true
  try {
    const checkedKeys = addTreeRef.value?.getCheckedKeys(true) || []
    const res = await acBatchGrantRole({
      role: addForm.role.trim(),
      permission: buildPermissionPayload(featureTree.value, checkedKeys)
    })

    if (isOkResult(res)) {
      addDialogVisible.value = false
      ElMessage({ message: '添加角色成功', type: 'success' })
      await loadRoles()
      return
    }

    ElMessage({ message: '添加角色失败', type: 'warning' })
  } catch {
    ElMessage({ message: '添加角色失败', type: 'error' })
  } finally {
    saving.value = false
  }
}

const saveRoleAuth = async () => {
  if (!editForm.role) {
    return
  }

  saving.value = true
  try {
    const checkedKeys = editTreeRef.value?.getCheckedKeys(true) || []
    const res = await acBatchGrantRole({
      role: editForm.role.trim(),
      permission: buildPermissionPayload(featureTree.value, checkedKeys)
    })

    if (isOkResult(res)) {
      editDialogVisible.value = false
      ElMessage({ message: '角色授权成功', type: 'success' })
      return
    }

    ElMessage({ message: '角色授权失败', type: 'warning' })
  } catch {
    ElMessage({ message: '角色授权失败', type: 'error' })
  } finally {
    saving.value = false
  }
}

const handleDeleteRole = async (row) => {
  try {
    await ElMessageBox.confirm('删除此角色会影响所有已授权用户，确认删除吗？', '删除确认', {
      type: 'warning'
    })
  } catch {
    return
  }

  try {
    const res = await acDeleteRole({ role: row.role })
    if (isOkResult(res)) {
      ElMessage({ message: '删除成功', type: 'success' })
      await loadRoles()
      return
    }
    ElMessage({ message: '删除失败', type: 'warning' })
  } catch {
    ElMessage({ message: '删除失败', type: 'error' })
  }
}

onMounted(async () => {
  await Promise.all([loadRoles(), loadFeatures()])
})
</script>

<style scoped>
.user-roles-config {
  padding: 0;
  background: transparent;
}

.page-header {
  margin-bottom: var(--space-5);
  text-align: left;
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ink-1);
  margin: 0 0 var(--space-2) 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-3);
}

.title-icon {
  font-size: 1.75rem;
  color: var(--ink-1);
}

.page-desc {
  font-size: 0.875rem;
  color: var(--ink-3);
  margin: 0;
}

.button-area {
  margin-bottom: var(--space-5);
  padding-top: var(--space-4);
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border-hair);
}

.config-card {
  margin-bottom: var(--space-5);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 600;
  color: var(--ink-1);
}

.header-icon {
  color: var(--ink-1);
}

:deep(.el-tree) {
  max-height: 360px;
  overflow: auto;
  border: 1px solid var(--border-hair);
  border-radius: var(--radius-md);
  padding: var(--space-2);
}
</style>
