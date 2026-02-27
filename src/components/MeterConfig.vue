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
        <el-select v-model="baseData.configId" @change="handleConfigChange" placeholder="请选择配置" class="config-select">
          <el-option 
          v-for="item in allMeterConfig" 
          :key="item.config_id" 
          :label="item.name" 
          :value="item.config_id"
          />
        </el-select>
        <el-select v-model="baseData.stationId" @change="handleStationChange" placeholder="请选择站" class="station-select">
          <el-option 
          v-for="item in allStations" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value"
          />
        </el-select>
        <el-button type="primary" @click="addConfig">
          <el-icon><plus /></el-icon>
          新增配置
        </el-button>
        <el-button type="primary" @click="resetConfig">
          <el-icon><refresh-right /></el-icon>
          取消修改
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
      @save-config="saveConfig"
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
      @save-config="saveConfig"
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
      @save-config="saveConfig"
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
      @save-config="saveConfig"
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
      @add-enum="addParameter"
      @remove-enum="removeParameter"
      @save-config="saveConfig"
    />

    <!--通道号设置 -->
    <MeterConfigMeterTongDaoSetting 
      :config="wnChannelNumber"
      :title="'当前计量通道号'"
      :name="'wnChannelNumber'"
      :param-options="paramOptions"
      @update:channelNumber="updateChannelNumber"
      @save-config="saveConfig"
    />

    <MeterConfigMeterTongDaoSetting 
      :config="wmChannelNumber"
      :title="'上次计量通道号'"
      :tips="'(主要用作统计结果时的通道确认)'"
      :name="'wmChannelNumber'"
      :param-options="paramOptions"
      @update:channelNumber="updateChannelNumber"
      @save-config="saveConfig"
    />

    <!-- 计划数据配置 -->
    <MeterConfigPlanSetting 
      :title="'计划数据配置'"
      :tips="'(下发计划配置信息)'"
      :name="'planSetinfo'"
      v-model:planTableInfo="planTableInfo"
      :tableOptions="tableOptions"
      :planTableColumnOptions="planTableColumnOptions"
      :paramOptions="paramOptions"
      @save-config="saveConfig"
    />

    <!-- 初始化设备数据设置 -->
    <MeterConfigInitDeviceSetting 
      :mappings="initDeviceMappings"
      :title="'初始化设备数据设置'"
      :tips="''"
      :name="'initDeviceSetting'"
      :paramOptions="paramOptions"
      @add-parameter="addParameter"
      @remove-parameter="removeParameter"
      @save-config="saveConfig"
    />

    <!-- 计量结果配置 -->
    <MeterConfigResultSetting 
      v-model:resultTableInfo="resultTableInfo"
      :title="'计量结果配置'"
      :tips="''"
      :name="'resultSetting'"
      :tableOptions="tableOptions"
      :resultTableColumnOptions="resultTableColumnOptions"
      :paramOptions="paramOptions"
      @save-config="saveConfig"
    />

    <!-- 出结果判断 -->
    <MeterConfigCheckResultSetting 
      v-model:resultCheck="resultCheck"
      :title="'出结果判断'"
      :tips="''"
      :name="'checkResultSetting'"
      :paramOptions="paramOptions"
      @save-config="saveConfig"
    />

    <!--参数解压-->
    <MeterConfigStartStopSetting 
      :parameters="paramUncompress"
      :title="'参数解压设置'"
      :tips="'(同名参数只保留一个值)'"
      :name="'paramUncompress'"
      :param-options="paramOptions"
      @add-parameter="addParameter"
      @remove-parameter="removeParameter"
      @save-config="saveConfig"
    />

    <!-- 可变参数选择 -->
    <MeterConfigChangeParamSetting 
      v-model:changeParam="changeParam"
      :title="'可修改参数选择'"
      :tips="''"
      :name="'changeParamSetting'"
      :paramOptions="paramOptions"
      @save-config="saveConfig"
    />

    <!-- 二次计量 -->
    <MeterConfigEmphasisPlanSetting 
      v-model:emphasisPlan="emphasisPlan"
      :title="'二次计量'"
      :tips="''"
      :name="'emphasisPlanSetting'"
      :paramOptions="paramOptions"
      @save-config="saveConfig"
    />

    <!-- 扩展信息 -->
    <MeterConfigExtendConfigSetting 
      v-model:extendConfig="extendConfig"
      :title="'扩展信息'"
      :tips="''"
      :name="'extendConfigSetting'"
      :modulesChoose="modulesChoose"
      @save-config="saveConfig"
    />

    <!-- 循环计量信息 -->
    <MeterConfigLoopMeterSetting 
      v-model:loopMeterInfo="loopMeterInfo"
      :title="'循环计量信息'"
      :tips="''"
      :name="'loopMeterSetting'"
      :paramOptions="paramOptions"
      @save-config="saveConfig"
    />
   
   

  </div>
