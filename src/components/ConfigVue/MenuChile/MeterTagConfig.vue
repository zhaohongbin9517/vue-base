<template>
  <div class="meter-tag-config">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Setting /></el-icon>
        参数点配置
      </h2>
      <p class="page-desc">管理计量站参数点配置信息</p>
    </div>

    <!-- 站选择 + 操作区 -->
    <el-card class="config-card" shadow="hover" style="margin-bottom: 20px;">
      <div class="toolbar">
        <div class="station-select-wrapper">
          <span class="toolbar-label">计量站：</span>
          <el-select
            v-model="currentStation"
            filterable
            placeholder="请选择站"
            class="station-select"
            @change="handleStationChange"
          >
            <el-option
              v-for="station in stationOptions"
              :key="station"
              :label="station"
              :value="station"
            />
          </el-select>
        </div>
        <div class="toolbar-actions" v-if="currentStation">
          <el-button type="primary" :icon="Plus" @click="handleAddRow">新增行</el-button>
          <el-button type="success" :icon="CopyDocument" @click="openCopyDialog">按模板添加多行</el-button>
          <el-button type="danger" :icon="Delete" :disabled="!selectedRows.length" @click="handleBatchDelete">
            批量删除<span v-if="selectedRows.length">（{{ selectedRows.length }}）</span>
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 配置表格 -->
    <el-card class="config-card" shadow="hover" v-loading="loading">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>参数点配置列表</span>
          <span class="header-count" v-if="tagConfigList.length">（共 {{ tagConfigList.length }} 条）</span>
          <div class="filter-area">
            <el-input
              v-model="filterCodeId"
              placeholder="参数ID筛选"
              clearable
              size="small"
              class="filter-input"
            />
            <el-select
              v-model="filterTagType"
              placeholder="参数类型筛选"
              clearable
              size="small"
              filterable
              class="filter-select"
            >
              <el-option
                v-for="item in tagTypeOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
            <el-button size="small" :icon="RefreshLeft" @click="clearFilters">清空筛选</el-button>
          </div>
        </div>
      </template>

      <el-table :data="filteredTagConfigList" border stripe class="config-table" style="width: 100%"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 400px)"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <!-- 多选列 -->
        <el-table-column type="selection" width="45" fixed="left" align="center" class-name="opaque-col" />

        <!-- 动态列渲染 -->
        <el-table-column
          v-for="col in sortedColumns"
          :key="col.name"
          :prop="col.name"
          :label="getColumnLabel(col)"
          :min-width="getColumnWidth(col)"
          align="center"
        >
          <template #default="{ row, $index }">
            <!-- 固定字段特殊渲染 -->
            <span v-if="col.name === 'meter_station_id'">{{ row.meter_station_id }}</span>

            <el-input
              v-else-if="col.name === 'code_id'"
              v-model="row.code_id"
              placeholder="请输入"
              size="small"
            />

            <el-select
              v-else-if="col.name === 'tag_type'"
              v-model="row.tag_type"
              placeholder="请选择"
              size="small"
              filterable
            >
              <el-option
                v-for="item in tagTypeOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>

            <el-switch
              v-else-if="col.name === 'is_curve' || isBoolType(col.data_type)"
              v-model="row[col.name]"
            />

            <el-button
              v-else-if="col.name === 'rule'"
              text
              type="primary"
              @click="handleEditRule(row)"
            >
              <el-icon><Edit /></el-icon>
              {{ row.rule ? '编辑' : '设置' }}
            </el-button>

            <!-- 动态字段默认渲染：按类型判断 -->
            <el-switch
              v-else-if="isBoolType(col.data_type)"
              v-model="row[col.name]"
            />
            <el-input
              v-else
              v-model="row[col.name]"
              placeholder="请输入"
              size="small"
            />
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" width="150" fixed="right" align="center" class-name="opaque-col">
          <template #default="{ row, $index }">
            <el-button type="primary" size="small" :loading="row._saving" @click="handleSaveRow(row, $index)">
              保存
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteRow(row, $index)">
              删除
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="请先选择计量站" />
        </template>
      </el-table>
    </el-card>

    <!-- 批量复制弹窗 -->
    <el-dialog v-model="showCopyDialog" title="按模板添加多行配置" width="500px">
      <div class="copy-dialog-content">
        <p class="copy-hint">从其他站复制参数点配置到当前站 <strong>{{ currentStation }}</strong>，已存在的 code_id 会自动跳过。</p>
        <div class="copy-form-item">
          <span class="copy-label">选择源站：</span>
          <el-select v-model="copySourceStation" filterable placeholder="请选择源站" class="copy-select">
            <el-option
              v-for="station in copySourceOptions"
              :key="station"
              :label="station"
              :value="station"
            />
          </el-select>
        </div>
      </div>
      <template #footer>
        <el-button @click="showCopyDialog = false">取消</el-button>
        <el-button type="primary" :loading="copyLoading" @click="handleCopyConfirm">确认复制</el-button>
      </template>
    </el-dialog>

    <!-- Rule 编辑弹窗 -->
    <MeterTagConfigRuleEdit
      v-model:visible="showRuleEdit"
      :rule="currentEditRule"
      :ruleData="caleRule"
      :codeIdOptions="codeIdOptions"
      @save="handleRuleSave"
    />
  </div>
