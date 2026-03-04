<template>
  <div class="all-meter-config">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Setting /></el-icon>
        全部计量站管理
      </h2>
      <p class="page-desc">管理所有计量站配置信息</p>
    </div>

    <!-- 列选择区域 -->
    <el-card class="config-card" shadow="hover" style="margin-bottom: 20px;">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>列显示设置</span>
        </div>
      </template>
      <div class="column-selector">
        <el-checkbox-group v-model="visibleColumns" @change="handleColumnChange">
          <el-checkbox v-for="column in allColumns" :key="column.key" :label="column.key" class="column-checkbox">
            {{ column.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-card>

    <!-- 配置预览表格 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>计量站列表</span>
        </div>
      </template>

      <el-table :data="configList" border class="config-table" stripe>
        <!-- 动态生成表格列 -->
        <template v-for="column in visibleColumns" :key="column">
          <!-- 特殊列处理 -->
          <el-table-column
            v-if="column === 'is_valid'"
            :prop="column"
            :label="getColumnLabel(column)"
            min-width="100"
            align="center"
          >
            <template #default="{ row }" >
              <span 
                :class="{ 'red-text': row.is_valid !== true  }">
                {{ row.is_valid === true ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <!-- 普通列 -->
          <el-table-column
            v-else
            :prop="column"
            :label="getColumnLabel(column)"
            min-width="150"
          >
          </el-table-column>
        </template>
        <!-- 操作列始终显示 -->
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" size="small" circle @click="handleDelete(row.config_id)" :icon="Delete">
            </el-button>
            <el-button type="primary" size="small" circle @click="handleEdit(row.config_id)" :icon="Edit">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑配置弹窗 -->
    <AllStationConfigEdit
      v-model:visible="editVisible"
      :data="currentEditData"
      :visible-columns="visibleColumns"
      :is-editable="isEditable"
      :select-options="selectOptions"
      @save="handleEditSave"
    />

  </div>
</template>

<script>
import { Delete,Document ,Setting,Edit} from '@element-plus/icons-vue'
import { getAllStationConfig } from '@/api/configUtils/config'
import {} from '@/api/configUtils/cacheData'
import AllStationConfigEdit from './AllStationConfigChild/AllStationConfigEdit.vue'

export default {
  name: 'AllStationConfig',
  components: {
    Setting,
    Document,
    AllStationConfigEdit
  },
  setup() {
    return {
      Edit,
      Delete
    }
  },
  data() {
    return {
      configList:[],
      allColumns: [], // 所有可选择的列
      visibleColumns: ['id','object_id', 'is_valid', 
      'behavior_tree', 'config_id', 'device_manu', 'mainfold_max_num', 'controller_id'
      ], // 当前可见的列
      // 默认列配置映射
      columnLabels: {
        object_id: '站id',
        is_valid: '是否启用',
        behavior_tree: '行为树id',
        config_id: '配置id',
        device_manu: '布局分组',
        mainfold_max_num: '管汇号',
        controller_id: '控制器id',
        id:'序列id',
        object_type:'对象类型',
        sub_type:'子类型',
        remark:'备注',
        create_time:'创建时间',
        modified_time:'修改时间'
      },
      // 编辑相关数据
      editVisible: false,
      currentEditData: {},
      // 控制字段是否可编辑
      isEditable: {
        object_id: true,
        // is_valid: true,
        // behavior_tree: true,
        // config_id: true,
        // device_manu: true,
        // mainfold_max_num: true,
        // controller_id: true
      },
      // 下拉框选项数据
      selectOptions: {
        behavior_tree: [],
        config_id: []
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取配置列表
    async fetchData() {
      try {
        const data = await getAllStationConfig()
        this.configList = data || []
        
        // 动态生成列信息
        this.generateColumns()
      } catch (error) {
        console.error('获取所有站配置失败:', error)
      }
    },
    
    // 动态生成列信息
    generateColumns() {
      if (this.configList.length === 0) {
        // 如果没有数据，使用默认列配置
        this.allColumns = Object.keys(this.columnLabels).map(key => ({
          key,
          label: this.columnLabels[key]
        }))
        // this.visibleColumns = Object.keys(this.columnLabels)
        return
      }
      
      // 从第一个数据项获取所有key
      const firstItem = this.configList[0]
      const keys = Object.keys(firstItem)
      
      // 生成列信息
      this.allColumns = keys.map(key => ({
        key,
        label: this.columnLabels[key] || key // 如果没有映射，使用key作为label
      }))
      
      // 默认显示所有列
      // this.visibleColumns = keys
    },
    
    // 根据列key获取显示名称
    getColumnLabel(key) {
      return this.columnLabels[key] || key
    },
    
    // 处理列选择变化
    handleColumnChange() {
      this.visibleColumns = this.visibleColumns.sort((a, b) => {
        const indexA = this.allColumns.findIndex(c => c.key === a)
        const indexB = this.allColumns.findIndex(c => c.key === b)
        return indexA - indexB
      })
    },
    //删除
    handleDelete(){
      this.$message.info('删除暂时不可用')
    },
    
    // 处理编辑按钮点击
    handleEdit(config_id) {
      // 查找对应的配置数据
      const data = this.configList.find(item => item.config_id === config_id)
      if (data) {
        this.currentEditData = data
        this.editVisible = true
      }
    },
    
    // 处理保存编辑
    handleEditSave(data) {
      // 这里可以添加保存逻辑，比如调用API更新配置
      console.log('保存编辑数据:', data)
      
      // 模拟保存成功，更新本地列表
      const index = this.configList.findIndex(item => item.config_id === data.config_id)
      if (index !== -1) {
        this.configList[index] = { ...this.configList[index], ...data }
      }
      
      this.$message.success('配置更新成功')
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
.config-table :deep(.el-table__header-wrapper th) {
  text-align: center;
}

.red-text {
  color: #f56c6c;
}

/* 列选择器样式 */
.column-selector {
  /* display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px 0; */
}

.column-checkbox {
  /* display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 20px; */
}
</style>