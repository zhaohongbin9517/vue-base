<template>
  <div class="plan-config">
    <h2>计划配置</h2>
    <el-form :model="form" label-width="120px" class="config-form">
      <el-form-item label="计划名称">
        <el-input v-model="form.planName" placeholder="请输入计划名称" />
      </el-form-item>
      <el-form-item label="计划类型">
        <el-select v-model="form.planType" placeholder="请选择计划类型">
          <el-option label="年度计划" value="year" />
          <el-option label="季度计划" value="quarter" />
          <el-option label="月度计划" value="month" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="form.startTime" type="date" placeholder="选择开始时间" />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="form.endTime" type="date" placeholder="选择结束时间" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" rows="4" placeholder="请输入备注信息" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存配置</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PlanConfig',
  data() {
    return {
      form: {
        planName: '',
        planType: '',
        startTime: '',
        endTime: '',
        remark: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('提交计划配置:', this.form)
      this.$message.success('计划配置保存成功')
    },
    onReset() {
      this.form = {
        planName: '',
        planType: '',
        startTime: '',
        endTime: '',
        remark: ''
      }
      this.$message.info('表单已重置')
    }
  }
}
</script>

<style scoped>
.plan-config {
  padding: 20px;
}

.plan-config h2 {
  margin-bottom: 20px;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.config-form {
  max-width: 600px;
  margin-top: 20px;
}
</style>
