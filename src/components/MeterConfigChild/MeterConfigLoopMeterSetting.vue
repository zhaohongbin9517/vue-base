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
      </div>
    </template>

    <el-form :model="localLoopMeterInfo" label-width="180px">
      <el-form-item label="循环计量参数：">
        <el-select 
        v-model="localLoopMeterInfo.paramName" 
        @change="updateLoopMeterInfo" 
        placeholder="请选择参数" 
        filterable
        clearable
        :class="{'is-error': codeIdIsValidParam(localLoopMeterInfo.paramName)}" 
        class="form-select">
          <el-option 
            v-for="option in paramOptions" 
            :key="option.code_id" 
            :label="option.desc" 
            :value="option.code_id" 
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开启循环计量：">
        <el-switch v-model="localLoopMeterInfo.enable" @change="updateLoopMeterInfo" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { Tools, Check } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigLoopMeterSetting',
  components: {
    Tools,
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
    loopMeterInfo: {
      type: Object,
      required: true
    },
    paramOptions: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return {
    }
  },
  data() {
    return {
      localLoopMeterInfo: {
        paramName: '',
        enable: false
      }
    }
  },
  mounted() {
    this.syncLocalData()
  },
  watch: {
    loopMeterInfo: {
      handler() {
        this.syncLocalData()
      },
      deep: true
    }
  },
  methods: {
    codeIdIsValidParam(codeId) {
      // 如果没有选择参数，无效
      if (!codeId || this.paramOptions.length === 0)  return true
      // 检查选择的参数是否在选项中
      return !this.paramOptions.some(option => option.code_id === codeId)
    },
    syncLocalData() {
      this.localLoopMeterInfo = JSON.parse(JSON.stringify(this.loopMeterInfo))
    },
    updateLoopMeterInfo() {
      this.$emit('update:loopMeterInfo', JSON.parse(JSON.stringify(this.localLoopMeterInfo)))
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

.save-param-btn {
  margin-left: auto;
}

.form-select {
  width: 400px;
  min-width: 200px;
}
.form-select.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.form-select.is-error :deep(.el-input__inner),
.form-select.is-error :deep(.el-select__selected-item) {
  color: #f56c6c !important;
}

/* 确保在小屏幕上也能正常显示 */
@media (max-width: 768px) {
  .form-select {
    width: 100%;
  }
}
</style>