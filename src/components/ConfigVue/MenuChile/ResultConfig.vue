<template>
  <div class="result-config">
    <div v-if="isShowHeader" class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><setting /></el-icon>
        结果配置
      </h2>
      <p class="page-desc">配置结果导出的数据表结构和字段选择</p>
    </div>

    <!-- 结果表名配置 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><collection /></el-icon>
          <span>结果表名配置</span>
        </div>
      </template>
      <div class="select-wrapper">
        <el-select
          v-model="form.tableName"
          placeholder="请选择数据表"
          class="table-select"
          :class="{ 'is-error': isTableNameInvalid }"
          filterable
          clearable
          @change="handleTableNameChange"
        >
          <el-option
            v-for="item in tableOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-tag v-if="isTableNameInvalid" type="danger" class="error-tag" effect="plain">
          <span class="tag-content">
            <el-icon><warning /></el-icon>
            <span>该表名不在列表中</span>
          </span>
        </el-tag>
      </div>
    </el-card>

    <!-- 结果导出项配置 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><document /></el-icon>
          <span>结果导出项配置</span>
        </div>
      </template>

      <!-- 结果导出项配置 -->
      <div class="sub-section">
        <div class="sub-title">
          <el-tag type="primary" effect="dark" size="small">选择</el-tag>
          <span class="sub-title-text">导出列选择</span>
          <el-tooltip content="请选择需要导出的结果列" placement="top">
            <el-icon class="help-icon"><question-filled /></el-icon>
          </el-tooltip>
        </div>
        <el-table :data="optionalItems" border class="config-table" stripe>
          <el-table-column prop="dbField" label="关系库列" min-width="180">
            <template #default="{ row }">
              <el-select
                v-model="row.dbField"
                placeholder="请输入或选择列名"
                filterable
                allow-create
                default-first-option
                class="db-field-select"
                :class="{ 'is-error': isDbFieldInvalid(row.dbField) }"
                @change="handleDbFieldChange"
              >
                <el-option
                  v-for="col in tableColumnOptions"
                  :key="col.column_name"
                  :label="col.column_name"
                  :value="col.column_name"
                />
                <template #prefix>
                  <el-button link type="primary" @click="loadTableColumns" :disabled="!form.tableName">
                    <el-icon><arrow-down /></el-icon>
                  </el-button>
                </template>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="excelHeader" label="EXCEL表头" min-width="180">
            <template #default="{ row }">
              <el-input v-model="row.excelHeader" placeholder="请输入Excel表头名称">
                <template #prefix>
                  <el-icon><document /></el-icon>
                </template>
              </el-input>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ $index }">
              <el-button type="primary" size="small" circle @click="optionalItemsTop($index)">
                <el-icon><top /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="optionalItemsBottom($index)">
                <el-icon><bottom /></el-icon>
              </el-button>
              <el-button type="danger" size="small" circle @click="removeItem($index)">
                <el-icon><delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 按钮区域 -->
    <div class="button-area">
      <el-button v-if="PromiseWrite" type="primary" plain @click="addItem" :icon="Plus">
        添加导出项
      </el-button>
      <el-button type="primary" plain @click="resetItem" :icon="RefreshLeft">
        重置
      </el-button>
      <el-button v-if="PromiseWrite" type="success" @click="onSubmit">
        <el-icon><check /></el-icon>
        保存配置
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  Bottom, Top, Delete, Setting, Collection, Document, 
  ArrowDown, Plus, Warning, QuestionFilled, Check,RefreshLeft
 } from '@element-plus/icons-vue'
import { getAllTableName, getTableColumn, getTmmsConfig, updateTmmsConfigResult } from '@/api/configUtils/config'
import { getAuthPermission } from '@/api/login/auth'

