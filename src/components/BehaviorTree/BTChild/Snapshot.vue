<template>
  <div class="all-meter-config">
    <div v-if="isShowHeader" class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Setting /></el-icon>
        全部快照管理
      </h2>
      <p class="page-desc">管理所有快照信息</p>
    </div>

    <!-- 配置预览表格 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>快照列表</span>
          <div class="param-btn">
            <el-button type="primary" size="large" @click="addGenerateSnapshot" class="add-param-btn">
              <el-icon class="btn-icon"><Camera /></el-icon>
              生成快照
            </el-button>
            <el-button type="info" size="large" @click="UploadSnapshot" class="add-param-btn">
              <el-icon class="btn-icon"><Upload /></el-icon>
              上传快照
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="configList" border class="config-table" stripe>
        <el-table-column prop="filename" label="文件名" min-width="200" />
        <el-table-column prop="size" label="大小" min-width="100" align="center" />
        <el-table-column prop="timestamp" label="创建时间" min-width="150" align="center" />
        
        <el-table-column v-if="PromiseWrite" label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" circle @click="handleDownload(row.filename)" :icon="Download" title="下载快照">
            </el-button>
            <el-button type="success" size="small" circle @click="handleRefresh(row.filename)" :icon="Refresh" title="还原快照">
            </el-button>
            <el-button type="danger" size="small" circle @click="handleDelete(row.filename)" :icon="Delete" title="删除快照">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Delete, Plus, Setting, Document,Edit,Camera,Upload,Refresh,Download } from '@element-plus/icons-vue'
import { getSnapshot ,restoreSnapshot,delSnapshot,generateSnapshot,snapshotUpload } from '@/api/behavior/behavior'
import { formatTimestamp } from '@/utils/timeLib'

export default {
  name: 'AllMeterConfig',
  components: {
    Upload,
    Camera,
    Setting,
    Document
  },
  setup() {
    return {
      Download,
      Refresh,
      Plus,
      Delete,
      Edit
    }
  },
  props: {
    isShowHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      configList: [],
      PromiseWrite: true,
      PromiseRead: true
    }
  },
  mounted() {
    this.getConfigList()
  },
  methods: {
    UploadSnapshot() {
      console.log('上传快照')
    },
    Upload(file) {
      const formData = new FormData()
      formData.append('file', file)
      snapshotUpload(formData).then(res => {
        if (res.filename !== undefined && res.filename !== '') {
          this.$message.success('上传成功')
          this.getConfigList()
        } else {
          this.$message.error(res.msg || '上传失败')
        }
      })
    },
    addGenerateSnapshot() {
      generateSnapshot().then(res => {
        if (res.filename !== undefined && res.filename !== '') {
          this.$message.success('生成成功')
          this.getConfigList()
        } else {
          this.$message.error(res.msg || '生成失败')
        }
      })
    },
    handleDelete(filename){
      delSnapshot(filename).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getConfigList()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      })
    },
    handleDownload(filename) {
      const link = document.createElement('a')
      link.href = `/snapshot/${filename}`
      link.download = filename // 自定义下载文件名
      link.click()
    },
    handleRefresh(filename) {
      restoreSnapshot({ filename }).then(res => {
        if (res.code === 200) {
          this.$message.success('还原成功')
        } else {
          this.$message.error(res.msg || '还原失败')
        }
      })
    },

    async getConfigList() {
      try {
        const res = await getSnapshot()
        this.configList = res.map(item => ({
          ...item,
          size: `${(item.size / 1024).toFixed(2)} KB`,
          timestamp: formatTimestamp(item.timestamp)
        }))
      } catch (error) {
        console.error('获取配置列表失败:', error)
      }
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

.btn-icon {
  font-size: 25px;
  padding-right: 8px;
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

.param-btn {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.add-param-btn {
  /* margin-left: auto; */
}

</style>