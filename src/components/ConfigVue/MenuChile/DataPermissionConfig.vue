<template>
  <div class="data-permission">
    <header class="page-header">
      <div class="page-header__main">
        <h2 class="page-title">
          <el-icon class="title-icon"><lock /></el-icon>
          数据权限
        </h2>
        <p class="page-desc">
          按组织对象树为用户分配可访问的数据范围。层级与对象类型由后台基础数据动态决定，仅作展示。
        </p>
      </div>
      <div v-if="!levelLoading && levels.length" class="page-header__meta">
        <span class="meta-caption">层级</span>
        <span class="meta-value">{{ levels.length }}</span>
      </div>
    </header>

    <!-- 01 层级结构 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="card-header__left">
            <span class="section-index">01</span>
            <el-icon class="header-icon"><connection /></el-icon>
            <span>层级结构</span>
          </div>
          <span class="card-header__meta">只读 · 来自 tmms_auth 回调</span>
        </div>
      </template>

      <div v-if="levelLoading" class="skeleton">
        <span v-for="n in 3" :key="n" class="skeleton__row"></span>
      </div>

      <div v-else-if="levels.length === 0" class="state-block">
        <el-icon class="state-block__icon"><folder-opened /></el-icon>
        <p class="state-block__title">暂无层级数据</p>
        <p class="state-block__desc">
          未获取到组织对象基础数据，请确认后台回调配置是否正确，或稍后重新进入本页。
        </p>
      </div>

      <ol v-else class="level-ladder">
        <li v-for="(item, index) in levels" :key="item.level" class="level-row">
          <span class="level-rail" aria-hidden="true">
            <span class="level-dot"></span>
            <span v-if="index < levels.length - 1" class="level-line"></span>
          </span>
          <span class="level-index">L{{ item.level }}</span>
          <span class="level-types">
            <span v-for="type in item.types" :key="type" class="level-type">{{ type }}</span>
          </span>
        </li>
      </ol>

      <p class="hint">层级来自后台基础数据（tmms_auth 回调），当前接口不支持新增或修改层级。</p>
    </el-card>

    <!-- 02 用户数据范围 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="card-header__left">
            <span class="section-index">02</span>
            <el-icon class="header-icon"><user /></el-icon>
            <span>用户数据范围</span>
          </div>
          <span class="card-header__meta">共 {{ totalNodes }} 个对象</span>
        </div>
      </template>

      <div class="toolbar">
        <div class="field field--user">
          <span class="field__label">用户</span>
          <el-select
            v-model="selectedUser"
            filterable
            clearable
            placeholder="请选择用户"
            class="user-select"
            @change="handleUserChange"
          >
            <el-option
              v-for="item in users"
              :key="item.user_name"
              :label="item.alias ? `${item.user_name}（${item.alias}）` : item.user_name"
              :value="item.user_name"
            />
          </el-select>
        </div>

        <div class="field field--search">
          <span class="field__label">查找</span>
          <el-input
            v-model="filterText"
            placeholder="对象名称或 ID"
            clearable
            class="filter-input"
          >
            <template #prefix>
              <el-icon><search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="toolbar__actions">
          <el-button
            :icon="Refresh"
            :loading="permissionLoading"
            :disabled="!selectedUser"
            @click="loadPermission"
          >
            重新载入
          </el-button>
        </div>
      </div>

      <transition name="result-fade">
        <div
          v-if="authResult"
          class="check-result"
          :class="authResult.allowed ? 'is-success' : 'is-danger'"
        >
          <el-icon class="check-result__icon">
            <circle-check v-if="authResult.allowed" />
            <circle-close v-else />
          </el-icon>
          <div class="check-result__body">
            <span class="check-result__title">
              {{ authResult.user }}
              {{ authResult.allowed ? '可以访问该对象' : '不能访问该对象' }}
            </span>
            <span class="check-result__meta">{{ authResult.objectId }}</span>
          </div>
        </div>
      </transition>

      <div class="tree-panel">
        <div class="tree-panel__head">
          <span class="tree-panel__caption">对象树</span>
          <span class="tree-panel__stats">已选 {{ checkedCount }} 项</span>
        </div>

        <div v-if="baseLoading" class="tree-scroll">
          <div class="skeleton">
            <span v-for="n in 5" :key="n" class="skeleton__row"></span>
          </div>
        </div>

        <div v-else class="tree-scroll">
          <el-tree
            ref="treeRef"
            :data="baseTree"
            node-key="objectId"
            show-checkbox
            highlight-current
            :props="treeProps"
            :filter-node-method="filterNode"
            :empty-text="baseTree.length ? '没有匹配的对象' : '暂无基础数据'"
            @node-click="handleNodeClick"
            @check="handleTreeCheck"
          >
            <template #default="{ data }">
              <span class="tree-node">
                <span class="tree-node__name">{{ data.objectName || data.objectId }}</span>
                <span v-if="data.objectType" class="tree-node__type">{{ data.objectType }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </el-card>

    <!-- 操作区 -->
    <footer class="action-bar">
      <div class="action-bar__context">
        <template v-if="selectedUser">
          <span class="context-dot" :class="dirty ? 'is-dirty' : 'is-clean'"></span>
          <span class="context-text">{{ selectedUser }}</span>
          <span v-if="!dirty" class="context-muted">已同步</span>
          <el-tag v-else size="small" type="warning" effect="plain">未保存</el-tag>
        </template>
        <span v-else class="context-muted">请选择用户后分配数据范围</span>
      </div>

      <div class="action-bar__buttons">
        <el-button
          class="btn-clear"
          :icon="Delete"
          :disabled="!selectedUser"
          @click="handleClear"
        >
          清空权限
        </el-button>
        <el-button
          :icon="Key"
          :disabled="!selectedUser || !selectedNode"
          :loading="authLoading"
          @click="handleAuthCheck"
        >
          校验选中节点
        </el-button>
        <el-button
          type="primary"
          :icon="Check"
          :loading="saving"
          :disabled="!selectedUser"
          @click="handleSave"
        >
          保存
        </el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Lock,
  User,
  Connection,
  Search,
  Refresh,
  Check,
  Delete,
  Key,
  FolderOpened,
  CircleCheck,
  CircleClose
} from '@element-plus/icons-vue'
import {
  getDataPermissionBase,
  getUserDataPermission,
  setUserDataPermission,
  authUserDataPermission
} from '@/api/userUtils/dataPermission'
import { acGetAllUsers } from '@/api/userUtils/userCenter'
import { getAuthUser } from '@/api/userUtils/auth'

