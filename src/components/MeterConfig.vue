<template>
  <div class="meter-config">
    <h2>计量配置</h2>
    <el-form :model="form" label-width="120px" class="config-form">
      <el-form-item label="计量名称">
        <el-input v-model="form.meterName" placeholder="请输入计量名称" />
      </el-form-item>
      <el-form-item label="计量单位">
        <el-select v-model="form.meterUnit" placeholder="请选择计量单位">
          <el-option label="千瓦时 (kWh)" value="kWh" />
          <el-option label="兆瓦时 (MWh)" value="MWh" />
          <el-option label="千瓦时/小时 (kWh/h)" value="kWh/h" />
          <el-option label="百分比 (%)" value="percent" />
        </el-select>
      </el-form-item>
      <el-form-item label="计量精度">
        <el-slider v-model="form.precision" :max="4" show-stops />
      </el-form-item>
      <el-form-item label="上限值">
        <el-input-number v-model="form.maxValue" :min="0" :max="999999" />
      </el-form-item>
      <el-form-item label="下限值">
        <el-input-number v-model="form.minValue" :min="0" :max="999999" />
      </el-form-item>
      <el-form-item label="校准系数">
        <el-input v-model="form.calibration" placeholder="请输入校准系数" />
      </el-form-item>
      <el-form-item label="启用状态">
        <el-switch v-model="form.enabled" active-text="启用" inactive-text="禁用" />
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
  name: 'MeterConfig',
  data() {
    return {
      form: {
        meterName: '',
        meterUnit: '',
        precision: 2,
        maxValue: 100,
        minValue: 0,
        calibration: '1.0',
        enabled: true
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('提交计量配置:', this.form)
      this.$message.success('计量配置保存成功')
    },
    onReset() {
      this.form = {
        meterName: '',
        meterUnit: '',
        precision: 2,
        maxValue: 100,
        minValue: 0,
        calibration: '1.0',
        enabled: true
      }
      this.$message.info('表单已重置')
    }
  }
}
</script>

<style scoped>
.meter-config {
  padding: 20px;
}

.meter-config h2 {
  margin-bottom: 20px;
  color: #303133;
  border-bottom: 2px solid #e6a23c;
  padding-bottom: 10px;
}

.config-form {
  max-width: 600px;
  margin-top: 20px;
}
</style>
