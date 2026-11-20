<!--
  数据更新总览
  展示全厂所有控制器（站）下采集单元的数据更新状态，支持按站、状态筛选与采集单元搜索
-->
<template>
  <div class="du-page">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><DataLine /></el-icon>
        数据更新总览
      </h2>
      <p class="page-desc">全厂各计量站采集单元最近一次数据更新时间，超过采集周期未更新即标记为「超期」</p>
    </div>

    <!-- 汇总信息 -->
    <div class="du-stats">
      <div class="du-stat">
        <span class="du-stat__label">采集单元总数</span>
        <span class="du-stat__value">{{ summary.total }}</span>
      </div>
      <div class="du-stat">
        <span class="du-stat__label">正常</span>
        <span class="du-stat__value du-stat__value--ok">{{ summary.normal }}</span>
      </div>
      <div class="du-stat">
        <span class="du-stat__label">超期</span>
        <span class="du-stat__value du-stat__value--err">{{ summary.expired }}</span>
      </div>
      <div class="du-stat">
        <span class="du-stat__label">未知</span>
        <span class="du-stat__value">{{ summary.unknown }}</span>
      </div>
      <div class="du-stat">
        <span class="du-stat__label">涉及站点</span>
        <span class="du-stat__value">{{ summary.stations }}</span>
      </div>
    </div>

    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>采集单元更新状态</span>
          <span class="du-refresh-time" v-if="lastRefreshTime">最近刷新：{{ lastRefreshTime }}</span>
        </div>
      </template>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-select
          v-model="stationFilter"
          filterable
          clearable
          placeholder="按站筛选"
          class="filter-select"
        >
          <el-option
            v-for="s in stationOptions"
            :key="s.id"
            :label="`${s.name}（${s.id}）`"
            :value="s.id"
          />
        </el-select>
        <el-select v-model="statusFilter" clearable placeholder="按状态筛选" class="filter-select">
          <el-option label="正常" value="normal" />
          <el-option label="超期" value="expired" />
          <el-option label="未知" value="unknown" />
        </el-select>
        <el-input
          v-model="searchKeyword"
          clearable
          placeholder="搜索采集单元"
          class="filter-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" :icon="RefreshRight" :loading="loading" @click="handleManualRefresh">
          刷新
        </el-button>
      </div>

      <el-table
        :data="filteredRows"
        v-loading="loading"
        border
        stripe
        class="config-table"
        empty-text="暂无采集单元数据更新记录"
      >
        <el-table-column label="设备名称" min-width="160">
          <template #default="{ row }">{{ stationName(row.controller_id) }}</template>
        </el-table-column>
        <el-table-column prop="controller_id" label="站 ID" min-width="150" />
        <el-table-column prop="da_unit" label="采集单元" min-width="140" />
        <el-table-column label="采集周期(s)" width="110" align="center">
          <template #default="{ row }">{{ formatPeriod(row.sample_period) }}</template>
        </el-table-column>
        <el-table-column label="最近更新" min-width="190">
          <template #default="{ row }">{{ formatTime(row.last_update_time) }}</template>
        </el-table-column>
        <el-table-column label="已过时长" width="110" align="center">
          <template #default="{ row }">{{ formatElapsed(row.elapsed) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.expired)" effect="light">
              {{ statusText(row.expired) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { DataLine, Document, Search, RefreshRight } from '@element-plus/icons-vue'
import { getAllStationConfig, getMeterDataUpdate } from '@/api/configUtils/config'

// 自动刷新间隔（毫秒）
const AUTO_REFRESH_INTERVAL = 10000

// 时间展示统一使用服务端所在时区，避免浏览器时区差异
const DISPLAY_TIME_ZONE = 'Asia/Shanghai'
const TIME_FORMATTER = new Intl.DateTimeFormat('zh-CN', {
  timeZone: DISPLAY_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23'
})

export default {
  name: 'DataUpdateOverview',
  components: { DataLine, Document, Search, RefreshRight },
  data() {
    return {
      loading: false,
      rows: [],
      stationConfigs: [],
      stationFilter: '',
      statusFilter: '',
      searchKeyword: '',
      lastRefreshTime: '',
      timerId: null,
      requesting: false,
      errorNotified: false
    }
  },
  computed: {
    stationOptions() {
      return this.stationConfigs
        .map(item => ({
          id: item.object_id,
          name: item.device_name || item.object_id
        }))
        .filter(item => item.id)
    },
    stationNameMap() {
      const map = {}
      this.stationConfigs.forEach(item => {
        if (item.object_id) {
          map[item.object_id] = item.device_name || item.object_id
        }
      })
      return map
    },
    filteredRows() {
      const keyword = this.searchKeyword.trim().toLowerCase()
      return this.rows.filter(row => {
        if (this.stationFilter && row.controller_id !== this.stationFilter) return false
        if (this.statusFilter === 'normal' && row.expired !== false) return false
        if (this.statusFilter === 'expired' && row.expired !== true) return false
        if (this.statusFilter === 'unknown' && row.expired !== null) return false
        if (keyword && !String(row.da_unit || '').toLowerCase().includes(keyword)) return false
        return true
      })
    },
    summary() {
      const total = this.rows.length
      const expired = this.rows.filter(r => r.expired === true).length
      const normal = this.rows.filter(r => r.expired === false).length
      const unknown = total - expired - normal
      const stations = new Set(this.rows.map(r => r.controller_id)).size
      return { total, expired, normal, unknown, stations }
    }
  },
  mounted() {
    this.loadStations()
    this.fetchData()
    this.startAutoRefresh()
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  },
  beforeUnmount() {
    this.stopAutoRefresh()
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  },
  methods: {
    async loadStations() {
      try {
        const res = await getAllStationConfig()
        this.stationConfigs = Array.isArray(res) ? res : []
      } catch (e) {
        console.error('获取站列表失败:', e)
      }
    },
    startAutoRefresh() {
      this.stopAutoRefresh()
      this.timerId = setInterval(() => {
        if (document.hidden) return
        this.fetchData({ silent: true })
      }, AUTO_REFRESH_INTERVAL)
    },
    stopAutoRefresh() {
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }
    },
    /* 页面隐藏时停表，重新可见时补一次静默刷新并恢复计时 */
    handleVisibilityChange() {
      if (document.hidden) {
        this.stopAutoRefresh()
      } else {
        this.fetchData({ silent: true })
        this.startAutoRefresh()
      }
    },
    /* 手动刷新：显示 loading，并把自动刷新计时重置 */
    handleManualRefresh() {
      this.fetchData()
      this.startAutoRefresh()
    },
    async fetchData({ silent = false } = {}) {
      if (silent && this.requesting) return
      this.requesting = true
      if (!silent) this.loading = true
      try {
        const res = await getMeterDataUpdate()
        this.rows = Array.isArray(res) ? res : []
        this.lastRefreshTime = this.formatTime(Date.now())
        this.errorNotified = false
      } catch (e) {
        // 连续失败只提示一次，避免自动刷新反复弹错
        if (!silent || !this.errorNotified) {
          this.$message.error(e?.message || '获取数据更新状态失败')
          this.errorNotified = true
        }
      } finally {
        this.requesting = false
        if (!silent) this.loading = false
      }
    },
    stationName(controllerId) {
      return this.stationNameMap[controllerId] || controllerId
    },
    statusText(expired) {
      if (expired === true) return '超期'
      if (expired === false) return '正常'
      return '未知'
    },
    statusTagType(expired) {
      if (expired === true) return 'danger'
      if (expired === false) return 'success'
      return 'info'
    },
    formatPeriod(period) {
      return period === null || period === undefined ? '—' : period
    },
    formatTime(ms) {
      if (!ms && ms !== 0) return '—'
      const d = new Date(Number(ms))
      if (isNaN(d.getTime())) return String(ms)
      // 按固定时区展示，避免不同浏览器时区导致服务端时间显示不一致
      const parts = {}
      TIME_FORMATTER.formatToParts(d).forEach(p => {
        if (p.type !== 'literal') parts[p.type] = p.value
      })
      return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`
    },
    formatElapsed(ms) {
      if (ms === null || ms === undefined) return '—'
      if (ms < 1000) return `${ms}ms`
      if (ms < 60000) return `${Math.floor(ms / 1000)}s`
      return `${(ms / 60000).toFixed(1)}min`
    }
  }
}
</script>

<style scoped>
.du-page {
  padding: 0;
  background: transparent;
}

.page-header {
  margin-bottom: var(--space-5);
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ink-1);
  margin: 0 0 var(--space-2) 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.title-icon {
  font-size: 26px;
  color: var(--ink-1);
}

.page-desc {
  font-size: 14px;
  color: var(--ink-2);
  margin: 0;
}

/* 汇总信息 */
.du-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.du-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-hair);
  border-radius: var(--radius-sm);
}

.du-stat__label {
  font-size: 12px;
  color: var(--ink-3);
  letter-spacing: 0.04em;
}

.du-stat__value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ink-1);
}

.du-stat__value--ok {
  color: var(--success, #3f7d4e);
}

.du-stat__value--err {
  color: var(--danger, #b91c1c);
}

.config-card {
  margin-bottom: var(--space-5);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 600;
  color: var(--ink-1);
}

.header-icon {
  color: var(--ink-1);
}

.du-refresh-time {
  margin-left: auto;
  font-size: 12px;
  font-weight: 400;
  color: var(--ink-3);
}

/* 筛选区域 */
.filter-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-hair);
}

.filter-select {
  width: 200px;
}

.filter-input {
  width: 200px;
}

.filter-input :deep(.el-input__wrapper) {
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
}

.config-table {
  margin-top: var(--space-4);
}
</style>