export default {
  name: 'DataPermissionConfig',
  components: {
    Lock,
    User,
    Connection,
    Search,
    FolderOpened,
    CircleCheck,
    CircleClose
  },
  setup() {
    return {
      Refresh,
      Check,
      Delete,
      Key
    }
  },
  data() {
    return {
      // 基础树（全量组织对象）
      baseTree: [],
      // objectId -> 基础节点，用于补齐权限节点的名称与后代
      baseMap: new Map(),
      // 从基础树推导出的层级
      levels: [],
      // 基础树对象总数
      totalNodes: 0,
      // 用户列表
      users: [],
      selectedUser: '',
      selectedNode: null,
      filterText: '',
      authResult: null,
      // 当前勾选数量与未保存状态
      checkedCount: 0,
      dirty: false,
      baseLoading: false,
      levelLoading: false,
      permissionLoading: false,
      authLoading: false,
      saving: false,
      treeProps: { label: 'objectName', children: 'children' }
    }
  },
  watch: {
    filterText(value) {
      const tree = this.$refs.treeRef
      if (tree) {
        tree.filter(value)
      }
    }
  },
  async mounted() {
    await this.loadBase()
    await this.loadUsers()
  },
  methods: {
    // 获取基础对象树，并推导层级
    async loadBase() {
      this.baseLoading = true
      this.levelLoading = true
      try {
        const res = await getDataPermissionBase()
        if (res?.result === 'ok') {
          const tree = Array.isArray(res.content) ? res.content : []
          this.baseTree = tree
          this.baseMap = this.indexBaseTree(tree)
          this.levels = this.computeLevels(tree)
          this.totalNodes = this.countNodes(tree)
        } else {
          this.baseTree = []
          this.baseMap = new Map()
          this.levels = []
          this.totalNodes = 0
          ElMessage.error(res?.content || '获取数据权限基础数据失败')
        }
      } catch (error) {
        console.error('获取数据权限基础数据失败:', error)
      } finally {
        this.baseLoading = false
        this.levelLoading = false
      }
    },
    // 构建 objectId -> 节点 的索引
    indexBaseTree(tree) {
      const map = new Map()
      const walk = (nodes) => {
        ;(nodes || []).forEach(node => {
          if (!node || !node.objectId) return
          map.set(node.objectId, node)
          walk(node.children)
        })
      }
      walk(tree)
      return map
    },
    // 统计基础树节点总数
    countNodes(tree) {
      let total = 0
      const walk = (nodes) => {
        ;(nodes || []).forEach(node => {
          if (!node) return
          total += 1
          walk(node.children)
        })
      }
      walk(tree)
      return total
    },
    // 从基础树推导层级（不写死层数）
    computeLevels(tree) {
      const levelTypes = []
      const walk = (nodes, depth) => {
        ;(nodes || []).forEach(node => {
          if (!node) return
          if (!levelTypes[depth]) levelTypes[depth] = new Set()
          if (node.objectType) levelTypes[depth].add(node.objectType)
          if (Array.isArray(node.children) && node.children.length) {
            walk(node.children, depth + 1)
          }
        })
      }
      walk(tree, 0)
      return levelTypes
        .map((types, index) => ({ level: index + 1, types: Array.from(types) }))
        .filter(item => item.types.length > 0)
    },
    // 获取用户列表，默认定位到当前登录用户
    async loadUsers() {
      try {
        const res = await acGetAllUsers()
        if (res?.result !== 'ok') {
          ElMessage.error(res?.content || '获取用户列表失败')
          return
        }
        this.users = Array.isArray(res.content) ? res.content : []
        const current = getAuthUser()
        const currentName =
          typeof current === 'string' ? current : (current && current.user_name) || ''
        if (currentName && this.users.some(item => item.user_name === currentName)) {
          this.selectedUser = currentName
          await this.loadPermission()
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
      }
    },
    handleUserChange() {
      this.selectedNode = null
      this.authResult = null
      this.dirty = false
      this.checkedCount = 0
      if (!this.selectedUser) {
        const tree = this.$refs.treeRef
        if (tree) {
          tree.setCheckedKeys([])
        }
        return
      }
      this.loadPermission()
    },
    // 读取并回显用户已有数据权限
    async loadPermission() {
      if (!this.selectedUser) return
      this.permissionLoading = true
      this.authResult = null
      try {
        const res = await getUserDataPermission({ user_name: this.selectedUser })
        if (res?.result === 'ok') {
          const permission = res.content?.permission || []
          this.applyPermission(permission)
        } else {
          ElMessage.error(res?.content || '获取用户数据权限失败')
        }
      } catch (error) {
        console.error('获取用户数据权限失败:', error)
      } finally {
        this.permissionLoading = false
      }
    },
    // permission 勾选树 -> 树组件勾选状态
    // 语义：节点 children 为空表示该对象下级全部可访问
    // 兼容历史数据：只按 objectId 匹配基础树，节点缺少 objectType / objectName 也能正常回显
    applyPermission(permission) {
      const allowed = new Set()
      const collectDescendants = (node) => {
        ;(node.children || []).forEach(child => {
          if (child && child.objectId) {
            allowed.add(child.objectId)
            collectDescendants(child)
          }
        })
      }
      const walk = (nodes) => {
        ;(nodes || []).forEach(node => {
          if (!node || !node.objectId) return
          allowed.add(node.objectId)
          const children = Array.isArray(node.children) ? node.children : []
          if (children.length === 0) {
            const base = this.baseMap.get(node.objectId)
            if (base) {
              collectDescendants(base)
            }
          } else {
            walk(children)
          }
        })
      }
      walk(permission)

      // 只勾选基础树的叶子节点，由树组件级联推导父节点状态，避免误放行兄弟分支
      const leafIds = []
      const collectLeaves = (nodes) => {
        ;(nodes || []).forEach(node => {
          if (!node || !node.objectId) return
          const children = Array.isArray(node.children) ? node.children : []
          if (children.length === 0) {
            if (allowed.has(node.objectId)) {
              leafIds.push(node.objectId)
            }
          } else {
            collectLeaves(children)
          }
        })
      }
      collectLeaves(this.baseTree)

      this.$nextTick(() => {
        const tree = this.$refs.treeRef
        if (tree) {
          tree.setCheckedKeys(leafIds)
        }
        this.updateCheckedCount()
        this.dirty = false
      })
    },
    // 树组件勾选状态 -> permission 勾选树（保留祖先链，并带上 objectType / objectName）
    buildPermission() {
      const tree = this.$refs.treeRef
      const checked = new Set(tree ? tree.getCheckedKeys() : [])
      const build = (node) => {
        const payload = { objectId: node.objectId }
        // objectType / objectName 取自基础树；基础数据缺失时省略该键，避免发送空值
        if (node.objectType) {
          payload.objectType = node.objectType
        }
        if (node.objectName) {
          payload.objectName = node.objectName
        }
        if (checked.has(node.objectId)) {
          // 该节点整棵子树都可见，children 留空
          payload.children = []
          return payload
        }
        const children = (node.children || []).map(build).filter(Boolean)
        if (children.length) {
          payload.children = children
          return payload
        }
        return null
      }
      return this.baseTree.map(build).filter(Boolean)
    },
    handleNodeClick(data) {
      this.selectedNode = data
      this.authResult = null
    },
    // 勾选变化：更新计数并标记未保存
    handleTreeCheck() {
      this.dirty = true
      this.authResult = null
      this.updateCheckedCount()
    },
    updateCheckedCount() {
      const tree = this.$refs.treeRef
      this.checkedCount = tree ? tree.getCheckedKeys().length : 0
    },
    // 校验用户对选中对象是否可访问
    async handleAuthCheck() {
      if (!this.selectedUser || !this.selectedNode) return
      const objectId = this.selectedNode.objectId
      this.authLoading = true
      try {
        const res = await authUserDataPermission({
          user_name: this.selectedUser,
          object_id: objectId
        })
        if (res?.result === 'ok') {
          this.authResult = {
            user: this.selectedUser,
            objectId,
            allowed: res.content === true
          }
        } else {
          this.authResult = null
          ElMessage.error(res?.content || '校验失败')
        }
      } catch (error) {
        console.error('校验数据权限失败:', error)
      } finally {
        this.authLoading = false
      }
    },
    async handleSave() {
      if (!this.selectedUser) return
      const permission = this.buildPermission()
      this.saving = true
      try {
        const res = await setUserDataPermission({
          user_name: this.selectedUser,
          permission: JSON.stringify(permission)
        })
        if (res?.result === 'ok') {
          this.dirty = false
          ElMessage.success('数据权限已保存')
        } else {
          ElMessage.error(res?.content || '保存失败')
        }
      } catch (error) {
        console.error('保存数据权限失败:', error)
      } finally {
        this.saving = false
      }
    },
    async handleClear() {
      if (!this.selectedUser) return
      try {
        await ElMessageBox.confirm(
          `确认清空用户 ${this.selectedUser} 的数据权限？`,
          '提示',
          { type: 'warning' }
        )
      } catch {
        return
      }
      this.saving = true
      try {
        const res = await setUserDataPermission({
          user_name: this.selectedUser,
          permission: '[]'
        })
        if (res?.result === 'ok') {
          const tree = this.$refs.treeRef
          if (tree) {
            tree.setCheckedKeys([])
          }
          this.updateCheckedCount()
          this.dirty = false
          this.authResult = null
          ElMessage.success('已清空数据权限')
        } else {
          ElMessage.error(res?.content || '清空失败')
        }
      } catch (error) {
        console.error('清空数据权限失败:', error)
      } finally {
        this.saving = false
      }
    },
    filterNode(value, data) {
      if (!value) return true
      const keyword = String(value).toLowerCase()
      const name = String(data.objectName || '').toLowerCase()
      const id = String(data.objectId || '').toLowerCase()
      return name.includes(keyword) || id.includes(keyword)
    }
  }
}
</script>

<style scoped>
.data-permission {
  padding: 0;
  background: transparent;
}

/* —— 页面标题 —— */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-5);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-hair);
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ink-1);
  margin: 0 0 var(--space-2) 0;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  letter-spacing: -0.01em;
}

