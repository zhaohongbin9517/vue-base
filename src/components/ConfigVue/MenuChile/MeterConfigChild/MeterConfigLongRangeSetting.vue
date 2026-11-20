<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <save-config-button @save="saveConfig"></save-config-button>
      </div>
    </template>
    

    <!-- 修改就地远程 -->
    <div class="config-section">
      <h4 class="section-title">
        <el-icon class="title-icon"><edit /></el-icon>
        展示就地远程：
      </h4>
      <div class="section-content">
        <el-form label-width="160px">
          <el-form-item label="是否启用展示配置：">
            <el-switch 
              v-model="localConfig.show.enable" 
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="绑定的点：">
            <el-select 
              v-model="localConfig.show.code_id" 
              placeholder="请选择参数" 
              filterable
              clearable
              @change="handleChange"
            >
              <el-option 
                v-for="option in paramOptions" 
                :key="option.code_id" 
                :label="option.desc" 
                :value="option.code_id" 
              />
            </el-select>
          </el-form-item>
           <el-form-item label="远程值：">
              <el-input-number 
                v-model="localConfig.show.values.long_range" 
                placeholder="请输入远程值" 
                :min="0"
                controls-position="right"
                @change="handleChange"
              />
            </el-form-item>
            <el-form-item label="就地值：">
              <el-input-number 
                v-model="localConfig.show.values.locally" 
                placeholder="请输入就地值" 
                :min="0"
                controls-position="right"
                @change="handleChange"
              />
            </el-form-item>
        </el-form>
      </div>
    </div>
    

    <!-- 检查配置 -->
    <div class="config-section">
      <h4 class="section-title">
        <el-icon class="title-icon"><document /></el-icon>
        检查配置：
      </h4>
      <div class="section-content">
        <el-form label-width="160px">
          <el-form-item label="是否启用检查：">
            <el-switch 
              v-model="localConfig.check.enable" 
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="检查的点：">
            <el-select 
              v-model="localConfig.check.code_id" 
              placeholder="请选择参数" 
              filterable
              clearable
              @change="handleChange"
            >
              <el-option 
                v-for="option in paramOptions" 
                :key="option.code_id" 
                :label="option.desc" 
                :value="option.code_id" 
              />
            </el-select>
          </el-form-item>
          <el-form-item label="检查的值：">
            <el-input-number 
              v-model="localConfig.check.value" 
              placeholder="请输入值" 
              :min="0"
              controls-position="right"
              @change="handleChange"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 修改就地远程 -->
    <div class="config-section">
      <h4 class="section-title">
        <el-icon class="title-icon"><edit /></el-icon>
        修改就地远程：
      </h4>
      <div class="section-content">
        <el-form label-width="160px">
          <el-form-item label="是否启用修改：">
            <el-switch 
              v-model="localConfig.set.enable" 
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="是否需要判断：">
            <el-switch 
              v-model="localConfig.set.isCheck" 
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="修改的点：">
            <el-select 
              v-model="localConfig.set.code_id" 
              placeholder="请选择参数" 
              filterable
              clearable
              @change="handleChange"
            >
              <el-option 
                v-for="option in paramOptions" 
                :key="option.code_id" 
                :label="option.desc" 
                :value="option.code_id" 
              />
            </el-select>
          </el-form-item>
           <el-form-item label="远程值：">
              <el-input-number 
                v-model="localConfig.set.values.long_range" 
                placeholder="请输入远程值" 
                :min="0"
                controls-position="right"
                @change="handleChange"
              />
            </el-form-item>
            <el-form-item label="就地值：">
              <el-input-number 
                v-model="localConfig.set.values.locally" 
                placeholder="请输入就地值" 
                :min="0"
                controls-position="right"
                @change="handleChange"
              />
            </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Tools, Document, Edit } from '@element-plus/icons-vue'
import SaveConfigButton from '@/components/ConfigVue/MenuChile/MeterConfigChild/Common/SaveConfigButton.vue'

// 就地远程默认结构，与父组件 MeterConfig.vue 的 longRangeConfig 保持一致
const defaultLongRangeConfig = () => ({
  show: {
    enable: false,
    code_id: '',
    values: {
      long_range: 1,
      locally: 0
    }
  },
  set: {
    enable: false,
    isCheck: false,
    code_id: '',
    values: {
      long_range: 1,
      locally: 0
    }
  },
  check: {
    enable: false,
    code_id: '',
    value: 0
  }
})

// 兼容历史配置缺少 show/check/values 的情况，避免页面渲染报错
const mergeLongRangeConfig = (config) => {
  const base = defaultLongRangeConfig()
  const src = config || {}
  const show = src.show || {}
  const set = src.set || {}
  return {
    ...base,
    ...src,
    show: { ...base.show, ...show, values: { ...base.show.values, ...(show.values || {}) } },
    set: { ...base.set, ...set, values: { ...base.set.values, ...(set.values || {}) } },
    check: { ...base.check, ...(src.check || {}) }
  }
}

export default {
  name: 'MeterConfigLongRangeSetting',
  components: {
    Tools,
    Document,
    Edit,
    SaveConfigButton
  },
  props: {
    config: {
      type: Object,
      default: defaultLongRangeConfig
    },
    title: {
      type: String,
      default: '就地远程配置'
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
      localConfig: mergeLongRangeConfig(this.config)
    }
  },
  mounted() {
    this.localConfig = mergeLongRangeConfig(this.config)
  },
  watch: {
    config: {
      handler(newVal) {
         // 父组件配置更新时，同步更新本地配置
        this.localConfig = mergeLongRangeConfig(newVal)
      },
      deep: true
    }
  },
  methods: {
    handleChange() {
      this.$emit('update-long-range',this.name, this.localConfig)
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

.config-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #fbfbff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.config-section:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 16px;
}

.title-icon {
  font-size: 16px;
  color: #409eff;
}

.section-content :deep(.el-form-item) {
  margin-bottom: 16px;
}
.section-content :deep(.el-form-item__label) {
  width: 220px;
}


.section-content :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.section-content :deep(.el-form-label) {
  font-weight: 500;
  color: #495057;
}

.config-section :deep(.el-select),
.config-section :deep(.el-input-number) {
  width: 50%;
}
</style>