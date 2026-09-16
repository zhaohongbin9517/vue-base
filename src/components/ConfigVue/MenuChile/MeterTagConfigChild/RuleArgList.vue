<template>
  <div class="rule-arg-list">
    <div v-for="(arg, idx) in args" :key="idx" class="arg-row">
      <div class="arg-row-main">
        <!-- 参数类型选择 -->
        <el-select
          v-model="arg.type"
          placeholder="参数类型"
          size="small"
          class="arg-type-select"
          @change="onArgTypeChange(arg)"
        >
          <el-option
            v-for="t in ruleData.args_type || []"
            :key="t.type"
            :label="t.name || t.type"
            :value="t.type"
          />
        </el-select>

        <!-- code_id: 下拉选择当前站的 code_id -->
        <el-select
          v-if="arg.type === 'code_id'"
          v-model="arg.value"
          placeholder="选择 code_id"
          size="small"
          filterable
          clearable
          class="arg-value-input"
        >
          <el-option v-for="cid in codeIdOptions" :key="cid" :label="cid" :value="cid" />
        </el-select>

        <!-- number: 数字输入 -->
        <el-input-number
          v-else-if="arg.type === 'number'"
          v-model="arg.value"
          placeholder="输入数字"
          size="small"
          :controls="false"
          class="arg-value-input"
        />

        <!-- string: 文本输入 -->
        <el-input
          v-else-if="arg.type === 'string'"
          v-model="arg.value"
          placeholder="输入字符串"
          size="small"
          class="arg-value-input"
        />

        <!-- arithmetic_operator: 下拉选择运算符 -->
        <el-select
          v-else-if="arg.type === 'arithmetic_operator'"
          v-model="arg.value"
          placeholder="选择运算符"
          size="small"
          class="arg-value-input"
        >
          <el-option v-for="op in getArgTypeValues('arithmetic_operator')" :key="op" :label="op" :value="op" />
        </el-select>

        <!-- logic_operator: 下拉选择逻辑运算符 -->
        <el-select
          v-else-if="arg.type === 'logic_operator'"
          v-model="arg.value"
          placeholder="选择逻辑运算符"
          size="small"
          class="arg-value-input"
        >
          <el-option v-for="op in getArgTypeValues('logic_operator')" :key="op" :label="op" :value="op" />
        </el-select>

        <!-- 删除参数行（ifelse 和 function 的删除按钮在下方） -->
        <el-button
          v-if="arg.type !== 'ifelse' && arg.type !== 'function'"
          type="danger"
          size="small"
          circle
          :icon="Delete"
          @click="args.splice(idx, 1)"
        />
      </div>

      <!-- ifelse: 递归展开条件/真值/假值 -->
      <div v-if="arg.type === 'ifelse'" class="nested-container">
        <div class="nested-block">
          <div class="nested-header">
            <span class="nested-label">条件：</span>
            <el-button size="small" :icon="Plus" @click="arg.value.condition.push({type: 'code_id', value: ''})">添加</el-button>
          </div>
          <RuleArgList
            :args="arg.value.condition"
            :ruleData="ruleData"
            :codeIdOptions="codeIdOptions"
          />
        </div>
        <div class="nested-block">
          <div class="nested-header">
            <span class="nested-label">真值：</span>
            <el-button size="small" :icon="Plus" @click="arg.value.true_value.push({type: 'number', value: 0})">添加</el-button>
          </div>
          <RuleArgList
            :args="arg.value.true_value"
            :ruleData="ruleData"
            :codeIdOptions="codeIdOptions"
          />
        </div>
        <div class="nested-block">
          <div class="nested-header">
            <span class="nested-label">假值：</span>
            <el-button size="small" :icon="Plus" @click="arg.value.false_value.push({type: 'number', value: 0})">添加</el-button>
          </div>
          <RuleArgList
            :args="arg.value.false_value"
            :ruleData="ruleData"
            :codeIdOptions="codeIdOptions"
          />
        </div>
        <el-button type="danger" size="small" :icon="Delete" @click="args.splice(idx, 1)" class="nested-delete">删除此条件</el-button>
      </div>

      <!-- function: 递归展开函数选择 + 参数列表 -->
      <div v-else-if="arg.type === 'function'" class="nested-container">
        <div class="nested-block">
          <div class="nested-header">
            <span class="nested-label">调用函数：</span>
            <el-select
              v-model="arg.value.function"
              placeholder="选择函数"
              size="small"
              class="nested-function-select"
            >
              <el-option
                v-for="fn in ruleData.function || []"
                :key="fn.name"
                :label="fn.name"
                :value="fn.name"
              />
            </el-select>
          </div>
        </div>
        <div class="nested-block">
          <div class="nested-header">
            <span class="nested-label">参数：</span>
            <el-button size="small" :icon="Plus" @click="arg.value.args.push({type: 'code_id', value: ''})">添加</el-button>
          </div>
          <RuleArgList
            :args="arg.value.args"
            :ruleData="ruleData"
            :codeIdOptions="codeIdOptions"
          />
        </div>
        <el-button type="danger" size="small" :icon="Delete" @click="args.splice(idx, 1)" class="nested-delete">删除此函数</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Plus, Delete } from '@element-plus/icons-vue'

export default {
  name: 'RuleArgList',
  components: { Plus, Delete },
  props: {
    args: { type: Array, default: () => [] },
    ruleData: { type: Object, default: () => ({ function: [], args_type: [] }) },
    codeIdOptions: { type: Array, default: () => [] }
  },
  methods: {
    getArgTypeValues(typeName) {
      const t = (this.ruleData.args_type || []).find(t => t.type === typeName)
      if (!t) return []
      return (t.value || []).map(v => String(v))
    },
    onArgTypeChange(arg) {
      if (arg.type === 'ifelse') {
        arg.value = { condition: [], true_value: [], false_value: [] }
      } else if (arg.type === 'function') {
        arg.value = { function: '', args: [] }
      } else if (arg.type === 'number') {
        arg.value = 0
      } else if (arg.type === 'string') {
        arg.value = ''
      } else {
        arg.value = ''
      }
    }
  }
}
</script>

<style scoped>
.arg-row {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
}
.arg-row-main {
  display: flex;
  align-items: center;
  gap: 8px;
}
.arg-type-select {
  width: 160px;
  flex-shrink: 0;
}
.arg-value-input {
  flex: 1;
}
.nested-container {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nested-block {
  background: #fafafa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  padding: 8px;
}
.nested-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.nested-label {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}
.nested-function-select {
  width: 200px;
}
.nested-delete {
  align-self: flex-end;
}
</style>
