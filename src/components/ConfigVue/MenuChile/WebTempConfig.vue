<template>
  <div class="web-ws-config">
    <div v-if="isShowHeader" class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Setting /></el-icon>
        模板配置管理
      </h2>
      <p class="page-desc">管理模板相关配置信息</p>
    </div>
    <el-card>
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><collection /></el-icon>
          <span>操作</span>
        </div>
      </template>
      <div class="base-config">
        <label for="webTempFileName">当前模板：
          <span style="color: #409eff;">{{webTempFileName}}</span></label>
        <el-input v-if="PromiseWrite" v-model="changeFileName" placeholder="请输入需要修改的模板文件名" class="file-input">
            <template #prefix>
              <el-icon><office-building /></el-icon>
            </template>
        </el-input>
        <el-button v-if="PromiseWrite" type="primary" @click="changFileName" :loading="loading" :icon="Refresh">
          修改配置文件
        </el-button>
        <el-button v-if="PromiseWrite" type="primary" @click="handleUpdate" :loading="loading" :icon="Refresh">
          文件加载配置
        </el-button>
        <el-button v-if="PromiseWrite" type="success" @click="handleSave" :loading="saving" :icon="Check">
          保存配置
        </el-button>
      </div>
    </el-card>
    
    <p>&nbsp;</p>
    <!-- 配置编辑卡片 -->
    <el-card class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <span>模板配置</span>
        </div>
      </template>

      <div class="editor-container">
        <!-- <label for="json-editor">WebSocket 配置 JSON：</label> -->
        <vue3-json-editor
          id="json-editor"
          :modes="modes"
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
import { Document,Collection ,OfficeBuilding, Refresh, Check,Setting} from '@element-plus/icons-vue'
import { Vue3JsonEditor } from 'vue3-json-editor'
import { getWebTempConfig, resetWebTempConfig , changeWebTempConfig , changeWebTempFilename} from '@/api/configUtils/config'
import { getAuthPermission } from '@/api/login/auth'

export default {
  name: 'WebTempConfig',
  components: {
    Setting,
    OfficeBuilding,
    Collection,
    Document,
    Vue3JsonEditor
  },
  setup() {
    return {
      Refresh,
      Check
    }
  },
  data() {
    return {
      modes: ['code','tree'],
      webTempFileName: '',
      changeFileName: '',
      jsonContent: {},
      loading: false,
      saving: false,
      errorMessage: '',
      PromiseWrite: getAuthPermission('config:write'),
      PromiseRead: getAuthPermission('config:read')
    }
  },
  props: {
    isShowHeader: {
      type: Boolean,
      default: false
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
        const response = await getWebTempConfig()
        if (response && response.temp) {
          this.jsonContent = response.temp
          this.webTempFileName = response.fileName
        } else {
          this.errorMessage = '获取配置数据失败：未找到 temp 配置'
        }
      } catch (error) {
        this.errorMessage = `获取配置数据失败：${error.message}`
      } finally {
        this.loading = false
      }
    },
    async handleUpdate() {
      await resetWebTempConfig(),
      this.loadConfig()
      this.$message.success('配置更新成功')
    },
    async changFileName() {
      const res =  await changeWebTempFilename({fileName: this.changeFileName})
        if (res && res.result === 'ok') {
          this.$message.success('文件名修改成功'),
          this.loadConfig()
        } else {
          this.$message.error(`文件名修改失败:${res.result}`)
        }
    },
    async handleSave() {
      this.errorMessage = ''
      try {
        // 验证 JSON 格式
        this.saving = true
        // 这里应该调用保存接口，暂时用模拟实现
        await changeWebTempConfig({temp: this.jsonContent})
        this.saving = false
        this.$message.success('保存成功')
      } catch (error) {
        this.errorMessage = `JSON 格式错误：${error.message}`
        this.$message.error(this.errorMessage)
      }
    },
    handleJsonChange(json) {
      this.jsonContent = json
    }
  }
}
</script>

<style scoped>
.base-config {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

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
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  color: var(--ink-2);
  margin-right: var(--space-2);
}

.base-config .el-input {
  width: 300px;
}

.file-input {
  width: 300px;
  margin-right: var(--space-2);
}

.json-editor {
  width: 100%;
  height: 500px;
  border: 1px solid var(--border-hair);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color var(--duration) var(--ease);
}

.json-editor :deep(.jsoneditor-outer) {
  height: 500px;
}

.json-editor:focus {
  outline: none;
  border-color: var(--ink-2);
}

.error-message {
  margin-top: var(--space-2);
  color: var(--danger);
  font-size: 12px;
}
</style>