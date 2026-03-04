<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <el-button type="primary" size="small" @click="addResultGroup" class="add-param-btn">
          <el-icon><plus /></el-icon>
          添加结果组
        </el-button>
        <el-button type="success" size="small" @click="saveConfig" class="save-param-btn">
          <el-icon><check /></el-icon>
          保存配置
        </el-button>
      </div>
    </template>

    <div v-for="(group, groupIndex) in localResultTableInfo.resultGroups" :key="groupIndex" class="result-group">
      <el-card class="group-card" shadow="hover">
        <template #header>
          <div class="group-header">
            <span class="group-title">结果组 {{ groupIndex + 1 }}</span>
            <el-button type="danger" size="small" circle @click="removeResultGroup(groupIndex)">
              <el-icon><delete /></el-icon>
            </el-button>
          </div>
        </template>
        
        <el-form :model="group" label-width="120px">
          <el-form-item label="配置项名称">
            <el-input v-model="group.name" @input="updateResultTableInfo" placeholder="请输入配置项名称" />
          </el-form-item>
          <el-form-item label="保存方式">
            <el-select v-model="group.save_type" @change="updateResultTableInfo" placeholder="请选择保存方式">
              <el-option label="按通道保存" value="tong_dao" />
              <el-option label="按井保存" value="well" />
            </el-select>
          </el-form-item>
          <el-form-item label="结果关系库表">
            <el-select 
            v-model="group.table" 
            @change="updateResultTableInfo" 
            :class="{'is-error': tableIsValidParam(group.table)}"
            placeholder="请选择结果关系库表">
              <el-option 
                v-for="option in tableOptions" 
                :key="option.value" 
                :label="option.label" 
                :value="option.value" 
              />
            </el-select>
          </el-form-item>
          <el-form-item label="结果字段配置">
            <div class="column-config">
              <div class="column-header">
                <el-button type="primary" size="small" @click="addColumn(groupIndex)">
                  <el-icon><plus /></el-icon>
                  添加字段
                </el-button>
              </div>
              <el-table :data="group.column" border size="small" class="inner-table">
                <el-table-column label="数据库字段" min-width="150">
                  <template #default="{ row: columnRow }">
                    <el-select 
                    v-model="columnRow.dbColumnField" 
                    @change="updateResultTableInfo" 
                    :class="{'is-error': columnIsValidParam(columnRow.dbColumnField,groupIndex)}"
                    placeholder="请选择数据库字段">
                      <el-option 
                        v-for="option in resultTableColumnOptions[groupIndex]" 
                        :key="option.column_name" 
                        :label="option.column_name" 
                        :value="option.column_name" 
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="参数" min-width="150">
                  <template #default="{ row: columnRow ,$index: columnIndex}">
                    <el-select v-model="columnRow.params" @change="updateResultTableInfo" multiple placeholder="请选择参数">
                      <el-option 
                        v-for="option in paramOptions" 
                        :key="option.code_id" 
                        :label="option.desc" 
                        :value="option.code_id" 
                      />
                      <template #tag>
                        <el-tag 
                        v-for="param in columnRow.params" 
                        :key="param" 
                        closable
                        @close="removeParam(param,columnIndex)"
                        :color="getTagColor(param)"
                        >{{ param }}</el-tag>
                      </template>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                  <template #default="{ $index: columnIndex }">
                    <el-button type="danger" size="small" circle @click="removeColumn(groupIndex, columnIndex)">
                      <el-icon><delete /></el-icon>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-card>
</template>

<script>
import { Tools, Plus, Delete, Check } from '@element-plus/icons-vue'
import { getTableColumn } from '@/api/configUtils/config'

