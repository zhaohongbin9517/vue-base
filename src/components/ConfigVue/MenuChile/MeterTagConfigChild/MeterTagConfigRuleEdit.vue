<template>
  <el-dialog
    v-model="dialogVisible"
    :title="'编辑 Rule'"
    width="800px"
    @close="handleClose"
  >
    <div class="rule-edit-content">
      <!-- 高级/可视化模式切换 -->
      <div class="mode-switch">
        <el-radio-group v-model="editMode" size="small">
          <el-radio-button label="visual">可视化编辑</el-radio-button>
          <el-radio-button label="advanced">高级模式（JSON）</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 可视化编辑模式 -->
      <div v-if="editMode === 'visual'" class="visual-edit">
        <!-- 函数选择 -->
        <div class="form-section">
          <label class="section-label">选择函数：</label>
          <el-select
            v-model="ruleConfig.function"
            placeholder="请选择函数"
            size="default"
            class="function-select"
          >
            <el-option
              v-for="fn in ruleData.function || []"
              :key="fn.name"
              :label="fn.name"
              :value="fn.name"
            >
              <span>{{ fn.name }}</span>
              <span class="option-desc">{{ fn.desc }}</span>
            </el-option>
          </el-select>
        </div>

        <!-- 函数描述 -->
        <div v-if="currentFunctionDesc" class="function-desc">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ currentFunctionDesc }}</span>
        </div>

        <!-- 参数列表 -->
        <div class="form-section">
          <div class="section-header">
            <label class="section-label">参数列表：</label>
            <el-button type="primary" size="small" :icon="Plus" @click="addArg">添加参数</el-button>
          </div>
          <RuleArgList
            :args="ruleConfig.args"
            :ruleData="ruleData"
            :codeIdOptions="codeIdOptions"
          />
        </div>

        <!-- JSON 预览 -->
        <div class="preview-section">
          <label class="section-label">预览：</label>
          <pre class="json-preview">{{ previewJson }}</pre>
        </div>
      </div>

      <!-- 高级模式：直接编辑 JSON -->
      <div v-else class="advanced-edit">
        <el-input
          v-model="ruleContent"
          type="textarea"
          :rows="14"
          placeholder='请输入 JSON 格式的 rule，例如：{"function":"operations","args":[{"type":"code_id","value":"end_flag"}]}'
          class="rule-textarea"
        />
        <p class="hint-text">
          <el-icon><InfoFilled /></el-icon>
          直接编辑 JSON 格式的规则表达式，保存时会原样存入 rule 列。
        </p>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { InfoFilled, Plus } from '@element-plus/icons-vue'
import RuleArgList from './RuleArgList.vue'

export default {
  name: 'MeterTagConfigRuleEdit',
  components: { InfoFilled, Plus, RuleArgList },
  props: {
    visible: { type: Boolean, default: false },
    rule: { type: String, default: '' },
    ruleData: { type: Object, default: () => ({ function: [], args_type: [] }) },
    codeIdOptions: { type: Array, default: () => [] }
  },
  emits: ['update:visible', 'save'],
  data() {
    return {
      editMode: 'visual',
      ruleContent: '',
      ruleConfig: {
        function: '',
        args: []
      }
    }
  },
  computed: {
    dialogVisible: {
      get() { return this.visible },
      set(val) { this.$emit('update:visible', val) }
    },
    currentFunctionDesc() {
      const fn = (this.ruleData.function || []).find(f => f.name === this.ruleConfig.function)
      return fn ? fn.desc : ''
    },
    previewJson() {
      try {
        return JSON.stringify(this.ruleConfig, null, 2)
      } catch {
        return '{}'
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.parseRule(this.rule || '')
      }
    }
  },
  methods: {
    parseRule(ruleStr) {
      try {
        const parsed = JSON.parse(ruleStr)
        if (parsed && parsed.function) {
          this.ruleConfig = {
            function: parsed.function,
            args: (parsed.args || []).map(a => this.normalizeArg(a))
          }
          this.editMode = 'visual'
          this.ruleContent = ruleStr
          return
        }
      } catch {
        // 非 JSON，切到高级模式
      }
      this.editMode = 'advanced'
      this.ruleContent = ruleStr
      this.ruleConfig = { function: '', args: [] }
    },
    normalizeArg(arg) {
      const type = arg.type || ''
      const value = arg.value
      if (type === 'ifelse') {
        return {
          type: 'ifelse',
          value: {
            condition: Array.isArray(value?.condition) ? value.condition.map(a => this.normalizeArg(a)) : [],
            true_value: Array.isArray(value?.true_value) ? value.true_value.map(a => this.normalizeArg(a)) : [],
            false_value: Array.isArray(value?.false_value) ? value.false_value.map(a => this.normalizeArg(a)) : []
          }
        }
      }
      if (type === 'function') {
        return {
          type: 'function',
          value: {
            function: value?.function || '',
            args: Array.isArray(value?.args) ? value.args.map(a => this.normalizeArg(a)) : []
          }
        }
      }
      return { type, value }
    },
    addArg() {
      this.ruleConfig.args.push({ type: 'code_id', value: '' })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSave() {
      let result
      if (this.editMode === 'visual') {
        if (!this.ruleConfig.function) {
          this.$message.warning('请选择函数')
          return
        }
        result = JSON.stringify(this.ruleConfig)
      } else {
        result = this.ruleContent
      }
      this.$emit('save', result)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.rule-edit-content {
  padding: 0 4px;
}
.mode-switch {
  margin-bottom: 16px;
}
.visual-edit {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-label {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}
.function-select {
  width: 100%;
}
.function-desc {
  background: #f0f9ff;
  border: 1px solid #d0e8ff;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 13px;
  color: #409eff;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}
.option-desc {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
}
.preview-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.json-preview {
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 12px;
  font-size: 12px;
  font-family: monospace;
  color: #303133;
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
.advanced-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rule-textarea {
  width: 100%;
}
.hint-text {
  margin-top: 12px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
