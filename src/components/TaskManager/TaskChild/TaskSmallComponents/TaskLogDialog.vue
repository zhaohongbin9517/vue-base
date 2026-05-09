<template>
  <el-dialog
    title="任务日志"
    v-model="localDialogVisible"
    width="1000px"
    @close="handleClose"
  >
    <div class="task-log-container">
      <el-table
        :data="logData"
        stripe
        style="width: 100% ; height: 400px"
        class="log-table"
      >
        <el-table-column prop="config_id" label="配置ID" width="100" align="center" />
        <el-table-column prop="config_name" label="配置名称" align="center" />
        <el-table-column prop="log_time" label="时间" width="180" align="center">
          <template #default="scope">
            {{ formatTime(scope.row.log_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="task_run_time" label="任务执行时间" width="180" align="center">
          <template #default="scope">
            {{ formatTime(scope.row.task_run_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="result" label="状态" width="100" align="center">
          <template #default="scope">
            <span :class="scope.row.result === '成功' ? 'status-success' : 'status-failed'">
              {{ scope.row.result }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />
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
import { get_task_logs } from '@/api/taskConfigUtils/taskConfig'

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
    async loadLogData() {
      const res = await get_task_logs(this.taskId,  this.pageSize, this.currentPage)
      this.logData = res.logs
      this.total = res.count
    },
    handlePageSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.loadLogData()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.loadLogData()
    },
    // 格式化时间戳为日期时间格式
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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
  width: 100px;
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