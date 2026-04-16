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
        <el-button type="primary" class="action-button" @click="handleRefresh">刷新</el-button>
        <el-button type="info" class="action-button" @click="handleDownloadAll">下载全部</el-button>
        <el-button type="warning" class="action-button" @click="handleUpload">上传</el-button>
      </div>
    </div>
    
    <el-table :data="filteredConfigs" stripe style="width: 100%" class="config-table">
      <el-table-column prop="id" label="配置ID" width="100" />
      <el-table-column prop="name" label="配置名称" />
      <el-table-column prop="module" label="配置模块" />
      <el-table-column prop="content" label="配置内容" width="400">
        <template #default="scope">
          <span class="config-content">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="small" type="info" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="small" type="success" @click="handleDownload(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 模拟配置数据
      configs: [
        {
          id: 1,
          name: 'zhushui1',
          module: '注水数据写入实时库',
          content: '{"task_file":":注..."}'
        },
        {
          id: 2,
          name: 'backup1',
          module: '数据备份模块',
          content: '{"backup_path":":/data/backup"}'
        },
        {
          id: 3,
          name: 'cleanup1',
          module: '数据清理模块',
          content: '{"cleanup_days":":7"}'
        }
      ],
      searchQuery: ''
    }
  },
  computed: {
    // 过滤配置
    filteredConfigs() {
      if (!this.searchQuery) {
        return this.configs
      }
      return this.configs.filter(config => 
        config.name.includes(this.searchQuery) ||
        config.module.includes(this.searchQuery)
      )
    }
  },
  methods: {
    // 操作方法
    handleRefresh() {
      console.log('刷新配置列表')
      // 模拟刷新操作
    },
    handleDownloadAll() {
      console.log('下载全部配置')
      // 模拟下载操作
    },
    handleUpload() {
      console.log('上传配置')
      // 模拟上传操作
    },
    handleDetail(config) {
      console.log('查看配置详情:', config)
      // 模拟查看详情操作
    },
    handleEdit(config) {
      console.log('编辑配置:', config)
      // 模拟编辑操作
    },
    handleDelete(config) {
      console.log('删除配置:', config)
      // 模拟删除操作
    },
    handleDownload(config) {
      console.log('下载配置:', config)
      // 模拟下载操作
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