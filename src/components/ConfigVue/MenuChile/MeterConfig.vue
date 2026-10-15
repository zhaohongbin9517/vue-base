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

    <!-- 工作区：左菜单 / 中间配置项 / 右侧 JSON 预览 -->
    <div class="config-workspace">
      <!-- 左侧菜单 -->
      <aside class="side-menu">
        <div class="side-menu__head">
          <span class="side-menu__title">配置导航</span>
          <span class="side-menu__count">{{ navItems.length }}</span>
        </div>
        <el-scrollbar class="side-menu__scroll" height="100%">
          <div class="side-menu__list">
            <div
              v-for="item in navItems"
              :key="item.id"
              class="side-menu__item"
              :class="{ 'is-active': item.id === activeSection }"
              @click="selectSection(item.id)"
            >
              <span
                class="side-menu__icon"
                :style="{ '--item-color': item.color, color: item.color, background: item.bg }"
              >
                <el-icon><component :is="item.icon" /></el-icon>
              </span>
              <span class="side-menu__text">
                <span class="side-menu__label">{{ item.title }}</span>
                <span class="side-menu__sub">{{ item.id }}</span>
              </span>
              <el-icon v-if="item.id === activeSection" class="side-menu__chev"><ArrowRight /></el-icon>
            </div>
          </div>
        </el-scrollbar>
      </aside>

      <!-- 中间：当前配置项（固定高度，内部滚动） -->
      <section class="section-panel">
          <div class="section-panel__head">
            <span class="section-panel__title">{{ activeSectionTitle }}</span>
            <span class="section-panel__tag">SECTION</span>
          </div>
          <div class="section-panel__scroll">
            <div class="section-panel__body">
              <!-- 启动设备参数设置 -->
              <div v-show="activeSection === 'start-parameters'" id="start-parameters">
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
              <div v-show="activeSection === 'check-start-parameters'" id="check-start-parameters">
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
              <div v-show="activeSection === 'stop-parameters'" id="stop-parameters">
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
              <div v-show="activeSection === 'check-stop-parameters'" id="check-stop-parameters">
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
              <!-- 设备状态枚举配置 -->
              <div v-show="activeSection === 'device-status-config'" id="device-status-config">
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
              <!-- 通道号设置 -->
              <div v-show="activeSection === 'wn-channel-number'" id="wn-channel-number">
                <MeterConfigMeterTongDaoSetting
                  :channelNumber="wnChannelNumber"
                  :title="'当前计量通道号'"
                  :name="'wnChannelNumber'"
                  :param-options="paramOptions"
                  @update:channelNumber="updateChannelNumber"
                  @save-config="saveConfig"
                />
              </div>
              <div v-show="activeSection === 'wm-channel-number'" id="wm-channel-number">
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
              <div v-show="activeSection === 'plan-data-config'" id="plan-data-config">
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
              <div v-show="activeSection === 'init-device-setting'" id="init-device-setting">
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
              <div v-show="activeSection === 'result-config'" id="result-config">
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
              <div v-show="activeSection === 'check-result'" id="check-result">
                <MeterConfigCheckResultSetting
                  v-model:resultCheck="resultCheck"
                  :title="'出结果判断'"
                  :tips="''"
                  :name="'checkResultSetting'"
                  :paramOptions="paramOptions"
                  @save-config="saveConfig"
                />
              </div>
              <!-- 参数解压 -->
              <div v-show="activeSection === 'param-uncompress'" id="param-uncompress">
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
              <div v-show="activeSection === 'change-param'" id="change-param">
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
              <div v-show="activeSection === 'secondary-measurement'" id="secondary-measurement">
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
              <div v-show="activeSection === 'extend-info'" id="extend-info">
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
              <div v-show="activeSection === 'loop-meter-info'" id="loop-meter-info">
                <MeterConfigLoopMeterSetting
                  v-model:loopMeterInfo="loopMeterInfo"
                  :title="'循环计量信息'"
                  :tips="''"
                  :name="'loopMeterSetting'"
                  :paramOptions="paramOptions"
                  @save-config="saveConfig"
                />
              </div>
              <!-- 计量井人工状态检查 -->
              <div v-show="activeSection === 'check-manual-status'" id="check-manual-status">
                <MeterConfigCheckMmanualStatusSetting
                  v-model:checkMeasureStatusBase="checkMeasureStatusBase"
                  :title="'计量井人工状态检查'"
                  :tips="''"
                  :name="'checkMeasureStatusSetting'"
                  :paramOptions="paramOptions"
                  @update-measure-status="updateMeasureStatus"
                  @save-config="saveConfig"
                />
              </div>
              <!-- 就地远程组件 -->
              <div v-show="activeSection === 'long-range'" id="long-range">
                <MeterConfigLongRangeSetting
                  v-model:config="longRangeConfig"
                  :title="'就地远程组件'"
                  :tips="''"
                  :name="'longRangeSetting'"
                  :paramOptions="paramOptions"
                  @update-long-range="updateLongRange"
                  @save-config="saveConfig"
                />
              </div>
              <!-- 设备启动预检查 -->
              <div v-show="activeSection === 'device-check'" id="device-check">
                <MeterConfigDeviceCheckSetting
                  v-model:deviceCheck="deviceCheck"
                  :title="'设备启动预检查'"
                  :tips="''"
                  :name="'deviceCheckSetting'"
                  :stationOptions="allStations"
                  :paramOptions="paramOptions"
                  @save-config="saveConfig"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- 右下：保存结果 JSON 预览 -->
        <section class="json-panel">
          <div class="json-panel__head">
            <span class="json-panel__title">配置 JSON 预览</span>
            <div class="json-panel__actions">
              <el-button size="small" text @click="copyConfigJson">
                <el-icon style="margin-right: 4px"><DocumentCopy /></el-icon>复制
              </el-button>
            </div>
          </div>
          <div class="json-panel__scroll">
            <pre class="json-panel__pre">{{ configJsonPreview }}</pre>
          </div>
        </section>
    </div>

  </div>

