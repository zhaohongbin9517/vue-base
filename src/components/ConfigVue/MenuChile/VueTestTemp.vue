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
        <el-input v-model="changeFileName" placeholder="请输入需要修改的模板文件名" class="file-input">
            <template #prefix>
              <el-icon><office-building /></el-icon>
            </template>
        </el-input>
        <el-button type="primary" @click="changFileName" :loading="loading" :icon="Refresh">
          修改配置文件
        </el-button>
        <el-button type="primary" @click="handleUpdate" :loading="loading" :icon="Refresh">
          文件加载配置
        </el-button>
        <el-button type="success" @click="handleSave" :loading="saving" :icon="Check">
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
        <label for="json-editor">WebSocket 配置 JSON：</label>
        <vue3-json-editor
          id="json-editor"
          :modes="modes"
          v-model="jsonContent"
          class="json-editor"
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
import { Document,Collection ,OfficeBuilding} from '@element-plus/icons-vue'
import { Vue3JsonEditor } from 'vue3-json-editor'
import { getWebTempConfig, resetWebTempConfig , changeWebTempConfig , changeWebTempFilename} from '@/api/configUtils/config'

export default {
  name: 'WebTempConfig',
  components: {
    OfficeBuilding,
    Collection,
    Document,
    Vue3JsonEditor
  },
  data() {
    return {
      modes: ['code','tree'],
      webTempFileName: '',
      changeFileName: '',
      jsonContent: {},
      loading: false,
      saving: false,
      errorMessage: ''
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
      await changeWebTempFilename({fileName: this.webTempFileName}),
      this.loadConfig()
      this.$message.success('配置更新成功')
    },
    async handleSave() {
      console.log(this.jsonContent)
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
  gap: 16px;
  flex-wrap: wrap;
}

.web-ws-config {
  padding: 24px;
  background: #f5f7fa;
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
}

.web-ws-config::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.web-ws-config {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.page-header {
  margin-bottom: 24px;
  text-align: center;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-icon {
  font-size: 26px;
  color: #409eff;
}

.page-desc {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.button-area {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.config-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.header-icon {
  color: #409eff;
}

.editor-container {
  margin-top: 16px;
}

label {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
}

/* 针对base-config中的输入框单独设置宽度 */
.base-config .el-input {
  width: 300px;
}

/* 为文件输入框设置特定样式 */
.file-input {
  width: 300px;
  margin-right: 8px;
}

.json-editor {
  width: 100%;
  height: 500px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.3s;
}

.json-editor :deep(.jsoneditor-outer) {
   height: 500px;
}

.json-editor:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}


.error-message {
  margin-top: 8px;
  color: #f56c6c;
  font-size: 12px;
}
</style>