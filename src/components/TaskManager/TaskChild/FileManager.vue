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
      </div>
    </div>
    
    <el-table :data="filteredFiles" stripe style="width: 100%" class="file-table">
      <el-table-column prop="file_name" label="文件名" width="300">
        <template #default="scope">
          <div class="file-name">
            <el-icon class="file-icon"><Document /></el-icon>
            <span>{{ scope.row.file_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="file_size" label="大小" width="100"  align="center">
        <template #default="scope">
          {{ formatFileSize(scope.row.file_size) }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180"  align="center" />
      <el-table-column prop="updated_at" label="最后修改时间" width="180"  align="center" />
      <el-table-column label="操作"   align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handlePreview(scope.row)">预览</el-button>
          <el-button size="small" type="info" @click="handleDownload(scope.row)">下载</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- CSV预览弹窗 -->
    <CsvPreviewDialog
      v-model:dialogVisible="previewDialogVisible"
      :file="currentPreviewFile"
    />
  </div>
</template>

<script>
import { Document } from '@element-plus/icons-vue'
import {get_all_files} from '@/api/taskConfigUtils/taskConfig'
import CsvPreviewDialog from './ConfigSmallComponents/CsvPreviewDialog.vue'


export default {
  name: 'FileManager',
  components: {
    Document,
    CsvPreviewDialog
  },
  data() {
    return {
      // 模拟文件数据
      files: [],
      searchQuery: '',
      // 预览弹窗相关
      previewDialogVisible: false,
      currentPreviewFile: {}
    }
  },
  computed: {
    // 过滤文件
    filteredFiles() {
      if (!this.searchQuery) {
        return this.files
      }
      return this.files.filter(file => 
        file.file_name.includes(this.searchQuery)
      )
    }
  },
  mounted() {
    this.initFiles()
  },
  methods: {
    async initFiles() {
      const res = await get_all_files()
      this.files = res
      console.log('files',this.files)
    },
    // 操作方法
    handlePreview(file) {
      this.currentPreviewFile = file
      this.previewDialogVisible = true
    },
    handleDownload(file) {
      console.log('下载文件:', file)
      // 模拟下载操作
    },
    handleDelete(file) {
      console.log('删除文件:', file)
      // 模拟删除操作
    },
    // 将字节转换为标准文件大小格式
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
  }
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