</template>

<script>
import { Setting, Collection, Plus, Check ,RefreshRight} from '@element-plus/icons-vue'
import MeterConfigStartStopSetting from './MeterConfigChild/MeterConfigStartStopSetting.vue'
import MeterConfigDeviceStatusSetting from './MeterConfigChild/MeterConfigDeviceStatusSetting.vue'
import MeterConfigMeterTongDaoSetting from './MeterConfigChild/MeterConfigMeterTongDaoSetting.vue'
import MeterConfigPlanSetting from './MeterConfigChild/MeterConfigPlanSetting.vue'
import MeterConfigInitDeviceSetting from './MeterConfigChild/MeterConfigInitDeviceSetting.vue'
import MeterConfigResultSetting from './MeterConfigChild/MeterConfigResultSetting.vue'
import MeterConfigCheckResultSetting from './MeterConfigChild/MeterConfigCheckResultSetting.vue'
import MeterConfigChangeParamSetting from './MeterConfigChild/MeterConfigChangeParamSetting.vue'
import MeterConfigEmphasisPlanSetting from './MeterConfigChild/MeterConfigEmphasisPlanSetting.vue'
import MeterConfigExtendConfigSetting from './MeterConfigChild/MeterConfigExtendConfigSetting.vue'
import MeterConfigLoopMeterSetting from './MeterConfigChild/MeterConfigLoopMeterSetting.vue'
import { getAllMeterConfig,getAllStationTagKey,getStationCode } from '@/api/config'

