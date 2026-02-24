<template>
  <div class="result-config">
    <h2>结果配置</h2>
    <el-form :model="form" label-width="120px" class="config-form">
      <el-form-item label="结果名称">
        <el-input v-model="form.resultName" placeholder="请输入结果名称" />
      </el-form-item>
      <el-form-item label="结果类型">
        <el-radio-group v-model="form.resultType">
          <el-radio label="success">成功</el-radio>
          <el-radio label="warning">警告</el-radio>
          <el-radio label="error">失败</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="结果状态">
        <el-switch v-model="form.resultStatus" active-text="启用" inactive-text="禁用" />
      </el-form-item>
      <el-form-item label="结果描述">
        <el-input v-model="form.description" type="textarea" rows="4" placeholder="请输入结果描述" />
      </el-form-item>
      <el-form-item label="处理人">
        <el-input v-model="form.handler" placeholder="请输入处理人" />
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
  name: 'ResultConfig',
  data() {
    return {
      form: {
        resultName: '',
        resultType: 'success',
        resultStatus: true,
        description: '',
        handler: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('提交结果配置:', this.form)
      this.$message.success('结果配置保存成功')
    },
    onReset() {
      this.form = {
        resultName: '',
        resultType: 'success',
        resultStatus: true,
        description: '',
        handler: ''
      }
      this.$message.info('表单已重置')
    }
  }
}
</script>

<style scoped>
.result-config {
  padding: 20px;
}

.result-config h2 {
  margin-bottom: 20px;
  color: #303133;
  border-bottom: 2px solid #67c23a;
  padding-bottom: 10px;
}

.config-form {
  max-width: 600px;
  margin-top: 20px;
}
</style>
