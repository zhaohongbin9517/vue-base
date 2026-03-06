<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增配置"
    width="500px"
    @close="handleClose"
  >
    <el-form
      :model="formData"
      label-width="100px"
      ref="addConfigForm"
      :rules="rules"
    >
      <el-form-item label="配置ID" prop="configId">
        <el-input
          v-model="formData.configId"
          placeholder="请输入配置ID"
          readonly
        />
      </el-form-item>
      <el-form-item label="配置名称" prop="configName">
        <el-input
          v-model="formData.configName"
          placeholder="请输入配置名称"
        />
      </el-form-item>
      <el-form-item label="计量站" prop="stationId">
        <el-select
          v-model="formData.stationId"
          filterable
          clearable
          @change="handleChange"
          placeholder="请选择计量站"
        >
          <el-option
            v-for="station in stationOptions"
            :key="station.value"
            :label="station.label"
            :value="station.value"
          >
          <span style="float: left">{{ station.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ station.value }}</span> 
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板配置" prop="templateId">
        <el-select
          v-model="formData.templateId"
          filterable
          clearable
          @change="handleChange"
          placeholder="请选择模板配置"
        >
          <el-option
            v-for="template in templateOptions"
            :key="template.value"
            :label="template.label"
            :value="template.value"
          >
          <span style="float: left">{{ template.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ template.value }}</span> 
        </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'MeterConfigAddConfig',
  props: {
    // 控制对话框显示
    visible: {
      type: Boolean,
      default: false
    },
    // 计量站选项
    stationOptions: {
      type: Array,
      default: () => []
    },
    // 模板配置选项
    templateOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      formData: {
        configId: '', // 配置ID，可能需要自动生成
        configName: '', // 配置名称
        stationId: '', // 计量站ID
        templateId: '' // 模板配置ID
      },
      rules: {
        configName: [
          { required: true, message: '请输入配置名称', trigger: 'blur' }
        ],
        stationId: [
          { required: true, message: '请选择计量站', trigger: 'change' }
        ],
        templateId: [
          { required: true, message: '请选择模板配置', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        this.dialogVisible = newVal;
        // 如果显示对话框，重置表单
        if (newVal) {
          this.resetForm();
        }
      },
      immediate: true
    }
  },
  methods: {
    handleChange(){
    },
    resetForm() {
      // 生成唯一配置ID，这里可以根据实际需求调整生成逻辑
      this.formData.configId = 'config_' + Date.now();
      // 重置其他表单字段
      this.formData.configName = '';
      this.formData.stationId = '';
      this.formData.templateId = '';
    },
    // 处理关闭对话框
    handleClose() {
      this.$emit('update:visible', false)
    },
    // 处理保存配置
    handleSave() {
      this.$emit('save', this.formData)
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>