export default {
  name: 'MeterConfig',
  components: {
    RefreshRight,
    Setting,
    Collection,
    Plus,
    Check,
    MeterConfigStartStopSetting,
    MeterConfigDeviceStatusSetting,
    MeterConfigMeterTongDaoSetting,
    MeterConfigPlanSetting,
    MeterConfigInitDeviceSetting,
    MeterConfigResultSetting,
    MeterConfigCheckResultSetting,
    MeterConfigChangeParamSetting,
    MeterConfigEmphasisPlanSetting,
    MeterConfigExtendConfigSetting,
    MeterConfigLoopMeterSetting
  },
  setup() {
    return {
      Plus,
      Check
    }
  },
  data() {
    return {
      //基础信息
      baseData:{
        configId:'',   //计量配置id
        stationId:'',  //站点id
        config:{}      //配置信息
      },
      //启动设备参数设置
      startParameters: [{ code_id: '', value: 0 }],
      //启动检查参数设置
      checkStartParameters: [{ code_id: '', value: 0 }],
      //停止设备参数设置
      stopParameters: [{ code_id: '', value: 0 }],
      //停止检查参数设置  
      checkStopParameters: [{ code_id: '', value: 0 }],
      //设备状态枚举
      deviceStatusConfig: {
        paramName: '',
        enums: [{ value: 0, status: '' }],
        statusEnumClassification: {
          run_status: [],
          stop_status: []
        }
      },
      //通道号设置
      wnChannelNumber: '',
      wmChannelNumber: '',
      //计划数据
      planTableInfo:{
        tableName:'',
        sql:'',
        tong_dao_column:'',
        column:[
          {set:'',check:'',column:''}
        ]
      },
      //初始化设备数据设置
      initDeviceMappings: [
        { set: '', check: '', value: 0 }
      ],
      //计量结果配置
      resultTableInfo: {
        resultGroups: [
          { name: '', save_type: 'tong_dao', table: '', column: [{ dbColumnField: '', params: [] }] }
        ]
      },
      //出结果判断
      resultCheck: {
        relation: 'and',
        checks: [
          { param: '', expression: '' }
        ]
      },
      //可变参数选择
      changeParam: {
        params: []
      },
      //二次计量
      emphasisPlan: {
        plan: { set: '', check: '', value: 0 },
        plan_time: { set: '', check: '' },
        plan_sort: { set: '', check: '' }
      },
      //扩展信息
      extendConfig: {
        meterResultBind: '',
        filterRealTime: ''
      },
      //循环计量信息
      loopMeterInfo: {
        paramName: '',
        enable: false
      },
      //参数解压
      paramUncompress: [
        { paramName: '', paramValue: 0 }
      ],
      //可变参数选择
      changeParamOptions: ["param1", "param2"],

      //模块选择
      modulesChoose: [
        { label: '获取计量结果绑定采集点-默认', value: '0' },
        { label: '获取计量结果绑定采集点-百口泉瑞飞', value: '1' },
        { label: '过滤实时数据-默认', value: '2' },
        { label: '过滤实时数据-百口泉瑞飞', value: '3' }
      ],
      //全部模块功能枚举
      modulesBase:[
        {index:'0',module: 'tmms_station_meter_result_lib', func:'get_result_tags_default', desc:'获取计量结果绑定采集点-默认'},
        {index:'1',module: 'tmms_station_meter_result_lib', func:'get_result_tags_ruifei', desc:'获取计量结果绑定采集点-百口泉瑞飞'},
        {index:'2',module: 'tmms_station_meter_result_lib', func:'filter_real_meter_data_default', desc:'过滤实时数据-默认'},
        {index:'3',module: 'tmms_station_meter_result_lib', func:'filter_real_meter_data_ruifei', desc:'过滤实时数据-百口泉瑞飞'},
      ],
      //参数选择
      paramOptions: [
        // { code_id:'',desc:''}
      ],
      //数据表名
      tableOptions: [
        { label: '表1', value: 'table1' },
        { label: '表2', value: 'table2' }
      ],
      //计划表字段映射
      planTableColumnOptions: [
        {column_name:'aaa'}
      ],
      //结果表字段映射
      resultTableColumnOptions: [
        {column_name:'aaa'}
      ],
      //全部计量配置
      allMeterConfig:[],
      allStations:[]
    }
  },
  mounted() {
    //初始化数据
    this.init()
  },
  methods: {
    //初始化全部计量配置
    async init(){
      try {
        const data = await getAllMeterConfig()
        const stationIds = await getAllStationTagKey()
        this.allMeterConfig =data
        this.allStations = stationIds.map(stationId => ({
          label: stationId,
          value: stationId
        }))
      } catch (error) {
        console.error('初始化配置的站列表失败:', error)
        this.$message.error('初始化配置的站列表失败')
      }
    },
    initConfig(){
      const config = this.baseData.config
    

      this.startParameters = config.start_device  || [{ code_id: '', value: 0 }]
      this.stopParameters = config.stop_device || [{ code_id: '', value: 0 }]

      this.checkStartParameters = config.check_start_device.flatMap(item =>{
        return item.value.map(val => ({ code_id: item.code_id, value: val }))
      }) || [{ code_id: '', value: 0 }]
      this.checkStopParameters = config.check_stop_device.flatMap(item =>{
        return item.value.map(val => ({ code_id: item.code_id, value: val }))
      }) || [{ code_id: '', value: 0 }]

      console.log(this.startParameters)
      console.log(this.checkStartParameters)
      console.log(this.stopParameters)
      console.log(this.checkStopParameters)
      //设备状态枚举
      this.deviceStatusConfig = {
        paramName: config.device_status.code_id,
        enums: config.device_status.status || [{ value: '', status: '' }],
        statusEnumClassification: {
          run_status: config.run_status || [],
          stop_status: config.stop_status || [] 
        }
      },
      // //通道号设置
      // wnChannelNumber: '',
      // wmChannelNumber: '',
      // //计划数据
      // planTableInfo:{
      //   tableName:'',
      //   sql:'',
      //   tong_dao_column:'',
      //   column:[
      //     {set:'',check:'',column:''}
      //   ]
      // },
      // //初始化设备数据设置
      // initDeviceMappings: [
      //   { set: '', check: '', value: 0 }
      // ],
      // //计量结果配置
      // resultTableInfo: {
      //   resultGroups: [
      //     { name: '', save_type: 'tong_dao', table: '', column: [{ dbColumnField: '', params: [] }] }
      //   ]
      // },
      // //出结果判断
      // resultCheck: {
      //   relation: 'and',
      //   checks: [
      //     { param: '', expression: '' }
      //   ]
      // },
      // //可变参数选择
      // changeParam: {
      //   params: []
      // },
      // //二次计量
      // emphasisPlan: {
      //   plan: { set: '', check: '', value: 0 },
      //   plan_time: { set: '', check: '' },
      //   plan_sort: { set: '', check: '' }
      // },
      // //扩展信息
      // extendConfig: {
      //   meterResultBind: '',
      //   filterRealTime: ''
      // },
      // //循环计量信息
      // loopMeterInfo: {
      //   paramName: '',
      //   enable: false
      // },
      // //参数解压
      // paramUncompress: [
      //   { paramName: '', paramValue: 0 }
      // ],
      // //可变参数选择
      // changeParamOptions: ["param1", "param2"],



      console.log(config)
    },
    //新增配置
    addConfig() {
      this.$message.info('新增配置')
    },
    //重置配置
    resetConfig() {
      this.$message.info('刷新配置')
    },
    //保存配置
    saveConfig() {
      this.$message.success('保存配置成功')
    },
    //配置选择变更事件
    handleConfigChange(configId) {
      const selectedItem = this.allMeterConfig.find(item => item.config_id === configId)
      this.baseData.config = selectedItem.config
      //变更配置信息
      this.initConfig()
    },
    //站选择变更事件
    async handleStationChange(stationId) {
      try {
        const data = await getStationCode(stationId)
        this.paramOptions = data
      } catch (error) {
        console.error('获取站参数失败:', error)
        this.$message.error('获取站参数失败')
      }
    },

    //启动参数设置 启动检查参数设置、停止设备参数设置、停止检查参数设置 增加删除
    addParameter(name){
      console.log(name)
      switch(name){
        case "startCode":
          this.startParameters.push({ paramName: '', paramValue: 0 })
          break
        case "checkStartCode":
          this.checkStartParameters.push({ paramName: '', paramValue: 0 })
          break
        case "stopCode":
          this.stopParameters.push({ paramName: '', paramValue: 0 })
          break
        case "checkStopCode":
          this.checkStopParameters.push({ paramName: '', paramValue: 0 })
          break
        case "initDeviceSetting":
          this.initDeviceMappings.push({ set: '', check: '', value: 0 })
          break
        case "deviceStatusCode":
          this.deviceStatusConfig.enums.push({ value: 0, status: '' })
          break
        case "paramUncompress":
          this.paramUncompress.push({ paramName: '', paramValue: 0 })
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
        case "initDeviceSetting":
          this.initDeviceMappings.splice(index, 1)
          break
        case "deviceStatusCode":
          this.deviceStatusConfig.enums.splice(index, 1)
          break
        case "paramUncompress":
          this.paramUncompress.splice(index, 1)
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
