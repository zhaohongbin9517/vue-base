<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <div class="param-btn">
          <save-config-button @save="saveConfig"></save-config-button>
        </div>
      </div>
    </template>

    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>计量站检查</span>
          <div class="param-btn">
            <el-button type="primary" size="small" @click="addParameter('stationCheck')" class="add-param-btn">
              <el-icon><plus /></el-icon>
              新增映射
            </el-button>
          </div>
        </div>
      </template>
      <!--计量站人工状态检查-->
      <el-table :data="localStationCheck" border class="config-table" stripe>
        <el-table-column prop="column" label="检查字段名称"  align="center"  min-width="200"></el-table-column>
        <el-table-column prop="data_type" label="字段类型"  align="center" min-width="200"> </el-table-column>
        <el-table-column prop="one_for_one" label="one-for-one" align="center"  min-width="200"></el-table-column>
        <el-table-column prop="one_for_all" label="one-for-all"  align="center" min-width="200"></el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ $index }">
            <el-button type="danger" size="small" circle @click="removeParameter('stationCheck', $index)">
              <el-icon><delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>计量井检查</span>
          <div class="param-btn">
            <el-button type="primary" size="small" @click="addParameter('wellCheck')" class="add-param-btn">
              <el-icon><plus /></el-icon>
              新增映射
            </el-button>
          </div>
        </div>
      </template>
      <!--计量井人工状态检查-->
      <el-table :data="localWellCheck" border class="config-table" stripe>
        <el-table-column prop="column" label="检查字段名称"  align="center"  min-width="200"></el-table-column>
        <el-table-column prop="data_type" label="字段类型"  align="center" min-width="200"> </el-table-column>
        <el-table-column prop="one_for_one" label="one-for-one" align="center"  min-width="200"></el-table-column>
        <el-table-column prop="one_for_all" label="one-for-all"  align="center" min-width="200"></el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ $index }">
            <el-button type="danger" size="small" circle @click="removeParameter('wellCheck', $index)">
              <el-icon><delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-card>

  <!-- 完善后的新增映射弹窗 -->
  <el-dialog title="新增映射" v-model="dialogVisible" width="450px">
    <div class="dialog-form">
      <el-form :model="addForm" label-width="120px" label-position="right">
        <el-form-item label="检查字段名称">
          <el-input v-model="addForm.column" placeholder="请输入检查字段名称" style="width: 260px" />
        </el-form-item>

        <el-form-item label="字段类型">
          <el-select v-model="addForm.data_type" placeholder="请选择字段类型" style="width: 260px">
            <el-option label="布尔" value="bool" />
            <el-option label="字符串" value="string" />
            <el-option label="函数" value="func" />
            <el-option label="LIKE" value="LIKE" />
          </el-select>
        </el-form-item>

        <el-form-item label="one-for-one">
          <el-select
            v-if="addForm.data_type === 'func'"
            v-model="addForm.one_for_one"
            placeholder="请选择函数"
            filterable
            clearable
            style="width: 260px"
          >
            <el-option v-for="f in funcList" :key="f.func" :label="f.name" :value="f.func">
              <span style="float: left">{{ f.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ f.func }}</span>
            </el-option>
          </el-select>
          <el-input v-else v-model="addForm.one_for_one" :placeholder="valueInputPlaceholder" style="width: 260px" />
        </el-form-item>

        <el-form-item label="one-for-all">
          <el-select
            v-if="addForm.data_type === 'func'"
            v-model="addForm.one_for_all"
            placeholder="请选择函数"
            filterable
            clearable
            style="width: 260px"
          >
            <el-option v-for="f in funcList" :key="f.func" :label="f.name" :value="f.func">
              <span style="float: left">{{ f.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ f.func }}</span>
            </el-option>
          </el-select>
          <el-input v-else v-model="addForm.one_for_all" :placeholder="valueInputPlaceholder" style="width: 260px" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { Tools, Plus, Delete } from '@element-plus/icons-vue'
import SaveConfigButton from '@/components/ConfigVue/MenuChile/MeterConfigChild/Common/SaveConfigButton.vue'
import { getCheckCanMeasure } from '@/api/configUtils/measureController'

