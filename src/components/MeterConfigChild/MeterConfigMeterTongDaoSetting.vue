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
    
    <div class="channel-setting-content">
      <div class="input-section">
        <el-form label-width="100px">
          <el-form-item label="通道号模板">
            <el-input 
              v-model="templateInput" 
              placeholder="请输入通道号模板，使用{}表示自定义参数，例如：{}123{}"
              @input="handleTemplateInput"
            />
          </el-form-item>
        </el-form>
        <p class="hint-text">
          <el-icon class="hint-icon"><info-filled /></el-icon>
          使用{}表示自定义参数位置，例如：{}123{} 表示两个参数选择
        </p>
      </div>
      
      <div v-if="placeholders.length > 0" class="placeholders-section">
        <h4 class="section-title">参数选择</h4>
        <div class="placeholder-items">
          <div 
            v-for="(placeholder, index) in placeholders" 
            :key="index"
            class="placeholder-item"
          >
            <span class="placeholder-label">参数 {{ index + 1 }}：</span>
            <el-select 
              v-model="placeholder.selectedParam" 
              placeholder="请选择参数"
              filterable
              @change="generateChannelNumber"
            >
              <el-option 
                v-for="option in paramOptions" 
                :key="option.code_id" 
                :label="option.desc" 
                :value="option.code_id" 
              />
            </el-select>
          </div>
        </div>
      </div>
      
    </div>
  </el-card>
</template>

<script>
import { Tools, InfoFilled, Check } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigMeterTongDaoSetting',
  components: {
    Tools,
    InfoFilled,
    Check
  },
  props: {
    channelNumber: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '通道号设置'
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
  data() {
    return {
      templateInput: this.channelNumber || '',
      placeholders: []
    }
  },
  watch: {
    channelNumber(newVal) {
      this.templateInput = newVal || ''
      this.handleTemplateInput()
    }
  },
  methods: {
    handleTemplateInput() {
      this.parseTemplate()
      this.generateChannelNumber()
      this.emitChange()
    },
    parseTemplate() {
      this.placeholders = []
      const matches = this.templateInput.match(/\{\}/g)
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          this.placeholders.push({
            index: i,
            selectedParam: ''
          })
        }
      }
    },
    generateChannelNumber() {
      let result = this.templateInput
      let placeholderIndex = 0
      
      result = result.replace(/\{\}/g, () => {
        const placeholder = this.placeholders[placeholderIndex]
        placeholderIndex++
        if (placeholder && placeholder.selectedParam) {
          return `{${placeholder.selectedParam}}`
        }
        return '{}'
      })
      
      this.templateInput = result
      this.parseTemplate()
      this.emitChange()
    },
    emitChange() {
      this.$emit('update:channelNumber', this.name, this.templateInput)
    },
    saveConfig() {
      this.$emit('save-config')
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

.channel-setting-content {
  padding: 8px 0;
}

.input-section {
  margin-bottom: 24px;
}

.hint-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
  margin-top: 8px;
  padding-left: 100px;
}

.hint-icon {
  font-size: 14px;
  color: #409eff;
}

.placeholders-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 16px;
}

.placeholder-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.placeholder-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.save-param-btn {
  margin-left: auto;
}

.placeholder-label {
  font-size: 13px;
  color: #606266;
  min-width: 60px;
  font-weight: 500;
}

.placeholder-item :deep(.el-select) {
  flex: 1;
  max-width: 400px;
}

.result-section {
  padding: 20px;
  background: #ecf5ff;
  border-radius: 8px;
  border: 1px solid #b3d8ff;
}

.result-display {
  margin-top: 12px;
}

.result-input :deep(.el-input__inner) {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  color: #409eff;
}
</style>
