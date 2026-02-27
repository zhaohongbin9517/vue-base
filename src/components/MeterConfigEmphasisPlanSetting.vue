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

    <el-form :model="localEmphasisPlan" label-width="120px">
      <el-form-item label="计划：">
        <div class="form-row">
          <div class="form-col">
            <span class="form-col-label">设置：</span>
            <el-select v-model="localEmphasisPlan.plan.set" @change="updateEmphasisPlan" placeholder="请选择参数" class="form-select">
              <el-option 
                v-for="option in paramOptions" 
                :key="option.value" 
                :label="option.label" 
                :value="option.value" 
              />
            </el-select>
          </div>
          <div class="form-col">
            <span class="form-col-label">检查：</span>
            <el-select v-model="localEmphasisPlan.plan.check" @change="updateEmphasisPlan" placeholder="请选择参数" class="form-select">
              <el-option 
                v-for="option in paramOptions" 
                :key="option.value" 
                :label="option.label" 
                :value="option.value" 
              />
            </el-select>
          </div>
          <div class="form-col">
            <span class="form-col-label">值：</span>
            <el-input-number 
              v-model="localEmphasisPlan.plan.value" 
              @change="updateEmphasisPlan" 
              placeholder="请输入值" 
              :min="0" 
              controls-position="right"
              class="form-input-number"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="计划时间：">
        <div class="form-row">
          <div class="form-col">
            <span class="form-col-label">设置：</span>
            <el-select v-model="localEmphasisPlan.plan_time.set" @change="updateEmphasisPlan" placeholder="请选择参数" class="form-select">
              <el-option 
                v-for="option in paramOptions" 
                :key="option.value" 
                :label="option.label" 
                :value="option.value" 
              />
            </el-select>
          </div>
          <div class="form-col">
            <span class="form-col-label">检查：</span>
            <el-select v-model="localEmphasisPlan.plan_time.check" @change="updateEmphasisPlan" placeholder="请选择参数" class="form-select">
              <el-option 
                v-for="option in paramOptions" 
                :key="option.value" 
                :label="option.label" 
                :value="option.value" 
              />
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="计划排序：">
        <div class="form-row">
          <div class="form-col">
            <span class="form-col-label">设置：</span>
            <el-select v-model="localEmphasisPlan.plan_sort.set" @change="updateEmphasisPlan" placeholder="请选择参数" class="form-select">
              <el-option 
                v-for="option in paramOptions" 
                :key="option.value" 
                :label="option.label" 
                :value="option.value" 
              />
            </el-select>
          </div>
          <div class="form-col">
            <span class="form-col-label">检查：</span>
            <el-select v-model="localEmphasisPlan.plan_sort.check" @change="updateEmphasisPlan" placeholder="请选择参数" class="form-select">
              <el-option 
                v-for="option in paramOptions" 
                :key="option.value" 
                :label="option.label" 
                :value="option.value" 
              />
            </el-select>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { Tools, Check } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigEmphasisPlanSetting',
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
    emphasisPlan: {
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
      localEmphasisPlan: {
        plan: {set:'',check:'',value:0},
        plan_time: {set:'',check:''},
        plan_sort: {set:'',check:''}
      }
    }
  },
  mounted() {
    this.syncLocalData()
  },
  watch: {
    emphasisPlan: {
      handler() {
        this.syncLocalData()
      },
      deep: true
    }
  },
  methods: {
    syncLocalData() {
      this.localEmphasisPlan = JSON.parse(JSON.stringify(this.emphasisPlan))
    },
    updateEmphasisPlan() {
      this.$emit('update:emphasisPlan', JSON.parse(JSON.stringify(this.localEmphasisPlan)))
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

.form-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.form-col {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.form-col-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  width: 60px;
}

.form-select {
  /* width: calc(100% - 68px); */
  width: 200px;
  min-width: 120px;
}

.form-input-number {
  width: calc(100% - 68px);
  min-width: 120px;
}

/* 确保在小屏幕上也能正常显示 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-col {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .form-select,
  .form-input-number {
    width: calc(100% - 68px);
  }
}
</style>