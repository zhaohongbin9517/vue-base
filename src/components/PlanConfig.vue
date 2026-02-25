<template>
  <div class="plan-config">
    <h2>计划配置</h2>
    
    <!-- 计划表名配置 -->
    <div class="section">
      <div class="section-title">计划表名配置：</div>
      <el-select v-model="form.tableName" placeholder="请选择" class="table-select">
        <el-option
          v-for="item in tableOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
          <el-table-column prop="field1" label="计量站id(Excel表头)">
            <template #default="{ row }">
              <el-input v-model="row.field1" placeholder="表头名" />
            </template>
          </el-table-column>
          <el-table-column prop="field2" label="管汇号(Excel表头)">
            <template #default="{ row }">
              <el-input v-model="row.field2" placeholder="表头名" />
            </template>
          </el-table-column>
          <el-table-column prop="field3" label="日期" width="180">
            <template #default="{ row }">
              <el-select v-model="row.field3" placeholder="请选择">
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
          <el-table-column prop="dbField" label="关系库列" width="150">
            <template #default="{ row }">
              <el-input v-model="row.dbField" placeholder="请输入或选择列名">
                <template #append>
                  <el-icon><menu /></el-icon>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="excelHeader" label="EXCEL表头" width="150">
            <template #default="{ row }">
              <el-input v-model="row.excelHeader" placeholder="表头名" />
            </template>
          </el-table-column>
          <el-table-column prop="dataType" label="数据类型" width="120">
            <template #default="{ row }">
              <el-select v-model="row.dataType" placeholder="请选择">
                <el-option label="int" value="int" />
                <el-option label="float" value="float" />
                <el-option label="string" value="string" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="checkCondition" label="检查条件">
            <template #default="{ row }">
              <div class="check-condition">
                <span>步长：</span>
                <el-input v-model="row.step" placeholder="步长" class="small-input" />
                <span class="label-gap">区间：</span>
                <el-input v-model="row.minValue" placeholder="最小值" class="small-input" />
                <span>-</span>
                <el-input v-model="row.maxValue" placeholder="最大值" class="small-input" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ $index }">
              <el-button type="danger" size="small" @click="removeItem($index)">
                <el-icon><delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 按钮区域 -->
    <div class="button-area">
      <el-button type="info" @click="addItem">
        <el-icon><plus /></el-icon> 添加导入项
      </el-button>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
import { Plus, Delete } from '@element-plus/icons-vue'
import { getAllTableName, getTableColumn, updateTmmsConfigPlan } from '@/api/config'

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
      basicItems: [
        { field1: '', field2: '', field3: 'now_day' }
      ],
      optionalItems: [
        { dbField: '', excelHeader: '', dataType: 'int', step: '', minValue: '', maxValue: '' }
      ]
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
          if (item.field1) {
            xlsxColumnName[item.field1] = {
              title_name: item.field1,
              value_type: item.field3
            }
          }
        })
        
        this.optionalItems.forEach((item) => {
          if (item.dbField) {
            xlsxColumnName[item.dbField] = {
              title_name: item.excelHeader,
              value_type: item.dataType,
              check: {
                step: parseInt(item.step) || 1,
                range: [parseInt(item.minValue) || 0, parseInt(item.maxValue) || 100]
              }
            }
          }
        })
        
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
      } catch (error) {
        console.error('获取表名列表失败:', error)
        this.$message.error('获取表名列表失败')
      }
    },
    async fetchTableColumns() {
      if (!this.form.tableName) return
      try {
        const data = await getTableColumn(this.form.tableName, 'plan')
        console.log('表列名:', data)
      } catch (error) {
        console.error('获取表列名失败:', error)
      }
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
</style>
