<template>
  <div class="markdown-container">
    <div class="markdown-header">
      <h2 class="markdown-title">{{ pageTitle }}</h2>
    </div>
    <div class="markdown-content" v-html="markdownContent"></div>
    <div class="markdown-loading" v-if="loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>
    <div class="markdown-error" v-if="error">
      <el-icon><WarningFilled /></el-icon>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
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
    
    // 根据路由参数获取当前页面标题
    const pageTitle = computed(() => {
      const type = route.params.type || 'default'
      return markdownFiles[type] ? markdownFiles[type].title : markdownFiles.default.title
    })
    
    // 加载markdown文件
    const loadMarkdown = async () => {
      loading.value = true
      error.value = ''
      markdownContent.value = ''
      
      try {
        const type = route.params.type || 'default'
        const fileConfig = markdownFiles[type] || markdownFiles.default
        
        // 构建完整路径
        const fullPath = `${fileConfig.path}`
        
        // 加载markdown文件
        const response = await fetch(fullPath)
        if (!response.ok) {
          throw new Error('文件加载失败')
        }
        
        const rawContent = await response.text()
        // 解析markdown为HTML
        markdownContent.value = marked(rawContent)
        
        // 处理图片路径
        processImages()
      } catch (err) {
        error.value = `加载失败: ${err.message}`
        console.error('加载markdown文件失败:', err)
      } finally {
        loading.value = false
      }
    }
    
    // 处理图片路径，确保正确显示
    const processImages = () => {
      setTimeout(() => {
        const images = document.querySelectorAll('.markdown-content img')
        images.forEach(img => {
          let src = img.getAttribute('src')
          // 如果是相对路径，转换为绝对路径
          if (src && !src.startsWith('http') && !src.startsWith('/')) {

            // 获取当前markdown文件的目录路径
            const type = route.params.type || 'default'
            const fileConfig = markdownFiles[type] || markdownFiles.default
            const basePath = fileConfig.path.substring(0, fileConfig.path.lastIndexOf('/'))
            
            // 构建完整图片路径
            src = `${basePath}/${src}`
            img.setAttribute('src', src)
          } else if (src && src.startsWith('/src/assets/doc/')) {
            // 旧的src/assets/doc路径转换为新的/doc路径
            src = src.replace('/src/assets/doc/', '/doc/')
            img.setAttribute('src', src)
          } else if (src && src.startsWith('/static/doc/')) {
            // 旧的/static/doc路径转换为新的/doc路径
            src = src.replace('/static/doc/', '/doc/')
            img.setAttribute('src', src)
          }
        })
      }, 0)
    }
    
    // 监听路由变化，重新加载markdown
    watch(() => route.params.type, () => {
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

.markdown-content {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
}

/* markdown内容样式 */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content h1 {
  font-size: 32px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.markdown-content h2 {
  font-size: 24px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.markdown-content h3 {
  font-size: 20px;
}

.markdown-content h4 {
  font-size: 16px;
}

.markdown-content h5 {
  font-size: 14px;
}

.markdown-content h6 {
  font-size: 12px;
  color: #909399;
}

.markdown-content p {
  margin-bottom: 16px;
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 24px;
  margin-bottom: 16px;
}

.markdown-content li {
  margin-bottom: 8px;
}

.markdown-content code {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 14px;
  color: #f56c6c;
}

.markdown-content pre {
  background: #f5f7fa;
  border-radius: 6px;
  padding: 16px;
  overflow: auto;
  margin-bottom: 16px;
}

.markdown-content pre code {
  background: none;
  padding: 0;
  color: #303133;
}

.markdown-content blockquote {
  border-left: 4px solid #409eff;
  padding: 10px 16px;
  margin: 0 0 16px 0;
  background: #ecf5ff;
  color: #606266;
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.markdown-content table th,
.markdown-content table td {
  border: 1px solid #e4e7ed;
  padding: 8px 12px;
  text-align: left;
}

.markdown-content table th {
  background: #f5f7fa;
  font-weight: 600;
}

.markdown-content img {
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