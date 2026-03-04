<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑配置' : '新增配置'"
    width="800px"
    @close="handleClose"
  >
    <el-form
      :model="formData"
      label-width="120px"
      ref="editForm"
    >
      <!-- 动态生成表单字段 -->
      <div v-for="column in visibleColumns" :key="column" class="form-row">
        <!-- 跳过id字段 -->
        <el-form-item v-if="column !== 'id'" :label="getColumnLabel(column)">
          <!-- is_valid 显示为开关 -->
          <el-switch
            v-if="column === 'is_valid'"
            v-model="formData[column]"
            :disabled="isEditable[column]"
          />
          
          <!-- behavior_tree 和 config_id 显示为下拉框 -->
          <el-select
            v-else-if="column === 'behavior_tree' || column === 'config_id'"
            v-model="formData[column]"
            placeholder="请选择"
            :disabled="isEditable[column]"
            clearable
          >
            <el-option
              v-for="option in getSelectOptions(column)"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <!-- 其他参数显示为输入框 -->
          <el-input
            v-else
            v-model="formData[column]"
            :disabled="isEditable[column]"
            placeholder="请输入"
          />
        </el-form-item>
      </div>
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
  name: 'AllStationConfigEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 当前编辑的数据
    data: {
      type: Object,
      default: () => ({})
    },
    // 可见列
    visibleColumns: {
      type: Array,
      default: () => []
    },
    // 是否可编辑映射
    isEditable: {
      type: Object,
      default: () => ({})
    },
    // 下拉框选项数据
    selectOptions: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:visible', 'save'],
  data() {
    return {
      dialogVisible: this.visible,
      formData: {},
      // 默认列标签映射
      columnLabels: {
        object_id: '站id',
        is_valid: '是否启用',
        behavior_tree: '行为树id',
        config_id: '配置id',
        device_manu: '布局分组',
        mainfold_max_num: '管汇号',
        controller_id: '控制器id'
      }
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        this.dialogVisible = newVal
        if (newVal) {
          this.initForm()
        }
      },
      immediate: true
    },
    data: {
      handler() {
        if (this.dialogVisible) {
          this.initForm()
        }
      },
      deep: true
    }
  },
  methods: {
    // 初始化表单数据
    initForm() {
      // 深拷贝传入的数据
      this.formData = JSON.parse(JSON.stringify(this.data))
      
      // 确保所有可见列都有值
      this.visibleColumns.forEach(column => {
        if (this.formData[column] === undefined) {
          // 根据列类型设置默认值
          if (column === 'is_valid') {
            this.formData[column] = false
          } else {
            this.formData[column] = ''
          }
        }
      })
    },
    
    // 获取列标签
    getColumnLabel(column) {
      return this.columnLabels[column] || column
    },
    
    // 获取下拉框选项
    getSelectOptions(column) {
      return this.selectOptions[column] || []
    },
    
    // 处理关闭对话框
    handleClose() {
      this.$emit('update:visible', false)
    },
    
    // 处理保存
    handleSave() {
      // 验证表单
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$emit('save', this.formData)
          this.$emit('update:visible', false)
        }
      })
    }
  }
}
</script>

<style scoped>
.form-row {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>