</template>

<script>
import { Setting, Collection, Plus, Check ,RefreshRight, DocumentCopy, ArrowRight,
  VideoPlay, CircleCheck, VideoPause, CircleClose, Grid, Odometer, Stopwatch,
  Notebook, SetUp, DataAnalysis, Finished, FolderOpened, EditPen, CopyDocument,
  InfoFilled, Timer, View, Compass, Aim } from '@element-plus/icons-vue'
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
import MeterConfigCheckMmanualStatusSetting from './MeterConfigChild/MeterConfigCheckMmanualStatusSetting.vue'
import { getAllMeterConfig,getAllStationTagKey,getStationCode,getAllTableName,updateMeterConfig,getExtendConfigEnum} from '@/api/configUtils/config'
import { getAllObjectInfoMap } from '@/api/configUtils/cacheData'
import { getAuthPermission } from '@/api/login/auth'
import MeterConfigLongRangeSetting from './MeterConfigChild/MeterConfigLongRangeSetting.vue'
import MeterConfigDeviceCheckSetting from './MeterConfigChild/MeterConfigDeviceCheckSetting.vue'

export default {
  name: 'MeterConfig',
  components: {
    Setting,
    Collection,
    Plus,
    Check,
    RefreshRight,
    DocumentCopy,
    ArrowRight,
    VideoPlay,
    CircleCheck,
    VideoPause,
    CircleClose,
    Grid,
    Odometer,
    Stopwatch,
    Notebook,
    SetUp,
    DataAnalysis,
    Finished,
    FolderOpened,
    EditPen,
    CopyDocument,
    InfoFilled,
    Timer,
    View,
    Compass,
    Aim,
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
    MeterConfigAddConfig,
    MeterConfigCheckMmanualStatusSetting,
    MeterConfigLongRangeSetting,
    MeterConfigDeviceCheckSetting
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
      // 左侧菜单 - 当前激活的配置项
      activeSection: 'start-parameters',
      navItems: [
        { id: 'start-parameters', title: '启动设备参数设置', icon: 'VideoPlay', color: '#d97706', bg: 'rgba(217,119,6,.12)' },
        { id: 'check-start-parameters', title: '启动检查参数设置', icon: 'CircleCheck', color: '#0d9488', bg: 'rgba(13,148,136,.12)' },
        { id: 'stop-parameters', title: '停止设备参数设置', icon: 'VideoPause', color: '#dc2626', bg: 'rgba(220,38,38,.12)' },
        { id: 'check-stop-parameters', title: '停止检查参数设置', icon: 'CircleClose', color: '#ea580c', bg: 'rgba(234,88,12,.12)' },
        { id: 'device-status-config', title: '设备状态枚举配置', icon: 'Grid', color: '#7c3aed', bg: 'rgba(124,58,237,.12)' },
        { id: 'wn-channel-number', title: '当前计量通道号', icon: 'Odometer', color: '#2563eb', bg: 'rgba(37,99,235,.12)' },
        { id: 'wm-channel-number', title: '上次计量通道号', icon: 'Stopwatch', color: '#4f46e5', bg: 'rgba(79,70,229,.12)' },
        { id: 'plan-data-config', title: '计划数据配置', icon: 'Notebook', color: '#16a34a', bg: 'rgba(22,163,74,.12)' },
        { id: 'init-device-setting', title: '初始化设备数据设置', icon: 'SetUp', color: '#0891b2', bg: 'rgba(8,145,178,.12)' },
        { id: 'result-config', title: '计量结果配置', icon: 'DataAnalysis', color: '#db2777', bg: 'rgba(219,39,119,.12)' },
        { id: 'check-result', title: '出结果判断', icon: 'Finished', color: '#65a30d', bg: 'rgba(101,163,13,.12)' },
        { id: 'param-uncompress', title: '参数解压设置', icon: 'FolderOpened', color: '#b45309', bg: 'rgba(180,83,9,.12)' },
        { id: 'change-param', title: '可修改参数选择', icon: 'EditPen', color: '#9333ea', bg: 'rgba(147,51,234,.12)' },
        { id: 'secondary-measurement', title: '二次计量', icon: 'CopyDocument', color: '#0284c7', bg: 'rgba(2,132,199,.12)' },
        { id: 'extend-info', title: '扩展信息', icon: 'InfoFilled', color: '#0f766e', bg: 'rgba(15,118,110,.12)' },
        { id: 'loop-meter-info', title: '循环计量信息', icon: 'Timer', color: '#c026d3', bg: 'rgba(192,38,211,.12)' },
        { id: 'check-manual-status', title: '计量井人工状态检查', icon: 'View', color: '#b91c1c', bg: 'rgba(185,28,28,.12)' },
        { id: 'long-range', title: '就地远程组件', icon: 'Compass', color: '#0369a1', bg: 'rgba(3,105,161,.12)' },
        { id: 'device-check', title: '设备启动预检查', icon: 'Aim', color: '#a16207', bg: 'rgba(161,98,7,.12)' },
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
      longRangeConfig: {
        show:{enable: false, code_id: '',  values:  { long_range: 1 , locally:0}},
        set: { enable: false, isCheck: false, code_id: '', values: { long_range: 1 ,locally:0} },
        check: { enable: false, code_id: '', value: 0 }
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
      //计量人工状态检查
      checkMeasureStatusBase: {
        station:{},  //站检查信息
        well:{}     //井检查信息
      },
      //设备检查
      deviceCheck: { rule_enum: [], station_choose: [] },


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
  computed: {
    // 当前激活配置项标题
    activeSectionTitle() {
      const item = this.navItems.find(i => i.id === this.activeSection)
      return item ? item.title : ''
    },
    // 保存结果 JSON 预览（实时跟随编辑）
    configJsonPreview() {
      try {
        return JSON.stringify(this.baseData.config ?? {}, null, 2)
      } catch (e) {
        return '{}'
      }
    }
  },
  mounted() {
    //初始化数据
    this.init()
  },
  methods: {
    // 深拷贝：解包 Vue reactive proxy（structuredClone 无法克隆 Proxy，会抛 DataCloneError）
    deepClone(value) {
      if (value === undefined || value === null) return value
      return JSON.parse(JSON.stringify(value))
    },
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
      if(config.result){
        if(Object.prototype.toString.call(config.result) === "[object Object]"){
          config.result = [config.result]
        }
      }else {
        config.result = []
      }
      this.resultTableInfo= {
        resultGroups:  
        config.result.map(item => ({
          name: item.name || 'result1',
          save_type: item.save_type || '',
          table: item.table || '',
          column: Object.entries(item.column || {}).map(([key, value]) => ({ dbColumnField: key,  params: value })) || [{ dbColumnField: '', params: [] }]
        }))
      }
      //出结果判断
      if(!config.check_result.relation){
        if(Object.prototype.toString.call(config.check_result) === "[object Object]"){
          const newConfigResult = {relation:"and",condition:[config.check_result]}
          config.check_result = newConfigResult
        }
      }
      this.resultCheck= 
      config.check_result ? {
        relation: config.check_result.relation || '',
        checks:  config.check_result.condition.map(item => ({ param: item.code_id || '', expression: item.expression || '' })) || [] 
      } : 
      { relation: '',  checks: [] }

      //计量人工状态检查
      this.checkMeasureStatusBase = config.check_measure_status_base ? config.check_measure_status_base : this.checkMeasureStatusBase

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
      //就地远程组件
      this.longRangeConfig= config.long_range? config.long_range : this.longRangeConfig

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
      const localDeviceStatus = config.device_status || {}
      if(localDeviceStatus.code_id && !config.device_status.code_ids){ //适配旧结构
        config.device_status.code_ids = [config.device_status.code_id]
        config.device_status.status = localDeviceStatus.status.map(item =>({
            tag_value:[{code_id:localDeviceStatus.code_id,value:item.value || 0}],
            status:item.status || ''
        }))
      }
      this.deviceStatusConfig = {
        allParam:config.device_status ? config.device_status.code_ids || []: [],
        enums: config.device_status ? this.deepClone(config.device_status.status) || [{  tag_value: [],    status: ''  }]: [],
        statusEnumClassification: {
          run_status: config.run_status || [],
          stop_status: config.stop_status || [] 
        }
      };

      //设备检查
      const dc = config.device_check || {}
      this.deviceCheck = {
        rule_enum: dc.rule_enum || [],
        station_choose: dc.station_choose || []
      }
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
        data.config = this.deepClone(selectedItem.config)
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
        this.baseData.config = this.deepClone(selectedItem.config)
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
        'changeParamSetting', 'emphasisPlanSetting', 'extendConfigSetting', 'loopMeterSetting', 
        'checkMeasureStatusSetting','longRangeSetting','deviceCheckSetting'
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
        case "checkMeasureStatusSetting":
          this.baseData.config.check_measure_status_base = this.checkMeasureStatusBase
          break
        case "longRangeSetting":
          this.baseData.config.long_range = this.longRangeConfig
          break
        case "deviceCheckSetting": {
          const validRules = (this.deviceCheck.rule_enum || []).filter(r => r.check !== '')
          const validRuleIds = new Set(validRules.map(r => r.id))
          this.baseData.config.device_check = {
            rule_enum: validRules.map(r => ({ id: r.id, check: r.check })),
            station_choose: (this.deviceCheck.station_choose || [])
              .filter(s => s.station_id !== '' && s.rule_id !== '' && validRuleIds.has(s.rule_id))
              .map(s => ({ station_id: s.station_id, rule_id: s.rule_id }))
          }
          break
        }
      }
      if(this.baseData.configId === ''){
        return {result:false,error:'请先选择配置'}
      }
      return {result:true,error:''}
    },
    async saveAllConfigApi(){
      try {
        const data = {
          config_id: this.baseData.configId,
          name: this.baseData.name,
          config: this.deepClone(this.baseData.config),
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
      this.baseData.config = this.deepClone(selectedItem.config)
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
    //更新计量检查
    updateMeasureStatus(name, newMeasureStatus){
      if(name !== 'checkMeasureStatusSetting') return
      this.checkMeasureStatusBase = newMeasureStatus
    },
    //就地远程组件
    updateLongRange(name, newLongRange){
      if(name !== 'longRangeSetting') return
      this.longRangeConfig = newLongRange
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

    // 左侧菜单 - 切换当前配置项
    selectSection(id) {
      this.activeSection = id
    },

    // 复制配置 JSON 到剪贴板
    async copyConfigJson() {
      const text = this.configJsonPreview
      try {
        await navigator.clipboard.writeText(text)
        this.$message.success('JSON 已复制')
      } catch (e) {
        // 剪贴板 API 不可用（非安全上下文）时回退到 textarea 方案
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        try {
          document.execCommand('copy')
          this.$message.success('JSON 已复制')
        } catch (err) {
          this.$message.error('复制失败')
        }
        document.body.removeChild(ta)
      }
    },

  }
}
</script>

<style scoped>
.meter-config {
  padding: 0 0 var(--space-7) 0;
  background: transparent;
}

/* —— 页面标题 —— */
.page-header {
  margin-bottom: var(--space-6);
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ink-1);
  margin: 0 0 var(--space-2) 0;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  letter-spacing: -0.01em;
}

.title-icon {
  font-size: 1.25rem;
  color: var(--ink-1);
}

.page-desc {
  font-family: var(--font-serif);
  color: var(--ink-3);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.6;
}

/* —— 卡片 —— */
.config-card {
  margin-bottom: var(--space-5);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink-1);
}

.header-icon {
  font-size: 1.125rem;
  color: var(--ink-2);
}

/* —— 基础配置 —— */
.base-config {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.config-select {
  width: 300px;
}

.station-select {
  width: 400px;
}

/* ============================================================
   工作区：左菜单 / 中间配置项 / 右侧 JSON 预览
   ============================================================ */
.config-workspace {
  display: grid;
  /* 10% : 70% : 20%（按扣除 gap 后的可用宽度分配） */
  grid-template-columns: 1.5fr 6.5fr 2fr;
  gap: var(--space-5);
  align-items: stretch;
  height: 890px;
}

/* —— 左侧菜单 —— */
.side-menu {
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  border: 1px solid var(--border-hair);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
}

.side-menu__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-2);
  border-bottom: 1px solid var(--border-hair);
  background: var(--bg-subtle);
  flex-shrink: 0;
}

.side-menu__title {
  font-family: var(--font-serif);
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.side-menu__count {
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.625rem;
  color: var(--ink-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-hair);
  border-radius: 999px;
  padding: 1px 5px;
  flex-shrink: 0;
}

.side-menu__scroll {
  flex: 1;
  min-height: 0;
}

.side-menu__list {
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.side-menu__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 8px var(--space-3);
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--duration) var(--ease);
}

.side-menu__item:hover {
  background: var(--bg-subtle);
}

/* 激活项：暖奶油底 + 琥珀描边（仿参考图） */
.side-menu__item.is-active {
  background: #f6e9d4;
  border-color: #e2cda6;
}

/* 彩色图标方块 */
.side-menu__icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  transition: all var(--duration) var(--ease);
}

/* 激活时图标反白填充 */
.side-menu__item.is-active .side-menu__icon {
  background: var(--item-color) !important;
  color: #fff !important;
}

.side-menu__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.side-menu__label {
  font-family: var(--font-serif);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-1);
  line-height: 1.3;
  word-break: break-word;
}

