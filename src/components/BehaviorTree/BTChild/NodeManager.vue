<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>节点管理<span class="tips-text">(基础分组+自定义分组)</span></span>
        <div class="param-btn">
          <el-button type="primary" size="large" @click="addResultGroup" class="add-param-btn">
            <el-icon><plus /></el-icon>
            添加分组
          </el-button>
        </div>
      </div>
    </template>

    <!--
        分组卡片展示
    -->
    
  </el-card>
</template>

<script>
import { Tools, Plus } from '@element-plus/icons-vue'
import { getAllBehavior } from '@/api/behavior/behavior'

export default {
  name: 'MeterConfigResultSetting',
  components: {
    Tools,
    Plus
  },
  setup() {
    return {
      Plus
    }
  },
  data() {
    return {
      behaviorGroupList: [
        {   
            id:2562,
            group_name:'计量基础',
            group_desc:'计量基础行为',
            behaviorList:[
                {
                    args: [
                        {
                            name: "time_cd",
                            type: "int"
                        }
                    ],
                    desc: "设置下发计划",
                    func: "set_child_step_init_plan_tag",
                    group_id: 2562,
                    id: 3074,
                    module: "measure_behavior_base",
                    name: "设置下发计划",
                    sort: 0
                }
            ]
        }
      ]
    }
  },
  mounted() {
    this.initData()
  },
  
  methods: {
    initData(){
        getAllBehavior().then(res => {
            console.log(res)
            if (res.code === 200) {
                this.behaviorGroupList = res.data
            } else {
                this.$message.error(res.msg || '获取失败')
            }
        })
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

.param-btn {
  margin-left: auto;
  display: flex;
  gap: 10px;
}
</style>