.title-icon {
  font-size: 1.25rem;
  color: var(--ink-1);
}

.page-desc {
  font-family: var(--font-serif);
  color: var(--ink-3);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.6;
  max-width: 68ch;
}

.page-header__meta {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.meta-caption {
  font-family: var(--font-serif);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-4);
}

.meta-value {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  line-height: 1.1;
  color: var(--ink-1);
  font-variant-numeric: tabular-nums;
}

/* —— 卡片 —— */
.config-card {
  margin-bottom: var(--space-5);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.card-header__left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink-1);
}

.section-index {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  color: var(--ink-4);
  padding-right: var(--space-2);
  border-right: 1px solid var(--border-hair);
  font-variant-numeric: tabular-nums;
}

.header-icon {
  font-size: 1.125rem;
  color: var(--ink-2);
}

.card-header__meta {
  font-family: var(--font-serif);
  font-size: 0.75rem;
  color: var(--ink-4);
  letter-spacing: 0.02em;
  white-space: nowrap;
}

/* —— 层级阶梯 —— */
.level-ladder {
  list-style: none;
  margin: 0;
  padding: 0;
}

.level-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding-bottom: var(--space-3);
}

.level-row:last-child {
  padding-bottom: 0;
}

.level-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  width: 10px;
  padding-top: 7px;
  flex: 0 0 auto;
}

