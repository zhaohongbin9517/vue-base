<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <el-button type="success" size="small" @click="saveConfig" class="save-param-btn">
          <el-icon><check /></el-icon>
          保存配置
        </el-button>

         <el-button type="success" size="small" @click="printConfig" class="save-param-btn">
          <el-icon><check /></el-icon>
          打印数据
        </el-button>

      </div>
    </template>
    
    <!-- 参数选择 -->
    
    <el-button type="primary" size="small" @click="addEnum" class="add-param-btn">
      <el-icon><plus /></el-icon>
      新增枚举
    </el-button>

    <p class="tips-text"> &nbsp; </p>

    <!-- 枚举列表 -->
    <el-table :data="enums" border class="config-table" stripe>
      <el-table-column prop="tag_value" label="标签" min-width="250">
        <template #default="{ row }">
          <div v-if="row.tag_value && row.tag_value.length > 0" class="tags-container">
            <el-button 
              type="primary" 
              size="small" 
              @click="addTag(row)"
              style="margin-top: 8px;"
            >
              <el-icon><plus /></el-icon>
              新增参数
            </el-button>

            <p > &nbsp; </p>

            <div v-for="(tag, index) in row.tag_value" :key="index" class="tag-item">
              <el-input-number 
                v-model="tag.value" 
                placeholder="值" 
                :min="0" 
                controls-position="right" 
                size="small"
                class="tag-input"
                @change="handleParamNameChange"
              />
              <el-select 
                v-model="tag.code_id" 
                placeholder="请选择参数" 
                filterable
                :class="{'is-error': isValidParam(tag.code_id)}"
                @change="handleParamNameChange"
                size="small"
                class="tag-select"
              >
                <el-option 
                  v-for="option in paramOptions" 
                  :key="option.code_id" 
                  :label="option.desc" 
                  :value="option.code_id" 
                />
              </el-select>

              <el-button 
                type="danger" 
                size="small" 
                circle 
                @click="removeTag(row, index)"
                class="tag-delete-btn"
              >
                <el-icon><delete /></el-icon>
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态(英文)" min-width="150">
        <template #default="{ row }">
          <el-input 
            v-model="row.status" 
            placeholder="请输入状态" 
            @input="filterStatusInput(row)"
            @change="handleParamNameChange"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ $index }">
          <el-button type="danger" size="small" circle @click="removeEnum($index)">
            <el-icon><delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 启停状态枚举分类 -->
    <div class="status-classification-section">
      <h4 class="section-title">
        <el-icon class="title-icon"><tools /></el-icon>
        枚举分类：
      </h4>
      <div class="classification-content">
        <el-form label-width="120px">
          <el-form-item label="运行状态：">
            <div class="checkbox-selection">
              <el-checkbox 
                v-for="enumItem in validEnums" 
                :key="enumItem.status"
                :checked="localRunStatus.includes(enumItem.status)"
                @change="() => toggleRunStatus(enumItem.status)"
                class="status-checkbox"
              >
                {{ enumItem.status }}
              </el-checkbox>
              <span v-if="validEnums.length === 0" class="no-enums">
                暂无枚举项，请先添加
              </span>
            </div>
          </el-form-item>
          <el-form-item label="停止状态：">
            <div class="checkbox-selection">
              <el-checkbox 
                v-for="enumItem in validEnums" 
                :key="enumItem.status"
                :checked="localStopStatus.includes(enumItem.status)"
                @change="() => toggleStopStatus(enumItem.status)"
                class="status-checkbox"
              >
                {{ enumItem.status }}
              </el-checkbox>
              <span v-if="validEnums.length === 0" class="no-enums">
                暂无枚举项，请先添加
              </span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Tools, Plus, Delete, Check } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigDeviceStatusSetting',
  components: {
    Tools,
    Plus,
    Delete,
    Check
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        enums: [{ value: {}, status: '' }],
        statusEnumClassification: {
          run_status: [],
          stop_status: []
        }
      })
    },
    title: {
      type: String,
      default: '设备状态枚举配置'
    },
    tips: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    paramOptions: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return {
      Plus
    }
  },
  data() {
    return {
      localRunStatus: this.config.statusEnumClassification?.run_status || [],
      localStopStatus: this.config.statusEnumClassification?.stop_status || []
    }
  },
  computed: {
    enums() {
      return this.config.enums || []
    },
    classificationDataStructure() {
      const data = {
        run_status: this.localRunStatus,
        stop_status: this.localStopStatus
      }
      return JSON.stringify(data, null, 2)
    },
    validEnums() {
      return this.enums.filter(item => item.status)
    }
  },
  watch: {
    'config.statusEnumClassification': {
      handler(newVal) {
        if (newVal) {
          this.localRunStatus = newVal.run_status || []
          this.localStopStatus = newVal.stop_status || []
        }
      },
      immediate: true
    }
  },
  methods: {
    isValidParam(codeId) {
      // 如果没有选择参数，无效
      if (!codeId || this.paramOptions.length === 0)  return true
      // 检查选择的参数是否在选项中
      return !this.paramOptions.some(option => option.code_id === codeId)
    },
    handleParamNameChange() {
      this.$emit('update:DeviceStatusEnums', this.enums)
    },
    toggleRunStatus(status) {
      let newValue = [...this.localRunStatus]
      const index = newValue.indexOf(status)
      if (index > -1) {
        newValue.splice(index, 1)
      } else {
        newValue.push(status)
      }
      this.localRunStatus = newValue
      this.$emit('update:statusClassification', {
        type: 'run_status',
        value: newValue
      })
    },
    toggleStopStatus(status) {
      let newValue = [...this.localStopStatus]
      const index = newValue.indexOf(status)
      if (index > -1) {
        newValue.splice(index, 1)
      } else {
        newValue.push(status)
      }
      this.localStopStatus = newValue
      this.$emit('update:statusClassification', {
        type: 'stop_status',
        value: newValue
      })
    },
    filterStatusInput(row) {
      // 只允许英文，不允许标点符号和特殊字符
      row.status = row.status.replace(/[^a-zA-Z]/g, '')
    },
    addEnum() {
      this.$emit('add-enum', this.name)
    },
    removeEnum(index) {
      this.$emit('remove-enum', this.name, index)
    },
    addTag(row) {
      // 确保 tag_value 数组存在
      if (!row.tag_value) {
        row.tag_value = []
      }
      // 添加新标签
      row.tag_value.push({ value: 0, code_id: '' })
    },
    removeTag(row, index) {
      // 移除指定索引的标签
      if (row.tag_value && row.tag_value.length > 0) {
        row.tag_value.splice(index, 1)
      }
      this.handleParamNameChange()
    },
    saveConfig() {
      this.$emit('save-config')
    },
    printConfig() {
      console.log(this.config)
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

.param-select-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.param-select-section:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.param-select-section :deep(.el-form-item) {
  margin-bottom: 0;
}

.param-select-section :deep(.el-select) {
  width: 100%;
  max-width: 300px;
}

.param-select-section :deep(.el-form-label) {
  font-weight: 500;
  color: #495057;
}

.param-select-section :deep(.el-select:hover .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

.add-param-btn {
  margin-left: auto;
}

.save-param-btn {
  margin-left: auto;
}

.config-table {
  width: 100%;
}

.config-table :deep(.el-table__header th) {
  background: #f5f7fa;
  font-weight: 600;
  color: #606266;
}

.config-table :deep(.el-table__cell) {
  padding: 8px 12px;
}

.config-table :deep(.el-input-number) {
  width: 100%;
}

.config-table :deep(.el-input) {
  width: 100%;
}

.config-table :deep(.el-input__wrapper) {
  width: 100%;
}

.status-classification-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f2f5;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 16px;
}

.title-icon {
  font-size: 16px;
  color: #409eff;
}

.classification-content {
  padding: 20px;
  border-radius: 8px;
  border: none;
}

.classification-content :deep(.el-form-item) {
  margin-bottom: 20px;
}

.classification-content :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.classification-content :deep(.el-form-label) {
  font-weight: 500;
  color: #495057;
  line-height: 32px;
}

.checkbox-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  min-height: 32px;
}

.status-checkbox {
  margin-right: 0;
}

.status-checkbox :deep(.el-checkbox__label) {
  font-size: 13px;
  color: #606266;
  cursor: pointer;
}

.status-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

.status-checkbox :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #409eff;
  font-weight: 500;
}

