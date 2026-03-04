<template>
  <el-button v-if="PromiseWrite" type="success" size="small" @click="handleClick" class="save-param-btn">
    <el-icon><check /></el-icon>
    保存配置
  </el-button>
</template>

<script>
import { Check } from '@element-plus/icons-vue'
import { getAuthPermission } from '@/api/login/auth'

export default {
  name: 'SaveConfigButton',
  components: {
    Check
  },
  data() {
    return {
      PromiseWrite: getAuthPermission('config:write'),
      PromiseRead: getAuthPermission('config:read')
    }
  },
  methods: {
    handleClick() {
      this.$emit('save')
    }
  }
}
</script>

<style scoped>
.save-param-btn {
  margin-left: auto;
}
</style>