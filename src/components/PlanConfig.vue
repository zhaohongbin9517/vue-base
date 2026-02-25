<template>
  <div class="plan-config">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><setting /></el-icon>
        计划配置
      </h2>
      <p class="page-desc">配置计划导入的数据表结构和字段映射关系</p>
    </div>

    <!-- 计划表名配置 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><collection /></el-icon>
          <span>计划表名配置</span>
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

    <!-- 计划导入项配置 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><document /></el-icon>
          <span>计划导入项配置</span>
        </div>
      </template>

      <!-- 基础导入项 -->
      <div class="sub-section">
        <div class="sub-title">
          <el-tag type="primary" effect="dark" size="small">必填</el-tag>
          <span class="sub-title-text">基础导入项</span>
          <el-tooltip content="这些是导入Excel时必须包含的基础字段" placement="top">
            <el-icon class="help-icon"><question-filled /></el-icon>
          </el-tooltip>
        </div>
        <el-table :data="basicItems" border class="config-table" stripe>
          <el-table-column prop="station_id" label="计量站ID (Excel表头)" min-width="200">
            <template #default="{ row }">
              <el-input v-model="row.station_id" placeholder="请输入Excel表头名称">
                <template #prefix>
                  <el-icon><office-building /></el-icon>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="mainfold_num" label="管汇号 (Excel表头)" min-width="200">
            <template #default="{ row }">
              <el-input v-model="row.mainfold_num" placeholder="请输入Excel表头名称">
                <template #prefix>
                  <el-icon><connection /></el-icon>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="日期类型" width="200">
            <template #default="{ row }">
              <el-select v-model="row.date" placeholder="请选择日期类型">
                <el-option label="当日" value="now_day">
                  <el-icon><calendar /></el-icon> 当日
                </el-option>
                <el-option label="Sheet名称 (xxxx-xx-xx)" value="sheet_name">
                  <el-icon><document-copy /></el-icon> Sheet名称
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 可选导入项 -->
      <div class="sub-section">
        <div class="sub-title">
          <el-tag type="info" effect="dark" size="small">可选</el-tag>
          <span class="sub-title-text">可选导入项</span>
          <el-tooltip content="这些是可选的额外字段，可根据需要添加" placement="top">
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
          <el-table-column prop="dataType" label="数据类型" width="160">
            <template #default="{ row }">
              <el-select v-model="row.dataType" placeholder="请选择">
                <el-option label="整数 (int)" value="int">
                  <el-tag type="success" size="small">int</el-tag>
                </el-option>
                <el-option label="字符串 (string)" value="string">
                  <el-tag type="info" size="small">string</el-tag>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="checkCondition" label="检查条件" min-width="320">
            <template #default="{ row }">
              <div class="check-condition">
                <div class="check-item">
                  <span class="check-label">步长</span>
                  <el-input-number
                    v-model="row.step"
                    placeholder="步长"
                    class="small-input"
                    :min="0"
                    :precision="0"
                    :controls="false"
                  />
                </div>
                <div class="check-item range-item">
                  <span class="check-label">区间</span>
                  <el-input-number
                    v-model="row.minValue"
                    placeholder="最小"
                    class="small-input"
                    :min="0"
                    :precision="0"
                    :controls="false"
                    :class="{ 'is-error': isRangeInvalid(row) }"
                  />
                  <span class="range-separator">~</span>
                  <el-input-number
                    v-model="row.maxValue"
                    placeholder="最大"
                    class="small-input"
                    :min="0"
                    :precision="0"
                    :controls="false"
                    :class="{ 'is-error': isRangeInvalid(row) }"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template #default="{ $index }">
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
      <el-button type="primary" plain @click="addItem" :icon="Plus">
        添加导入项
      </el-button>
      <el-button type="success" @click="onSubmit" :icon="Check">
        保存配置
      </el-button>
    </div>
  </div>
</template>

<script>
import { Delete, Plus, Check, Setting, Collection, Document, OfficeBuilding, Connection, Calendar, DocumentCopy, ArrowDown, Warning, QuestionFilled } from '@element-plus/icons-vue'
import { getAllTableName, getTableColumn, getTmmsConfig, updateTmmsConfigPlan } from '@/api/config'