export default {
  name: 'MeterConfigResultSetting',
  components: {
    Tools,
    Plus,
    Delete,
    Check
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
    resultTableInfo: {
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
      resultTableColumnOptions:[],
      localResultTableInfo: {
        resultGroups: []
      }
    }
  },
  mounted() {
    this.syncLocalData()
    this.initResultTableColumnOptions()
  },
  watch: {
    resultTableInfo: {
      handler() {
        this.syncLocalData()
        this.initResultTableColumnOptions()
      },
      deep: true
    }
  },
  methods: {
    removeParam(param,columnIndex) {
      this.localResultTableInfo.resultGroups.forEach(group => {
        group.column.forEach((column,index) => {
          if(index === columnIndex) {
            column.params = column.params.filter(item => item !== param)
          }
        })
      })
      this.updateResultTableInfo()
    },
    getTagColor(param) {
      if(this.paramOptions.length === 0)  return '#ffdccc'
      if(this.paramOptions.some(option => option.code_id === param))  return '#e6f9ff'
      return '#ffdccc'
    },
    columnIsValidParam(columnName,groupIndex){
      // 如果没有选择参数，无效
      if (!this.resultTableColumnOptions[groupIndex]) return true
      if (!columnName || this.resultTableColumnOptions[groupIndex].length === 0)  return true
      // 检查选择的参数是否在选项中
      return !this.resultTableColumnOptions[groupIndex].some(option => option.column_name === columnName)
    },
    tableIsValidParam(tableName){
      // 如果没有选择参数，无效
      if (!tableName || this.tableOptions.length === 0)  return true
      // 检查选择的参数是否在选项中
      return !this.tableOptions.some(option => option.value === tableName)
    },
    async loadResultTableColumnOptions(groupIndex){
      if (!this.localResultTableInfo.resultGroups[groupIndex].table) {
        return
      }
      try {
        const data = await getTableColumn(this.localResultTableInfo.resultGroups[groupIndex].table,'result_data_table_name')
        this.resultTableColumnOptions[groupIndex] = data
      } catch (error) {
        this.resultTableColumnOptions[groupIndex] = []
        this.$message.error('获取表名列表失败：' + this.localResultTableInfo.resultGroups[groupIndex].table)
      }
    },
    async initResultTableColumnOptions(){
      for (let i = 0; i < this.localResultTableInfo.resultGroups.length; i++) {
        await this.loadResultTableColumnOptions(i)
      }
    },
    syncLocalData() {
      this.localResultTableInfo = JSON.parse(JSON.stringify(this.resultTableInfo))
    },
    updateResultTableInfo() {
      this.$emit('update:resultTableInfo', JSON.parse(JSON.stringify(this.localResultTableInfo)))
    },
    addResultGroup() {
      this.localResultTableInfo.resultGroups.push({
        name: '',
        save_type: 'tong_dao',
        table: '',
        column:  [{ dbColumnField: '', params: [] }]
      })
      this.updateResultTableInfo()
    },
    removeResultGroup(index) {
      this.localResultTableInfo.resultGroups.splice(index, 1)
      this.resultTableColumnOptions.splice(index, 1)
      this.updateResultTableInfo()
    },
    addColumn(groupIndex) {
      this.localResultTableInfo.resultGroups[groupIndex].column.push({
        dbColumnField: '',
        params: []
      })
      this.updateResultTableInfo()
    },
    removeColumn(groupIndex, columnIndex) {
      this.localResultTableInfo.resultGroups[groupIndex].column.splice(columnIndex, 1)
      this.updateResultTableInfo()
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

.form-textarea {
  width: 100%;
  min-width: 300px;
}

.save-param-btn {
  margin-left: 8px;
}

.result-group {
  margin-bottom: 16px;
}

.group-card {
  border-radius: 8px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.group-title {
  margin-left: 8px;
}

.column-config {
  padding: 8px 0;
}

.column-header {
  margin-bottom: 8px;
}

.inner-table {
  margin-top: 8px;
  width: 100%;
}

.inner-table :deep(.el-table__header th) {
  background: #fafafa;
  font-weight: 600;
  color: #606266;
}

.inner-table :deep(.el-table__cell) {
  padding: 8px 12px;
}

.inner-table :deep(.el-select) {
  width: 100%;
}

.inner-table :deep(.el-input) {
  width: 100%;
}

.inner-table :deep(.el-input__wrapper) {
  width: 100%;
}

.inner-table :deep(.el-select.is_error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.inner-table :deep(.el-select.is_error .el-select__selected-item) {
  color: #f56c6c !important;
}

.el-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.el-form :deep(.el-select) {
  width: 300px;
}

.el-form :deep(.el-input) {
  width: 300px;
}

/* 错误样式 */
.el-form :deep(.el-select.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.el-form :deep(.el-select.is-error .el-select__selected-item) {
  color: #f56c6c !important;
}
</style>