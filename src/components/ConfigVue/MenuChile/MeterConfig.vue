<template>
  <div class="meter-config">
    <div v-if="isShowHeader" class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><setting /></el-icon>
        计量配置
      </h2>
      <p class="page-desc">配置计量过程参数</p>
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
        <el-select 
        v-model="baseData.configId" 
        @change="handleConfigChange" 
        placeholder="请选择配置" 
        filterable
        class="config-select">
          <el-option 
          v-for="item in allMeterConfig" 
          :key="item.config_id" 
          :label="item.name" 
          :value="item.config_id"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.config_id }}</span> 
          </el-option>
        </el-select>
        <el-select 
        v-model="baseData.stationId" 
        @change="handleStationChange" 
        placeholder="请选择站" 
        filterable
        copyable
        class="station-select">
          <el-option 
          v-for="item in allStations" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value"
          >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> 
        </el-option>
        </el-select>
        <el-button v-if="PromiseWrite" type="primary" @click="addConfig">
          <el-icon><plus /></el-icon>
          新增配置
        </el-button>
        <el-button v-if="PromiseWrite" type="primary" @click="resetConfig">
          <el-icon><refresh-right /></el-icon>
          取消修改
        </el-button>
    
        <el-button v-if="PromiseWrite" type="success" @click="saveAllConfig">
          <el-icon><check /></el-icon>
          保存配置
        </el-button>
    
    <!-- 新增配置对话框组件 -->
    <MeterConfigAddConfig
      v-model:visible="addConfigVisible"
      :stationOptions="stationOptions"
      :templateOptions="templateOptions"
      @save="handleAddConfigSave"
    />
      </div>
    </el-card>

    <!-- 启动设备参数设置 -->
    <div id="start-parameters">
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
    </div>
    <!-- 启动检查参数设置 -->
    <div id="check-start-parameters">
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
    </div>

    <!-- 停止设备参数设置 -->
    <div id="stop-parameters">
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
    </div>
    <!-- 停止检查参数设置 -->
    <div id="check-stop-parameters">
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
    </div>

    <!-- 
    设备状态枚举配置 
    启停状态枚举
    -->
    <div id="device-status-config">
      <MeterConfigDeviceStatusSetting 
        :config="deviceStatusConfig"
        :title="'设备状态枚举配置'"
        :name="'deviceStatusCode'"
        :param-options="paramOptions"
        @update:DeviceStatusEnums="updateDeviceStatusEnums"
        @update:DeviceStatusAllParam="updateDeviceStatusAllParam"
        @update:statusClassification="updateStatusClassification"
        @add-enum="addParameter"
        @remove-enum="removeParameter"
        @save-config="saveConfig"
      />
    </div>

    <!--通道号设置 -->
    <div id="wn-channel-number">
      <MeterConfigMeterTongDaoSetting 
        :channelNumber="wnChannelNumber"
        :title="'当前计量通道号'"
        :name="'wnChannelNumber'"
        :param-options="paramOptions"
        @update:channelNumber="updateChannelNumber"
        @save-config="saveConfig"
      />
    </div>

    <div id="wm-channel-number">
      <MeterConfigMeterTongDaoSetting 
        :channelNumber="wmChannelNumber"
        :title="'上次计量通道号'"
        :tips="'(主要用作统计结果时的通道确认)'"
        :name="'wmChannelNumber'"
        :param-options="paramOptions"
        @update:channelNumber="updateChannelNumber"
        @save-config="saveConfig"
      />
    </div>

    <!-- 计划数据配置 -->
    <div id="plan-data-config">
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
    </div>

    <!-- 初始化设备数据设置 -->
    <div id="init-device-setting">
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
    </div>

    <!-- 计量结果配置 -->
    <div id="result-config">
      <MeterConfigResultSetting 
        v-model:resultTableInfo="resultTableInfo"
        :title="'计量结果配置'"
        :tips="''"
        :name="'resultSetting'"
        :tableOptions="tableOptions"
        :paramOptions="paramOptions"
        @save-config="saveConfig"
      />
    </div>

    <!-- 出结果判断 -->
    <div id="check-result">
      <MeterConfigCheckResultSetting 
        v-model:resultCheck="resultCheck"
        :title="'出结果判断'"
        :tips="''"
        :name="'checkResultSetting'"
        :paramOptions="paramOptions"
        @save-config="saveConfig"
      />
    </div>

    <!--参数解压-->    
    <div id="param-uncompress">
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
    </div>

    <!-- 可变参数选择 -->
    <div id="change-param">
      <MeterConfigChangeParamSetting 
        v-model:changeParam="changeParam"
        :title="'可修改参数选择'"
        :tips="''"
        :name="'changeParamSetting'"
        :paramOptions="paramOptions"
        @save-config="saveConfig"
      />
    </div>

    <!-- 二次计量 -->
    <div id="secondary-measurement">
      <MeterConfigEmphasisPlanSetting 
        v-model:emphasisPlan="emphasisPlan"
        :title="'二次计量'"
        :tips="''"
        :name="'emphasisPlanSetting'"
        :paramOptions="paramOptions"
        @save-config="saveConfig"
      />
    </div>

    <!-- 扩展信息 -->
    <div id="extend-info">
      <MeterConfigExtendConfigSetting 
        v-model:extendConfig="extendConfig"
        :title="'扩展信息'"
        :tips="''"
        :name="'extendConfigSetting'"
        :modulesChoose="modulesChoose"
        @save-config="saveConfig"
      />
    </div>

    <!-- 循环计量信息 -->
    <div id="loop-meter-info">
      <MeterConfigLoopMeterSetting 
        v-model:loopMeterInfo="loopMeterInfo"
        :title="'循环计量信息'"
        :tips="''"
        :name="'loopMeterSetting'"
        :paramOptions="paramOptions"
        @save-config="saveConfig"
      />
    </div>
    
  </div>
   <!-- 快速导航菜单 -->
    <div class="quick-nav">
      <div class="nav-content">
        <span class="nav-title">快速导航：</span>
        <el-scrollbar wrap-class="nav-scroll-wrap" max-height="80">
          <div class="nav-links">
            <div 
              v-for="item in navItems" 
              :key="item.id"
              class="nav-item"
              :class="{'nav-active': item.id === activeId}"
              @click="scrollToSection(item.id)"
            >
              {{ item.title }}
            </div>
          </div>
        </el-scrollbar>
        <el-button 
          type="text" 
          class="back-top-btn"
          @click="scrollToTop"
          title="返回顶部"
        >
          <el-icon><top /></el-icon>
        </el-button>
      </div>
    </div>

