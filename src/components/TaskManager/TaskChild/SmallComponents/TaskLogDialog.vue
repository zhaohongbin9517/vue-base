<template>
  <el-dialog
    title="任务日志"
    v-model="localDialogVisible"
    width="800px"
    @close="handleClose"
  >
    <div class="task-log-container">
      <el-table
        :data="logData"
        stripe
        style="width: 100%"
        class="log-table"
      >
        <el-table-column prop="configId" label="配置ID" width="100" />
        <el-table-column prop="configName" label="配置名称" />
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="executionTime" label="任务执行时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <span :class="scope.row.status === '成功' ? 'status-success' : 'status-failed'">
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
      </el-table>
      
      <div v-if="logData.length === 0" class="no-data">
        暂无日志数据
      </div>
      
      <div class="pagination-container">
        <div class="pagination-left">
          <el-select v-model="pageSize" size="small" @change="handlePageSizeChange">
            <el-option label="10条" :value="10" />
            <el-option label="20条" :value="20" />
            <el-option label="50条" :value="50" />
          </el-select>
        </div>
        <div class="pagination-info">
          共 {{ total }} 条
        </div>
        <div class="pagination-right">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </div>
    </div>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'TaskLogDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      logData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      localDialogVisible: false
    }
  },
  watch: {
    dialogVisible: {
      handler(newVal) {
        this.localDialogVisible = newVal
        if (newVal && this.taskId) {
          this.loadLogData()
        }
      },
      immediate: true
    },
    taskId: {
      handler(newVal) {
        if (newVal && this.localDialogVisible) {
          this.loadLogData()
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    loadLogData() {
      // 模拟加载日志数据
      console.log('加载任务日志:', this.taskId)
      // 这里可以替换为真实的API调用
      this.logData = []
      this.total = 0
    },
    handlePageSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.loadLogData()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.loadLogData()
    }
  }
}
</script>

<style scoped>
.task-log-container {
  padding: 10px 0;
}

.log-table {
  margin-bottom: 20px;
}

.no-data {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-left {
  flex-shrink: 0;
}

.pagination-info {
  flex: 1;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.pagination-right {
  flex-shrink: 0;
}

.status-success {
  color: #67c23a;
  font-weight: 500;
}

.status-failed {
  color: #f56c6c;
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>