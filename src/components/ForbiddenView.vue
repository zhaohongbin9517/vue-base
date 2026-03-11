<template>
  <div class="forbidden-page">
    <el-card class="forbidden-card" shadow="never">
      <el-result icon="warning" title="无浏览权限" sub-title="当前账号没有访问此页面的浏览权限，请联系管理员授权。">
        <template #extra>
          <el-button type="primary" @click="goFirstAuthorizedPage">返回可访问页面</el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { getFirstAuthorizedPath } from '@/api/userUtils/access-control'

const router = useRouter()

const goFirstAuthorizedPage = () => {
  router.replace(getFirstAuthorizedPath())
}
</script>

<style scoped>
.forbidden-page {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 16px;
  box-sizing: border-box;
}

.forbidden-card {
  width: min(720px, 100%);
  border-radius: 14px;
}
</style>