export default {
  name: 'PlanConfig',
  components: {
    Delete,
    Setting,
    Collection,
    Document,
    OfficeBuilding,
    Connection,
    Calendar,
    DocumentCopy,
    ArrowDown,
    Warning,
    QuestionFilled
  },
  setup() {
    return {
      Plus,
      Check
    }
  },
  data() {
    return {
      form: {
        tableName: ''
      },
      tableOptions: [],
      isTableNameInvalid: false,
      basicItems: [
        { station_id: '', mainfold_num: '', date: 'now_day' }
      ],
      optionalItems: [
        // { dbField: '', excelHeader: '', dataType: 'int', step: null, minValue: null, maxValue: null }
      ],
      tableColumnOptions: [{column_name:''}]
    }
  },
  mounted() {
    this.fetchTableOptions()
  },
  methods: {
    addItem() {
      this.optionalItems.push({
        dbField: '',
        excelHeader: '',
        dataType: 'int',
        step: null,
        minValue: null,
        maxValue: null
      })
    },
    removeItem(index) {
      this.optionalItems.splice(index, 1)
    },
    async onSubmit() {
      try {
        const xlsxColumnName = {}

        this.basicItems.forEach((item) => {
          if (item.station_id) {
            xlsxColumnName['station_id'] = {
              title_name: item.station_id,
              value_type: 'string'
            }
          }
          if (item.mainfold_num) {
            xlsxColumnName['mainfold_num'] = {
              title_name: item.mainfold_num,
              value_type: 'string'
            }
          }
          if (item.date) {
            xlsxColumnName['date'] = {
              value_type: item.date
            }
          }
        })

        for (const item of this.optionalItems) {
          if (item.dbField) {
            const colConfig = {
              title_name: item.excelHeader,
              value_type: item.dataType
            }

            const hasStep = item.step !== '' && item.step !== null && item.step !== undefined
            const hasMin = item.minValue !== '' && item.minValue !== null && item.minValue !== undefined
            const hasMax = item.maxValue !== '' && item.maxValue !== null && item.maxValue !== undefined

            if (hasStep || hasMin || hasMax) {
              const stepNum = hasStep ? parseFloat(item.step) : NaN
              const minNum = hasMin ? parseFloat(item.minValue) : NaN
              const maxNum = hasMax ? parseFloat(item.maxValue) : NaN

              if (hasStep && isNaN(stepNum)) {
                this.$message.error(`字段 "${item.dbField}" 的步长必须是数字`)
                return
              }
              if (hasMin && isNaN(minNum)) {
                this.$message.error(`字段 "${item.dbField}" 的最小值必须是数字`)
                return
              }
              if (hasMax && isNaN(maxNum)) {
                this.$message.error(`字段 "${item.dbField}" 的最大值必须是数字`)
                return
              }

              if (hasMin && hasMax && minNum > maxNum) {
                this.$message.error(`字段 "${item.dbField}" 的最小值不能大于最大值`)
                return
              }

              colConfig.check = {}
              if (hasStep) {
                colConfig.check.step = stepNum
              }
              if (hasMin || hasMax) {
                colConfig.check.range = []
                colConfig.check.range[0] = hasMin ? minNum : 0
                colConfig.check.range[1] = hasMax ? maxNum : 100
              }
            }

            xlsxColumnName[item.dbField] = colConfig
          }
        }

        const data = {
          plan_table_name: this.form.tableName,
          xlsx_column_name: xlsxColumnName
        }
        await updateTmmsConfigPlan(data)
        this.$message.success('保存成功')
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败')
      }
    },
    async fetchTableOptions() {
      try {
        const data = await getAllTableName()
        this.tableOptions = data.table_names.map(name => ({
          label: name,
          value: name
        }))
        await this.fetchTmmsConfig()
        this.loadTableColumns()
      } catch (error) {
        console.error('获取表名列表失败:', error)
        this.$message.error('获取表名列表失败')
      }
    },
    async fetchTmmsConfig() {
      try {
        const config = await getTmmsConfig()
        if (config && config.length > 0) {
          const planTableName = config[0].plan_table_name
          if (planTableName) {
            const exists = this.tableOptions.some(item => item.value === planTableName)
            if (exists) {
              this.form.tableName = planTableName
              this.isTableNameInvalid = false
            } else {
              this.form.tableName = planTableName
              this.isTableNameInvalid = true
            }
          }

          const xlsxColumnName = config[0].xlsx_column_name
          if (xlsxColumnName) {
            this.basicItems = [
              {
                station_id: xlsxColumnName.station_id?.title_name || '',
                mainfold_num: xlsxColumnName.mainfold_num?.title_name || '',
                date: xlsxColumnName.date?.value_type || 'now_day'
              }
            ]

            const basicFields = ['station_id', 'mainfold_num', 'date']
            const optionalFields = Object.keys(xlsxColumnName).filter(
              field => !basicFields.includes(field)
            )
            this.optionalItems = optionalFields.map(field => {
              const col = xlsxColumnName[field]
              return {
                dbField: field,
                excelHeader: col.title_name || '',
                dataType: col.value_type || 'string',
                step: col.check?.step ?? null,
                minValue: col.check?.range?.[0] ?? null,
                maxValue: col.check?.range?.[1] ?? null
              }
            })
          }
        }
      } catch (error) {
        console.error('获取配置失败:', error)
      }
    },
    handleTableNameChange(value) {
      const exists = this.tableOptions.some(item => item.value === value)
      this.isTableNameInvalid = !exists
      this.loadTableColumns()
    },
    async loadTableColumns() {
      if (!this.isTableNameInvalid) {
        if (!this.form.tableName) return
        try {
          const data = await getTableColumn(this.form.tableName, 'plan')
          this.tableColumnOptions = data
        } catch (error) {
          console.error('获取表列名失败:', error)
          this.tableColumnOptions = []
        }
      }
    },
    isDbFieldInvalid(dbField) {
      if (!dbField || this.tableColumnOptions.length === 0) return false
      return !this.tableColumnOptions.some(col => col.column_name === dbField)
    },
    handleDbFieldChange() {
      this.$forceUpdate()
    },
    isRangeInvalid(row) {
      if (row.minValue === null || row.minValue === undefined) return false
      if (row.maxValue === null || row.maxValue === undefined) return false
      return parseFloat(row.minValue) > parseFloat(row.maxValue)
    }
  }
}
</script>