.level-dot {
  width: 6px;
  height: 6px;
  border: 1px solid var(--ink-1);
  border-radius: 50%;
  background: var(--bg-surface);
  flex: 0 0 auto;
}

.level-line {
  flex: 1;
  width: 1px;
  margin-top: 3px;
  background: var(--border-soft);
}

.level-index {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--ink-4);
  min-width: 26px;
  padding-top: 3px;
  flex: 0 0 auto;
  font-variant-numeric: tabular-nums;
}

.level-types {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: var(--space-2);
  row-gap: 2px;
  padding-top: 1px;
  min-width: 0;
}

.level-type {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  color: var(--ink-2);
  word-break: break-all;
}

.level-type:not(:last-child)::after {
  content: '/';
  color: var(--border-soft);
  margin-left: var(--space-2);
}

.hint {
  font-family: var(--font-serif);
  font-size: 0.75rem;
  color: var(--ink-4);
  margin: var(--space-4) 0 0;
  padding-top: var(--space-3);
  border-top: 1px dashed var(--border-hair);
  line-height: 1.6;
}

/* —— 空状态 —— */
.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-1);
  padding: var(--space-6) var(--space-4);
}

.state-block__icon {
  font-size: 1.5rem;
  color: var(--ink-4);
  margin-bottom: var(--space-2);
}

