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

    <el-form :model="localResultCheck" label-width="120px">
      <el-form-item label="判断关系：">
        <el-radio-group v-model="localResultCheck.relation" @change="updateResultCheck">
          <el-radio label="and">且</el-radio>
          <el-radio label="or">或</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-button type="primary" size="small" @click="addCheck" class="add-param-btn">
          <el-icon><plus /></el-icon>
          新增判断
        </el-button>
        <p> &nbsp; </p>
      <div v-for="(check, checkIndex) in localResultCheck.checks" :key="checkIndex" class="check-card">
        <el-card class="inner-card" shadow="hover">
          <template #header>
            <div class="check-header">
              <span class="check-title">判断条件 {{ checkIndex + 1 }}</span>
              <el-button type="danger" size="small" circle @click="removeCheck(checkIndex)">
                <el-icon><delete /></el-icon>
              </el-button>
            </div>
          </template>
          
          <el-form :model="check" label-width="100px">
            <el-form-item label="参数：">
              <el-select v-model="check.param" @change="updateResultCheck" placeholder="请选择参数" class="form-select">
                <el-option 
                  v-for="option in paramOptions" 
                  :key="option.value" 
                  :label="option.label" 
                  :value="option.value" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="表达式：">
              <el-input 
                v-model="check.expression" 
                @input="updateResultCheck" 
                placeholder="请输入表达式" 
                class="form-input"
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import { Tools, Plus, Delete, Check } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigCheckResultSetting',
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
    resultCheck: {
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
      Plus,
      Delete
    }
  },
  data() {
    return {
      localResultCheck: {
        checks: []
      }
    }
  },
  mounted() {
    this.syncLocalData()
  },
  watch: {
    resultCheck: {
      handler() {
        this.syncLocalData()
      },
      deep: true
    }
  },
  methods: {
    syncLocalData() {
      this.localResultCheck = JSON.parse(JSON.stringify(this.resultCheck))
    },
    updateResultCheck() {
      this.$emit('update:resultCheck', JSON.parse(JSON.stringify(this.localResultCheck)))
    },
    addCheck() {
      this.localResultCheck.checks.push({ param: '', expression: '' })
      this.updateResultCheck()
    },
    removeCheck(index) {
      this.localResultCheck.checks.splice(index, 1)
      this.updateResultCheck()
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

.add-param-btn {
  margin-left: auto;
}

.save-param-btn {
  margin-left: auto;
}

.check-card {
  margin-bottom: 16px;
}

.inner-card {
  border-radius: 8px;
}

.check-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.check-title {
  margin-left: 8px;
}

.form-select {
  width: 300px;
}

.form-input {
  width: 80%;
  min-width: 300px;
}

.el-form :deep(.el-form-item) {
  margin-bottom: 16px;
}
</style>