.status-checkbox :deep(.el-checkbox__input:hover .el-checkbox__inner) {
  border-color: #c6e2ff;
}

.status-checkbox :deep(.el-checkbox__input.is-focus .el-checkbox__inner) {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.no-enums {
  font-size: 13px;
  color: #909399;
  font-style: italic;
}

.tags-container {
  padding: 8px 0;
}

.tag-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.tag-input {
  display: flex;
  width: 30%;
  min-width: 30%;
  margin-right: 8px;
}

.tag-select {
  width: 100%;
  margin-right: 8px;
}

.tag-delete-btn {
  margin-left: 8px;
}

.empty-tags {
  padding: 8px 0;
}

/* 错误样式 */
.config-table :deep(.el-select.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.config-table :deep(.el-select.is-error .el-select__selected-item) {
  color: #f56c6c !important;
}

.checkbox-selection :deep(.el-checkbox) {
  margin-right: 16px;
  margin-bottom: 8px;
}

.classification-desc {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #f0f2f5;
}

.desc-text {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.code-block {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #495057;
  overflow-x: auto;
  margin: 0;
  border: 1px solid #e9ecef;
}

.classification-content :deep(.el-select:hover .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

.classification-content :deep(.el-multiple-select__tags) {
  flex-wrap: wrap;
  gap: 4px;
}
</style>
