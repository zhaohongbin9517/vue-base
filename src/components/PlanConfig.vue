<template>
  <div class="plan-config">
    <h2>计划配置</h2>

    <!-- 计划表名配置 -->
    <div class="section">
      <div class="section-title">计划表名配置：</div>
      <div class="select-wrapper">
        <el-select v-model="form.tableName" placeholder="请选择" class="table-select"
          :class="{ 'is-error': isTableNameInvalid }" filterable clearable @change="handleTableNameChange">
          <el-option v-for="item in tableOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span v-if="isTableNameInvalid" class="error-text">该表名不在列表中</span>
      </div>
    </div>

    <!-- 计划导入项配置 -->
    <div class="section">
      <div class="section-title">计划导入项配置：</div>

      <!-- 基础导入项 -->
      <div class="sub-section">
        <div class="sub-title">
          <span class="required-label">基础导入项</span>
          <span class="required-mark">(必填*)：</span>
        </div>
        <el-table :data="basicItems" border class="config-table">
          <el-table-column prop="station_id" label="计量站id(Excel表头)" width="400">
            <template #default="{ row }">
              <el-input v-model="row.station_id" placeholder="表头名" />
            </template>
          </el-table-column>
          <el-table-column prop="mainfold_num" label="管汇号(Excel表头)" width="400">
            <template #default="{ row }">
              <el-input v-model="row.mainfold_num" placeholder="表头名" />
            </template>
          </el-table-column>
          <el-table-column prop="date" label="日期" width="410">
            <template #default="{ row }">
              <el-select v-model="row.date" placeholder="请选择">
                <el-option label="当日" value="now_day" />
                <el-option label="sheet名称(xxxx-xx-xx)" value="sheet_name" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 可选导入项 -->
      <div class="sub-section">
        <div class="sub-title optional">可选导入项：</div>
        <el-table :data="optionalItems" border class="config-table">
          <el-table-column prop="dbField" label="关系库列" width="300">
            <template #default="{ row, $index }">
              <el-select v-model="row.dbField" placeholder="请输入或选择列名" filterable allow-create default-first-option
                class="db-field-select"
                :class="{ 'is-error': isDbFieldInvalid(row.dbField) }"
                @change="handleDbFieldChange($index)">
                <el-option v-for="col in tableColumnOptions" :key="col.column_name" :label="col.column_name"
                  :value="col.column_name" />
                <template #prefix>
                  <el-button link type="primary" @click="loadTableColumns">
                    <el-icon>
                      <menu />
                    </el-icon>
                  </el-button>
                </template>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="excelHeader" label="EXCEL表头" width="300">
            <template #default="{ row }">
              <el-input v-model="row.excelHeader" placeholder="表头名" />
            </template>
          </el-table-column>
          <el-table-column prop="dataType" label="数据类型" width="120">
            <template #default="{ row }">
              <el-select v-model="row.dataType" placeholder="请选择">
                <el-option label="int" value="int" />
                <el-option label="string" value="string" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="checkCondition" label="检查条件">
            <template #default="{ row }">
              <div class="check-condition">
                <span>步长：</span>
                <el-input-number v-model="row.step" placeholder="步长" class="small-input" :min="0" :precision="0" :controls="false" />
                <span class="label-gap">区间：</span>
                <el-input-number
                  v-model="row.minValue"
                  placeholder="最小值"
                  class="small-input"
                  :min="0"
                  :precision="0"
                  :controls="false"
                  :class="{ 'is-error': isRangeInvalid(row) }"
                />
                <span>-</span>
                <el-input-number
                  v-model="row.maxValue"
                  placeholder="最大值"
                  class="small-input"
                  :min="0"
                  :precision="0"
                  :controls="false"
                  :class="{ 'is-error': isRangeInvalid(row) }"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ $index }">
              <el-button type="danger" size="small" @click="removeItem($index)">
                <el-icon>
                  <delete />
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 按钮区域 -->
    <div class="button-area">
      <el-button type="info" @click="addItem">
        <el-icon>
          <plus />
        </el-icon> 添加导入项
      </el-button>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
import { Plus, Delete } from '@element-plus/icons-vue'
import { 
  getAllTableName
  , getTableColumn
  , getTmmsConfig
  , updateTmmsConfigPlan 
} from '@/api/config'

export default {
  name: 'PlanConfig',
  components: {
    Plus,
    Delete
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
        { dbField: '', excelHeader: '', dataType: 'int', step: '', minValue: '', maxValue: '' }
      ],
      tableColumnOptions: []
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
        step: '',
        minValue: '',
        maxValue: ''
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
              value_type: 'int'
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

            // 检查是否有 check 相关参数
            const hasStep = item.step !== '' && item.step !== null && item.step !== undefined
            const hasMin = item.minValue !== '' && item.minValue !== null && item.minValue !== undefined
            const hasMax = item.maxValue !== '' && item.maxValue !== null && item.maxValue !== undefined

            if (hasStep || hasMin || hasMax) {
              // 验证是否为数字
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

              // 检查 minValue 是否大于 maxValue
              if (hasMin && hasMax && minNum > maxNum) {
                this.$message.error(`字段 "${item.dbField}" 的最小值不能大于最大值`)
                return
              }

              // 构建 check 对象
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
        console.log(data)
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
                step: col.check?.step?.toString() || '',
                minValue: col.check?.range?.[0]?.toString() || '',
                maxValue: col.check?.range?.[1]?.toString() || ''
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
      // 加载表列名
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
      // 值变化时触发验证
      this.$forceUpdate()
    },
    isRangeInvalid(row) {
      if (row.minValue === '' || row.minValue === null || row.minValue === undefined) return false
      if (row.maxValue === '' || row.maxValue === null || row.maxValue === undefined) return false
      return parseFloat(row.minValue) > parseFloat(row.maxValue)
    }

  }
}
</script>

<style scoped>
.plan-config {
  padding: 20px;
}

.plan-config h2 {
  margin-bottom: 20px;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  color: #409eff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.table-select {
  width: 300px;
}

.table-select.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.table-select.is-error :deep(.el-input__inner),
.table-select.is-error :deep(.el-select__selected-item) {
  color: #f56c6c !important;
}

.table-select.is-error :deep(.el-select__placeholder) {
  color: #f56c6c !important;
}

.select-wrapper {
  display: flex;
  flex-direction: column;
}

.error-text {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 6px;
}

.sub-section {
  margin-bottom: 20px;
}

.sub-title {
  margin-bottom: 12px;
  font-size: 14px;
}

.required-label {
  color: #409eff;
}

.required-mark {
  color: #f56c6c;
}

.optional {
  color: #409eff;
}

.config-table {
  width: 100%;
}

.check-condition {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.check-condition span {
  color: #909399;
  font-size: 13px;
}

.small-input {
  width: 80px;
}

.label-gap {
  margin-left: 8px;
}

.button-area {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.db-field-select.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.db-field-select.is-error :deep(.el-input__inner),
.db-field-select.is-error :deep(.el-select__selected-item) {
  color: #f56c6c !important;
}

.small-input.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.small-input.is-error :deep(.el-input__inner) {
  color: #f56c6c !important;
}
</style>
