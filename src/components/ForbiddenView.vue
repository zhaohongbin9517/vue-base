<template>
  <div class="forbidden-page">
    <div class="forbidden-inner editorial-fade-in">
      <p class="forbidden-kicker editorial-caption">Access Denied · 403</p>
      <h1 class="forbidden-title">无浏览权限</h1>
      <hr class="editorial-rule" />
      <p class="forbidden-lead">
        当前账号没有访问此页面的浏览权限。<br/>
        如需获取访问权限，请联系管理员进行授权。
      </p>
      <div class="forbidden-action">
        <el-button type="primary" @click="goFirstAuthorizedPage">返回可访问页面</el-button>
      </div>
    </div>
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
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-7) var(--space-5);
  background: var(--bg-canvas);
}

.forbidden-inner {
  max-width: 520px;
  text-align: center;
}

.forbidden-kicker {
  margin-bottom: var(--space-4);
}

.forbidden-title {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--ink-1);
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-5);
  line-height: 1.1;
}

.forbidden-lead {
  font-family: var(--font-serif);
  font-size: 1.0625rem;
  line-height: 1.8;
  color: var(--ink-2);
  margin: 0 0 var(--space-7);
}

.forbidden-action {
  display: flex;
  justify-content: center;
}

.forbidden-action :deep(.el-button) {
  padding: 12px 32px;
  font-family: var(--font-serif);
  letter-spacing: 0.1em;
}
</style>
