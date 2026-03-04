<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <save-config-button @save="saveConfig"></save-config-button>
      </div>
    </template>

    <el-form :model="localExtendConfig" label-width="180px">
      <el-form-item label="获取计量结果绑定采集点：">
        <el-select v-model="localExtendConfig.meterResultBind" @change="updateExtendConfig" placeholder="请选择模块功能" class="form-select">
          <el-option 
            v-for="option in modulesChoose" 
            :key="option.value" 
            :label="option.label" 
            :value="option.value" 
          />
        </el-select>
      </el-form-item>
      <el-form-item label="过滤实时数据：">
        <el-select v-model="localExtendConfig.filterRealTime" @change="updateExtendConfig" placeholder="请选择模块功能" class="form-select">
          <el-option 
            v-for="option in modulesChoose" 
            :key="option.value" 
            :label="option.label" 
            :value="option.value" 
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { Tools } from '@element-plus/icons-vue'
import SaveConfigButton from '@/components/ConfigVue/MenuChile/MeterConfigChild/Common/SaveConfigButton'

export default {
  name: 'MeterConfigExtendConfigSetting',
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
    extendConfig: {
      type: Object,
      required: true
    },
    modulesChoose: {
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
      localExtendConfig: {
        meterResultBind: '',
        filterRealTime: ''
      }
    }
  },
  mounted() {
    this.syncLocalData()
  },
  watch: {
    extendConfig: {
      handler() {
        this.syncLocalData()
      },
      deep: true
    }
  },
  methods: {
    syncLocalData() {
      this.localExtendConfig = JSON.parse(JSON.stringify(this.extendConfig))
    },
    updateExtendConfig() {
      this.$emit('update:extendConfig', JSON.parse(JSON.stringify(this.localExtendConfig)))
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
  width: 400px;
  min-width: 200px;
}

/* 确保在小屏幕上也能正常显示 */
@media (max-width: 768px) {
  .form-select {
    width: 100%;
  }
}
</style>