export default {
  name: 'ResultConfig',
  components: {
    Bottom,
    Top,
    Delete,
    Setting,
    Collection,
    Document,
    ArrowDown,
    Warning,
    QuestionFilled,
    Check
  },
  props: {
    isShowHeader: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      Plus,
      RefreshLeft
    }
  },
  data() {
    return {
      form: {
        tableName: ''
      },
      tableOptions: [],
      isTableNameInvalid: false,

      optionalItems: [
        // { dbField: '', excelHeader: ''}
      ],

      tableColumnOptions: [{column_name:''}],
      PromiseWrite: getAuthPermission('config:write'),
      PromiseRead: getAuthPermission('config:read')
    }
  },
  mounted() {
    this.fetchTableOptions()
  },
  methods: {
    //移除
    removeItem(index) {
      this.optionalItems.splice(index, 1)
    },
    //上移
    optionalItemsTop(index) {
      if (index === 0) return
      const item = this.optionalItems.splice(index, 1)[0]
      this.optionalItems.splice(index - 1, 0, item)
    },
    //下移
    optionalItemsBottom(index) {
      if (index === this.optionalItems.length - 1) return
      const item = this.optionalItems.splice(index, 1)[0]
      this.optionalItems.splice(index + 1, 0, item)
    },
    //添加
    addItem() {
      this.optionalItems.push({
        dbField: '',
        excelHeader: ''
      })
    },
    //重置
    resetItem(){

      this.form= {tableName: '' },
      this.tableOptions= [],
      this.isTableNameInvalid= false,

      this.optionalItems= [ ],
      this.tableColumnOptions= [{column_name:''}]

      this.fetchTableOptions()
    },
    //导出列选项是否存在于对应的关系库列中
    isDbFieldInvalid(dbField) {
      if (!dbField || this.tableColumnOptions.length === 0) return false
      return !this.tableColumnOptions.some(col => col.column_name === dbField)
    },
    //导出列变更
    handleDbFieldChange() {
      this.$forceUpdate()
    },
    //保存
    async onSubmit() {
      try {
        const data = {
          result_data_table_name: this.form.tableName,
          measure_result_title_name: this.optionalItems.reduce((acc, item) => {
            acc[item.dbField] = item.excelHeader
            return acc
          }, {})
        }
        await updateTmmsConfigResult(data)
        this.$message.success('保存成功')
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败')
      }
    },
    //初始化获取全部表名
    async fetchTableOptions() {
      try {
        const data = await getAllTableName()
        this.tableOptions = data.table_names.map(name => ({
          label: name,
          value: name
        }))
        await this.fetchTmmsConfig()
      } catch (error) {
        console.error('获取表名列表失败:', error)
        this.$message.error('获取表名列表失败')
      }
    },
    //初始化结果配置数据
    async fetchTmmsConfig() {
      try {
        const config = await getTmmsConfig()
        if (config && config.length > 0) {
          const resultTableName = config[0].result_data_table_name
          if (resultTableName) {
            const exists = this.tableOptions.some(item => item.value === resultTableName)
            if (exists) {
              this.form.tableName = resultTableName
              this.isTableNameInvalid = false
            } else {
              this.form.tableName = resultTableName
              this.isTableNameInvalid = true
            }
            // 先加载列名，再设置 optionalItems，这样才能正确判断 dbField 是否有效
            await this.loadTableColumns()

            const xlsxColumnName = config[0].measure_result_title_name
            // 遍历对象的所有键名
            if (xlsxColumnName && typeof xlsxColumnName === 'object') {
              Object.keys(xlsxColumnName).forEach(key => {
                const value = xlsxColumnName[key]
                this.optionalItems.push({
                  dbField: key,
                  excelHeader: value
                })
              })
            }
          }
        }
      } catch (error) {
        console.error('获取配置失败:', error)
      }
    },
    //结果表名变更
    handleTableNameChange(value) {
      const exists = this.tableOptions.some(item => item.value === value)
      this.isTableNameInvalid = !exists
      this.loadTableColumns()
    },
    //加载关系库列
    async loadTableColumns() {
      if (!this.isTableNameInvalid) {
        if (!this.form.tableName) return
        try {
          const data = await getTableColumn(this.form.tableName, 'result_data_table_name')
          this.tableColumnOptions = data
        } catch (error) {
          console.error('获取表列名失败:', error)
          this.tableColumnOptions = []
        }
      }
    },
  }
}
</script>

<style scoped>
.result-config {
  padding: 0;
  background: transparent;
  overflow-y: auto;
}

.page-header {
  margin-bottom: var(--space-5);
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ink-1);
  margin: 0 0 var(--space-2) 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.title-icon {
  font-size: 26px;
  color: var(--ink-1);
}

.page-desc {
  color: var(--ink-3);
  font-size: 14px;
  margin: 0;
}

.config-card {
  margin-bottom: var(--space-5);
  border-radius: var(--radius-sm);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 16px;
  font-weight: 600;
  color: var(--ink-1);
}

.header-icon {
  font-size: 20px;
  color: var(--ink-1);
}

.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.table-select {
  width: 400px;
}

.table-select.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--danger) inset;
}

.table-select.is-error :deep(.el-input__inner),
.table-select.is-error :deep(.el-select__selected-item) {
  color: var(--danger) !important;
}

.error-tag {
  width: fit-content;
}

.tag-content {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  white-space: nowrap;
}

.sub-section {
  margin-bottom: var(--space-6);
}

.sub-section:last-child {
  margin-bottom: 0;
}

.sub-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--border-hair);
}

.sub-title-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-2);
}

.help-icon {
  color: var(--ink-3);
  cursor: help;
}

.checkbox-wrapper {
  padding: var(--space-5);
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  min-height: 200px;
}

.column-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.column-checkbox {
  margin-right: 0;
  padding: var(--space-2) var(--space-4);
  background: var(--bg-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-hair);
  transition: all var(--duration) var(--ease);
}

.column-checkbox:hover {
  border-color: var(--ink-2);
  box-shadow: none;
}

.column-checkbox :deep(.el-checkbox__label) {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.db-field-select {
  width: 100%;
}

.db-field-select.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--danger) inset;
}

.db-field-select.is-error :deep(.el-input__inner),
.db-field-select.is-error :deep(.el-select__selected-item) {
  color: var(--danger) !important;
}

.button-area {
  margin-top: var(--space-5);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-top: 1px solid var(--border-hair);
  background: transparent;
  box-shadow: none;
}
</style>