</template>

<script>
import { getAllStationConfig, getMeterTagInfo, getMeterTagColumns, getMeterCodeInfo, updateMeterTagInfo, copyMeterTagInfo, deleteMeterTagInfo, getAllMeterTagInfoStation } from '@/api/configUtils/config'
import MeterTagConfigRuleEdit from './MeterTagConfigChild/MeterTagConfigRuleEdit.vue'
import { Setting, Document, Plus, CopyDocument, Edit, Delete, RefreshLeft } from '@element-plus/icons-vue'

// 固定字段的中文标签映射
const FIXED_LABELS = {
  meter_station_id: '站ID',
  code_id: '参数ID',
  rule: '规则',
  tag_type: '参数类型',
  desc: '描述',
  is_curve: '是否曲线',
  da_unit: '采集单元',
  tag: '采集点',
  curve_name: '曲线名称'
}

// 固定字段集合（用于判断哪些列有特殊渲染）
const FIXED_COLUMNS = new Set(Object.keys(FIXED_LABELS))

// 固定列顺序（按需求定义）
const COLUMN_ORDER = ['meter_station_id', 'code_id', 'desc', 'tag_type', 'da_unit', 'tag', 'rule', 'is_curve', 'curve_name']

export default {
  name: 'MeterTagConfig',
  components: { MeterTagConfigRuleEdit, Setting, Document, Edit, Delete, RefreshLeft },
  data() {
    return {
      currentStation: '',
      stationOptions: [],
      tagConfigList: [],
      tagTypeOptions: [],
      columns: [],
      loading: false,
      showCopyDialog: false,
      copySourceStation: '',
      copyLoading: false,
      configuredStations: [],
      showRuleEdit: false,
      currentEditRule: '',
      currentEditRow: null,
      selectedRows: [],
      filterCodeId: '',
      filterTagType: '',
      caleRule: { function: [], args_type: [] }
    }
  },
  computed: {
    codeIdOptions() {
      return this.tagConfigList
        .map(r => r.code_id)
        .filter(Boolean)
    },
    copySourceOptions() {
      return this.configuredStations.filter(s => s !== this.currentStation)
    },
    filteredTagConfigList() {
      return this.tagConfigList.filter(row => {
        if (this.filterCodeId) {
          const v = String(row.code_id || '')
          if (!v.toLowerCase().includes(this.filterCodeId.toLowerCase())) return false
        }
        if (this.filterTagType) {
          if (String(row.tag_type || '') !== String(this.filterTagType)) return false
        }
        return true
      })
    },
    sortedColumns() {
      if (!this.columns.length) return []
      const used = new Set()
      const result = []
      // 1. 按 COLUMN_ORDER 顺序排列固定列（仅包含实际存在的列）
      for (const name of COLUMN_ORDER) {
        const col = this.columns.find(c => String(c.name) === name)
        if (col) {
          result.push(col)
          used.add(name)
        }
      }
      // 2. 追加其他动态列（不在 COLUMN_ORDER 中的）
      for (const col of this.columns) {
        const name = String(col.name)
        if (!used.has(name)) {
          result.push(col)
        }
      }
      return result
    }
  },
  mounted() {
    this.loadStations()
    this.loadTagTypeOptions()
    this.loadColumns()
  },
  methods: {
    isBoolType(dataType) {
      if (!dataType) return false
      const t = String(dataType).toLowerCase()
      return t === 'bool' || t === 'boolean'
    },
    isIntType(dataType) {
      if (!dataType) return false
      const t = String(dataType).toLowerCase()
      return t === 'int4' || t === 'int2' || t === 'int8' || t === 'integer' || t === 'bigint' || t === 'smallint'
    },
    coerceValue(name, value) {
      const col = this.columns.find(c => String(c.name) === String(name))
      if (!col) return value
      if (this.isIntType(col.data_type)) {
        const n = parseInt(value, 10)
        return isNaN(n) ? 0 : n
      }
      if (this.isBoolType(col.data_type)) {
        return !!value
      }
      return value
    },
    isFixedColumn(name) {
      return FIXED_COLUMNS.has(name)
    },
    getColumnLabel(col) {
      const name = String(col.name)
      return FIXED_LABELS[name] || name
    },
    getColumnWidth(col) {
      const name = String(col.name)
      if (name === 'meter_station_id') return 140
      if (name === 'is_curve') return 90
      if (name === 'rule') return 180
      return 140
    },
    async loadStations() {
      try {
        const res = await getAllStationConfig()
        const list = Array.isArray(res) ? res : []
        this.stationOptions = list.map(item => item.object_id).filter(Boolean)
      } catch (e) {
        this.$message.error('获取站列表失败')
      }
    },
    async loadConfiguredStations() {
      try {
        const res = await getAllMeterTagInfoStation()
        const list = Array.isArray(res) ? res : []
        this.configuredStations = list.map(item => item.station_id).filter(Boolean)
      } catch (e) {
        this.$message.error('获取已配置站列表失败')
      }
    },
    async openCopyDialog() {
      await this.loadConfiguredStations()
      this.copySourceStation = ''
      this.showCopyDialog = true
    },
    clearFilters() {
      this.filterCodeId = ''
      this.filterTagType = ''
    },
    async loadTagTypeOptions() {
      try {
        const res = await getMeterCodeInfo()
        if (res && res.tag_type) {
          this.tagTypeOptions = res.tag_type
        }
        if (res && res.cale_rule) {
          this.caleRule = res.cale_rule
        }
      } catch (e) {
        this.$message.error('获取tag_type选项失败')
      }
    },
    async loadColumns() {
      try {
        const res = await getMeterTagColumns()
        this.columns = (res || []).map(item => ({
          name: item.column_name,
          data_type: item.data_type
        }))
      } catch (e) {
        this.$message.error('获取列定义失败')
      }
    },
    createEmptyRow() {
      const row = {}
      for (const col of this.columns) {
        const name = String(col.name)
        if (this.isBoolType(col.data_type) || name === 'is_curve') {
          row[name] = false
        } else if (name === 'tag_type') {
          row[name] = 'da_tag'
        } else if (name === 'meter_station_id') {
          row[name] = this.currentStation
        } else if (this.isIntType(col.data_type)) {
          row[name] = 0
        } else {
          row[name] = ''
        }
      }
      row._saving = false
      return row
    },
    async handleStationChange() {
      if (!this.currentStation) {
        this.tagConfigList = []
        return
      }
      this.loading = true
      try {
        const res = await getMeterTagInfo(this.currentStation)
        this.tagConfigList = (res || []).map(row => {
          const item = {}
          for (const [k, v] of Object.entries(row)) {
            item[k] = v
          }
          item._saving = false
          return item
        })
      } catch (e) {
        this.$message.error('加载参数点配置失败')
        this.tagConfigList = []
      } finally {
        this.loading = false
      }
    },
    handleAddRow() {
      this.tagConfigList.unshift(this.createEmptyRow())
    },
    async handleSaveRow(row, index) {
      if (!row.code_id) {
        this.$message.warning('code_id 不能为空')
        return
      }
      row._saving = true
      try {
        const data = {}
        for (const [k, v] of Object.entries(row)) {
          if (k === '_saving') continue
          data[k] = this.coerceValue(k, v)
        }
        await updateMeterTagInfo(data)
        this.$message.success(`第 ${index + 1} 行保存成功`)
      } catch (e) {
        this.$message.error(`第 ${index + 1} 行保存失败`)
      } finally {
        row._saving = false
      }
    },
    handleEditRule(row) {
      this.currentEditRow = row
      this.currentEditRule = row.rule || ''
      this.showRuleEdit = true
    },
    async handleRuleSave(content) {
      const row = this.currentEditRow
      if (!row) return
      if (!row.code_id) {
        this.$message.warning('code_id 不能为空')
        return
      }
      row.rule = content
      row._saving = true
      try {
        const data = {}
        for (const [k, v] of Object.entries(row)) {
          if (k === '_saving') continue
          data[k] = this.coerceValue(k, v)
        }
        await updateMeterTagInfo(data)
        this.$message.success('规则保存成功')
      } catch (e) {
        this.$message.error('规则保存失败')
      } finally {
        row._saving = false
      }
    },
    async handleCopyConfirm() {
      if (!this.copySourceStation) {
        this.$message.warning('请选择源站')
        return
      }
      this.copyLoading = true
      try {
        const res = await copyMeterTagInfo({
          source_station_id: this.copySourceStation,
          target_station_id: this.currentStation
        })
        const copyNum = res?.copy_num ?? res?.[0]?.copy_num ?? 0
        this.$message.success(`复制完成，新增 ${copyNum} 条配置`)
        this.showCopyDialog = false
        this.copySourceStation = ''
        await this.handleStationChange()
      } catch (e) {
        this.$message.error('批量复制失败')
      } finally {
        this.copyLoading = false
      }
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows || []
    },
    async handleDeleteRow(row, index) {
      // 新增未保存的行（无 code_id 或 code_id 为空）直接从列表移除
      if (!row.code_id) {
        this.tagConfigList.splice(index, 1)
        this.$message.success('已移除未保存的行')
        return
      }
      try {
        await this.$confirm('确认删除该行配置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        return
      }
      try {
        const res = await deleteMeterTagInfo({
          meter_station_id: row.meter_station_id,
          code_ids: [row.code_id]
        })
        const num = res?.delete_num ?? res?.[0]?.delete_num ?? 0
        if (num > 0) {
          this.tagConfigList.splice(index, 1)
          this.$message.success(`删除成功（${num} 条）`)
        } else {
          this.$message.warning('删除失败：未找到匹配记录')
        }
      } catch (e) {
        this.$message.error('删除失败')
      }
    },
    async handleBatchDelete() {
      if (!this.selectedRows.length) {
        this.$message.warning('请先勾选要删除的行')
        return
      }
      // 区分已保存行（有 code_id）和未保存行（无 code_id）
      const toDelete = this.selectedRows.filter(r => r.code_id)
      const toRemoveLocal = this.selectedRows.filter(r => !r.code_id)
      const total = this.selectedRows.length
      try {
        await this.$confirm(`确认删除选中的 ${total} 行配置？`, '批量删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        return
      }
      // 1. 未保存的行直接从列表移除
      if (toRemoveLocal.length) {
        const removeSet = new Set(toRemoveLocal)
        this.tagConfigList = this.tagConfigList.filter(r => !removeSet.has(r))
      }
      // 2. 已保存的行调接口删除
      if (toDelete.length) {
        try {
          const res = await deleteMeterTagInfo({
            meter_station_id: this.currentStation,
            code_ids: toDelete.map(r => r.code_id)
          })
          const num = res?.delete_num ?? res?.[0]?.delete_num ?? 0
          // 从列表移除已成功删除的 code_id
          const deletedSet = new Set(toDelete.map(r => r.code_id))
          this.tagConfigList = this.tagConfigList.filter(r => !deletedSet.has(r.code_id))
          this.$message.success(`删除成功（${num} 条），本地移除 ${toRemoveLocal.length} 条`)
        } catch (e) {
          this.$message.error('批量删除失败')
        }
      } else {
        this.$message.success(`本地移除 ${toRemoveLocal.length} 条`)
      }
      this.selectedRows = []
    }
  }
}
</script>

<style scoped>
.meter-tag-config {
  padding: 0 4px;
}

.page-header {
  margin-bottom: 20px;
}
.page-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ink-1);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px 0;
}
.title-icon {
  color: var(--ink-3);
}
.page-desc {
  font-size: 0.8125rem;
  color: var(--ink-3);
  margin: 0;
}