export default {
  name: 'MeterConfigCheckMmanualStatusSetting',
  components: {
    Tools,
    Plus,
    Delete,
    SaveConfigButton
  },
  props: {
    checkMeasureStatusBase: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '计量井人工状态检查'
    },
    tips: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  setup() {
    return {
      Plus,
      Delete
    }
  },
  data() {
    return {
      localCheckMeasureStatusBase: {},
      localStationCheck: [],
      localWellCheck: [],
      funcList: [], // 字段类型为 func 时可选的函数列表 [{ name, func, desp }]
      dialogVisible: false,
      // 新增表单数据
      addForm: {
        column: '',
        data_type: '',
        one_for_one: '',
        one_for_all: ''
      },
      currentType: '' // 记录当前是stationCheck还是wellCheck
    }
  },
  computed: {
    // LIKE 类型下 "," 属于检查内容而非分隔符，提示语需与逗号分隔的类型区分
    valueInputPlaceholder() {
      return this.addForm.data_type === 'LIKE'
        ? '请输入检查内容（逗号属于内容，不做分隔）'
        : '请输入值，多个用逗号分隔'
    }
  },
  mounted() {
    this.initLocalData()
    this.loadFuncList()
  },
  watch: {
    checkMeasureStatusBase: {
      handler(newVal) {
        this.localStationCheck = []
        this.localWellCheck = []
        this.localCheckMeasureStatusBase = newVal
        this.initLocalData()
      },
      deep: true
    }
  },
  methods: {
    initLocalData() {
      const station = this.localCheckMeasureStatusBase.station || {}
      const well = this.localCheckMeasureStatusBase.well || {}
      Object.keys(station).forEach(ColumnName => {
        const valueObj = station[ColumnName]
        if (!valueObj) return
        this.localStationCheck.push({
          column: ColumnName,
          data_type: valueObj.data_type || '',
          one_for_one: valueObj.one_for_one ? valueObj.one_for_one.join(',') : '',
          one_for_all: valueObj.one_for_all ? valueObj.one_for_all.join(',') : '',
        })
      })
      Object.keys(well).forEach(ColumnName => {
        const valueObj = well[ColumnName]
        if (!valueObj) return
        this.localWellCheck.push({
          column: ColumnName,
          data_type: valueObj.data_type || '',
          one_for_one: valueObj.one_for_one ? valueObj.one_for_one.join(',') : '',
          one_for_all: valueObj.one_for_all ? valueObj.one_for_all.join(',') : '',
        })
      })
    },
    // 打开新增弹窗
    addParameter(type) {
      this.currentType = type
      // 重置表单
      this.addForm = {
        column: '',
        data_type: '',
        one_for_one: '',
        one_for_all: ''
      }
      this.dialogVisible = true
    },
    // 拉取可用于人工状态检查的函数列表（字段类型为 func 时使用）
    async loadFuncList() {
      try {
        const res = await getCheckCanMeasure()
        this.funcList = Array.isArray(res) ? res : []
      } catch (e) {
        this.$message.error(`获取函数列表失败：${e.message || e}`)
      }
    },
    // 值解析：LIKE 类型不做逗号分割，整体作为一个值；其余类型按逗号分割为多值
    splitValues(dataType, raw) {
      const str = raw || ''
      if (dataType === 'LIKE') {
        return str ? [str] : []
      }
      return str.split(',').filter(i => i)
    },
    //生产localCheckMeasureStatusBase
    createLocalCheckMeasureStatusBase(){
      const station = this.localStationCheck.reduce((acc, item) => {
        const dataType = item.data_type || ''
        acc[item.column] = {
          data_type: dataType,
          // 空值保护，防止 undefined.split 报错
          one_for_one: this.splitValues(dataType, item.one_for_one),
          one_for_all: this.splitValues(dataType, item.one_for_all),
        }
        return acc
      }, {}) // 初始值必须是 {}
      const well = this.localWellCheck.reduce((acc, item) => {
        const dataType = item.data_type || ''
        acc[item.column] = {
          data_type: dataType,
          one_for_one: this.splitValues(dataType, item.one_for_one),
          one_for_all: this.splitValues(dataType, item.one_for_all),
        }
        return acc
      }, {})
      this.localCheckMeasureStatusBase = {
        station,
        well
      }
    },

    // 删除行
    removeParameter(type, index) {
      if (type === 'stationCheck') {
        this.localStationCheck.splice(index, 1)
      } else {
        this.localWellCheck.splice(index, 1)
      }
      this.createLocalCheckMeasureStatusBase()
      //通知外部删除
      this.$emit('update-measure-status', this.name, this.localCheckMeasureStatusBase)
    },
    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false
    },
    // 确认新增
    confirmAdd() {
      const { column, data_type, one_for_one, one_for_all } = this.addForm

      // 1. 必填项校验
      if (!column || !data_type) {
        this.$message.warning('请填写完整必填项')
        return
      }

      // 2. 如果是 bool 类型，严格校验内容只能是 true / false（逗号分隔）
      if (data_type === 'bool') {
          // 工具方法：校验bool值
          const isValidBoolValue = (str) => {
            if (!str) return true // 允许为空
            return str.split(',').every(v => {
              const val = v.trim().toLowerCase()
              return val === 'true' || val === 'false'
            })
          }

          // 开始校验
          if (!isValidBoolValue(one_for_one)) {
            this.$message.warning('one-for-one 只能填写 true/false，多个用逗号分隔')
            return
          }
          if (!isValidBoolValue(one_for_all)) {
            this.$message.warning('one-for-all 只能填写 true/false，多个用逗号分隔')
            return
          }
        }
        const item = { column,data_type,one_for_one,one_for_all }
        if (this.currentType === 'stationCheck') { this.localStationCheck.push(item)
        } else { this.localWellCheck.push(item) }

        this.dialogVisible = false
        this.createLocalCheckMeasureStatusBase()
        this.$emit('update-measure-status', this.name, this.localCheckMeasureStatusBase)
        this.$message.success('新增成功')
    },
    saveConfig() {
      this.$emit('save-config', this.name)
    }
  }
}
</script>

<style scoped>
.config-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.param-btn {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.header-icon {
  font-size: 20px;
  color: #409eff;
}

.tips-text {
  font-size: 12px;
  color: #409eff;
  margin-left: 8px;
}

.add-param-btn {
  margin-left: auto;
}

.config-table {
  width: 100%;
}

.config-table :deep(.el-table__header th) {
  background: #f5f7fa;
  font-weight: 600;
  color: #606266;
}

.config-table :deep(.el-table__cell) {
  padding: 8px 12px;
}

.config-table :deep(.el-select) {
  width: 100%;
}

.config-table :deep(.el-input) {
  width: 100%;
}

.config-table :deep(.el-input__wrapper) {
  width: 100%;
}

.dialog-form {
  padding: 10px 0;
}

.dialog-footer {
  text-align: right;
}
</style>