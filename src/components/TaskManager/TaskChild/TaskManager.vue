<template>
  <div class="task-manager-container">
    <div class="task-header">
      <h2 class="task-title">任务列表</h2>
      <div class="task-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索任务..."
          class="search-input"
          clearable
        />
        <el-button type="primary" class="action-button" @click="handleDownloadAll">下载全部</el-button>
        <el-button type="warning" class="action-button" @click="handleUpload">上传</el-button>
        <el-button type="primary" class="action-button" @click="addTask">新增任务</el-button>
      </div>
    </div>
    
    <el-table :data="tasks" stripe  class="el-table task-table">
      <el-table-column prop="task_id" label="ID"  width="100" align="center"/>
      <el-table-column prop="task_desp" label="任务名称" />
      <el-table-column prop="corn" label="Cron表达式"   align="center"/>
      <el-table-column prop="config_id" label="配置ID"  width="100" align="center"/>
      <el-table-column prop="config_name" label="配置名称" />
      <el-table-column prop="status" label="状态" width="100"  align="center">
        <template #default="scope">
          <span :class="scope.row.status === false ? 'status-disabled' : 'status-enabled'">
           {{ scope.row.status === true ? '启用' : '禁用' }}
          </span>
        </template>
      </el-table-column> 
      <el-table-column label="操作" width="500" fixed="right" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button 
            size="small" 
            type="primary" 
            @click="handleEnable(scope.row)"
          >
            {{ scope.row.status === false ? '启用' : '禁用' }}
          </el-button>
          <el-button size="small" type="success" @click="handleRun(scope.row)">运行</el-button>
          <el-button size="small" type="info" @click="handleLog(scope.row)">日志</el-button>
          <el-button size="small" type="primary" @click="handleDownload(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { get_all_tasks, delete_task ,get_all_config_modules} from '@/api/taskConfigUtils/taskConfig'

export default {
  name: 'TaskManager',
  data() {
    return {
      tasks: [
        // {
        //   task_id: 1,
        //   task_desp: 'zhushui',
        //   corn: '0 10 * * *',
        //   config_id: 1,
        //   config_name: 'zhushui1',
        //   status: false
        // }
      ],
      searchQuery:'',
      config_modules: []
    }
  },

  mounted() {
    this.get_all_tasks()
    this.get_all_config_modules()
  },
  methods: {
    //获取全部任务配置
    async get_all_tasks() {
      const res = await get_all_tasks()
      this.tasks = res
      console.log(res)
    },
    //获取全部配置模块
    async get_all_config_modules() {
      const res = await get_all_config_modules()
      this.config_modules = res
      console.log(res)
    },

    handleDownloadAll() {
      console.log('下载全部任务')
      // 模拟下载操作
    },

    handleUpload() {
      console.log('上传任务')
      // 模拟上传操作
    },

    addTask() {
      console.log('新增任务')
      // 模拟新增操作
    },

    handleEdit(task) {
      console.log('编辑任务:', task)
      // 模拟编辑操作
    },

    async handleDelete(task) {
      const res =  await delete_task(task.task_id)
      if(res === 'ok'){
        this.get_all_tasks()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
    },

    handleEnable(task) {
      task.status = task.status === true ? false : true
    },

    handleRun(task) {
      console.log('运行任务:', task)
      // 模拟运行操作
    },

    handleLog(task) {
      console.log('查看任务日志:', task)
      // 模拟查看日志操作
    },

    handleDownload(task) {
      console.log('下载任务:', task)
      // 模拟下载操作
    }
  }
}
</script>

<style scoped>

.el-table {
  width: 100% !important;
  table-layout: fixed !important;
}

.task-manager-container {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.task-header {
  margin-bottom: 20px;
}

.task-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.task-actions {
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

.el-table {
  width: 100% !important;
  table-layout: fixed;
}

.task-table {
  margin-top: 20px;
}

.status-disabled {
  color: #f56c6c;
  font-weight: 500;
}

.status-enabled {
  color: #67c23a;
  font-weight: 500;
}

:deep(.el-button--small) {
  margin-right: 5px;
}
</style>