<style scoped>
.plan-config {
  padding: 24px;
  background: #f5f7fa;
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
}

.plan-config::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.plan-config {
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
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.config-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-icon {
  font-size: 20px;
  color: #409eff;
}

.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.table-select {
  width: 400px;
}

.table-select.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.table-select.is-error :deep(.el-input__inner),
.table-select.is-error :deep(.el-select__selected-item) {
  color: #f56c6c !important;
}

.error-tag {
  width: fit-content;
}

.tag-content {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.sub-section {
  margin-bottom: 32px;
}

.sub-section:last-child {
  margin-bottom: 0;
}

.sub-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #dcdfe6;
}

.sub-title-text {
  font-size: 15px;
  font-weight: 600;
  color: #606266;
}

.help-icon {
  color: #909399;
  cursor: help;
}

.config-table {
  width: 100%;
}

.config-table :deep(.el-table__header th) {
  background: #f5f7fa;
  font-weight: 600;
  color: #606266;
}

.db-field-select {
  width: 100%;
}

.db-field-select.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.db-field-select.is-error :deep(.el-input__inner),
.db-field-select.is-error :deep(.el-select__selected-item) {
  color: #f56c6c !important;
}

.check-condition {
  display: flex;
  align-items: center;
  gap: 16px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.check-label {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.range-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-separator {
  color: #909399;
  font-size: 14px;
}

.small-input {
  width: 70px;
}

.small-input.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.small-input.is-error :deep(.el-input__inner) {
  color: #f56c6c !important;
}

.button-area {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
</style>
