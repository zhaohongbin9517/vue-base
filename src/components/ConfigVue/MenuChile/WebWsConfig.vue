<template>
  <div  class="web-ws-config">
    <div v-if="isShowHeader" class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Setting /></el-icon>
        WebSocket 配置管理
      </h2>
      <p class="page-desc">管理 WebSocket 相关配置信息</p>
    </div>

    <!-- 按钮区域 -->
    <div class="button-area">
      <el-button v-if="PromiseWrite" type="primary" @click="handleUpdate" :loading="loading" :icon="Refresh">
        文件加载配置
      </el-button>
      <el-button v-if="PromiseWrite" type="success" @click="handleSave" :loading="saving" :icon="Check">
        保存配置
      </el-button>
    </div>

    <!-- 配置编辑卡片 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>WebSocket 配置</span>
        </div>
      </template>

      <div class="editor-container">
        <!-- <label for="json-editor">WebSocket 配置 JSON：</label> -->
        <vue3-json-editor
          :modes="modes"
          id="json-editor"
          v-model="jsonContent"
          class="json-editor"
          :useWorker="false"
          :indent="2"
          mode="code"
          placeholder="请输入 JSON 格式的配置数据"
          @json-change="handleJsonChange"
        ></vue3-json-editor>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Setting, Document, Refresh, Check } from '@element-plus/icons-vue'
import { getWebWsConfig, updateWebWsConfig, changeWebWsConfig } from '@/api/configUtils/config'
import { getAuthPermission } from '@/api/login/auth'
import { Vue3JsonEditor } from 'vue3-json-editor'



export default {
  name: 'WebWsConfig',
  components: {
    Setting,
    Document,
    Vue3JsonEditor
  },
  setup() {
    return {
      Refresh,
      Check
    }
  },
  props: {
    isShowHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // modes: ['tree','code','form','text','view'],
      modes: ['code','tree'],
      jsonContent: {},
      loading: false,
      saving: false,
      errorMessage: '',
      PromiseWrite: getAuthPermission('config:write'),
      PromiseRead: getAuthPermission('config:read')
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    async loadConfig() {
      this.loading = true
      this.errorMessage = ''
      try {
        const response = await getWebWsConfig()
        if (response && response.ws) {
          this.jsonContent = response.ws
        } else {
          this.errorMessage = '获取配置数据失败：未找到 ws 配置'
        }
      } catch (error) {
        this.errorMessage = `获取配置数据失败：${error.message}`
      } finally {
        this.loading = false
      }
    },
    async handleUpdate() {
      await updateWebWsConfig(),
      this.loadConfig()
      this.$message.success('配置更新成功')
    },
    async handleSave() {
      this.errorMessage = ''
      try {
        // 验证 JSON 格式
        // JSON.parse(this.jsonContent)
        this.saving = true
        // 这里应该调用保存接口，暂时用模拟实现
        await changeWebWsConfig({ws: this.jsonContent})
        this.saving = false
        this.$message.success('保存成功')
      } catch (error) {
        this.errorMessage = `JSON 格式错误：${error.message}`
        this.$message.error(this.errorMessage)
        this.saving = false
      }
    },
    handleJsonChange(value) {
      this.jsonContent = value
    }
  }
}
</script>

<style scoped>
.web-ws-config {
  padding: 0;
  background: transparent;
  overflow-y: auto;
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

.button-area {
  margin-bottom: var(--space-5);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding: var(--space-4) 0;
  border-top: 1px solid var(--border-hair);
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

.editor-container {
  margin-top: var(--space-4);
}

label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
  color: var(--ink-2);
}

.json-editor {
  width: 100%;
  height: 590px;
  border: 1px solid var(--border-hair);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color var(--duration) var(--ease);
}

.json-editor :deep(.vue-json-editor) {
  padding: var(--space-3);
}

.json-editor:focus {
  outline: none;
  border-color: var(--ink-2);
}

.json-editor :deep(.jsoneditor-outer) {
  height: 590px;
}

.error-message {
  margin-top: var(--space-2);
  color: var(--danger);
  font-size: 12px;
}
</style>