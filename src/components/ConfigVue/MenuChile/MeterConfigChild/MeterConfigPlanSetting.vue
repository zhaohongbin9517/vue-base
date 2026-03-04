<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <save-config-button @save="saveConfig"></save-config-button>
      </div>
    </template>

    <el-form :model="localPlanTableInfo" label-width="120px">
      <el-form-item label="计划关系库表：">
        <el-select 
        v-model="localPlanTableInfo.tableName" 
        @change="updateTableName" 
        class="form-select"
        filterable
        :class="{'is-error': tableIsValidParam(localPlanTableInfo.tableName)}" 
        placeholder="请选择计划关系库表">
          <el-option 
            v-for="option in tableOptions" 
            :key="option.value" 
            :label="option.label" 
            :value="option.value" 
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划数据SQL：">
        <el-input 
          v-model="localPlanTableInfo.sql" 
          type="textarea" 
          @input="updatePlanTableInfo" 
          placeholder="请输入SQL" 
          :rows="4" 
          class="form-textarea"
        />
      </el-form-item>
      <el-form-item label="管汇号字段：">
        <el-select 
        v-model="localPlanTableInfo.tong_dao_column" 
        @change="updatePlanTableInfo" 
        class="form-select" 
        filterable
        :class="{'is-error': columnIsValidParam(localPlanTableInfo.tong_dao_column)}" 
        placeholder="请选择管汇号字段">
          <el-option 
            v-for="option in planTableColumnOptions" 
            :key="option.column_name" 
            :label="option.column_name" 
            :value="option.column_name" 
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据字段映射：">
        <template #label>
          <span>数据字段映射：</span>
        </template>
        <el-container>
          <el-header height="40px" class="mapping-header">
            <el-button type="primary" size="small" @click="addMapping">
              <el-icon><plus /></el-icon>
              新增映射
            </el-button>
          </el-header>
          <el-main class="table-container">
            <el-table :data="localPlanTableInfo.column" border class="config-table" stripe>
              <el-table-column label="设置" min-width="200">
                <template #default="{ row }">
                  <el-select 
                  v-model="row.set" 
                  @change="updatePlanTableInfo" 
                  filterable
                  :class="{'is-error': codeIdIsValidParam(row.set)}" 
                  placeholder="请选择参数">
                    <el-option 
                      v-for="option in paramOptions" 
                      :key="option.code_id" 
                      :label="option.desc" 
                      :value="option.code_id" 
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="检查" min-width="200">
                <template #default="{ row }">
                  <el-select 
                  v-model="row.check" 
                  @change="updatePlanTableInfo"
                  filterable
                  :class="{'is-error': codeIdIsValidParam(row.check)}" 
                  placeholder="请选择参数">
                    <el-option 
                      v-for="option in paramOptions" 
                      :key="option.code_id" 
                      :label="option.desc" 
                      :value="option.code_id" 
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="字段" min-width="200">
                <template #default="{ row }">
                  <el-select 
                  v-model="row.column" 
                  @change="updatePlanTableInfo" 
                  filterable
                  :class="{'is-error': columnIsValidParam(row.column)}" 
                  placeholder="请选择字段">
                    <el-option 
                      v-for="option in planTableColumnOptions" 
                      :key="option.column_name" 
                      :label="option.column_name" 
                      :value="option.column_name" 
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="{ $index }">
                  <el-button type="danger" size="small" circle @click="removeMapping($index)">
                    <el-icon><delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { Tools,Plus, Delete } from '@element-plus/icons-vue'
import SaveConfigButton from '@/components/ConfigVue/MenuChile/MeterConfigChild/Common/SaveConfigButton'
import { getTableColumn } from '@/api/configUtils/config'

export default {
  name: 'MeterConfigPlanSetting',
  components: {
    Tools,
    Plus,
    Delete,
    SaveConfigButton
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    planTableInfo: {
      type: Object,
      required: true
    },
    tableOptions: {
      type: Array,
      default: () => []
    },
    paramOptions: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return {
      Plus,
      Delete
    }
  },
  data() {
    return {
      planTableColumnOptions: [],
      localPlanTableInfo: {
        tableName: '',
        sql: '',
        tong_dao_column: '',
        column: []
      }
    }
  },
  mounted() {
    this.syncLocalData()
    this.loadPlanTableColumn()
  },
  watch: {
    planTableInfo: {
      handler() {
        this.syncLocalData()
        this.loadPlanTableColumn()
      },
      deep: true
    }
  },
  methods: {
    async loadPlanTableColumn(){
      if(this.localPlanTableInfo.tableName) {
        try {
          const planTableColumnData = await getTableColumn(this.localPlanTableInfo.tableName,'meter_plan')
          this.planTableColumnOptions = planTableColumnData || []
        } catch (error) {
          this.planTableColumnOptions =  []
          this.$message.error('获取计划表列名失败：' + this.localPlanTableInfo.tableName)
        }
      }
    },
    tableIsValidParam(tableName) {
      // 如果没有选择参数，无效
      if (!tableName || this.tableOptions.length === 0)  return true
      // 检查选择的参数是否在选项中
      return !this.tableOptions.some(option => option.value === tableName)
    },
    columnIsValidParam(columnName) {
      // 如果没有选择参数，无效
      if (!columnName || this.planTableColumnOptions.length === 0)  return true
      // 检查选择的参数是否在选项中
      return !this.planTableColumnOptions.some(option => option.column_name === columnName)
    },
    codeIdIsValidParam(codeId) {
      // 如果没有选择参数，无效
      if (!codeId || this.paramOptions.length === 0)  return true
      // 检查选择的参数是否在选项中
      return !this.paramOptions.some(option => option.code_id === codeId)
    },
    syncLocalData() {
      this.localPlanTableInfo = JSON.parse(JSON.stringify(this.planTableInfo))
    },
    updateTableName(){
      this.loadPlanTableColumn()
      this.updatePlanTableInfo()
    },
    updatePlanTableInfo() {
      this.$emit('update:planTableInfo', JSON.parse(JSON.stringify(this.localPlanTableInfo)))
    },
    addMapping() {
      this.localPlanTableInfo.column.push({ set: '', check: '', column: '' })
      this.updatePlanTableInfo()
    },
    removeMapping(index) {
      this.localPlanTableInfo.column.splice(index, 1)
      this.updatePlanTableInfo()
    },
    saveConfig() {
      this.$emit('save-config',this.name)
    }
  }
}
</script>

<style scoped>
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

.tips-text {
  font-size: 12px;
  color: #409eff;
  margin-left: 8px;
}

.add-param-btn {
  margin-left: auto;
}

.form-select {
  width: 300px;
}

.form-select.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.form-select.is-error :deep(.el-input__inner),
.form-select.is-error :deep(.el-select__selected-item) {
  color: #f56c6c !important;
}

.config-table :deep(.el-select.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.config-table :deep(.el-select.is-error .el-select__selected-item) {
  color: #f56c6c !important;
}

.form-textarea {
  width: 100%;
  min-width: 300px;
}

.mapping-header {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.table-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.config-table {
  width: 100%;
  margin-bottom: 0;
}

.config-table :deep(.el-table__header th) {
  background: #f5f7fa;
  font-weight: 600;
  color: #606266;
}

.config-table :deep(.el-table__cell) {
  padding: 8px 12px;
}

.config-table :deep(.el-select) {
  width: 100%;
}
</style>