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

    <el-form :model="localChangeParam" label-width="120px">
      <el-form-item label="可变参数：">
        <el-select 
          v-model="localChangeParam.params" 
          @change="updateChangeParam" 
          multiple 
          filterable
          placeholder="请选择可修改参数" 
          class="form-select"
        >
          <el-option 
            v-for="option in paramOptions" 
            :key="option.code_id" 
            :label="option.desc" 
            :value="option.code_id" 
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { Tools, Check } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigChangeParamSetting',
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
    changeParam: {
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
      localChangeParam: {
        params: []
      }
    }
  },
  mounted() {
    this.syncLocalData()
  },
  watch: {
    changeParam: {
      handler() {
        this.syncLocalData()
      },
      deep: true
    }
  },
  methods: {
    syncLocalData() {
      this.localChangeParam = JSON.parse(JSON.stringify(this.changeParam))
    },
    updateChangeParam() {
      this.$emit('update:changeParam', JSON.parse(JSON.stringify(this.localChangeParam)))
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

.save-param-btn {
  margin-left: auto;
}

.form-select {
  width: 90%;
  margin-bottom: 12px;
}

.param-display {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.param-label {
  font-weight: 600;
  color: #606266;
  margin-right: 8px;
}

.param-value {
  color: #303133;
}
</style>