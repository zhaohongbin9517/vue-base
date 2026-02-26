<template>
  <div class="meter-config">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><setting /></el-icon>
        计量配置
      </h2>
      <p class="page-desc">配置计量设备参数和启动设备参数设置</p>
    </div>

    <!-- 配置基础 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><collection /></el-icon>
          <span>配置基础</span>
        </div>
      </template>
      <div class="base-config">
        <el-select v-model="configType" placeholder="请选择配置" class="config-select">
          <el-option label="配置1" value="config1" />
          <el-option label="配置2" value="config2" />
        </el-select>
        <el-select v-model="stationId" placeholder="请选择站" class="station-select">
          <el-option label="站1" value="station1" />
          <el-option label="站2" value="station2" />
        </el-select>
        <el-button type="primary" @click="addConfig">
          <el-icon><plus /></el-icon>
          新增配置
        </el-button>
        <el-button type="success" @click="saveConfig">
          <el-icon><check /></el-icon>
          保存配置
        </el-button>
      </div>
    </el-card>

    <!-- 启动设备参数设置 -->
    <MeterConfigStartStopSetting 
      :parameters="startParameters"
      :title="'启动设备参数设置'"
      :tips="'(同名参数只保留一个值)'"
      :name="'startCode'"
      :param-options="paramOptions"
      @add-parameter="addParameter"
      @remove-parameter="removeParameter"
    />
    <!-- 启动检查参数设置 -->
    <MeterConfigStartStopSetting 
      :parameters="checkStartParameters"
      :title="'启动检查参数设置'"
      :tips="'(同名参数保留多个值)'"
      :name="'checkStartCode'"
      :param-options="paramOptions"
      @add-parameter="addParameter"
      @remove-parameter="removeParameter"
    />

    <!-- 停止设备参数设置 -->
    <MeterConfigStartStopSetting 
      :parameters="stopParameters"
      :title="'停止设备参数设置'"
      :tips="'(同名参数只保留一个值)'"
      :name="'stopCode'"
      :param-options="paramOptions"
      @add-parameter="addParameter"
      @remove-parameter="removeParameter"
    />
    <!-- 停止检查参数设置 -->
    <MeterConfigStartStopSetting 
      :parameters="checkStopParameters"
      :title="'停止检查参数设置'"
      :tips="'(同名参数保留多个值)'"
      :name="'checkStopCode'"
      :param-options="paramOptions"
      @add-parameter="addParameter"
      @remove-parameter="removeParameter"
    />

    <!-- 
    设备状态枚举配置 
    启停状态枚举
    -->
    <MeterConfigDeviceStatusSetting 
      :config="deviceStatusConfig"
      :title="'设备状态枚举配置'"
      :name="'deviceStatusCode'"
      :param-options="paramOptions"
      @update:paramName="updateDeviceStatusParamName"
      @update:statusClassification="updateStatusClassification"
      @add-enum="addEnum"
      @remove-enum="removeEnum"
    />

    <!--
      通道号设置
      一个文本输入框
      根据用户输入的文本，识别文本中连续的”{}“字符，
      每个”{}“字符表示一个自定义的参数选择，参数来源为paramOptions，为每个”{}“ 提供一个下拉框来选择对应的参数
      例如：用户输入”{}123{}“，则会识别出两个自定义参数选择，用户需要从paramOptions中选择对应的参数值,
      用户为第一个”{}“选择了参数param1，为第二个”{}“选择了参数param2,最后生成的通道号为”{param1}123{param2}“
    -->
    <MeterConfigMeterTongDaoSetting 
      :config="wnChannelNumber"
      :title="'当前计量通道号'"
      :name="'wnChannelNumber'"
      :param-options="paramOptions"
      @update:channelNumber="updateChannelNumber"
    />

    <MeterConfigMeterTongDaoSetting 
      :config="wmChannelNumber"
      :title="'上次计量通道号'"
      :tips="'(主要用作统计结果时的通道确认)'"
      :name="'wmChannelNumber'"
      :param-options="paramOptions"
      @update:channelNumber="updateChannelNumber"
    />

  </div>
</template>

