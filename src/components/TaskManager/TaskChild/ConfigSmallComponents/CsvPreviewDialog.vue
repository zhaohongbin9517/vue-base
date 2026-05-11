<template>
  <el-dialog
    :title="dialogTitle"
    v-model="localDialogVisible"
    width="1200px"
    @close="handleClose"
  >
  <el-config-provider :locale="zhCn">
    <div class="csv-preview-container">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载文件内容...</span>
      </div>
      
      <div v-else-if="error" class="error-container">
        <el-icon><WarningFilled /></el-icon>
        <span>{{ error }}</span>
      </div>
      
      <div v-else-if="csvData.length === 0" class="empty-container">
        <span>文件内容为空</span>
      </div>
      
      <div v-else class="csv-content">
        <el-table
          :data="currentPageData"
          stripe
          style="width: 100%"
          class="csv-table"
          border
        >
          <el-table-column
            v-for="(header, index) in csvHeaders"
            :key="index"
            :prop="index.toString()"
            :label="header"
            align="center"
          >
            <template #default="scope">
              <span class="csv-cell">{{ scope.row[index] || '' }}</span>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
            background
            layout="prev, pager, next, jumper, total"
            :total="csvData.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </div>
    </div>
    </el-config-provider>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { Loading, WarningFilled } from '@element-plus/icons-vue'

export default {
  name: 'CsvPreviewDialog',
  components: {
    Loading,
    WarningFilled
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    file: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localDialogVisible: false,
      loading: false,
      error: '',
      csvData: [],
      csvHeaders: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    dialogTitle() {
      return `${this.file.file_name} - 预览`
    },
    currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.csvData.slice(start, end)
    }
  },
  watch: {
    dialogVisible: {
      handler(newVal) {
        this.localDialogVisible = newVal
        if (newVal && this.file) {
          this.loadCsvContent()
        } else {
          this.resetData()
        }
      },
      immediate: true
    },
    file: {
      handler(newVal) {
        if (this.localDialogVisible && newVal) {
          this.loadCsvContent()
        }
      },
      deep: true
    }
  },
  methods: {
    resetData() {
      this.csvData = []
      this.csvHeaders = []
      this.currentPage = 1
      this.loading = false
      this.error = ''
    },
    
    async loadCsvContent() {
      if (!this.file || !this.file.file_name) return
      
      this.resetData()
      this.loading = true
      
      try {
        // 处理中文文件名编码
        const encodedFilename = encodeURIComponent(this.file.file_name)
        const url = `/config/${encodedFilename}`
        
        // 获取CSV文件内容
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`文件加载失败: ${response.statusText}`)
        }
        
        const csvText = await response.text()
        this.parseCsv(csvText)
      } catch (error) {
        this.error = `加载文件失败: ${error.message}`
        console.error('加载CSV文件失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    parseCsv(csvText) {
      // 简单的CSV解析
      const lines = csvText.split('\n').filter(line => line.trim())
      if (lines.length === 0) return
      
      // 获取表头
      this.csvHeaders = this.parseCsvLine(lines[0])
      
      // 获取数据行
      for (let i = 1; i < lines.length; i++) {
        const row = this.parseCsvLine(lines[i])
        if (row.length > 0) {
          this.csvData.push(row)
        }
      }
    },
    
    parseCsvLine(line) {
      // 支持带引号的CSV字段解析
      const result = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            // 转义的引号
            current += '"'
            i++ // 跳过下一个引号
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          // 字段分隔符
          result.push(current)
          current = ''
        } else {
          current += char
        }
      }
      
      // 添加最后一个字段
      result.push(current)
      return result
    },
    
    handleCurrentChange(page) {
      this.currentPage = page
    },
    
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped>
.csv-preview-container {
  height: 800px;
  max-height: 600px;
  overflow-y: auto;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 10px;
}

.loading-container {
  color: #409eff;
}

.error-container {
  color: #f56c6c;
}

.empty-container {
  color: #909399;
}

.csv-content {
  margin-top: 10px;
}

.csv-table {
  margin-bottom: 20px;
}

.csv-cell {
  font-family: monospace;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  display: inline-block;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>