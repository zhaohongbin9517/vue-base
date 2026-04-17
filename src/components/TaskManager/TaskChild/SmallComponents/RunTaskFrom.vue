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
          start-placeholder="Start date"
          end-placeholder="End date"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
          time-format="A hh:mm:ss"
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
      dateRange: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    handleSubmit() {
      this.$emit('update:dialogVisible', false)
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