<script>
import { Setting, Collection, Plus, Check } from '@element-plus/icons-vue'
import MeterConfigStartStopSetting from './MeterConfigStartStopSetting.vue'
import MeterConfigDeviceStatusSetting from './MeterConfigDeviceStatusSetting.vue'
import MeterConfigMeterTongDaoSetting from './MeterConfigMeterTongDaoSetting.vue'

export default {
  name: 'MeterConfig',
  components: {
    Setting,
    Collection,
    Plus,
    Check,
    MeterConfigStartStopSetting,
    MeterConfigDeviceStatusSetting,
    MeterConfigMeterTongDaoSetting
  },
  setup() {
    return {
      Plus,
      Check
    }
  },
  data() {
    return {
      configType: '',
      stationId: '',
      //启动设备参数设置
      startParameters: [{ paramName: '', paramValue: '' }],
      //启动检查参数设置
      checkStartParameters: [{ paramName: '', paramValue: '' }],
      //停止设备参数设置
      stopParameters: [{ paramName: '', paramValue: '' }],
      //停止检查参数设置  
      checkStopParameters: [{ paramName: '', paramValue: '' }],
      //设备状态枚举
      deviceStatusConfig: {
        paramName: '',
        enums: [{ value: '', status: '' }],
        statusEnumClassification: {
          run_status: [],
          stop_status: []
        }
      },
      //通道号设置
      wnChannelNumber: '',
      wmChannelNumber: '',


      //参数选择
      paramOptions: [
        { label: '参数1', value: 'param1' },
        { label: '参数2', value: 'param2' }
      ]
    }
  },
  methods: {
    addConfig() {
      this.$message.info('新增配置')
    },
    saveConfig() {

      console.log(this.startParameters),
      console.log(this.checkStartParameters),
      console.log(this.stopParameters),
      console.log(this.checkStopParameters),
      console.log(this.deviceStatusConfig),
      console.log(this.wnChannelNumber),
      console.log(this.wmChannelNumber),

      this.$message.success('保存配置成功')
    },

    //启动参数设置 启动检查参数设置、停止设备参数设置、停止检查参数设置 增加删除
    addParameter(name){
      console.log(name)
      switch(name){
        case "startCode":
          this.startParameters.push({ paramName: '', paramValue: '' })
          break
        case "checkStartCode":
          this.checkStartParameters.push({ paramName: '', paramValue: '' })
          break
        case "stopCode":
          this.stopParameters.push({ paramName: '', paramValue: '' })
          break
        case "checkStopCode":
          this.checkStopParameters.push({ paramName: '', paramValue: '' })
          break
      }
    },

    removeParameter(name, index){
      console.log(name, index)
      switch(name){
        case "startCode":
          this.startParameters.splice(index, 1)
          break
        case "checkStartCode":
          this.checkStartParameters.splice(index, 1)
          break
        case "stopCode":
          this.stopParameters.splice(index, 1)
          break
        case "checkStopCode":
          this.checkStopParameters.splice(index, 1)
          break
      }
    },

    //状态枚举增加删除
    updateDeviceStatusParamName(value){
      this.deviceStatusConfig.paramName = value
    },
    updateStatusClassification(data){
      const { type, value } = data
      if(type === 'run_status' || type === 'stop_status'){
        this.deviceStatusConfig.statusEnumClassification[type] = value
      }
    },
    addEnum(name){
      console.log(name)
      if(name === "deviceStatusCode"){
        this.deviceStatusConfig.enums.push({ value: '', status: '' })
      }
    },
    removeEnum(name, index){
      console.log(name, index)
      if(name === "deviceStatusCode"){
        this.deviceStatusConfig.enums.splice(index, 1)
      }
    },

    //通道号设置变更
    updateChannelNumber(name, newChannelNumber){
      switch(name){
        case "wnChannelNumber":
          this.wnChannelNumber = newChannelNumber
          break
        case "wmChannelNumber":
          this.wmChannelNumber = newChannelNumber
          break
      }
    },

  }
}
</script>

<style scoped>
.meter-config {
  padding: 24px;
  background: #f5f7fa;
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
}

.meter-config::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.meter-config {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.page-header {
  margin-bottom: 24px;
  text-align: center;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-icon {
  font-size: 26px;
  color: #409eff;
}

.page-desc {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

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

.header-icon {
  font-size: 20px;
  color: #409eff;
}

.base-config {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.config-select,
.station-select {
  width: 200px;
}
</style>
