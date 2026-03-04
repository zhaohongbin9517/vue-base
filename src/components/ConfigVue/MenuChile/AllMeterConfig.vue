<template>
  <div class="all-meter-config">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Setting /></el-icon>
        全部配置管理
      </h2>
      <p class="page-desc">管理所有配置信息</p>
    </div>

    <!-- 按钮区域 -->
    <div class="button-area">
      <el-button type="primary" @click="openAddConfigDialog" :icon="Plus">
        新增配置
      </el-button>
    </div>

    <!-- 配置预览表格 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>配置列表</span>
        </div>
      </template>

      <el-table :data="configList" border class="config-table" stripe>
        <el-table-column prop="config_id" label="配置ID" min-width="200" />
        <el-table-column prop="name" label="配置名称" min-width="200" />
        <el-table-column prop="meter_station_name" label="参数模板" min-width="150" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" size="small" circle @click="handleDelete(row.config_id)" :icon="Delete">
            </el-button>
            <el-button type="primary" size="small" circle @click="handleChange(row.config_id)" :icon="Edit">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增配置弹窗 -->
    <MeterConfigAddConfig
      v-model:visible="addConfigVisible"
      :stationOptions="stationOptions"
      :templateOptions="templateOptions"
      @save="handleAddConfigSave"
    />
  </div>
</template>

<script>
import { Delete, Plus, Setting, Document,Edit } from '@element-plus/icons-vue'
import MeterConfigAddConfig from './MeterConfigChild/MeterConfigAddConfig.vue'
import {getAllMeterConfig, getAllStationTagKey,updateMeterConfig,deleteMeterConfig} from '@/api/configUtils/config'
import {getAllObjectInfoMap} from '@/api/configUtils/cacheData'

export default {
  name: 'AllMeterConfig',
  components: {
    Setting,
    Document,
    MeterConfigAddConfig
  },
  setup() {
    return {
      Plus,
      Delete,
      Edit
    }
  },
  data() {
    return {
      addConfigVisible: false,
      configList: [],
      stationOptions: [],
      templateOptions: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 打开新增配置弹窗
    openAddConfigDialog() {
      this.addConfigVisible = true
    },

    // 处理新增配置保存
    async handleAddConfigSave(formData) {
      const templateId = formData.templateId || ''
      const data = {
          config_id: formData.configId,
          name: formData.configName,
          meter_station_id:formData.stationId
      }
      if(templateId !== ''){
        const selectedItem = this.configList.find(item => item.config_id === templateId)  
        data.config = structuredClone(selectedItem.config)
      } else {
        data.config = {}
      }
      try {
        await  updateMeterConfig(data)
        this.$message.success('配置新增成功')
      } catch (error) {
        console.error('新增配置失败:', error)
        this.$message.error('新增配置失败')
      }
      //关闭新增窗口
      this.addConfigVisible = false
      //重新加载信息
      this.fetchData()
    },

    // 处理删除配置
    async handleDelete(configId) {
      this.$confirm('确定要删除该配置吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
            await deleteMeterConfig(configId)
        } catch (error) {
          console.error('删除配置失败:', error)
          this.$message.error('删除配置失败')
          return
        }
        this.configList = this.configList.filter(config => config.config_id !== configId)
        // 显示成功消息
        this.$message.success('配置删除成功')
      }).catch(() => {
        // 取消删除操作
        this.$message.info('已取消删除')
      })
    },

    // 获取配置列表
    async fetchData() {
      try {
        const data = await getAllMeterConfig()
        const stationIds = await getAllStationTagKey()
        const objectInfoMap = await getAllObjectInfoMap() || {}

        this.configList = data || []
        this.configList.map(item => {
          const stationInfo = objectInfoMap.get(`${item.meter_station_id}_METER_STATION`) || {}
          item.meter_station_name = stationInfo.objectName || item.meter_station_id
        })
        this.templateOptions = data.map(item => ({
          label: item.name,
          value: item.config_id
        }))
        this.stationOptions = stationIds.map(stationId => {
          const stationInfo = objectInfoMap.get(`${stationId}_METER_STATION`) || {}
          const stationName = stationInfo.objectName || stationId
          return {
            label: stationName,
            value: stationId
          }
        })
      } catch (error) {
        console.error('获取配置列表失败:', error)
        this.$message.error('获取配置列表失败')
      }
    },

    //跳转到配置修改界面
    handleChange(configId){
        this.$router.push({
            name: 'MeterEdit',
            params: { id: configId }
        })
    }
  }
}
</script>

<style scoped>
.all-meter-config {
  padding: 24px;
  background: #f5f7fa;
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
}

.all-meter-config::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.all-meter-config {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.page-header {
  margin-bottom: 24px;
  text-align: center;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-icon {
  font-size: 26px;
  color: #409eff;
}

.page-desc {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.button-area {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-start;
}

.config-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.header-icon {
  color: #409eff;
}

.config-table {
  margin-top: 16px;
}
</style>