<template>
  <div class="config-manager-container">
    <div class="config-header">
      <h2 class="config-title">配置列表</h2>
      <div class="config-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索配置..."
          class="search-input"
          clearable
        />
        <el-button type="info" class="action-button" @click="handleDownloadAll">下载全部</el-button>
        <el-button type="warning" class="action-button" @click="handleUpload">上传</el-button>
        <el-button type="primary" class="action-button" @click="handleCreateConfig">创建配置</el-button>
      </div>
    </div>
    
    <el-table :data="filteredTasks" stripe style="width: 100%" class="config-table">
      <!-- <el-table-column prop="config_id" label="配置ID" width="100" align="center" /> -->
      <el-table-column prop="config_name" label="配置名称" width="150" align="center" />
      <el-table-column prop="config_module" label="配置模块" width="150" align="center" >
        <template #default="scope">
          {{ modules.find(item => item.config_module === scope.row.config_module)?.config_module_name || '未知模块' }}
        </template>
      </el-table-column>
      <el-table-column prop="config" label="配置内容"  align="center">
        <template #default="scope">
          <span class="config-content">{{ scope.row.config }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350"  align="center">
        <template #default="scope">
          <el-button size="small" type="info" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="small" type="success" @click="handleDownload(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 配置表单弹窗 -->
    <ConfigForm
      v-model:dialogVisible="dialogVisible"
      :configData="currentConfig"
      :configModules="modules"
      :mode="configMode"
      @submit="handleConfigSubmit"
    />
  </div>
</template>

<script>
import {get_all_configs, get_all_config_modules ,delete_config,download_all_configs,download_one_data,upload_data} from '@/api/taskConfigUtils/taskConfig'
import ConfigForm from './ConfigSmallComponents/ConfigForm.vue'
import {exportJsonFile} from '@/utils/utils'

export default {
  components: {
    ConfigForm
  },
  data() {
    return {
      configs: [],
      modules: [],
      searchQuery: '',
      dialogVisible: false,
      currentConfig: {},
      configMode: 'create' // create, view, edit
    }
  },
  computed: {
    // 根据搜索关键词过滤任务列表
    filteredTasks() {
      if (!this.searchQuery) {
        return this.configs
      }
      const query = this.searchQuery.toLowerCase()
      return this.configs.filter(config => {
        const moduleName = this.modules.find(item => item.config_module === config.config_module)?.config_module_name || '未知模块'
        return (
          config.config_name.toLowerCase().includes(query) ||
          moduleName.toLowerCase().includes(query)
        )
      })
    }
  },
  mounted() {
    this.init_configs()
  },
  methods: {
    async init_configs(){
      const res = await get_all_configs()
      const modules = await get_all_config_modules()
      this.modules = modules
      this.configs = res
    },
    // 操作方法
    async handleDownloadAll() {
      // 模拟下载操作
      const res = await download_all_configs()  
      const fileName = res.file_name
      delete res.file_name
      exportJsonFile(res, fileName);
    },
    async handleUpload() {
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      // 限制只能选择CSV文件
      fileInput.accept = '.json'
      fileInput.click()
      
      fileInput.onchange = async () => {
        const file = fileInput.files[0]
        if (!file) return
        
        // 再次验证文件类型（防止绕过accept属性）
        if (!file.name.toLowerCase().endsWith('.json')) {
          this.$message({
            message: '请选择JSON格式的文件',
            type: 'warning'
          })
          return
        }
        
        try {
          await upload_data(file)
          this.init_configs()
          this.$message({
            message: '文件上传成功',
            type: 'success'
          })
        } catch (error) {
          console.error('上传文件失败:', error)
          this.$message({
            message: '上传文件失败: ' + (error.message || '未知错误'),
            type: 'error'
          })
        }
      }
    },
    handleCreateConfig() {
      this.configMode = 'create'
      this.currentConfig = {}
      this.dialogVisible = true
    },
    handleDetail(config) {
      this.configMode = 'view'
      this.currentConfig = config
      this.dialogVisible = true
    },
    handleEdit(config) {
      this.configMode = 'edit'
      this.currentConfig = config
      this.dialogVisible = true
    },
    handleConfigSubmit() {
      // 根据模式执行不同操作
      if (this.configMode === 'view') {
        return
      } else {
        this.init_configs()
      }
    },
    async handleDelete(config) {
      await delete_config(config.config_id)
      this.init_configs()
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    },
    async handleDownload(config) {
      const res = await download_one_data('config',config.config_id) 
      const fileName = res.file_name
      delete res.file_name
      exportJsonFile(res, fileName);
    }
  }
}
</script>

<style scoped>
.config-manager-container {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.config-header {
  margin-bottom: 20px;
}

.config-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.config-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 300px;
  margin-right: 10px;
}

.action-button {
  flex-shrink: 0;
}

.config-table {
  margin-top: 20px;
}

.config-content {
  font-family: monospace;
  font-size: 14px;
  color: #606266;
  word-break: break-all;
}

:deep(.el-button--small) {
  margin-right: 5px;
}
</style>