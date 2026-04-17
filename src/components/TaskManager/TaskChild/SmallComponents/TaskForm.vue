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
      <el-form-item label="任务名称:" prop="task_desp">
        <el-input
          v-model="localFormData.task_desp"
          placeholder="请输入任务名称"
        />
      </el-form-item>

      <!-- ====================== 自定义 Cron 编辑器 ====================== -->
      <el-form-item label="Cron表达式:" prop="corn">
        <CronBuilder 
          v-model:cornVal="localFormData.corn"
          @update:cornVal="localFormData.corn = $event"
         />
      </el-form-item>
      <!-- =================================================================== -->

      <el-form-item label="配置名称:" prop="config_id">
        <el-select
          v-model="localFormData.config_id"
          placeholder="请选择配置"
          style="width: 100%"
        >
          <el-option
            v-for="config in configOptions"
            :key="config.config_id"
            :label="config.config_name"
            :value="config.config_id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="任务状态:" prop="status">
        <el-select
          v-model="localFormData.status"
          style="width: 100%"
        >
          <el-option label="禁用" :value="false" />
          <el-option label="启用" :value="true" />
        </el-select>
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
import CronBuilder from './CronBuilder.vue'

export default {
  name: 'TaskForm',
  components: {
    CronBuilder
  },
  props: {
    dialogVisible: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    formData: {
      type: Object,
      default: () => ({
        task_id: null,
        task_desp: '',
        corn: '',
        config_id: '',
        status: false
      })
    },
    configOptions: { type: Array, default: () => [] }
  },
  data() {
    return {
      localFormData: {},
      localDialogVisible: false,
      cronBuilder: {
        second: '*', secondVal: 0, secondStart: 0, secondEnd: 10, secondEnum: '0,10,20',
        minute: '*', minuteVal: 0, minuteStart: 0, minuteEnd: 10, minuteEnum: '0,10,20',
        hour: '*', hourVal: 0, hourStart: 0, hourEnd: 6, hourEnum: '0,6,12',
        day: '*', dayVal: 1, dayStart: 1, dayEnd: 5, dayEnum: '1,15',
        month: '*', monthVal: 1, monthStart: 1, monthEnd: 6, monthEnum: '1,6,12',
        week: '*', weekVal: 1, weekStart: 1, weekEnd: 5, weekEnum: '1,5'
      },
      rules: {
        task_desp: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        // corn: [{ required: true, message: '请配置Cron表达式', trigger: 'change' }],
        config_id: [{ required: true, message: '请选择配置', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑任务' : '新增任务'
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        this.localFormData = { ...newVal }
        if (newVal.corn) this.parseCron(newVal.corn)
      },
      deep: true,
      immediate: true
    },
    dialogVisible: {
      handler(val) { this.localDialogVisible = val },
      immediate: true
    }
  },
  methods: {
    // 构建 cron
    buildCron() {
      const cb = this.cronBuilder
      const getVal = (type, val, start, end, en) => {
        if (type === 'spec') return val
        if (type === 'range') return `${start}-${end}`
        if (type === 'enum') return en
        return '*'
      }
      const second = getVal(cb.second, cb.secondVal, cb.secondStart, cb.secondEnd, cb.secondEnum)
      const minute = getVal(cb.minute, cb.minuteVal, cb.minuteStart, cb.minuteEnd, cb.minuteEnum)
      const hour = getVal(cb.hour, cb.hourVal, cb.hourStart, cb.hourEnd, cb.hourEnum)
      const day = getVal(cb.day, cb.dayVal, cb.dayStart, cb.dayEnd, cb.dayEnum)
      const month = getVal(cb.month, cb.monthVal, cb.monthStart, cb.monthEnd, cb.monthEnum)
      const week = getVal(cb.week, cb.weekVal, cb.weekStart, cb.weekEnd, cb.weekEnum)
      
      this.localFormData.corn = `${second} ${minute} ${hour} ${day} ${month} ${week}`
    },
    
    // 解析回显（编辑用）
    parseCron(cron) {
      const arr = cron.split(' ')
      if (arr.length < 6) return
      this.cronBuilder.second = arr[0]
      this.cronBuilder.minute = arr[1]
      this.cronBuilder.hour = arr[2]
      this.cronBuilder.day = arr[3]
      this.cronBuilder.month = arr[4]
      this.cronBuilder.week = arr[5]
    },
    
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.taskForm.resetFields()
    },
    
    async handleSubmit() {
      this.localFormData.config_name = this.configOptions.find(config => config.config_id === this.localFormData.config_id)?.config_name || ''
      if (this.isEdit) {
       
        console.log('update',this.localFormData)
      }else{
        console.log('add',this.localFormData)
      }
      //更新任务通知外部更新列表里的任务列表
      this.$emit('update:refreshTaskList', false)
      //关闭弹窗
      this.handleClose()
    }
  }
}
</script>

<style scoped>
.cron-builder {
  display: flex;
  flex-direction: column;  /* 纵向排列 */
  gap: 15px;               /* 上下间距 */
  align-items: stretch;    /* 宽度铺满 */
}
.cron-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.cron-item label {
  width: 20px;
  font-weight: bold;
}
.flex {
  display: flex;
  align-items: center;
  gap: 4px;
}
.cron-result {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>