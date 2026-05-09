<template>
  <el-dialog
    :title="dialogTitle"
    v-model="localDialogVisible"
    width="800px"
    @close="handleClose"
  >
    <el-form
      ref="configForm"
      :model="localFormData"
      :rules="rules"
      label-width="120px"
      class="config-form"
    >
      <el-form-item label="配置名称" prop="config_name">
        <el-input
          v-model="localFormData.config_name"
          :disabled="mode === 'view'"
          placeholder="请输入配置名称"
        />
      </el-form-item>
      
      <el-form-item label="配置模块" prop="config_module">
        <el-select
          v-model="localFormData.config_module"
          :disabled="mode === 'view'"
          placeholder="请选择配置模块"
        >
          <el-option
            v-for="module in configModules"
            :key="module.config_module"
            :label="module.config_module_name"
            :value="module.config_module"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="配置内容" prop="config">
        <el-input
          v-model="localFormData.config"
          :disabled="mode === 'view'"
          type="textarea"
          rows="10"
          placeholder="请输入配置内容"
          class="config-textarea"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <template v-if="mode !== 'view'">
          <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
        </template>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'ConfigForm',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    configData: {
      type: Object,
      default: () => ({})
    },
    configModules: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'create', // create, view, edit
      validator: (value) => ['create', 'view', 'edit'].includes(value)
    }
  },
  data() {
    return {
      localDialogVisible: false,
      localFormData: {
        config_id: null,
        config_name: '',
        config_module: '',
        config: ''
      },
      loading: false,
      rules: {
        config_name: [
          { required: true, message: '请输入配置名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        config_module: [
          { required: true, message: '请选择配置模块', trigger: 'change' }
        ],
        config: [
          { required: true, message: '请输入配置内容', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      switch (this.mode) {
        case 'create': return '创建配置'
        case 'view': return '配置详情'
        case 'edit': return '编辑配置'
        default: return '配置'
      }
    }
  },
  watch: {
    dialogVisible: {
      handler(newVal) {
        this.localDialogVisible = newVal
        if (newVal) {
          this.initFormData()
        }
      },
      immediate: true
    },
    configData: {
      handler() {
        if (this.localDialogVisible) {
          this.initFormData()
        }
      },
      deep: true
    }
  },
  methods: {
    initFormData() {
      if (this.mode === 'create') {
        this.localFormData = {
          config_id: null,
          config_name: '',
          config_module: '',
          config: ''
        }
      } else {
        this.localFormData = { ...this.configData }
      }
    },
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    async handleSubmit() {
      this.$refs.configForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            // 发送数据到父组件处理
            this.$emit('submit', this.localFormData)
            this.$message({
              message: this.mode === 'create' ? '创建成功' : '编辑成功',
              type: 'success'
            })
            this.handleClose()
          } catch (error) {
            this.$message({
              message: '操作失败: ' + error.message,
              type: 'error'
            })
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.config-form {
  margin-top: 20px;
}

.config-textarea {
  font-family: monospace;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>