.state-block__title {
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  color: var(--ink-2);
  margin: 0;
}

.state-block__desc {
  font-family: var(--font-serif);
  font-size: 0.8125rem;
  color: var(--ink-4);
  margin: 0;
  line-height: 1.6;
  max-width: 440px;
}

/* —— 加载骨架 —— */
.skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-2) 0;
}

.skeleton__row {
  height: 14px;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    var(--bg-subtle) 25%,
    var(--bg-hover) 37%,
    var(--bg-subtle) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
}

.skeleton__row:nth-child(2) {
  width: 72%;
}

.skeleton__row:nth-child(3) {
  width: 86%;
}

.skeleton__row:nth-child(4) {
  width: 64%;
}

.skeleton__row:nth-child(5) {
  width: 78%;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

/* —— 工具栏 —— */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-4);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-hair);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  font-family: var(--font-serif);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-4);
}

.user-select {
  width: 300px;
}

.filter-input {
  width: 240px;
}

.toolbar__actions {
  margin-left: auto;
}

/* —— 校验结果 —— */
.check-result {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
  border: 1px solid var(--border-hair);
  border-left-width: 3px;
  border-radius: var(--radius-sm);
}

.check-result.is-success {
  border-left-color: var(--success);
  background: rgba(22, 163, 74, 0.04);
}

