<template>
  <el-dialog
    :title="dialogTitle"
    v-model="localDialogVisible"
    width="900px"
    @close="handleClose"
  >
    <el-form
      ref="taskForm"
      :model="localFormData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="时间:">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          :shortcuts="shortcuts"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          value-format="x"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { run_task } from '@/api/taskConfigUtils/taskConfig'
export default {
  name: 'RunTaskFrom',
  components: {
  },
  props: {
    dialogTitle: { type: String, default: '运行任务'},
    dialogVisible: { type: Boolean, default: false },
  },
  data() {
    return {
      localDialogVisible: false,
      dateRange: '',
      shortcuts : [
        {
          text: 'Last week',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 7)
            return [start, end]
          },
        },
        {
          text: 'Last month',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            return [start, end]
          },
        },
        {
          text: 'Last 3 months',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 3)
            return [start, end]
          },
        },
      ]
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    handleSubmit() {
      console.log(this.dateRange)
      run_task({
        task_id: this.taskId,
        start_time: this.dateRange[0],
        end_time: this.dateRange[1]
      })
      // this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped>
.cron-builder {
  display: flex;
  flex-direction: column; 
  gap: 15px;               
  align-items: stretch;    
}


.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>