.config-card {
  border-radius: 4px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.station-select-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.toolbar-label {
  font-size: 0.875rem;
  color: var(--ink-2);
  white-space: nowrap;
}
.station-select {
  width: 280px;
}
.toolbar-actions {
  display: flex;
  gap: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.header-icon {
  color: var(--ink-3);
}
.header-count {
  font-size: 0.75rem;
  color: var(--ink-3);
  margin-left: 4px;
}

.filter-area {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-input {
  width: 160px;
}
.filter-select {
  width: 160px;
}

.config-table {
  margin-top: 4px;
}

/* 固定高度 + 内部滚动 + 冻结标题行 */
:deep(.config-table .el-table__header-wrapper) {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 多选列和操作列不透明，避免滚动时内容透显 */
:deep(.opaque-col) {
  background-color: #fff !important;
}
:deep(.el-table__fixed .el-table__fixed-body-wrapper .opaque-col) {
  background-color: #fff !important;
}

/* 斑马纹下不透明列保持白底 */
:deep(.el-table tr.el-table__row .opaque-col) {
  background-color: #fff !important;
}

/* 表头不透明 */
:deep(.el-table__fixed-header .el-table__fixed .opaque-col) {
  background-color: #f5f7fa !important;
}

.copy-dialog-content {
  padding: 0 4px;
}
.copy-hint {
  font-size: 0.8125rem;
  color: var(--ink-3);
  margin: 0 0 16px 0;
  line-height: 1.6;
}
.copy-form-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.copy-label {
  font-size: 0.875rem;
  white-space: nowrap;
}
.copy-select {
  flex: 1;
}
</style>
