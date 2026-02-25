<template>
  <div class="meter-config">
    <!-- 
    头部,计量配置
    参照PlanConfig.vue中page-header
     -->

    <!--
    配置基础：
      配置选择：下拉框  站选择：下拉框 按钮：新增配置 按钮：保存配置 
    -->

    <!--
    计量配置第一部分：启动设备参数设置 按钮：新增参数
      参数选择：下拉框  参数值：输入框  按钮：删除
    -->

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
  min-height: 85vh;
  max-height: 85vh;
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
