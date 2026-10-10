<template>
  <div class="user-auth-config">
    <div v-if=false class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><User /></el-icon>
        用户授权管理
      </h2>
      <p class="page-desc">管理用户角色和权限</p>
    </div>

    <!-- 用户授权表格 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>用户授权列表</span>
        </div>
      </template>

      <el-table v-loading="loading" stripe :data="tableData" style="width: 100%" border>
        <el-table-column prop="user_name" min-width="120" label="用户名" />
        <el-table-column prop="alias" min-width="140" label="账户别名" />
        <el-table-column min-width="220" label="授权角色">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.roles || []"
              :key="tag"
              class="role-tag"
              type="info"
              effect="plain"
              @click="openRoleInfoDialog(tag)"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="canLicenseWrite" label="操作" align="center" width="240">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" type="primary" :disabled="isSystemUser(row)" @click="openAssignRoleDialog(row)">
                授权
              </el-button>
              <el-button size="small" type="info" @click="openUserAuthDialog(row)">
                用户权限
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="assignDialogVisible" title="授权" width="640px" :close-on-click-modal="false">
      <el-form ref="assignFormRef" :model="assignForm" :rules="assignRules" label-width="120px">
        <el-form-item prop="user_name" label="用户：">
          <el-input v-model="assignForm.user_name" disabled />
        </el-form-item>
        <el-form-item label="账户别名：">
          <el-input v-model="assignForm.alias" disabled />
        </el-form-item>
        <el-form-item label="角色：">
          <el-checkbox-group v-model="assignForm.roles">
            <el-checkbox v-for="item in roles" :key="item.role" :label="item.role">
              {{ item.role }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveAssignedRoles">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="roleInfoDialogVisible" title="角色权限" width="640px" :close-on-click-modal="false">
      <el-form :model="roleInfo" label-width="120px">
        <el-form-item label="角色：">
          <el-input v-model="roleInfo.role" disabled />
        </el-form-item>
        <el-form-item label="权限：">
          <el-tree
            ref="roleInfoTreeRef"
            :data="features"
            :props="treeProps"
            node-key="key"
            show-checkbox
            default-expand-all
            :check-strictly="false"
          />
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="userAuthDialogVisible" title="用户权限详情" width="640px" :close-on-click-modal="false">
      <el-form :model="userAuth" label-width="120px">
        <el-form-item label="用户：">
          <el-input v-model="userAuth.user_name" disabled />
        </el-form-item>
        <el-form-item label="账户别名：">
          <el-input v-model="userAuth.alias" disabled />
        </el-form-item>
        <el-form-item label="权限：">
          <el-tree
            ref="userAuthTreeRef"
            :data="features"
            :props="treeProps"
            node-key="key"
            show-checkbox
            default-expand-all
            :check-strictly="false"
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Document } from '@element-plus/icons-vue'
import {
  acGetAllRoles,
  acGetAllUserRole,
  acGetFeatures,
  acGetRoleAccess,
  acGetUserAccess,
  acSetUserRole
} from '@/api/userUtils/userCenter'
import { accessItemsToCheckedKeys, asArray, deepClone, isOkResult, treeProps } from '@/utils/permission-utils'

import { computed } from 'vue'
import { hasAuthPermission } from '@/api/userUtils/auth'
const canLicenseWrite = computed(() => hasAuthPermission('auth:write'))

const loading = ref(false)
const saving = ref(false)
const tableData = ref([])
const roles = ref([])
const features = ref([])

const assignDialogVisible = ref(false)
const roleInfoDialogVisible = ref(false)
const userAuthDialogVisible = ref(false)

const assignFormRef = ref(null)
const roleInfoTreeRef = ref(null)
const userAuthTreeRef = ref(null)

const assignForm = reactive({
  user_name: '',
  alias: '',
  roles: []
})

const roleInfo = reactive({
  role: ''
})

const userAuth = reactive({
  user_name: '',
  alias: ''
})

const assignRules = {
  user_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
}

const isSystemUser = (row) => row?.user_name === 'configtazh'

const loadData = async () => {
  loading.value = true
  try {
    const res = await acGetAllUserRole()
    if (isOkResult(res)) {
      tableData.value = asArray(res.content)
      return
    }
    tableData.value = []
    ElMessage({ message: '数据读取失败', type: 'warning' })
  } catch {
    tableData.value = []
    ElMessage({ message: '数据读取失败', type: 'error' })
  } finally {
    loading.value = false
  }
}

const loadFeatures = async () => {
  try {
    const res = await acGetFeatures()
    features.value = isOkResult(res) ? deepClone(res.content) : []
  } catch {
    features.value = []
  }
}

const loadRoles = async () => {
  try {
    const res = await acGetAllRoles()
    roles.value = isOkResult(res) ? asArray(res.content) : []
  } catch {
    roles.value = []
  }
}

const openAssignRoleDialog = (row) => {
  assignForm.user_name = row.user_name || ''
  assignForm.alias = row.alias || ''
  assignForm.roles = Array.isArray(row.roles) ? [...row.roles] : []
  assignDialogVisible.value = true
}

const saveAssignedRoles = async () => {
  try {
    await assignFormRef.value?.validate()
  } catch {
    return
  }

  saving.value = true
  try {
    const res = await acSetUserRole({
      user_name: assignForm.user_name.trim(),
      roles: assignForm.roles.join(',')
    })

    if (isOkResult(res)) {
      assignDialogVisible.value = false
      ElMessage({ message: '授权成功', type: 'success' })
      await loadData()
      return
    }

    ElMessage({ message: '授权失败', type: 'warning' })
  } catch {
    ElMessage({ message: '授权失败', type: 'error' })
  } finally {
    saving.value = false
  }
}

const applyCheckedKeys = async (treeRef, checkedKeys) => {
  await nextTick()
  treeRef.value?.setCheckedKeys([])
  treeRef.value?.setCheckedKeys(checkedKeys)
}

const openRoleInfoDialog = async (role) => {
  if (!role) {
    return
  }

  roleInfo.role = role
  roleInfoDialogVisible.value = true

  try {
    const res = await acGetRoleAccess({ role })
    const checkedKeys = isOkResult(res) ? accessItemsToCheckedKeys(res.content) : []
    await applyCheckedKeys(roleInfoTreeRef, checkedKeys)
  } catch {
    await applyCheckedKeys(roleInfoTreeRef, [])
    ElMessage({ message: '读取角色权限失败', type: 'error' })
  }
}

const openUserAuthDialog = async (row) => {
  userAuth.user_name = row.user_name || ''
  userAuth.alias = row.alias || ''
  userAuthDialogVisible.value = true

  try {
    const res = await acGetUserAccess({ user_name: userAuth.user_name })
    const checkedKeys = isOkResult(res) ? accessItemsToCheckedKeys(res.content) : []
    await applyCheckedKeys(userAuthTreeRef, checkedKeys)
  } catch {
    await applyCheckedKeys(userAuthTreeRef, [])
    ElMessage({ message: '读取用户权限失败', type: 'error' })
  }
}

onMounted(async () => {
  await Promise.all([loadData(), loadFeatures(), loadRoles()])
})
</script>

<style scoped>
.user-auth-config {
  padding: 24px;
  background: #f5f7fa;
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
}

.user-auth-config::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.user-auth-config {
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

.role-tag {
  margin: 4px 8px 4px 0;
  cursor: pointer;
}

:deep(.el-tree) {
  max-height: 360px;
  overflow: auto;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 8px;
}
</style>
