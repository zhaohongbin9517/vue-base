<template>
  <div class="cron-builder-wrapper">
    <!-- 循环渲染 cron 配置项 -->
    <div
      class="cron-item"
      v-for="item in cornTemp"
      :key="item.title"
    >
      <label>{{ item.title }}</label>
      <el-select v-model="item.select_value" @change="buildCron" :placeholder="item.title" >
        <el-option v-for="item1 in cronItem" :key="item1.value" :label="item1.label" :value="item1.value" />
      </el-select>

      <!-- 指定值 -->
      <el-input-number 
       class="spec-input" 
       v-if="item.select_value === 'spec'" 
       v-model.number="item.val" 
       placeholder="请输入" 
       :min="item.min"
       :max="item.max"
       @change="buildCron"
      clearable/>

      <!-- 区间 -->
      <div v-if="item.select_value === 'range'" class="flex">
        <el-input-number v-model.number="item.start" :min="item.min" :max="item.max" placeholder="开始" @change="buildCron" clearable/>
        <span>-</span>
        <el-input-number v-model.number="item.end" :min="item.min" :max="item.max" placeholder="结束" @change="buildCron" clearable/>
      </div>

      <!-- 枚举 -->
      <el-input 
      class="enum-input" 
      v-if="item.select_value === 'enum'" 
      v-model="item.Enum" 
      placeholder="例: 0,10,20" 
      @change="buildCron" 
      clearable />
    </div>

    <!-- 结果展示 -->
    <div class="cron-result">
      <span>最终表达式：</span>
      <span class="text-primary font-bold">{{ localCornVal }}</span>
    </div>

    <!-- 最近5次执行时间 -->
    <div class="cron-preview" v-if="recentExecTimes.length">
      <span>最近5次执行时间：</span>
      <div class="time-list">
        <div v-for="(time, idx) in recentExecTimes" :key="idx">
          {{ time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CronBuilder',
  props: {
    cornVal: {
      type: String,
      default: '* * * * * *'
    }
  },
  data() {
    return {
      localCornVal: this.cornVal,
      recentExecTimes: [], // 最近5次执行时间
      cronItem: [
        { label: '任意', value: '*' },
        { label: '指定', value: 'spec' },
        { label: '区间', value: 'range' },
        { label: '枚举', value: 'enum' }
      ],
      cornTemp: [
        { title: '分', select_value: '*', val: 0, start: 0, end: 59, min: 0, max: 59, Enum: '0,10,20' },
        { title: '时', select_value: '*', val: 0, start: 0, end: 23, min: 0, max: 23, Enum: '0,6,12' },
        { title: '日', select_value: '*', val: 1, start: 1, end: 31, min: 1, max: 31, Enum: '1,15' },
        { title: '月', select_value: '*', val: 1, start: 1, end: 12, min: 1, max: 12, Enum: '1,6,12' },
        { title: '周', select_value: '*', val: 0, start: 0, end: 6, min: 0, max: 6, Enum: '1,5' },
        { title: '年', select_value: '*', val: 2025, start: 2025, end: 2028, min: 1997, max: 2228, Enum: '2025,2026' }
      ]
    }
  },
  mounted() {
    this.getRecentExecTimes()
  },
  methods: {
    // 枚举输入框校验：只允许 >0 的数字 + 英文逗号
    processString(CronItem) {
      const parts = CronItem.Enum.split(',');
      const validNumbers = parts.reduce((acc, item) => {
        const trimmed = item.trim();
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && Number.isInteger(num) && num >= 0 && num <= CronItem.max && num >= CronItem.min) {
          acc.push(num);
        }
        return acc;
      }, []);
      console.log(validNumbers,validNumbers.length)
      if (validNumbers.length === 0) {
        CronItem.Enum = '0'
        return 
      }
      CronItem.Enum = validNumbers.join(',')
    },
    buildCron() {
      const getVal = (item) => {
        if (item.select_value === 'spec') return item.val
        if (item.select_value === 'range') return `${item.start}-${item.end}`
        if (item.select_value === 'enum') {
          this.processString(item)
          return item.Enum
        }
        return '*'
      }
      const minute = getVal(this.cornTemp[0])
      const hour = getVal(this.cornTemp[1])
      const day = getVal(this.cornTemp[2])
      const month = getVal(this.cornTemp[3])
      const week = getVal(this.cornTemp[4])
      const year = getVal(this.cornTemp[5])
      this.localCornVal = `${minute} ${hour} ${day} ${month} ${week} ${year}`
      this.getRecentExecTimes()
      this.updateCornVal()
    },

    // ====================== 核心：获取最近5次执行时间 ======================
    getRecentExecTimes() {
      try {
        const cronArr = this.localCornVal.split(' ')
        if (cronArr.length < 6) return
        this.recentExecTimes = this.simulateCron(cronArr, 5)
      } catch (e) {
        this.recentExecTimes = []
      }
    },

    // 模拟 Cron 执行（分 时 日 月 周 年）
    simulateCron(cronParts, count = 5) {
      const [minute, hour, day, month, week, year] = cronParts
      const now = new Date()
      const times = []
      let current = new Date(now)
      current.setSeconds(0, 0)

      while (times.length < count) {
        const y = current.getFullYear()
        const M = current.getMonth() + 1
        const d = current.getDate()
        const h = current.getHours()
        const m = current.getMinutes()
        const wd = current.getDay() || 7

        if (this.match(y, year) &&
          this.match(M, month) &&
          this.match(d, day) &&
          this.match(h, hour) &&
          this.match(m, minute) &&
          this.match(wd, week)) {
          times.push(this.formatTime(current))
        }

        current.setMinutes(current.getMinutes() + 1)
        if (current.getFullYear() > 2100) break
      }
      return times
    },

    match(val, rule) {
      if (rule === '*') return true
      if (rule.includes(',')) return rule.split(',').includes(String(val))
      if (rule.includes('-')) {
        const [s, e] = rule.split('-').map(Number)
        return val >= s && val <= e
      }
      return Number(val) === Number(rule)
    },

    formatTime(date) {
      const y = date.getFullYear()
      const M = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = String(date.getHours()).padStart(2, '0')
      const m = String(date.getMinutes()).padStart(2, '0')
      return `${y}-${M}-${d} ${h}:${m}`
    },
    // =====================================================================

    parseCron(cron) {
      const arr = cron.split(' ')
      if (arr.length < 6) return
      const setItem = (index, value) => {
        const item = this.cornTemp[index]
        item.select_value = '*'
        if (value.includes('-')) {
          item.select_value = 'range'
          const [s, e] = value.split('-')
          item.start = Number(s)
          item.end = Number(e)
        } else if (value.includes(',')) {
          item.select_value = 'enum'
          item.Enum = value
        } else if (value !== '*') {
          item.select_value = 'spec'
          item.val = Number(value)
        }
      }
      setItem(0, arr[0])
      setItem(1, arr[1])
      setItem(2, arr[2])
      setItem(3, arr[3])
      setItem(4, arr[4])
      setItem(5, arr[5])
    },
    // 更新父组件的 cornVal
    updateCornVal() {
      this.$emit('update:cornVal', this.localCornVal)
    }
  }
}
</script>

<style scoped>
.cron-builder-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: stretch;
}

.cron-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.cron-item label {
  width: 30px;
  font-weight: bold;
  flex-shrink: 0;
}

/* 下拉框 150px */
.cron-item :deep(.el-select) {
  width: 100px !important;
  flex-shrink: 0;
}

/* 指定输入框 150px */
.cron-item .spec-input {
  width: 150px !important;
  flex-shrink: 0;
}

/* 区间输入框 */
.cron-item .flex {
  display: flex;
  align-items: center;
  gap: 4px;
}
.cron-item .flex .el-input {
  width: 100px !important;
  flex-shrink: 0;
}

/* 枚举输入框 300px */
.cron-item .enum-input {
  width: 300px !important;
  flex-shrink: 0;
}

.cron-result {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

/* 最近执行时间样式 - 横向布局 */
.cron-preview {
  padding: 8px 12px;
  background: #f9fafc;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.time-list {
  display: flex;
  gap: 12px;
  align-items: center;
  color: #1e57f5;
}
</style>