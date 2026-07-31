<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <save-config-button @save="saveConfig"></save-config-button>
      </div>
    </template>

    <el-form :model="localChangeParam" label-width="120px">
      <el-form-item label="可变参数：">
        <el-select 
          v-if="Array.isArray(localChangeParam.params)"
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
            :value="option.code_id">
            <span style="float: left">{{ option.desc }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ option.code_id }}</span> 
          </el-option>
            <template #tag>
              <el-tag 
              v-for="param in localChangeParam.params" 
              :key="param" 
              closable
              @close="removeParam(param)"
              :color="getTagColor(param)"
              >{{ param }}</el-tag>
            </template>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { Tools } from '@element-plus/icons-vue'
import SaveConfigButton from '@/components/ConfigVue/MenuChile/MeterConfigChild/Common/SaveConfigButton.vue'

export default {
  name: 'MeterConfigChangeParamSetting',
  components: {
    Tools,
    SaveConfigButton
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
    removeParam(param) {
      this.localChangeParam.params = this.localChangeParam.params.filter(item => item !== param)
      this.updateChangeParam()
    },
    getTagColor(param) {
      if(this.paramOptions.length === 0)  return '#ffdccc'
      if(this.paramOptions.some(option => option.code_id === param))  return '#e6f9ff'
      return '#ffdccc'
    },
    syncLocalData() {
      this.localChangeParam = JSON.parse(JSON.stringify(this.changeParam))
    },
    updateChangeParam() {
      this.$emit('update:changeParam', JSON.parse(JSON.stringify(this.localChangeParam)))
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