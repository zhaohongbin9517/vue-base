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
      <!-- 检查规则定义 -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">检查规则</span>
          <el-button type="primary" size="small" @click="addRule" class="add-btn">
            <el-icon><plus /></el-icon>
            新增规则
          </el-button>
        </div>
        <p class="section-desc">定义可复用的检查表达式，站通过规则ID引用；id 为 default 的为默认规则</p>

        <div v-for="(rule, ri) in localRuleEnum" :key="ri" class="rule-card">
          <el-card class="inner-card" shadow="hover">
            <template #header>
              <div class="rule-header">
                <span class="rule-title">规则 {{ rule.id }}</span>
                <el-tag v-if="rule.id === 'default'" size="small" type="info" class="default-tag">默认</el-tag>
                <el-button v-if="rule.id !== 'default'" type="danger" size="small" circle @click="removeRule(ri)">
                  <el-icon><delete /></el-icon>
                </el-button>
              </div>
            </template>

            <el-form label-width="120px">
              <el-form-item label="检查表达式：">
                <el-input
                  v-model="rule.check"
                  @input="handleCheckInput(rule)"
                  placeholder="请输入检查表达式，使用{}表示自定义参数，例如：{} > 1"
                />
              </el-form-item>
            </el-form>
            <p class="hint-text">
              <el-icon class="hint-icon"><info-filled /></el-icon>
              使用{}表示自定义参数位置，选择参数后会替换为{参数名}，例如：{end_flag} >= 0 andalso {end_flag} =< 10
            </p>

            <div v-if="rule.placeholders && rule.placeholders.length > 0" class="placeholders-section">
              <h4 class="placeholders-title">参数选择</h4>
              <div class="placeholder-items">
                <div
                  v-for="(placeholder, pIndex) in rule.placeholders"
                  :key="pIndex"
                  class="placeholder-item"
                >
                  <span class="placeholder-label">参数 {{ pIndex + 1 }}：</span>
                  <el-select
                    v-model="placeholder.selectedParam"
                    placeholder="请选择参数"
                    filterable
                    @change="generateExpression(rule)"
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

      <!-- 站规则绑定 -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">站规则绑定</span>
          <el-button type="primary" size="small" @click="addStation" class="add-btn">
            <el-icon><plus /></el-icon>
            新增绑定
          </el-button>
        </div>
        <p class="section-desc">为每个站选择一条检查规则</p>

        <el-table :data="localStationChoose" border class="station-table" empty-text="暂无绑定">
          <el-table-column label="站id" min-width="220">
            <template #default="{ row }">
              <el-select
                v-model="row.station_id"
                @change="onStationChange(row)"
                placeholder="请选择站"
                filterable
                class="table-select"
              >
                <el-option
                  v-for="item in stationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="isStationUsed(item.value, row)"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="规则id" min-width="280">
            <template #default="{ row }">
              <el-select
                v-model="row.rule_id"
                @change="updateDeviceCheck"
                placeholder="请选择规则"
                filterable
                class="table-select"
              >
                <el-option
                  v-for="r in localRuleEnum"
                  :key="r.id"
                  :label="ruleLabel(r)"
                  :value="r.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ $index }">
              <el-button type="danger" size="small" circle @click="removeStation($index)">
                <el-icon><delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
      type: Object,
      default: () => ({})
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
      localRuleEnum: [],
      localStationChoose: [],
      nextRuleId: 1
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
    ruleLabel(r) {
      return r.check ? `规则${r.id}：${r.check}` : `规则${r.id}`
    },
    isStationUsed(stationId, currentRow) {
      return this.localStationChoose.some(s => s.station_id === stationId && s !== currentRow)
    },
    onStationChange(row) {
      // 去重检查：单个站只能配置一个规则
      if (row.station_id !== '') {
        const dup = this.localStationChoose.filter(s => s.station_id === row.station_id)
        if (dup.length > 1) {
          this.$message.warning(`站 ${row.station_id} 已配置规则，不能重复绑定`)
          row.station_id = ''
        }
      }
      this.updateDeviceCheck()
    },
    syncLocalData() {
      const dc = this.deviceCheck || {}
      let rules = (dc.rule_enum || []).map(item => ({
        id: item.id || '',
        check: item.check || '',
        placeholders: []
      }))
      // 确保默认规则存在（id=default，check 默认 true）
      if (!rules.some(r => r.id === 'default')) {
        rules.unshift({ id: 'default', check: 'true', placeholders: [] })
      }
      this.localRuleEnum = rules
      this.localStationChoose = (dc.station_choose || []).map(item => ({
        station_id: item.station_id || '',
        rule_id: item.rule_id || ''
      }))
      let maxId = 0
      this.localRuleEnum.forEach(r => {
        const n = parseInt(r.id, 10)
        if (!isNaN(n) && n > maxId) maxId = n
      })
      this.nextRuleId = maxId + 1
      this.localRuleEnum.forEach(r => this.parseTemplate(r))
    },
    handleCheckInput(rule) {
      this.parseTemplate(rule)
      this.updateDeviceCheck()
    },
    parseTemplate(rule) {
      const matches = (rule.check || '').match(/\{\}/g)
      rule.placeholders = []
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          rule.placeholders.push({ index: i, selectedParam: '' })
        }
      }
    },
    generateExpression(rule) {
      let result = rule.check || ''
      let placeholderIndex = 0
      result = result.replace(/\{\}/g, () => {
        const placeholder = rule.placeholders[placeholderIndex]
        placeholderIndex++
        if (placeholder && placeholder.selectedParam) {
          return `{${placeholder.selectedParam}}`
        }
        return '{}'
      })
      rule.check = result
      this.parseTemplate(rule)
      this.updateDeviceCheck()
    },
    updateDeviceCheck() {
      const payload = {
        rule_enum: this.localRuleEnum.map(r => ({ id: r.id, check: r.check })),
        station_choose: this.localStationChoose.map(s => ({ station_id: s.station_id, rule_id: s.rule_id }))
      }
      this.$emit('update:deviceCheck', JSON.parse(JSON.stringify(payload)))
    },
    addRule() {
      this.localRuleEnum.push({ id: String(this.nextRuleId++), check: '', placeholders: [] })
      this.updateDeviceCheck()
    },
    removeRule(index) {
      const removedId = this.localRuleEnum[index].id
      this.localRuleEnum.splice(index, 1)
      // 清理引用该规则的站绑定
      this.localStationChoose.forEach(s => {
        if (s.rule_id === removedId) s.rule_id = ''
      })
      this.updateDeviceCheck()
    },
    addStation() {
      this.localStationChoose.push({ station_id: '', rule_id: '' })
      this.updateDeviceCheck()
    },
    removeStation(index) {
      this.localStationChoose.splice(index, 1)
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

.device-check-content {
  padding: 8px 0;
}

.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.section-desc {
  font-size: 13px;
  color: #909399;
  margin: 0 0 16px 0;
}

.add-btn {
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
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.rule-title {
  margin-left: 0;
}

.default-tag {
  margin-left: 4px;
}

.station-table {
  width: 100%;
}

.table-select {
  width: 100%;
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

.placeholders-title {
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
