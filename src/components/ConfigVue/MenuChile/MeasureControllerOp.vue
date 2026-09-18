<template>
  <div class="mc-panel">
    <!-- 头部条 -->
    <header class="mc-header">
      <div class="mc-header__left">
        <span class="mc-header__dot" :class="`mc-header__dot--${activeColor}`"></span>
        <h1 class="mc-header__title">计量站控制台</h1>
        <span class="mc-header__sub">MEASURE STATION CONTROL</span>
      </div>
      <div class="mc-header__right">
        <span class="mc-header__meta">{{ stationOptions.length }} STATIONS</span>
      </div>
    </header>

    <!-- 主体：左右结构 -->
    <div class="mc-body">
      <!-- 左侧：操作列表 -->
      <aside class="mc-aside">
        <div class="mc-aside__label">操作指令</div>
        <nav class="mc-nav">
          <button
            v-for="op in operations"
            :key="op.key"
            class="mc-nav__item"
            :class="{ 'mc-nav__item--active': currentOp === op.key }"
            :style="currentOp === op.key ? { '--accent': op.color, '--accent-soft': op.soft } : {}"
            @click="currentOp = op.key"
          >
            <span class="mc-nav__icon" :style="{ '--accent': op.color }">{{ op.icon }}</span>
            <span class="mc-nav__text">
              <span class="mc-nav__name">{{ op.name }}</span>
              <span class="mc-nav__desc">{{ op.desc }}</span>
            </span>
            <span class="mc-nav__arrow" v-if="currentOp === op.key">▸</span>
          </button>
        </nav>
        <div class="mc-aside__footer">
          <span class="mc-aside__tag">v2.0</span>
          <span class="mc-aside__hint">选择指令后配置参数并执行</span>
        </div>
      </aside>

      <!-- 右侧：上下结构 -->
      <section class="mc-main">
        <!-- 右上：指令配置区 -->
        <div class="mc-config">
          <div class="mc-config__bar">
            <span class="mc-config__chip" :style="{ background: activeOp.color }">{{ activeOp.tag }}</span>
            <h2 class="mc-config__title">{{ activeOp.name }}</h2>
            <span class="mc-config__path">/measure_controller/{{ activeOp.endpoint }}</span>
          </div>

          <div class="mc-config__form">
            <!-- 重启单个 -->
            <template v-if="currentOp === 'restart_one'">
              <div class="mc-field">
                <label class="mc-field__label">目标站</label>
                <el-select
                  v-model="restartStationId"
                  filterable
                  placeholder="搜索或选择计量站"
                  class="mc-field__input"
                >
                  <el-option v-for="s in stationOptions" :key="s" :label="s" :value="s" />
                </el-select>
              </div>
              <div class="mc-config__action">
                <el-button
                  type="warning"
                  :icon="RefreshRight"
                  :loading="restartOneLoading"
                  :disabled="!restartStationId"
                  @click="handleRestartOne"
                  class="mc-btn mc-btn--warn"
                >
                  执行重启
                </el-button>
              </div>
            </template>

            <!-- 重启全部 -->
            <template v-if="currentOp === 'restart_all'">
              <div class="mc-field mc-field--notice">
                <el-icon class="mc-field__icon"><Warning /></el-icon>
                <span>将对全部 <strong>{{ stationOptions.length }}</strong> 个计量站执行重启操作，影响范围较大。</span>
              </div>
              <div class="mc-config__action">
                <el-button
                  type="danger"
                  :icon="RefreshRight"
                  :loading="restartAllLoading"
                  @click="handleRestartAll"
                  class="mc-btn mc-btn--danger"
                >
                  执行全部重启
                </el-button>
              </div>
            </template>

            <!-- 配置检查 -->
            <template v-if="currentOp === 'check_config'">
              <div class="mc-field">
                <label class="mc-field__label">检查站</label>
                <el-select
                  v-model="checkStationId"
                  filterable
                  placeholder="搜索或选择计量站"
                  class="mc-field__input"
                >
                  <el-option v-for="s in stationOptions" :key="s" :label="s" :value="s" />
                </el-select>
              </div>
              <div class="mc-field mc-field--col">
                <label class="mc-field__label">检测项</label>
                <div class="mc-check-items">
                  <el-checkbox v-model="checkAllItems" @change="handleCheckAllChange" class="mc-check-all">全选</el-checkbox>
                  <el-checkbox-group v-model="checkItems" class="mc-check-group" @change="handleCheckItemsChange">
                    <el-checkbox v-for="opt in checkItemOptions" :key="opt.key" :label="opt.key">{{ opt.name }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="mc-config__action">
                <el-button
                  type="primary"
                  :icon="View"
                  :loading="checkLoading"
                  :disabled="!checkStationId || checkItems.length === 0"
                  @click="handleCheckConfig"
                  class="mc-btn mc-btn--info"
                >
                  执行检查
                </el-button>
              </div>
            </template>

            <!-- 清空scada缓存 -->
            <template v-if="currentOp === 'clear_cache'">
              <div class="mc-field mc-field--notice">
                <el-icon class="mc-field__icon" style="color: #0891b2;"><Warning /></el-icon>
                <span>将清空计量系统 scada 缓存（etag 与对象关系缓存），可能短暂影响数据读取。</span>
              </div>
              <div class="mc-config__action">
                <el-button
                  type="primary"
                  :icon="RefreshRight"
                  :loading="clearCacheLoading"
                  @click="handleClearCache"
                  class="mc-btn mc-btn--purple"
                >
                  执行清空
                </el-button>
              </div>
            </template>

            <!-- 获取进程信息 -->
            <template v-if="currentOp === 'process_info'">
              <div class="mc-field">
                <label class="mc-field__label">目标站</label>
                <el-select
                  v-model="processStationId"
                  filterable
                  placeholder="搜索或选择计量站"
                  class="mc-field__input"
                >
                  <el-option v-for="s in stationOptions" :key="s" :label="s" :value="s" />
                </el-select>
              </div>
              <div class="mc-config__action">
                <el-button
                  type="primary"
                  :icon="View"
                  :loading="processInfoLoading"
                  :disabled="!processStationId"
                  @click="handleProcessInfo"
                  class="mc-btn mc-btn--info"
                >
                  获取进程信息
                </el-button>
              </div>
            </template>

            <!-- 日志查看 -->
            <template v-if="currentOp === 'view_logs'">
              <div class="mc-field">
                <label class="mc-field__label">目标站</label>
                <el-select
                  v-model="logStationId"
                  filterable
                  placeholder="搜索或选择计量站"
                  class="mc-field__input"
                >
                  <el-option v-for="s in stationOptions" :key="s" :label="s" :value="s" />
                </el-select>
              </div>
              <div class="mc-config__action">
                <el-button
                  type="primary"
                  :icon="Search"
                  :loading="logLoading"
                  :disabled="!logStationId"
                  @click="handleLogSearch"
                  class="mc-btn mc-btn--info"
                >
                  搜索日志
                </el-button>
                <el-button
                  :icon="RefreshLeft"
                  :disabled="!logHasSearched"
                  @click="handleLogClear"
                  style="margin-left: 8px"
                >
                  清空
                </el-button>
                <el-button
                  :icon="Download"
                  :disabled="!logDisplayLogs.length"
                  @click="handleLogExport"
                  style="margin-left: 8px"
                >
                  导出
                </el-button>
              </div>
            </template>
          </div>
        </div>

        <!-- 右下：结果区（终端风格） -->
        <div class="mc-result">
          <div class="mc-result__bar">
            <span class="mc-result__dot" :class="resultDotClass"></span>
            <span class="mc-result__title">输出结果</span>
            <span class="mc-result__status">{{ resultStatusText }}</span>
            <button v-if="hasResult" class="mc-result__clear" @click="clearResult">清除</button>
          </div>

          <div class="mc-result__body">
            <!-- 无结果占位 -->
            <div v-if="!hasResult" class="mc-result__empty">
              <span class="mc-result__placeholder">等待指令执行…</span>
            </div>

            <!-- 重启结果表格 -->
            <template v-else-if="currentOp === 'restart_one' || currentOp === 'restart_all'">
              <div class="mc-result__scroll">
                <table class="mc-table">
                  <thead>
                    <tr>
                      <th style="width:48px">#</th>
                      <th>STATION_ID</th>
                      <th>PID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in currentResultData" :key="i">
                      <td class="mc-table__idx">{{ String(i + 1).padStart(3, '0') }}</td>
                      <td class="mc-table__mono">{{ row.station_id }}</td>
                      <td class="mc-table__mono mc-table__pid">{{ row.pid }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>

            <!-- 检查结果（结构化展示） -->
            <template v-else-if="currentOp === 'check_config' && checkResultData">
              <div class="mc-check-result">
                <div
                  v-for="item in checkResultList"
                  :key="item.key"
                  class="mc-check-item"
                >
                  <div class="mc-check-item__head" :class="item.status">
                    <span class="mc-check-item__icon">{{ item.icon }}</span>
                    <span class="mc-check-item__name">{{ item.name }}</span>
                    <span class="mc-check-item__msg">{{ item.msg }}</span>
                  </div>
                  <div v-if="item.child && item.child.values && item.child.values.length > 0" class="mc-check-item__child">
                    <table class="mc-table mc-table--check">
                      <thead>
                        <tr>
                          <th v-for="(t, i) in item.child.title" :key="i">{{ t }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, i) in item.child.values" :key="i">
                          <td v-for="(cell, j) in row" :key="j">{{ cell }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </template>

            <!-- 清空缓存结果 -->
            <template v-else-if="currentOp === 'clear_cache' && clearCacheResult">
              <div class="mc-result__alert success">
                <span class="mc-result__alert-icon">✓</span>
                <span class="mc-result__alert-text">{{ clearCacheResult }}</span>
              </div>
            </template>

            <!-- 进程信息结果（结构化展示） -->
            <template v-else-if="currentOp === 'process_info' && processInfoData">
              <div v-if="processInfoData.alive === false" class="mc-result__alert error">
                <span class="mc-result__alert-icon">⚠</span>
                <span class="mc-result__alert-text">{{ processInfoData.msg || '进程不存在' }}</span>
              </div>
              <div v-else class="mc-process-result">
                <!-- 概览卡片 -->
                <div class="mc-process-overview">
                  <div class="mc-process-overview__item">
                    <span class="mc-process-overview__label">站ID</span>
                    <span class="mc-process-overview__val">{{ processInfoData.station_id }}</span>
                  </div>
                  <div class="mc-process-overview__item">
                    <span class="mc-process-overview__label">PID</span>
                    <span class="mc-process-overview__val mc-table__mono">{{ processInfoData.pid }}</span>
                  </div>
                  <div class="mc-process-overview__item">
                    <span class="mc-process-overview__label">程序状态</span>
                    <span class="mc-process-overview__val" :class="processInfoData.status.code">{{ processInfoData.status.name }}</span>
                  </div>
                  <div class="mc-process-overview__item">
                    <span class="mc-process-overview__label">计量模式</span>
                    <span class="mc-process-overview__val">{{ processInfoData.measure_mode.name }}</span>
                  </div>
                </div>
                <!-- 进程监控指标 -->
                <div v-if="processInfoData.process_info && Object.keys(processInfoData.process_info).length" class="mc-process-proc">
                  <div class="mc-process-proc__title">进程监控</div>
                  <div class="mc-process-proc__grid">
                    <div v-for="(val, key) in processInfoData.process_info" :key="key" class="mc-process-proc__cell">
                      <span class="mc-process-proc__k">{{ key }}</span>
                      <span class="mc-process-proc__v">{{ val }}</span>
                    </div>
                  </div>
                </div>
                <!-- 实时数据 -->
                <div v-if="processInfoData.alarm_data" class="mc-process-groups">
                  <div class="mc-process-group">
                    <div class="mc-process-group__title mc-process-group__title--toggle" @click="alarmCollapse.chang_alarm = !alarmCollapse.chang_alarm">
                      <span class="mc-process-group__arrow" :class="{ 'is-collapsed': alarmCollapse.chang_alarm }">▾</span>
                      变化实时数据 (chang_alarm_data)
                    </div>
                    <div v-show="!alarmCollapse.chang_alarm">
                      <table v-if="processInfoData.alarm_data.chang_alarm && processInfoData.alarm_data.chang_alarm.length" class="mc-table mc-table--check">
                        <thead>
                          <tr>
                            <th style="width:50%">标签</th>
                            <th>值</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, i) in processInfoData.alarm_data.chang_alarm" :key="i">
                            <td class="mc-table__mono">{{ item.key }}</td>
                            <td class="mc-table__mono mc-process-val">{{ item.value }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div v-else class="mc-log-state mc-log-state--more">无数据</div>
                    </div>
                  </div>
                  <div class="mc-process-group">
                    <div class="mc-process-group__title mc-process-group__title--toggle" @click="alarmCollapse.alarm = !alarmCollapse.alarm">
                      <span class="mc-process-group__arrow" :class="{ 'is-collapsed': alarmCollapse.alarm }">▾</span>
                      实时数据 (alarm_data)
                    </div>
                    <div v-show="!alarmCollapse.alarm">
                      <table v-if="processInfoData.alarm_data.alarm && processInfoData.alarm_data.alarm.length" class="mc-table mc-table--check">
                        <thead>
                          <tr>
                            <th style="width:50%">标签</th>
                            <th>值</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, i) in processInfoData.alarm_data.alarm" :key="i">
                            <td class="mc-table__mono">{{ item.key }}</td>
                            <td class="mc-table__mono mc-process-val">{{ item.value }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div v-else class="mc-log-state mc-log-state--more">无数据</div>
                    </div>
                  </div>
                </div>
                <!-- 状态字段分组 -->
                <div class="mc-process-groups">
                  <div v-for="group in processInfoData.groups" :key="group.name" class="mc-process-group">
                    <div class="mc-process-group__title">{{ group.name }}</div>
                    <table class="mc-table mc-table--check">
                      <thead>
                        <tr>
                          <th style="width:30%">字段</th>
                          <th>值</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="f in group.fields" :key="f.key">
                          <tr>
                            <td class="mc-table__mono">{{ f.label }}</td>
                            <td class="mc-table__mono mc-process-val" v-if="!f.child">{{ f.value }}</td>
                            <td class="mc-process-val" v-else>
                              <span class="mc-process-val__count">共 {{ f.child.values.length }} 条 ▾</span>
                            </td>
                          </tr>
                          <tr v-if="f.child && f.child.values && f.child.values.length">
                            <td colspan="2" class="mc-table__child-cell">
                              <table class="mc-table mc-table--check mc-table--child">
                                <thead>
                                  <tr>
                                    <th v-for="(t, i) in f.child.title" :key="i">{{ t }}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(row, ri) in f.child.values" :key="ri">
                                    <td v-for="(v, ci) in row" :key="ci" class="mc-table__mono">{{ v }}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </template>

            <!-- 日志查看结果 -->
            <template v-else-if="currentOp === 'view_logs'">
              <div class="mc-log-result">
                <div v-if="logLoading" class="mc-log-state">
                  <el-icon class="is-loading"><Loading /></el-icon>
                  <span>正在加载日志...</span>
                </div>
                <div v-else-if="logErrorMsg" class="mc-log-state mc-log-state--err">
                  <el-icon><Warning /></el-icon>
                  <span>{{ logErrorMsg }}</span>
                </div>
                <div v-else-if="!logHasSearched" class="mc-log-state">
                  <span>请选择站后点击「搜索日志」</span>
                </div>
                <div v-else-if="logAllLogs.length === 0" class="mc-log-state">
                  <el-icon><CircleClose /></el-icon>
                  <span>该站暂无日志</span>
                </div>
                <el-scrollbar
                  v-else
                  ref="logScrollbarRef"
                  height="100%"
                  class="mc-log-scrollbar"
                  @scroll="handleLogScroll"
                >
                  <div class="mc-log-list">
                    <div class="mc-log-count">共 {{ logAllLogs.length }} 条 · 已显示 {{ logDisplayLogs.length }} 条</div>
                    <div
                      v-for="(log, index) in logDisplayLogs"
                      :key="index"
                      class="mc-log-item"
                    >
                      <span class="mc-log-time">{{ formatLogTime(log.time) }}</span>
                      <span class="mc-log-msg">{{ log.msg }}</span>
                    </div>
                    <div v-if="logLoadingMore" class="mc-log-state mc-log-state--more">
                      <el-icon class="is-loading"><Loading /></el-icon>
                      <span>加载更多...</span>
                    </div>
                    <div v-else-if="!logHasMore && logAllLogs.length > logBatchSize" class="mc-log-state mc-log-state--more">
                      <span>— 已加载全部日志 —</span>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </template>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getAllStations, restartMeasureProcessOne, restartMeasureProcessAll, checkStationMeterConfig, clearScadaCache, getStationProcessInfo } from '@/api/configUtils/measureController'
import { getMeterLogs } from '@/api/configUtils/config'
import { RefreshRight, View, Warning, Search, RefreshLeft, Download, Loading, CircleClose } from '@element-plus/icons-vue'

export default {
  name: 'MeasureControllerOp',
  components: { RefreshRight, View, Warning, Search, RefreshLeft, Download, Loading, CircleClose },
  data() {
    return {
      stationOptions: [],
      currentOp: 'restart_one',
      restartStationId: '',
      restartOneLoading: false,
      restartOneResult: [],
      restartAllLoading: false,
      restartAllResult: [],
      checkStationId: '',
      checkLoading: false,
      checkResultData: null,
      clearCacheLoading: false,
      clearCacheResult: '',
      processStationId: '',
      processInfoLoading: false,
      processInfoData: null,
      alarmCollapse: { chang_alarm: false, alarm: false },
      logStationId: '',
      logLoading: false,
      logLoadingMore: false,
      logHasSearched: false,
      logErrorMsg: '',
      logAllLogs: [],
      logDisplayLogs: [],
      logBatchSize: 200,
      logCurrentEnd: 0,
      checkItemOptions: [
        { key: 'config_check', name: '配置json格式检测' },
        { key: 'meter_config', name: '计量配置静态检测' },
        { key: 'plan_columns', name: '计划表列检测' },
        { key: 'result_columns', name: '结果表列检测' },
        { key: 'daunit_tag', name: '点表检测' },
        { key: 'base_tongdao', name: '通道号检测' }
      ],
      checkItems: ['config_check', 'meter_config', 'plan_columns', 'result_columns', 'daunit_tag', 'base_tongdao'],
      checkAllItems: true,
      checkResultOrder: ['config_check', 'meter_config', 'plan_columns', 'result_columns', 'daunit_tag', 'base_tongdao']
    }
  },
  computed: {
    operations() {
      return [
        { key: 'restart_one', name: '重启单个计量站', desc: '重启指定站进程', icon: '↻', color: '#d97706', soft: 'rgba(217,119,6,.12)', tag: 'RESTART', endpoint: 'restart_measure_process_one' },
        { key: 'restart_all', name: '重启全部计量站', desc: '批量重启所有站', icon: '⏻', color: '#dc2626', soft: 'rgba(220,38,38,.12)', tag: 'RESTART ALL', endpoint: 'restart_measure_process_all' },
        { key: 'check_config', name: '计量配置检查', desc: '解析格式校验', icon: '◎', color: '#0891b2', soft: 'rgba(8,145,178,.12)', tag: 'CHECK', endpoint: 'check_station_meter_config' },
        { key: 'clear_cache', name: '清空scada缓存', desc: '清理etag与对象缓存', icon: '⟳', color: '#7c3aed', soft: 'rgba(124,58,237,.12)', tag: 'CACHE', endpoint: 'clear_scada_cache' },
        { key: 'process_info', name: '获取进程信息', desc: '查看站进程状态', icon: '⌬', color: '#059669', soft: 'rgba(5,150,105,.12)', tag: 'PROCESS', endpoint: 'get_station_process_info' },
        { key: 'view_logs', name: '日志查看', desc: '查看站运行日志', icon: '≡', color: '#0891b2', soft: 'rgba(8,145,178,.12)', tag: 'LOGS', endpoint: 'get_meter_logs' }
      ]
    },
    activeOp() {
      return this.operations.find(o => o.key === this.currentOp)
    },
    activeColor() {
      const map = { restart_one: 'amber', restart_all: 'red', check_config: 'cyan', clear_cache: 'purple', process_info: 'green', view_logs: 'cyan' }
      return map[this.currentOp] || 'cyan'
    },
    currentResultData() {
      return this.currentOp === 'restart_one' ? this.restartOneResult : this.restartAllResult
    },
    hasResult() {
      if (this.currentOp === 'restart_one') return this.restartOneResult.length > 0
      if (this.currentOp === 'restart_all') return this.restartAllResult.length > 0
      if (this.currentOp === 'check_config') return !!this.checkResultData
      if (this.currentOp === 'clear_cache') return !!this.clearCacheResult
      if (this.currentOp === 'process_info') return !!this.processInfoData
      if (this.currentOp === 'view_logs') return this.logHasSearched
      return false
    },
    resultStatusText() {
      if (this.currentOp === 'restart_one' && this.restartOneResult.length) return `OK · ${this.restartOneResult.length} RECORD`
      if (this.currentOp === 'restart_all' && this.restartAllResult.length) return `OK · ${this.restartAllResult.length} RECORDS`
      if (this.currentOp === 'check_config' && this.checkResultData) {
        const list = this.checkResultList
        const pass = list.filter(i => i.result === true).length
        const fail = list.filter(i => i.result === false).length
        return `DONE · ${pass} PASS / ${fail} FAIL`
      }
      if (this.currentOp === 'clear_cache' && this.clearCacheResult) return 'DONE'
      if (this.currentOp === 'process_info' && this.processInfoData) {
        return this.processInfoData.alive === false ? 'OFFLINE' : 'ONLINE'
      }
      if (this.currentOp === 'view_logs' && this.logHasSearched) return `LOGS · ${this.logAllLogs.length} ENTRIES`
      return 'IDLE'
    },
    resultDotClass() {
      if (this.restartOneLoading || this.restartAllLoading || this.checkLoading || this.clearCacheLoading || this.processInfoLoading || this.logLoading) return 'blink'
      if (this.hasResult) {
        if (this.currentOp === 'check_config' && this.checkResultData) {
          return this.checkResultList.some(i => i.result === false) ? 'err' : 'on'
        }
        if (this.currentOp === 'process_info' && this.processInfoData && this.processInfoData.alive === false) return 'err'
        return 'on'
      }
      return 'off'
    },
    logHasMore() {
      return this.logCurrentEnd < this.logAllLogs.length
    },
    checkResultList() {
      if (!this.checkResultData) return []
      return this.checkResultOrder
        .filter(key => this.checkResultData[key])
        .map(key => {
          const raw = this.checkResultData[key]
          let status = 'pending'
          let icon = '○'
          if (raw.result === true) { status = 'pass'; icon = '✓' }
          else if (raw.result === false) { status = 'fail'; icon = '✗' }
          return { key, ...raw, status, icon }
        })
    }
  },
  mounted() {
    this.loadStations()
  },
  methods: {
    async loadStations() {
      try {
        const res = await getAllStations()
        const list = Array.isArray(res) ? res : []
        this.stationOptions = list.map(item => item.object_id).filter(Boolean)
      } catch (e) {
        this.$message.error('获取站列表失败')
      }
    },
    clearResult() {
      this.restartOneResult = []
      this.restartAllResult = []
      this.checkResultData = null
      this.clearCacheResult = ''
      this.processInfoData = null
      this.logHasSearched = false
      this.logErrorMsg = ''
      this.logAllLogs = []
      this.logDisplayLogs = []
      this.logCurrentEnd = 0
    },
    async handleLogSearch() {
      if (!this.logStationId) return
      this.logLoading = true
      this.logErrorMsg = ''
      this.logHasSearched = true
      this.logAllLogs = []
      this.logDisplayLogs = []
      this.logCurrentEnd = 0
      try {
        const data = await getMeterLogs(this.logStationId)
        this.logAllLogs = Array.isArray(data) ? data : (data?.list || [])
        this.loadMoreLogs()
      } catch (err) {
        this.logErrorMsg = err.message || '获取日志失败'
        this.$message.error(this.logErrorMsg)
      } finally {
        this.logLoading = false
      }
    },
    loadMoreLogs() {
      const nextEnd = Math.min(this.logCurrentEnd + this.logBatchSize, this.logAllLogs.length)
      if (nextEnd <= this.logCurrentEnd) return
      this.logLoadingMore = true
      this.$nextTick(() => {
        const batch = this.logAllLogs.slice(this.logCurrentEnd, nextEnd)
        this.logDisplayLogs.push(...batch)
        this.logCurrentEnd = nextEnd
        this.logLoadingMore = false
      })
    },
    handleLogScroll({ scrollTop, scrollHeight, clientHeight }) {
      if (!this.logHasMore || this.logLoadingMore) return
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        this.loadMoreLogs()
      }
    },
    handleLogClear() {
      this.logStationId = ''
      this.logAllLogs = []
      this.logDisplayLogs = []
      this.logHasSearched = false
      this.logErrorMsg = ''
      this.logCurrentEnd = 0
    },
    handleLogExport() {
      if (!this.logDisplayLogs.length) return
      const lines = this.logDisplayLogs.map(log =>
        `[${this.formatLogTime(log.time)}] ${log.msg}`
      )
      const content = lines.join('\n')
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${this.logStationId}_log_${Date.now()}.txt`
      a.click()
      URL.revokeObjectURL(url)
    },
    formatLogTime(ms) {
      if (!ms && ms !== 0) return '-'
      const d = new Date(Number(ms))
      if (isNaN(d.getTime())) return String(ms)
      const pad = (n, w = 2) => String(n).padStart(w, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
    },
    async handleClearCache() {
      this.clearCacheLoading = true
      this.clearCacheResult = ''
      try {
        await clearScadaCache()
        this.clearCacheResult = 'scada缓存已清空'
        this.$message.success('缓存清空成功')
      } catch (e) {
        this.clearCacheResult = `清空失败：${e.message || e}`
        this.$message.error(this.clearCacheResult)
      } finally {
        this.clearCacheLoading = false
      }
    },
    async handleProcessInfo() {
      if (!this.processStationId) return
      this.processInfoLoading = true
      this.processInfoData = null
      try {
        const res = await getStationProcessInfo(this.processStationId)
        this.processInfoData = res || { alive: false, msg: '无返回数据' }
      } catch (e) {
        this.$message.error(`获取失败：${e.message || e}`)
      } finally {
        this.processInfoLoading = false
      }
    },
    handleCheckAllChange(val) {
      this.checkItems = val ? this.checkItemOptions.map(o => o.key) : []
    },
    handleCheckItemsChange(val) {
      this.checkAllItems = val.length === this.checkItemOptions.length
    },
    async handleRestartOne() {
      if (!this.restartStationId) return
      try {
        await this.$confirm(`确认重启计量站「${this.restartStationId}」？`, '提示', { type: 'warning' })
      } catch { return }
      this.restartOneLoading = true
      this.restartOneResult = []
      try {
        const res = await restartMeasureProcessOne(this.restartStationId)
        const list = Array.isArray(res) ? res : []
        this.restartOneResult = list.map(item => ({
          station_id: item.station_id || '',
          pid: item.pid || ''
        }))
        this.$message.success('重启成功')
      } catch (e) {
        this.$message.error(`重启失败：${e.message || e}`)
      } finally {
        this.restartOneLoading = false
      }
    },
    async handleRestartAll() {
      try {
        await this.$confirm('确认重启全部计量站？此操作影响范围较大。', '提示', { type: 'warning' })
      } catch { return }
      this.restartAllLoading = true
      this.restartAllResult = []
      try {
        const res = await restartMeasureProcessAll()
        const list = Array.isArray(res) ? res : []
        this.restartAllResult = list.map(item => ({
          station_id: item.station_id || '',
          pid: item.pid || ''
        }))
        this.$message.success(`全部重启成功（${this.restartAllResult.length} 个站）`)
      } catch (e) {
        this.$message.error(`重启失败：${e.message || e}`)
      } finally {
        this.restartAllLoading = false
      }
    },
    async handleCheckConfig() {
      if (!this.checkStationId || this.checkItems.length === 0) return
      this.checkLoading = true
      this.checkResultData = null
      try {
        const res = await checkStationMeterConfig(this.checkStationId, this.checkItems)
        this.checkResultData = res || {}
      } catch (e) {
        this.$message.error(`检查失败：${e.message || e}`)
      } finally {
        this.checkLoading = false
      }
    }
  }
}
</script>

<style scoped>
.mc-panel {
  --mono: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', 'Courier New', monospace;
  --bg: #eef0f3;
  --panel: #ffffff;
  --line: #d4d9e0;
  --line-soft: #e8ebef;
  --ink-1: #1a1d23;
  --ink-2: #4a5160;
  --ink-3: #8b92a1;
  --amber: #d97706;
  --red: #dc2626;
  --cyan: #0891b2;
  --green: #16a34a;
  /* === 输出结果区：暖纸工程账本风格 === */
  --term-bg: #fbf8f1;
  --term-fg: #1a1d23;
  --term-dim: #7d756a;
  --term-line: #e8e0d0;
  --term-accent: #0d4f4f;
  --term-amber: #b45309;
  --term-red: #b91c1c;
  --term-green: #15803d;
  --term-blue: #1e40af;
  --term-head-bg: #f0ead6;
  --term-head-fg: #3a3024;
  --term-stripe: #f6f1e3;
  padding: 0;
  background: var(--bg);
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: var(--ink-1);
}

/* === 头部条 === */
.mc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: var(--panel);
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}
.mc-header__left { display: flex; align-items: baseline; gap: 10px; }
.mc-header__dot {
  width: 8px; height: 8px; border-radius: 50%;
  display: inline-block; transform: translateY(-1px);
  background: var(--ink-3);
}
.mc-header__dot--amber { background: var(--amber); box-shadow: 0 0 8px rgba(217,119,6,.5); }
.mc-header__dot--red { background: var(--red); box-shadow: 0 0 8px rgba(220,38,38,.5); }
.mc-header__dot--cyan { background: var(--cyan); box-shadow: 0 0 8px rgba(8,145,178,.5); }
.mc-header__dot--purple { background: #7c3aed; box-shadow: 0 0 8px rgba(124,58,237,.5); }
.mc-header__dot--green { background: #059669; box-shadow: 0 0 8px rgba(5,150,105,.5); }
.mc-header__title { font-size: 16px; font-weight: 700; letter-spacing: .5px; margin: 0; color: var(--ink-1); }
.mc-header__sub { font-family: var(--mono); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); text-transform: uppercase; }
.mc-header__right { display: flex; align-items: center; gap: 16px; }
.mc-header__meta { font-family: var(--mono); font-size: 11px; color: var(--ink-3); letter-spacing: 1px; }

/* === 主体 === */
.mc-body { flex: 1; display: flex; min-height: 0; }

/* === 左侧 === */
.mc-aside {
  width: 280px; flex-shrink: 0;
  background: var(--panel);
  border-right: 1px solid var(--line);
  display: flex; flex-direction: column;
  padding: 16px 0;
}
.mc-aside__label {
  font-family: var(--mono); font-size: 10px; letter-spacing: 2px;
  color: var(--ink-3); text-transform: uppercase;
  padding: 0 20px 12px;
  border-bottom: 1px solid var(--line-soft);
}
.mc-nav { flex: 1; padding: 8px 12px; display: flex; flex-direction: column; gap: 4px; }
.mc-nav__item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: all .15s ease;
  position: relative;
}
.mc-nav__item:hover { background: #f4f5f7; border-color: var(--line-soft); }
.mc-nav__item--active {
  background: var(--accent-soft, #f4f5f7);
  border-color: color-mix(in srgb, var(--accent, var(--line)) 35%, transparent);
}
.mc-nav__item--active::before {
  content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px;
  background: var(--accent, var(--ink-3)); border-radius: 0 3px 3px 0;
}
.mc-nav__icon {
  width: 28px; height: 28px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700;
  border: 1px solid color-mix(in srgb, var(--accent, var(--line)) 40%, transparent);
  border-radius: 6px;
  color: var(--accent, var(--ink-2));
  background: var(--panel);
}
.mc-nav__text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.mc-nav__name { font-size: 13px; font-weight: 600; color: var(--ink-1); }
.mc-nav__desc { font-size: 11px; color: var(--ink-3); }
.mc-nav__arrow { font-size: 12px; color: var(--accent, var(--ink-3)); }
.mc-aside__footer {
  padding: 12px 20px 0;
  border-top: 1px solid var(--line-soft);
  display: flex; flex-direction: column; gap: 6px;
}
.mc-aside__tag {
  font-family: var(--mono); font-size: 10px; letter-spacing: 1px;
  color: var(--ink-3); align-self: flex-start;
  border: 1px solid var(--line); border-radius: 3px; padding: 1px 6px;
}
.mc-aside__hint { font-size: 11px; color: var(--ink-3); }

/* === 右侧 === */
.mc-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

/* 右上：配置区 */
.mc-config {
  background: var(--panel);
  border-bottom: 1px solid var(--line);
  padding: 20px 24px;
  flex-shrink: 0;
}
.mc-config__bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.mc-config__chip {
  font-family: var(--mono); font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
  color: #fff; padding: 3px 10px; border-radius: 3px;
}
.mc-config__title { font-size: 16px; font-weight: 700; margin: 0; color: var(--ink-1); }
.mc-config__path { font-family: var(--mono); font-size: 11px; color: var(--ink-3); margin-left: auto; }
.mc-config__form { display: flex; flex-direction: column; gap: 16px; }
.mc-field { display: flex; align-items: center; gap: 16px; }
.mc-field__label {
  font-size: 12px; font-weight: 600; letter-spacing: .5px;
  color: var(--ink-2); width: 64px; flex-shrink: 0;
}
.mc-field__input { flex: 1; max-width: 420px; }
.mc-field__input :deep(.el-select__wrapper) {
  border-radius: 4px; box-shadow: 0 0 0 1px var(--line) inset;
}
.mc-field--notice {
  background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px;
  padding: 10px 14px; color: #9a3412; font-size: 13px;
}
.mc-field__icon { color: var(--amber); margin-right: 6px; }
.mc-config__action { display: flex; justify-content: flex-end; padding-top: 4px; }
.mc-btn { font-weight: 600; letter-spacing: .3px; }
.mc-btn--warn { --el-button-bg-color: var(--amber); --el-button-border-color: var(--amber); --el-button-hover-bg-color: #b45309; --el-button-hover-border-color: #b45309; }
.mc-btn--danger { --el-button-bg-color: var(--red); --el-button-border-color: var(--red); --el-button-hover-bg-color: #b91c1c; --el-button-hover-border-color: #b91c1c; }
.mc-btn--info { --el-button-bg-color: var(--cyan); --el-button-border-color: var(--cyan); --el-button-hover-bg-color: #0e7490; --el-button-hover-border-color: #0e7490; }
.mc-btn--purple { --el-button-bg-color: #7c3aed; --el-button-border-color: #7c3aed; --el-button-hover-bg-color: #6d28d9; --el-button-hover-border-color: #6d28d9; }

/* 右下：结果区（工程账本风：暖纸 + 深墨 + 琥珀/青绿强调） */
.mc-result {
  flex: 1; min-height: 0;
  background: var(--term-bg);
  display: flex; flex-direction: column;
  font-family: var(--mono);
  background-image:
    linear-gradient(to right, rgba(13,79,79,.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(13,79,79,.025) 1px, transparent 1px);
  background-size: 24px 24px;
}
.mc-result__bar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 22px;
  border-bottom: 2px solid var(--term-head-bg);
  flex-shrink: 0;
  background: linear-gradient(to right, var(--term-head-bg), transparent 60%);
}
.mc-result__dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.mc-result__dot.off { background: #b3a99a; }
.mc-result__dot.on { background: var(--term-green); box-shadow: 0 0 0 3px rgba(21,128,61,.18); }
.mc-result__dot.blink { background: var(--term-amber); animation: mc-blink 1s steps(2) infinite; }
@keyframes mc-blink { 50% { opacity: .25; } }
.mc-result__title {
  font-size: 16px; font-weight: 800; letter-spacing: 2px; color: var(--term-head-fg);
  text-transform: uppercase;
  position: relative; padding-left: 4px;
}
.mc-result__title::before {
  content: ''; position: absolute; left: -6px; top: 3px; bottom: 3px; width: 3px;
  background: var(--term-amber); border-radius: 2px;
}
.mc-result__status {
  font-size: 14px; color: var(--term-accent); margin-left: auto; letter-spacing: 1.5px;
  font-weight: 700; padding: 2px 10px;
  background: rgba(13,79,79,.08); border-radius: 3px;
}
.mc-result__clear {
  background: transparent; border: 1px solid var(--term-line);
  color: var(--term-dim); font-family: var(--mono);
  font-size: 13px; padding: 3px 10px; border-radius: 3px;
  cursor: pointer; letter-spacing: .5px;
  transition: all .15s;
}
.mc-result__clear:hover { color: var(--term-red); border-color: var(--term-red); background: rgba(185,28,28,.06); }
.mc-result__body { flex: 1; overflow: auto; padding: 18px 22px; }
.mc-result__empty { display: flex; align-items: center; justify-content: center; height: 100%; }
.mc-result__placeholder { color: var(--term-dim); font-size: 16px; letter-spacing: 1.5px; }
.mc-result__scroll { display: flex; flex-direction: column; gap: 0; }
.mc-result__alert {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; border-radius: 6px; font-size: 16px;
}
.mc-result__alert.success { background: rgba(21,128,61,.08); border: 1px solid rgba(21,128,61,.25); color: var(--term-green); }
.mc-result__alert.error { background: rgba(185,28,28,.08); border: 1px solid rgba(185,28,28,.25); color: var(--term-red); }
.mc-result__alert-icon { font-size: 22px; }
.mc-result__alert-text { font-family: var(--mono); font-weight: 600; }

/* 表格 — 工程账本风：奶油表头、斑马行、深墨字 */
.mc-table { width: 100%; border-collapse: collapse; font-size: 15px; }
.mc-table thead tr { border-bottom: 2px solid var(--term-head-bg); }
.mc-table th {
  text-align: left; padding: 9px 16px;
  font-size: 13px; font-weight: 700; letter-spacing: 1.5px;
  color: var(--term-head-fg); text-transform: uppercase;
  background: var(--term-head-bg);
  border-right: 1px solid #e2dac4;
}
.mc-table th:last-child { border-right: 0; }
.mc-table td {
  padding: 9px 16px;
  border-bottom: 1px solid var(--term-line);
  color: var(--term-fg);
}
.mc-table tbody tr:nth-child(even) { background: var(--term-stripe); }
.mc-table tbody tr:hover { background: rgba(13,79,79,.05); }
.mc-table__idx { color: var(--term-amber); font-weight: 700; }
.mc-table__mono { font-family: var(--mono); }
.mc-table__pid { color: var(--term-blue); font-weight: 600; }

/* 滚动条 */
.mc-result__body::-webkit-scrollbar { width: 10px; height: 10px; }
.mc-result__body::-webkit-scrollbar-track { background: var(--term-stripe); }
.mc-result__body::-webkit-scrollbar-thumb {
  background: #d4c9b0; border-radius: 5px; border: 2px solid var(--term-stripe);
}
.mc-result__body::-webkit-scrollbar-thumb:hover { background: var(--term-amber); }

/* === 检测项多选 === */
.mc-field--col { flex-direction: column; align-items: stretch; gap: 8px; }
.mc-check-items {
  display: flex; align-items: center; flex-wrap: wrap; gap: 8px 16px;
  padding: 10px 14px; border: 1px solid var(--line-soft); border-radius: 6px;
  background: #fafbfc;
}
.mc-check-all { font-weight: 600; color: var(--ink-1); margin-right: 4px; }
.mc-check-group { display: flex; flex-wrap: wrap; gap: 8px 16px; }
.mc-check-group .el-checkbox { margin-right: 0; }

/* === 结果点-错误态 === */
.mc-result__dot.err { background: var(--term-red); box-shadow: 0 0 0 3px rgba(185,28,28,.18); }

/* === 结构化检查结果 === */
.mc-check-result { display: flex; flex-direction: column; gap: 12px; }
.mc-check-item {
  border: 1px solid var(--term-line); border-radius: 6px; overflow: hidden;
  background: var(--term-bg);
  box-shadow: 0 1px 0 rgba(58,48,36,.04);
}
.mc-check-item__head {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 16px; font-size: 16px;
  border-left: 4px solid var(--term-dim);
}
.mc-check-item__head.pass { background: rgba(21,128,61,.06); border-left-color: var(--term-green); border-bottom: 1px solid rgba(21,128,61,.18); }
.mc-check-item__head.fail { background: rgba(185,28,28,.06); border-left-color: var(--term-red); border-bottom: 1px solid rgba(185,28,28,.18); }
.mc-check-item__head.pending { background: var(--term-stripe); border-left-color: var(--term-dim); border-bottom: 1px solid var(--term-line); }
.mc-check-item__icon { font-size: 18px; font-weight: 800; flex-shrink: 0; width: 20px; text-align: center; }
.mc-check-item__head.pass .mc-check-item__icon { color: var(--term-green); }
.mc-check-item__head.fail .mc-check-item__icon { color: var(--term-red); }
.mc-check-item__head.pending .mc-check-item__icon { color: var(--term-dim); }
.mc-check-item__name { font-weight: 700; color: var(--term-head-fg); flex-shrink: 0; font-size: 16px; }
.mc-check-item__msg { color: var(--term-dim); font-size: 15px; }
.mc-check-item__child { padding: 0; }
.mc-table--check { width: 100%; font-size: 15px; }
.mc-table--check th { font-size: 13px; }
.mc-table--check td { padding: 8px 14px; }

/* === 进程信息展示 === */
.mc-process-result { display: flex; flex-direction: column; gap: 16px; }
.mc-process-overview {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
}
.mc-process-overview__item {
  background: var(--term-bg); border: 1px solid var(--term-line);
  border-left: 3px solid var(--term-accent);
  border-radius: 6px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px;
  box-shadow: 0 1px 0 rgba(58,48,36,.04);
}
.mc-process-overview__label { font-size: 13px; letter-spacing: 1.5px; color: var(--term-accent); text-transform: uppercase; font-weight: 700; }
.mc-process-overview__val { font-size: 18px; font-weight: 800; color: var(--term-head-fg); word-break: break-all; }
.mc-process-overview__val.run { color: var(--term-green); }
.mc-process-overview__val.free { color: var(--term-blue); }
.mc-process-overview__val.init, .mc-process-overview__val.start_run { color: var(--term-amber); }

.mc-process-proc {
  border: 1px solid var(--term-line); border-radius: 6px; overflow: hidden;
  background: var(--term-bg);
}
.mc-process-proc__title {
  font-size: 14px; font-weight: 800; letter-spacing: 2px; color: var(--term-head-fg);
  text-transform: uppercase; padding: 9px 16px; background: var(--term-head-bg);
  border-bottom: 2px solid #d4c9b0;
  position: relative; padding-left: 22px;
}
.mc-process-proc__title::before {
  content: ''; position: absolute; left: 12px; top: 8px; bottom: 8px; width: 4px;
  background: var(--term-accent); border-radius: 2px;
}
.mc-process-proc__grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: var(--term-line);
}
.mc-process-proc__cell {
  background: var(--term-bg); padding: 10px 16px; display: flex; flex-direction: column; gap: 3px;
}
.mc-process-proc__cell:nth-child(even) { background: var(--term-stripe); }
.mc-process-proc__k { font-size: 13px; color: var(--term-dim); letter-spacing: .5px; text-transform: uppercase; font-weight: 600; }
.mc-process-proc__v { font-size: 16px; color: var(--term-fg); font-family: var(--mono); font-weight: 600; }

.mc-process-groups { display: flex; flex-direction: column; gap: 12px; }
.mc-process-group {
  border: 1px solid var(--term-line); border-radius: 6px; overflow: hidden;
  background: var(--term-bg); box-shadow: 0 1px 0 rgba(58,48,36,.04);
}
.mc-process-group__title {
  font-size: 15px; font-weight: 800; color: var(--term-head-fg);
  padding: 10px 16px; background: var(--term-head-bg);
  border-bottom: 2px solid #d4c9b0;
  letter-spacing: 1px; text-transform: uppercase;
  position: relative; padding-left: 22px;
}
.mc-process-group__title::before {
  content: ''; position: absolute; left: 12px; top: 9px; bottom: 9px; width: 4px;
  background: var(--term-amber); border-radius: 2px;
}
.mc-process-group__title--toggle { cursor: pointer; user-select: none; display: flex; align-items: center; gap: 6px; }
.mc-process-group__title--toggle:hover { background: #ebe3cc; }
.mc-process-group__arrow { display: inline-block; transition: transform .18s ease; font-size: 15px; line-height: 1; color: var(--term-amber); }
.mc-process-group__arrow.is-collapsed { transform: rotate(-90deg); }
.mc-process-val { color: var(--term-blue); word-break: break-all; font-weight: 600; }
.mc-process-val__count { color: var(--term-accent); font-size: 15px; font-weight: 700; }
.mc-table__child-cell { padding: 0 !important; background: var(--term-stripe); }
.mc-table--child { width: 100%; font-size: 14px; border: 0; }
.mc-table--child thead th { font-size: 13px; background: var(--term-head-bg); border-bottom: 1px solid var(--term-line); color: var(--term-head-fg); }
.mc-table--child tbody td { padding: 6px 12px; border-top: 1px solid var(--term-line); }
.mc-table--child tbody tr:nth-child(even) { background: var(--term-bg); }

/* === 日志查看展示 === */
.mc-log-result { height: 100%; display: flex; flex-direction: column; }
.mc-log-scrollbar { flex: 1; }
.mc-log-scrollbar :deep(.el-scrollbar__wrap) { overflow-x: hidden; }
.mc-log-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; padding: 40px 20px; color: var(--term-dim); font-size: 16px;
}
.mc-log-state--err { color: var(--term-red); }
.mc-log-state--more { padding: 14px; font-size: 15px; }
.mc-log-list { padding: 10px 14px; }
.mc-log-count {
  font-size: 14px; color: var(--term-accent); padding: 8px 0 10px;
  border-bottom: 2px solid var(--term-head-bg); margin-bottom: 8px; letter-spacing: 1px;
  font-weight: 700; text-transform: uppercase;
}
.mc-log-item {
  display: flex; gap: 14px; padding: 6px 0;
  border-bottom: 1px dashed var(--term-line); word-break: break-all;
  font-size: 15px; line-height: 1.7;
}
.mc-log-item:nth-child(even) { background: var(--term-stripe); padding-left: 6px; padding-right: 6px; border-radius: 3px; }
.mc-log-time { color: var(--term-blue); flex-shrink: 0; font-size: 14px; min-width: 180px; font-weight: 600; }
.mc-log-msg { color: var(--term-fg); flex: 1; white-space: pre-wrap; }
</style>
