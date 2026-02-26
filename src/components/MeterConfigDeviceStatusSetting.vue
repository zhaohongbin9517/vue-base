<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <el-button type="primary" size="small" @click="addEnum" class="add-param-btn">
          <el-icon><plus /></el-icon>
          新增枚举
        </el-button>
      </div>
    </template>
    
    <!-- 参数选择 -->
    <div class="param-select-section">
      <el-form label-width="100px">
        <el-form-item label="状态参数">
          <el-select v-model="localParamName" placeholder="请选择参数" @change="handleParamNameChange">
            <el-option 
              v-for="option in paramOptions" 
              :key="option.value" 
              :label="option.label" 
              :value="option.value" 
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 枚举列表 -->
    <el-table :data="enums" border class="config-table" stripe>
      <el-table-column prop="value" label="值" min-width="150">
        <template #default="{ row }">
          <el-input v-model="row.value" placeholder="请输入值" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="150">
        <template #default="{ row }">
          <el-input v-model="row.status" placeholder="请输入状态" />
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
  </el-card>
</template>

<script>
import { Tools, Plus, Delete } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigDeviceStatusSetting',
  components: {
    Tools,
    Plus,
    Delete
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        paramName: '',
        enums: [{ value: '', status: '' }]
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
      localParamName: this.config.paramName
    }
  },
  computed: {
    enums() {
      return this.config.enums || []
    }
  },
  watch: {
    'config.paramName': {
      handler(newVal) {
        this.localParamName = newVal
      },
      immediate: true
    }
  },
  methods: {
    handleParamNameChange(value) {
      this.$emit('update:paramName', value)
    },
    addEnum() {
      this.$emit('add-enum', this.name)
    },
    removeEnum(index) {
      this.$emit('remove-enum', this.name, index)
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

.config-table {
  width: 100%;
}

.config-table :deep(.el-table__header th) {
  background: #f5f7fa;
  font-weight: 600;
  color: #606266;
}
</style>