.side-menu__sub {
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace;
  font-size: 9.5px;
  color: var(--ink-3);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-menu__item.is-active .side-menu__label {
  color: #7c4a03;
}

.side-menu__item.is-active .side-menu__sub {
  color: #a8752c;
}

.side-menu__chev {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 14px;
  color: #b45309;
}

/* —— 中间：配置项面板（内部滚动） —— */
.section-panel {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  border: 1px solid var(--border-hair);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
}

.section-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-hair);
  background: var(--bg-subtle);
  flex-shrink: 0;
}

.section-panel__title {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink-1);
}

.section-panel__tag {
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  color: var(--ink-3);
  border: 1px solid var(--border-hair);
  border-radius: 3px;
  padding: 2px 6px;
  background: var(--bg-surface);
}

.section-panel__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.section-panel__body {
  padding: var(--space-4);
}

/* 隐藏未激活的 section，同时避免占位间隙 */
.section-panel__body > div[v-show],
.section-panel__body > div[style*="display: none"] {
  margin: 0;
}

/* —— 右侧：JSON 预览 —— */
.json-panel {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #beb7b6;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
}

.json-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid #292524;
  background: #ffffff;
  flex-shrink: 0;
}

.json-panel__title {
  font-family: var(--font-serif);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
  color: #a8a29e;
}

.json-panel__actions :deep(.el-button) {
  color: #251d17;
}

.json-panel__actions :deep(.el-button):hover {
  color: #3ec2ff;
}

.json-panel__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.json-panel__pre {
  margin: 0;
  padding: var(--space-4);
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: #3a37f0;
  white-space: pre;
  tab-size: 2;
}
</style>
