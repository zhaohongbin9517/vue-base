<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <save-config-button @save="saveConfig"></save-config-button>
      </div>
    </template>

    <div class="device-check-content">
      <el-button type="primary" size="small" @click="addRule" class="add-rule-btn">
        <el-icon><plus /></el-icon>
        新增规则
      </el-button>
      <p>&nbsp;</p>

      <div v-for="(row, index) in localRows" :key="index" class="rule-card">
        <el-card class="inner-card" shadow="hover">
          <template #header>
            <div class="rule-header">
              <span class="rule-title">规则 {{ index + 1 }}</span>
              <el-button type="danger" size="small" circle @click="removeRule(index)">
                <el-icon><delete /></el-icon>
              </el-button>
            </div>
          </template>

          <el-form label-width="120px">
            <el-form-item label="站：">
              <el-select
                v-model="row.station_id"
                @change="updateDeviceCheck"
                placeholder="请选择站"
                filterable
                class="form-select"
              >
                <el-option
                  v-for="item in stationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="检查表达式：">
              <el-input
                v-model="row.check"
                @input="handleCheckInput(row)"
                placeholder="请输入检查表达式，使用{}表示自定义参数，例如：{} >= 0 andalso {} =< 10"
              />
            </el-form-item>
          </el-form>
          <p class="hint-text">
            <el-icon class="hint-icon"><info-filled /></el-icon>
            使用{}表示自定义参数位置，选择参数后会替换为{参数名}，例如：{end_flag} >= 0 andalso {end_flag} =< 10
          </p>

          <div v-if="row.placeholders && row.placeholders.length > 0" class="placeholders-section">
            <h4 class="section-title">参数选择</h4>
            <div class="placeholder-items">
              <div
                v-for="(placeholder, pIndex) in row.placeholders"
                :key="pIndex"
                class="placeholder-item"
              >
                <span class="placeholder-label">参数 {{ pIndex + 1 }}：</span>
                <el-select
                  v-model="placeholder.selectedParam"
                  placeholder="请选择参数"
                  filterable
                  @change="generateExpression(row)"
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
        </el-card>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Tools, Plus, Delete, InfoFilled } from '@element-plus/icons-vue'
import SaveConfigButton from '@/components/ConfigVue/MenuChile/MeterConfigChild/Common/SaveConfigButton.vue'

export default {
  name: 'MeterConfigDeviceCheckSetting',
  components: {
    Tools,
    Plus,
    Delete,
    InfoFilled,
    SaveConfigButton
  },
  props: {
    title: {
      type: String,
      default: '设备检查'
    },
    tips: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    deviceCheck: {
      type: Array,
      default: () => []
    },
    stationOptions: {
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
      localRows: []
    }
  },
  mounted() {
    this.syncLocalData()
  },
  watch: {
    deviceCheck: {
      handler() {
        this.syncLocalData()
      },
      deep: true
    }
  },
  methods: {
    syncLocalData() {
      this.localRows = (this.deviceCheck || []).map(item => ({
        station_id: item.station_id || '',
        check: item.check || '',
        placeholders: []
      }))
      this.localRows.forEach(row => this.parseTemplate(row))
    },
    handleCheckInput(row) {
      this.parseTemplate(row)
      this.updateDeviceCheck()
    },
    parseTemplate(row) {
      const matches = (row.check || '').match(/\{\}/g)
      row.placeholders = []
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          row.placeholders.push({ index: i, selectedParam: '' })
        }
      }
    },
    generateExpression(row) {
      let result = row.check || ''
      let placeholderIndex = 0
      result = result.replace(/\{\}/g, () => {
        const placeholder = row.placeholders[placeholderIndex]
        placeholderIndex++
        if (placeholder && placeholder.selectedParam) {
          return `{${placeholder.selectedParam}}`
        }
        return '{}'
      })
      row.check = result
      this.parseTemplate(row)
      this.updateDeviceCheck()
    },
    updateDeviceCheck() {
      const payload = this.localRows.map(item => ({
        station_id: item.station_id,
        check: item.check
      }))
      this.$emit('update:deviceCheck', JSON.parse(JSON.stringify(payload)))
    },
    addRule() {
      this.localRows.push({ station_id: '', check: '', placeholders: [] })
      this.updateDeviceCheck()
    },
    removeRule(index) {
      this.localRows.splice(index, 1)
      this.updateDeviceCheck()
    },
    saveConfig() {
      this.$emit('save-config', this.name)
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

.add-rule-btn {
  margin-left: auto;
}

.rule-card {
  margin-bottom: 16px;
}

.inner-card {
  border-radius: 8px;
}

.rule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.rule-title {
  margin-left: 8px;
}

.form-select {
  width: 300px;
}

.hint-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
  margin-top: 8px;
  padding-left: 120px;
}

.hint-icon {
  font-size: 14px;
  color: #409eff;
}

.placeholders-section {
  margin-top: 16px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 12px;
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

.placeholder-label {
  font-size: 13px;
  color: #606266;
  min-width: 70px;
  font-weight: 500;
}

.placeholder-item :deep(.el-select) {
  flex: 1;
  max-width: 400px;
}
</style>
