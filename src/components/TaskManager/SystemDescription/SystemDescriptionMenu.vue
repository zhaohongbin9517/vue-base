<template>
  <div class="markdown-container">
    <div class="markdown-header">
      <h2 class="markdown-title">{{ pageTitle }}</h2>
    </div>
    <div v-if="loading" class="markdown-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>
    <div v-else-if="error" class="markdown-error">
      <el-icon><WarningFilled /></el-icon>
      <span>{{ error }}</span>
    </div>
    <v-md-preview
      v-else
      :text="markdownContent"
      :copy-code="false"
      class="markdown-editor"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Loading, WarningFilled } from '@element-plus/icons-vue'

export default {
  name: 'SystemDescriptionMenu',
  components: {
    Loading,
    WarningFilled
  },
  setup() {
    const route = useRoute()
    const markdownContent = ref('')
    const loading = ref(false)
    const error = ref('')
    
    // 支持的markdown文件配置
    const markdownFiles = {
      'task-config': {
        title: '任务配置说明',
        path: '/doc/任务配置说明.md'
      },
      'task-flow': {
        title: '任务配置流程',
        path: '/doc/任务配置流程/任务配置流程.md'
      },
      // 默认显示任务配置说明
      default: {
        title: '任务配置说明',
        path: '/doc/任务配置说明.md'
      }
    }
    
    // 根据路由查询参数获取当前页面标题
    const pageTitle = computed(() => {
      const type = route.query.type || 'default'
      return markdownFiles[type] ? markdownFiles[type].title : markdownFiles.default.title
    })
    
    // 加载markdown文件
    const loadMarkdown = async () => {
      loading.value = true
      error.value = ''
      markdownContent.value = ''
      
      try {
        const type = route.query.type || 'default'
        const fileConfig = markdownFiles[type] || markdownFiles.default
        
        // 构建完整路径
        const fullPath = `${fileConfig.path}`
        
        // 加载markdown文件
        const response = await fetch(fullPath)
        if (!response.ok) {
          throw new Error('文件加载失败')
        }
        
        const rawContent = await response.text()
        // 直接将markdown文本赋值给v-md-editor
        markdownContent.value = rawContent
      } catch (err) {
        error.value = `加载失败: ${err.message}`
        console.error('加载markdown文件失败:', err)
      } finally {
        loading.value = false
      }
    }
    

    
    // 监听路由查询参数变化，重新加载markdown
    watch(() => route.query.type, () => {
      loadMarkdown()
    })
    
    // 组件挂载时加载markdown
    onMounted(() => {
      loadMarkdown()
    })
    
    return {
      markdownContent,
      loading,
      error,
      pageTitle
    }
  }
}
</script>

<style scoped>
.markdown-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.markdown-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
}

.markdown-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.markdown-editor {
  min-height: 500px;
  font-size: 16px;
}

/* 确保v-md-editor内部元素样式正确 */
:deep(.v-md-editor__content) {
  padding: 0;
}

:deep(.v-md-editor__outline) {
  border: none;
}

:deep(.v-md-editor__content img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 8px 0;
}

.markdown-loading,
.markdown-error {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 10px;
}

.markdown-loading {
  color: #409eff;
}

.markdown-error {
  color: #f56c6c;
}
</style>