.check-result.is-danger {
  border-left-color: var(--danger);
  background: rgba(220, 38, 38, 0.04);
}

.check-result__icon {
  font-size: 1rem;
  margin-top: 2px;
  flex: 0 0 auto;
}

.is-success .check-result__icon {
  color: var(--success);
}

.is-danger .check-result__icon {
  color: var(--danger);
}

.check-result__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.check-result__title {
  font-family: var(--font-serif);
  font-size: 0.875rem;
  color: var(--ink-2);
}

.check-result__meta {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--ink-4);
  word-break: break-all;
}

.result-fade-enter-active,
.result-fade-leave-active {
  transition: opacity var(--duration) var(--ease), transform var(--duration) var(--ease);
}

.result-fade-enter-from,
.result-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* —— 对象树 —— */
.tree-panel {
  border: 1px solid var(--border-hair);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.tree-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border-hair);
}

.tree-panel__caption {
  font-family: var(--font-serif);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.tree-panel__stats {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--ink-4);
  font-variant-numeric: tabular-nums;
}

.tree-scroll {
  max-height: 440px;
  min-height: 120px;
  overflow: auto;
  padding: var(--space-2) var(--space-2);
}

.tree-scroll :deep(.el-tree) {
  background: transparent;
  --el-tree-node-hover-bg-color: var(--bg-subtle);
}

.tree-scroll :deep(.el-tree-node__content) {
  height: 34px;
  border-radius: var(--radius-sm);
  padding-right: var(--space-2);
}

.tree-scroll :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: var(--el-color-primary-light-9);
  box-shadow: inset 2px 0 0 var(--ink-1);
}

.tree-scroll :deep(.el-tree__empty-block) {
  min-height: 160px;
}

.tree-scroll :deep(.el-tree__empty-text) {
  font-family: var(--font-serif);
  font-size: 0.875rem;
  color: var(--ink-4);
}

.tree-node {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  min-width: 0;
}

.tree-node__name {
  font-family: var(--font-serif);
  font-size: 0.875rem;
  color: var(--ink-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-node__type {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
  color: var(--ink-4);
  flex: 0 0 auto;
}

.tree-node__type::before {
  content: '·';
  margin-right: 6px;
  color: var(--border-soft);
}

/* —— 操作区 —— */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-5);
  padding: var(--space-4) 0 0;
  border-top: 1px solid var(--border-hair);
}

.action-bar__context {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  min-width: 0;
}

.context-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ink-4);
  flex: 0 0 auto;
}

.context-dot.is-dirty {
  background: var(--warning);
}

.context-dot.is-clean {
  background: var(--success);
}

.context-text {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--ink-2);
}

.context-muted {
  font-family: var(--font-serif);
  font-size: 0.8125rem;
  color: var(--ink-4);
}

.action-bar__buttons {
  display: flex;
  gap: var(--space-3);
  margin-left: auto;
}

/* 危险操作：沿用编辑风的描边按钮，避免全局 danger 实心样式 */
.action-bar__buttons .btn-clear:not(.is-disabled) {
  color: var(--danger);
  border-color: var(--danger);
  background: var(--bg-surface);
}

.action-bar__buttons .btn-clear:not(.is-disabled):hover {
  color: var(--danger);
  border-color: var(--danger);
  background: rgba(220, 38, 38, 0.06);
}

/* —— 响应式 —— */
@media (max-width: 1120px) {
  .user-select {
    width: 240px;
  }

  .filter-input {
    width: 200px;
  }
}

@media (max-width: 860px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header__meta {
    display: none;
  }

  .card-header {
    flex-wrap: wrap;
  }

  .toolbar {
    align-items: stretch;
  }

  .field {
    width: 100%;
  }

  .user-select,
  .filter-input {
    width: 100%;
  }

  .toolbar__actions {
    margin-left: 0;
  }

  .action-bar__buttons {
    width: 100%;
  }

  .action-bar__buttons .el-button {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton__row {
    animation: none;
  }

  .result-fade-enter-active,
  .result-fade-leave-active {
    transition: none;
  }
}
</style>
