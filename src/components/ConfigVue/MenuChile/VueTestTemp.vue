<template>
  <div class="custom-button-container">
    <el-button type="primary" @click="handleButtonClick" :icon="Plus">
        测试对象缓存函数
    </el-button>
  </div>
</template>

<script>
// 引入 Vue3 核心 API
import { Plus } from '@element-plus/icons-vue'
import { getAllObjectInfoMap } from '@/api/cacheData'

export default {
  name: 'VueTestTemp',
  components: {
    
  },
  setup() {
    return {
        Plus
    }
  },
  data() {
    return {
      buttonText: '点击我'
    }
  },
  mounted() {
  },
  methods: {
    async handleButtonClick() {
      console.log('按钮被点击了')
      console.log(await getAllObjectInfoMap())
    }
}}
</script>

<style scoped>
/* 样式和 Vue2 版本完全一致 */
.custom-button-container {
  margin: 10px 0;
}

.custom-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.custom-btn:hover {
  background-color: #66b1ff;
}

.custom-btn:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
}
</style>