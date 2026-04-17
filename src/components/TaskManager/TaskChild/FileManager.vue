<template>
  <div class="file-manager-container">
    <div class="file-header">
      <h2 class="file-title">文件列表</h2>
      <div class="file-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索文件..."
          class="search-input"
          clearable
        />
        <el-button type="warning" class="action-button" @click="handleRefresh">刷新</el-button>
      </div>
    </div>
    
    <el-table :data="filteredFiles" stripe style="width: 100%" class="file-table">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="文件名" width="300">
        <template #default="scope">
          <div class="file-name">
            <el-icon class="file-icon"><Document /></el-icon>
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小" width="100" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column prop="updatedAt" label="最后修改时间" width="180" />
      <el-table-column label="操作" width="350"  align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handlePreview(scope.row)">预览</el-button>
          <el-button size="small" type="info" @click="handleDownload(scope.row)">下载</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Document } from '@element-plus/icons-vue'

// 模拟文件数据
const files = ref([
  {
    id: 1,
    name: '注水模板.csv',
    size: '37 B',
    createdAt: '2026-04-15 15:44:05',
    updatedAt: '2026-04-15 15:20:04'
  },
  {
    id: 2,
    name: '关系库数据写入虚拟点模板.csv',
    size: '1015 B',
    createdAt: '2026-02-05 16:22:28',
    updatedAt: '2026-02-04 14:56:08'
  },
  {
    id: 3,
    name: '运行状态模板.csv',
    size: '103 B',
    createdAt: '2025-12-05 17:56:00',
    updatedAt: '2025-12-05 17:56:00'
  },
  {
    id: 4,
    name: '拉油罐模板.csv',
    size: '117 B',
    createdAt: '2026-04-15 15:24:56',
    updatedAt: '2025-12-05 17:56:00'
  }
])

const searchQuery = ref('')

// 过滤文件
const filteredFiles = computed(() => {
  if (!searchQuery.value) {
    return files.value
  }
  return files.value.filter(file => 
    file.name.includes(searchQuery.value)
  )
})

// 操作方法
const handleRefresh = () => {
  console.log('刷新文件列表')
  // 模拟刷新操作
}

const handlePreview = (file) => {
  console.log('预览文件:', file)
  // 模拟预览操作
}

const handleDownload = (file) => {
  console.log('下载文件:', file)
  // 模拟下载操作
}

const handleDelete = (file) => {
  console.log('删除文件:', file)
  // 模拟删除操作
}
</script>

<style scoped>
.file-manager-container {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.file-header {
  margin-bottom: 20px;
}

.file-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.file-actions {
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

.file-table {
  margin-top: 20px;
}

.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: #409eff;
  font-size: 16px;
}

:deep(.el-button--small) {
  margin-right: 5px;
}
</style>