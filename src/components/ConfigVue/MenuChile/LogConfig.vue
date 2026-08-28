<template>
  <div class="log-config">
    <div v-if="isShowHeader" class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Document /></el-icon>
        日志查看
      </h2>
      <p class="page-desc">输入站 ID 查看该计量站运行日志</p>
    </div>

    <el-card class="config-card" shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="stationId"
          placeholder="请输入站 ID，如 Z01SAGD_1"
          clearable
          class="station-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch" :loading="loading">
          <el-icon><Search /></el-icon>
          <span>搜索</span>
        </el-button>
        <el-button @click="handleClear" :disabled="!hasSearched">
          <el-icon><RefreshLeft /></el-icon>
          <span>清空</span>
        </el-button>
        <el-button @click="handleExport" :disabled="!displayLogs.length">
          <el-icon><Download /></el-icon>
          <span>导出</span>
        </el-button>
      </div>
    </el-card>

    <el-card class="config-card log-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Tickets /></el-icon>
          <span>日志列表</span>
          <el-tag v-if="allLogs.length" type="info" effect="plain" class="log-count">
            共 {{ allLogs.length }} 条 · 已显示 {{ displayLogs.length }} 条
          </el-tag>
        </div>
      </template>

      <div v-if="loading" class="log-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>正在加载日志...</span>
      </div>

      <div v-else-if="errorMsg" class="log-empty log-error">
        <el-icon><Warning /></el-icon>
        <span>{{ errorMsg }}</span>
      </div>

      <div v-else-if="!hasSearched" class="log-empty">
        <el-icon><Tickets /></el-icon>
        <span>请输入站 ID 后点击搜索</span>
      </div>

      <div v-else-if="allLogs.length === 0" class="log-empty">
        <el-icon><CircleClose /></el-icon>
        <span>该站暂无日志</span>
      </div>

      <el-scrollbar
        v-else
        ref="scrollbarRef"
        height="600px"
        class="log-scrollbar"
        @scroll="handleScroll"
      >
        <div class="log-list">
          <div
            v-for="(log, index) in displayLogs"
            :key="index"
            class="log-item"
          >
            <span class="log-time">{{ formatTime(log.time) }}</span>
            <span class="log-msg">{{ log.msg }}</span>
          </div>
          <div v-if="loadingMore" class="log-loading-more">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>加载更多...</span>
          </div>
          <div v-else-if="!hasMore && allLogs.length > batchSize" class="log-end">
            — 已加载全部日志 —
          </div>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
import { Document, Search, RefreshLeft, Download, Tickets, Loading, Warning, CircleClose } from '@element-plus/icons-vue'
import { getMeterLogs } from '@/api/configUtils/config'

export default {
  name: 'LogConfig',
  components: {
    Document, Search, RefreshLeft, Download, Tickets, Loading, Warning, CircleClose
  },
  props: {
    isShowHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stationId: '',
      allLogs: [],
      displayLogs: [],
      loading: false,
      loadingMore: false,
      hasSearched: false,
      errorMsg: '',
      batchSize: 200,
      currentEnd: 0,
      scrollbarRef: null
    }
  },
  computed: {
    hasMore() {
      return this.currentEnd < this.allLogs.length
    }
  },
  methods: {
    async handleSearch() {
      if (!this.stationId.trim()) {
        this.$message.warning('请输入站 ID')
        return
      }
      this.loading = true
      this.errorMsg = ''
      this.hasSearched = true
      this.allLogs = []
      this.displayLogs = []
      this.currentEnd = 0

      try {
        const data = await getMeterLogs(this.stationId.trim())
        this.allLogs = Array.isArray(data) ? data : (data?.list || [])
        this.loadMore()
      } catch (err) {
        this.errorMsg = err.message || '获取日志失败'
        this.$message.error(this.errorMsg)
      } finally {
        this.loading = false
      }
    },

    loadMore() {
      const nextEnd = Math.min(this.currentEnd + this.batchSize, this.allLogs.length)
      if (nextEnd <= this.currentEnd) return

      this.loadingMore = true
      // 用 nextTick 让 loading 状态先渲染，再追加数据
      this.$nextTick(() => {
        const batch = this.allLogs.slice(this.currentEnd, nextEnd)
        this.displayLogs.push(...batch)
        this.currentEnd = nextEnd
        this.loadingMore = false
      })
    },

    handleScroll({ scrollTop, scrollHeight, clientHeight }) {
      if (!this.hasMore || this.loadingMore) return
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        this.loadMore()
      }
    },

    handleClear() {
      this.stationId = ''
      this.allLogs = []
      this.displayLogs = []
      this.hasSearched = false
      this.errorMsg = ''
      this.currentEnd = 0
    },

    handleExport() {
      if (!this.displayLogs.length) return
      const lines = this.displayLogs.map(log =>
        `[${this.formatTime(log.time)}] ${log.msg}`
      )
      const content = lines.join('\n')
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${this.stationId}_log_${Date.now()}.txt`
      a.click()
      URL.revokeObjectURL(url)
    },

    formatTime(ms) {
      if (!ms && ms !== 0) return '-'
      const d = new Date(Number(ms))
      if (isNaN(d.getTime())) return String(ms)
      const pad = (n, w = 2) => String(n).padStart(w, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
    }
  }
}
</script>

<style scoped>
.log-config {
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

.log-count {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 400;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.station-input {
  width: 320px;
}

/* —— 日志列表 —— */
.log-card {
  margin-bottom: 0;
}

.log-scrollbar {
  border: 1px solid var(--border-hair);
  border-radius: var(--radius-md);
  background: var(--bg-subtle);
}

.log-list {
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.7;
}

.log-item {
  display: flex;
  gap: var(--space-3);
  padding: 4px 6px;
  border-bottom: 1px dashed var(--border-hair);
  word-break: break-all;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: var(--accent);
  flex-shrink: 0;
  font-size: 0.75rem;
  min-width: 180px;
}

.log-msg {
  color: var(--ink-2);
  flex: 1;
  white-space: pre-wrap;
}

.log-empty,
.log-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-9) var(--space-5);
  color: var(--ink-4);
  font-family: var(--font-serif);
}

.log-error {
  color: var(--danger);
}

.log-loading-more,
.log-end {
  text-align: center;
  padding: var(--space-3);
  color: var(--ink-4);
  font-size: 0.75rem;
}
</style>