</template>

<script>
import { Setting, Collection, Plus, Check ,RefreshRight, Top} from '@element-plus/icons-vue'
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
import MeterConfigAddConfig from './MeterConfigChild/MeterConfigAddConfig.vue'
import { getAllMeterConfig,getAllStationTagKey,getStationCode,getAllTableName,updateMeterConfig,getExtendConfigEnum} from '@/api/configUtils/config'
import { getAllObjectInfoMap } from '@/api/configUtils/cacheData'
import { getAuthPermission } from '@/api/login/auth'

export default {
  name: 'MeterConfig',
  components: {
    Setting,
    Collection,
    Plus,
    Check,
    RefreshRight,
    Top,
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
    MeterConfigLoopMeterSetting,
    MeterConfigAddConfig
  },
  props: {
    isShowHeader: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      Plus,
      Check
    }
  },
  data() {
    return {
      // 快速导航菜单配置
      activeId: '',
      navItems: [
        { id: 'start-parameters', title: '启动设备参数设置' },
        { id: 'check-start-parameters', title: '启动检查参数设置' },
        { id: 'stop-parameters', title: '停止设备参数设置' },
        { id: 'check-stop-parameters', title: '停止检查参数设置' },
        { id: 'device-status-config', title: '设备状态枚举配置' },
        { id: 'wn-channel-number', title: '当前计量通道号' },
        { id: 'wm-channel-number', title: '上次计量通道号' },
        { id: 'plan-data-config', title: '计划数据配置' },
        { id: 'init-device-setting', title: '初始化设备数据设置' },
        { id: 'result-config', title: '计量结果配置' },
        { id: 'check-result', title: '出结果判断' },
        { id: 'param-uncompress', title: '参数解压设置' },
        { id: 'change-param', title: '可修改参数选择' },
        { id: 'secondary-measurement', title: '二次计量' },
        { id: 'extend-info', title: '扩展信息' },
        { id: 'loop-meter-info', title: '循环计量信息' }
      ],
      PromiseWrite: getAuthPermission('config:write'),
      PromiseRead: getAuthPermission('config:read'),
      //基础信息
      baseData:{
        name:'',
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
        allParam:[],
        enums: [{ 
          tag_value: [ {value:0,code_id:''}], 
          status: '' 
        }],
        statusEnumClassification: {
          run_status: [],
          stop_status: []
        }
      },
      // 新增配置对话框
      addConfigVisible: false,
      // 计量站选项
      stationOptions: [],
      // 模板配置选项
      templateOptions: [],
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
      paramUncompress: [{ code_id: '', value: 0 }],


      //模块选择
      modulesChoose: [ ],
      //全部模块功能枚举
      modulesBase:[],
      //参数选择
      paramOptions: [
        { code_id:'',desc:''}
      ],
      //数据表名
      tableOptions: [
        // { label: '表1', value: 'table1' },
        // { label: '表2', value: 'table2' }
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
        const allTable = await getAllTableName()
        const extendConfigEnum = await getExtendConfigEnum()
        const objectInfoMap = await getAllObjectInfoMap()
        this.modulesBase = extendConfigEnum
        this.modulesChoose = extendConfigEnum.map(item => ({
          label: item.desc,
          value: item.index
        }))
        this.allMeterConfig =data
        this.templateOptions = data.map(item => ({
          label: item.name,
          value: item.config_id
        }))
        this.allStations = stationIds.map(stationId => {
          const stationInfo = objectInfoMap.get(`${stationId}_METER_STATION`) || {}
          const stationName = stationInfo.objectName || stationId
          return {
            label: stationName,
            value: stationId
          }
        })
        this.stationOptions = this.allStations
        this.tableOptions = allTable.table_names.map(name => ({
          label: name,
          value: name
        }))
        
        // 数据加载完成后检查路由参数
        if (this.$route.params.id) {
          this.baseData.configId = this.$route.params.id
          this.handleConfigChange(this.$route.params.id)
        }
      } catch (error) {
        console.error('初始化配置的站列表失败:', error)
        this.$message.error('初始化配置的站列表失败')
      }
    },
    initConfig(){
      const config = this.baseData.config

      this.startParameters = config.start_device  || [{ code_id: '', value: 0 }]
      this.stopParameters = config.stop_device || [{ code_id: '', value: 0 }]

      this.checkStartParameters = 
      config.check_start_device ? config.check_start_device.flatMap(item =>{
        return item.value.map(val => ({ code_id: item.code_id, value: val }))
      }) : [{ code_id: '', value: 0 }]
      this.checkStopParameters = config.check_stop_device ? config.check_stop_device.flatMap(item =>{
        return item.value.map(val => ({ code_id: item.code_id, value: val }))
      }) : [{ code_id: '', value: 0 }]

      //通道号设置
      this.wnChannelNumber = config.wn || ''
      this.wmChannelNumber = config.wm || ''

      //计划数据
      this.planTableInfo={
        tableName: config.plan_table ? config.plan_table.table || '' : '',
        sql:config.plan_table ? config.plan_table.sql || '' : '',
        tong_dao_column:config.plan_table ? config.plan_table.tong_dao_column || '' : '',
        column:config.plan_table ? config.plan_table.column.map(item => ({set:item.set,check:item.check,column:item.column || item.cloumn})) || [ {set:'',check:'',column:''} ] : []
      }
      
      //初始化设备数据设置
      this.initDeviceMappings= config.init_device || []

      //计量结果配置
      this.resultTableInfo= {
        resultGroups: config.result ? config.result.map(item => ({
          name: item.name || 'result1',
          save_type: item.save_type || '',
          table: item.table || '',
          column: Object.entries(item.column || {}).map(([key, value]) => ({ dbColumnField: key,  params: value })) || [{ dbColumnField: '', params: [] }]
        })) : []
      }

      //出结果判断
      this.resultCheck= 
      config.check_result ? {
        relation: config.check_result.relation || '',
        checks:  config.check_result.condition.map(item => ({ param: item.code_id || '', expression: item.expression || '' })) || [] 
      } : 
      { relation: '',  checks: []  }

      //可变参数选择
      this.changeParam= {
        params: config.change_code_id || []
      }

      //参数解压
      this.paramUncompress=  Object.entries(config.code_id_uncompress || {}).map(([key, value]) => 
      ({ code_id: key,  value: value })) || [{ code_id: '', value: 0 }]

      //循环计量信息
      this.loopMeterInfo= {
        paramName: config.meter_loop ? config.meter_loop.code_id || '' : '',
        enable: config.meter_loop_enable|| false
      }

      //扩展信息
      // 扩展信息：全链路判空，避免任意层级属性/方法调用报错
      // 1. 先逐层解构+兜底，避免深层属性访问报错
      const extendConfig = config.extend_config || {}; // 兜底extend_config
      const getResultTags = extendConfig.get_result_tags || {}; // 兜底get_result_tags
      const filterRealMeterData = extendConfig.filter_real_meter_data || {}; // 兜底filter_real_meter_data

      // 2. 封装通用查找方法（减少冗余，统一判空逻辑）
      const findModule = (moduleVal, funcVal) => {
        // 先判断modulesBase是有效数组，且module/func有值，再执行find
        if (!Array.isArray(this.modulesBase) || !moduleVal || !funcVal) {
          return null;
        }
        // find回调中先判空item，再比较属性
        return this.modulesBase.find(item => 
          item && item.module === moduleVal && item.func === funcVal
        );
      };

      // 3. 查找匹配模块（传入兜底后的module/func）
      const selectedModules1 = findModule(getResultTags.module, getResultTags.func);
      const selectedModules2 = findModule(filterRealMeterData.module, filterRealMeterData.func);

      // 4. 赋值extendConfig：对查找结果兜底，避免访问index报错
      this.extendConfig = {
        meterResultBind: selectedModules1?.index || '', // 可选链+默认值
        filterRealTime: selectedModules2?.index || ''   // 可选链+默认值
      };

      //二次计量
      this.emphasisPlan= 
      config.emphasis_plan ?
      {
        plan: config.emphasis_plan.plan || { set: '', check: '', value: 0 },
        plan_time: config.emphasis_plan.plan_time || { set: '', check: '' },
        plan_sort: config.emphasis_plan.plan_sort || { set: '', check: '' }
      } : {
        plan: { set: '', check: '', value: 0 },
        plan_time: { set: '', check: '' },
        plan_sort: { set: '', check: '' }
      };

      //设备状态枚举
      this.deviceStatusConfig = {
        allParam:config.device_status ? config.device_status.code_ids || []: [],
        enums: config.device_status ? structuredClone(config.device_status.status) || [{  tag_value: [],    status: ''  }]: [],
        statusEnumClassification: {
          run_status: config.run_status || [],
          stop_status: config.stop_status || [] 
        }
      };
      console.log('设备状态枚举配置:', this.deviceStatusConfig)

    },
    //新增配置
    addConfig() {
      this.addConfigVisible = true
    },
    //处理新增配置保存
    async handleAddConfigSave(formData){
      const templateId = formData.templateId || ''
      const data = {
          config_id: formData.configId,
          name: formData.configName,
          meter_station_id:formData.stationId
      }
      if(templateId !== ''){
        const selectedItem = this.allMeterConfig.find(item => item.config_id === templateId)  
        data.config = structuredClone(selectedItem.config)
      } else {
        data.config = {}
      }
      try {
        await  updateMeterConfig(data)
        this.$message.success('配置新增成功')
      } catch (error) {
        console.error('新增配置失败:', error)
        this.$message.error('新增配置失败')
      }
      //关闭新增窗口
      this.addConfigVisible = false
      //刷新配置
      const meterData = await getAllMeterConfig()
      this.allMeterConfig = meterData
      this.templateOptions = meterData.map(item => ({
        label: item.name,
        value: item.config_id
      }))
    },
    //重置配置
    resetConfig() {
      // 重置所有配置项到默认值
      if(!this.baseData.configId || this.baseData.configId === ''){
        this.$message.error('请选择配置')
        return
      }else {
        const selectedItem = this.allMeterConfig.find(item => item.config_id === this.baseData.configId)
        this.baseData.config = structuredClone(selectedItem.config)
        this.initConfig()
        this.$message.info('重置修改')
      }
    },
    //保存配置
    async saveAllConfig(){
      // 定义需要更新的配置项数组
      const configsToUpdate = [
        'startCode', 'checkStartCode', 'stopCode', 'checkStopCode',
        'deviceStatusCode', 'wnChannelNumber', 'wmChannelNumber', 'planSetinfo',
        'initDeviceSetting', 'resultSetting', 'checkResultSetting', 'paramUncompress',
        'changeParamSetting', 'emphasisPlanSetting', 'extendConfigSetting', 'loopMeterSetting'
      ];
      
      // 遍历并检查每个配置项的更新结果
      for (const configName of configsToUpdate) {
        const result = this.updateConfig(configName);
        // 如果有错误，提示错误信息并终止执行
        if (result && result.result === false) {
          this.$message.error(result.error);
          return;
        }
      }
      // 所有配置项更新成功后，执行保存
      await this.saveAllConfigApi()
    },
    async saveConfig(name) {
      const result =  this.updateConfig(name)
      if(!result.result){
        console.error(`更新${name}配置失败:${result.error}`)
        this.$message.error(`更新${name}配置失败:${result.error}`)
      }else {
        this.saveAllConfigApi()
      }
    },
    updateConfig(name) {
      //startCode
      //checkStartCode
      //stopCode
      //checkStopCode
      //deviceStatusCode
      //wnChannelNumber
      //wmChannelNumber
      //planSetinfo
      //initDeviceSetting
      //resultSetting
      //checkResultSetting
      //paramUncompress
      //changeParamSetting
      //emphasisPlanSetting
      //extendConfigSetting
      //loopMeterSetting
      switch(name){
        case "startCode":
          this.baseData.config.start_device = this.startParameters.filter(item => item.code_id !== '')
          if(this.baseData.config.start_device.length === 0) return {result:false,error:'启动设备参数不能为空'}
          break
        case "checkStartCode":{
          const cache = {};
          this.checkStartParameters.forEach(item => {
            const { code_id, value } = item;
            if (!cache[code_id])  cache[code_id] = []
            cache[code_id].push(value);
          });
          this.baseData.config.check_start_device = Object.keys(cache).map(code_id => ({
            code_id:code_id,
            value: cache[code_id]
          })).filter(item => item.code_id !== '' && item.value.length > 0)
          break;
        }
        case "stopCode":
          this.baseData.config.stop_device = this.stopParameters.filter(item => item.code_id !== '')
          if(this.baseData.config.stop_device.length === 0) return {result:false,error:'停止设备参数不能为空'}
          break
        case "checkStopCode":{
          const cache = {};
          this.checkStopParameters.forEach(item => {
            const { code_id, value } = item;
            if (!cache[code_id])  cache[code_id] = []
            cache[code_id].push(value);
          });
          this.baseData.config.check_stop_device = Object.keys(cache).map(code_id => ({
            code_id:code_id,
            value: cache[code_id]
          })).filter(item => item.code_id !== '' && item.value.length > 0)
          break;
        }
        case "deviceStatusCode":
          this.baseData.config.device_status = this.baseData.config.device_status ||{}
          this.baseData.config.device_status.code_ids = this.deviceStatusConfig.allParam  
          this.baseData.config.device_status.status = this.deviceStatusConfig.enums.map(item=>({
            tag_value: item.tag_value.map(tag => ({value:tag.value,code_id:tag.code_id})).filter(tag => tag.code_id !== ''),
            status: item.status
          })).filter(item => item.tag_value.length > 0) || []
          this.baseData.config.run_status = this.deviceStatusConfig.statusEnumClassification.run_status || []
          this.baseData.config.stop_status = this.deviceStatusConfig.statusEnumClassification.stop_status || []
          if(this.baseData.config.device_status.status.length === 0) return {result:false,error:'设备状态枚举不能为空'}
          if(this.baseData.config.run_status.length === 0) return {result:false,error:'运行状态枚举不能为空'}
          if(this.baseData.config.stop_status.length === 0) return {result:false,error:'停止状态枚举不能为空'}
          break
        case "wnChannelNumber":
          this.baseData.config.wn = this.wnChannelNumber
          if(this.baseData.config.wn === '') return {result:false,error:'通道号模板不能为空'}
          break
        case "wmChannelNumber":
          this.baseData.config.wm = this.wmChannelNumber
          if(this.baseData.config.wm === '') return {result:false,error:'通道号模板不能为空'}
          break
        case "planSetinfo":
          this.baseData.config.plan_table = this.baseData.config.plan_table || {}
          this.baseData.config.plan_table.table = this.planTableInfo.tableName
          this.baseData.config.plan_table.sql = this.planTableInfo.sql
          this.baseData.config.plan_table.tong_dao_column = this.planTableInfo.tong_dao_column
          this.baseData.config.plan_table.column = this.planTableInfo.column.filter(item => item.set !== '' && item.check !== '' && item.column !== '')
          
          if(this.baseData.config.plan_table.table  === '') return {result:false,error:'计划表不能为空'}
          if(this.baseData.config.plan_table.sql  === '') return {result:false,error:'读取计划sql不能为空'}
          if(this.baseData.config.plan_table.tong_dao_column  === '') return {result:false,error:'通道列不能为空'}
          if(this.baseData.config.plan_table.column.length === 0) return {result:false,error:'计划下发数据列不能为空'}
          break
        case "initDeviceSetting":
          this.baseData.config.init_device = this.initDeviceMappings.filter(item => item.code_id !== '')
          break
        case "resultSetting":
          this.baseData.config.result = this.resultTableInfo.resultGroups.map(item => ({
            name: item.name || 'result1',
            save_type: item.save_type || '',
            table: item.table || '',
            column: item.column.reduce((acc, cur) => ({
              ...acc,
              [cur.dbColumnField]: cur.params
            }), {}) || {}
          }))
          if(this.baseData.config.result.length === 0 ) return {result:false,error:'计量结果不能为空'}
          break
        case "checkResultSetting":
          this.baseData.config.check_result = {
            relation: this.resultCheck.relation || '',
            condition: this.resultCheck.checks.map(item => ({
              code_id: item.param || '',
              expression: item.expression || ''
            })).filter(item => item.param !== '' && item.expression !== '') || []
          }
          if(this.baseData.config.check_result.relation === '') return {result:false,error:'判断关系不能为空'}
          if(this.baseData.config.check_result.condition.length === 0) return {result:false,error:'判断条件不能为空'}
          break
        case "paramUncompress":
          this.baseData.config.code_id_uncompress = this.paramUncompress.reduce((acc, cur) => ({
            ...acc,
            [cur.code_id]: cur.value
          }), {}) || {}
          break
        case "changeParamSetting":
          this.baseData.config.change_code_id = this.changeParam.params
          break
        case "emphasisPlanSetting":
          this.baseData.config.emphasis_plan = this.baseData.config.emphasis_plan || {}
          this.baseData.config.emphasis_plan.plan = this.baseData.config.emphasis_plan.plan || {}
          this.baseData.config.emphasis_plan.plan_time = this.baseData.config.emphasis_plan.plan_time || {}
          this.baseData.config.emphasis_plan.plan_sort = this.baseData.config.emphasis_plan.plan_sort || {}
          //
          if( !this.isInvalidValue(this.emphasisPlan.plan.set)  &&  !this.isInvalidValue(this.emphasisPlan.plan.check)){
            this.baseData.config.emphasis_plan.plan = this.emphasisPlan.plan
          }else {
            delete this.baseData.config.emphasis_plan.plan
          }
          //
          if( !this.isInvalidValue(this.emphasisPlan.plan_time.set)  &&  !this.isInvalidValue(this.emphasisPlan.plan_time.check)){
            this.baseData.config.emphasis_plan.plan_time = this.emphasisPlan.plan_time
          }else {
            delete this.baseData.config.emphasis_plan.plan_time
          }
          //
          if( !this.isInvalidValue(this.emphasisPlan.plan_sort.set)  &&  !this.isInvalidValue(this.emphasisPlan.plan_sort.check)){
            this.baseData.config.emphasis_plan.plan_sort = this.emphasisPlan.plan_sort
          }else {
            delete this.baseData.config.emphasis_plan.plan_sort
          }
          if( this.isEmptyObject(this.baseData.config.emphasis_plan)){
            delete this.baseData.config.emphasis_plan
          }
          break
        case "extendConfigSetting":
          this.baseData.config.extend_config = this.baseData.config.extend_config || {}
          this.baseData.config.extend_config.get_result_tags = this.baseData.config.extend_config.get_result_tags || {}
          this.baseData.config.extend_config.filter_real_meter_data = this.baseData.config.extend_config.filter_real_meter_data || {}
          this.baseData.config.extend_config.get_result_tags.module = this.modulesBase.find(item => item.index === this.extendConfig.meterResultBind)?.module || ''
          this.baseData.config.extend_config.get_result_tags.func = this.modulesBase.find(item => item.index === this.extendConfig.meterResultBind)?.func || ''
          this.baseData.config.extend_config.filter_real_meter_data.module = this.modulesBase.find(item => item.index === this.extendConfig.filterRealTime)?.module || ''
          this.baseData.config.extend_config.filter_real_meter_data.func = this.modulesBase.find(item => item.index === this.extendConfig.filterRealTime)?.func || ''
          
          if(this.baseData.config.extend_config.get_result_tags.module === '' && this.baseData.config.extend_config.get_result_tags.func === ''){
            delete this.baseData.config.extend_config.get_result_tags
          }
          //
          if(this.baseData.config.extend_config.filter_real_meter_data.module === '' && this.baseData.config.extend_config.filter_real_meter_data.func === ''){
            delete this.baseData.config.extend_config.filter_real_meter_data
          }
          if(this.isEmptyObject(this.baseData.config.extend_config)){
            delete this.baseData.config.extend_config
          }
          break
        case "loopMeterSetting":
          this.baseData.config.meter_loop = this.baseData.config.meter_loop || {}
          this.baseData.config.meter_loop.code_id = this.loopMeterInfo.paramName
          this.baseData.config.meter_loop_enable = this.loopMeterInfo.enable
          if(this.baseData.config.meter_loop.code_id === ''){
            delete this.baseData.config.meter_loop
          }
          break
      }
      return {result:true,error:''}
    },
    async saveAllConfigApi(){
      try {
        const data = {
          config_id: this.baseData.configId,
          name: this.baseData.name,
          config:structuredClone(this.baseData.config),
          meter_station_id:this.baseData.stationId
        }
        await updateMeterConfig(data)
      } catch (error) {
        console.error('保存所有配置失败:', error)
        this.$message.error('保存所有配置失败')
        return
      }
      this.$message.success('保存所有配置成功')
    },

    isEmptyObject(obj) {
      // 1. 先判断类型是否为 object（排除 null、undefined、基本类型）
      if (typeof obj !== 'object' || obj === null) {
        return false;
      }
      // 2. 排除数组（数组也是 object 类型）
      if (Array.isArray(obj)) {
        return false;
      }
      // 3. 判断是否有可枚举属性
      return Object.keys(obj).length === 0;
    },
    isInvalidValue(value) {
      return value === undefined || value === null || value === '';
    },
    //配置选择变更事件
    async handleConfigChange(configId) {
      const selectedItem = this.allMeterConfig.find(item => item.config_id === configId)
      this.baseData.config = structuredClone(selectedItem.config)
      this.baseData.stationId = selectedItem.meter_station_id
      this.baseData.name = selectedItem.name
      //变更配置信息
      this.initConfig()
      this.handleStationChange(selectedItem.meter_station_id)
    },
    //站选择变更事件
    async handleStationChange(stationId) {
      try {
        const data = await getStationCode(stationId)
        this.paramOptions = data || [{ code_id: '', desc: '' }]
      } catch (error) {
        console.error('获取站参数失败:', error)
        this.$message.error('获取站参数失败')
      }
    },

    //启动参数设置 启动检查参数设置、停止设备参数设置、停止检查参数设置 增加删除
    addParameter(name){
      switch(name){
        case "startCode":
          this.startParameters.push({ code_id: '', value: 0 })
          break
        case "checkStartCode":
          this.checkStartParameters.push({ code_id: '', value: 0 })
          break
        case "stopCode":
          this.stopParameters.push({ code_id: '', value: 0 })
          break
        case "checkStopCode":
          this.checkStopParameters.push({ code_id: '', value: 0 })
          break
        case "initDeviceSetting":
          this.initDeviceMappings.push({ set: '', check: '', value: 0 })
          break
        case "deviceStatusCode":
          this.deviceStatusConfig.enums.push({ tag_value: [{ value: 0 ,code_id: ''}], status: '' })
          break
        case "paramUncompress":
          this.paramUncompress.push({ code_id: '', value: 0 })
          break
      }
    },

    removeParameter(name, index){
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
    updateDeviceStatusEnums(deviceEnum){
      this.deviceStatusConfig.enums = deviceEnum
    },
    updateDeviceStatusAllParam(allParam){
      this.deviceStatusConfig.allParam = allParam
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

    // 快速导航 - 滚动到指定部分
    scrollToSection(id) {
      // 更新当前激活项
      this.activeId = id
      const element = document.getElementById(id)
      if (element) {
        const offsetTop = element.offsetTop
        const meterConfigElement = document.querySelector('.meter-config')
        if (meterConfigElement) {
          meterConfigElement.scrollTo({
            top: offsetTop - 20,
            behavior: 'smooth'
          })
        }
      }
    },

    // 快速导航 - 返回顶部
    scrollToTop() {
      const meterConfigElement = document.querySelector('.meter-config')
      if (meterConfigElement) {
        meterConfigElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    },

  }
}
</script>

<style scoped>
.meter-config {
  padding: 24px;
  background: #f5f7fa;
  min-height: 74vh;
  max-height: 74vh;
  overflow-y: auto;
}

/* 快速导航菜单样式 */
.quick-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ebf8fd;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 0px;
  padding: 12px 16px;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-title {
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.nav-scroll-wrap {
  flex: 2;
  overflow: visible;
}

.nav-links {
  height: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.nav-item {
  padding: 6px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: #ecf5ff;
  color: #409eff;
}

.nav-active {
  background: #ecf5ff;
  color: #2793ff;
}



.back-top-btn {
  color: #606266;
  font-size: 18px;
  transition: all 0.3s ease;
}

.back-top-btn:hover {
  color: #409eff;
}

/* 导航项自动换行，不再需要滚动条 */

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

.config-select  {
  width: 300px;
}

.station-select {
  width: 400px;
}
</style>
