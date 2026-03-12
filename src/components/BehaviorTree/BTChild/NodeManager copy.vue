<template>
  <div class="config-card">
    <div class="config-card-header">
      <span>
        <el-icon><Tools /></el-icon> 行为节点管理器
      </span>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="addResultGroup">
          <el-icon><Plus /></el-icon> 新建分组
        </el-button>
      </div>
    </div>
    <div class="config-card-content">
      <div class="group-container">
        <div v-for="group in behaviorGroupList" :key="group.id" class="group-item">
          <!-- 分组头部 -->
          <div class="group-header" @click="toggleGroup(group)">
            <el-icon size="16" class="folder-icon"><Folder /></el-icon>
            <div class="group-info">
              <span class="group-name">{{ group.group_name }}</span>
              <span class="node-count">({{ group.behaviors.length }})</span>
            </div>
            <div class="group-actions">
              <el-button size="small" @click.stop="editGroup(group)">
                <el-icon><Edit /></el-icon> 编辑
              </el-button>
              <el-button size="small" type="danger" @click.stop="deleteGroup(group.id)">
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </div>
            <el-icon class="expand-icon">
              <Expand v-if="group.expanded" />
              <Fold v-else />
            </el-icon>
          </div>
          
          <!-- 节点列表 -->
          <transition name="slide-fade">
            <div v-if="group.expanded" class="node-list">
              <div class="node-item" v-for="node in group.behaviors" :key="node.id">
                <div class="node-left">
                  <el-icon size="16"><CircleCheck /></el-icon>
                  <div class="node-info">
                    <span class="node-name">{{ node.name }}</span>
                    <span class="node-desc">{{ node.desc }}</span>
                  </div>
                </div>
                <div class="node-actions">
                  <el-button size="small" @click.stop="viewNodeInfo(node)">
                    <el-icon><InfoFilled /></el-icon> 查看
                  </el-button>
                  <el-button size="small" @click.stop="editNode(node)">
                    <el-icon><Edit /></el-icon> 编辑
                  </el-button>
                  <el-button size="small" type="danger" @click.stop="deleteNode(node.id)">
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </div>
              </div>
              <!-- 添加节点按钮 -->
              <div class="add-node-button">
                <el-button type="primary" size="small" @click="addNode(group.id)">
                  <el-icon><Plus /></el-icon> 添加节点
                </el-button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 添加/修改分组弹窗 -->
  <el-dialog
    :title="isEditGroup ? '修改分组' : '添加分组'"
    v-model="groupDialogVisible"
    width="500px"
    destroy-on-close
  >
    <el-form ref="groupForm" :model="groupForm" :rules="groupFormRules" label-width="80px">
      <el-form-item label="分组名称" prop="group_name">
        <el-input v-model="groupForm.group_name" placeholder="请输入分组名称" />
      </el-form-item>
      <el-form-item label="分组描述" prop="group_desc">
        <el-input
          v-model="groupForm.group_desc"
          type="textarea"
          :rows="3"
          placeholder="请输入分组描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="groupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveGroup">确定</el-button>
      </span>
    </template>
  </el-dialog>
  
  <!-- 添加/修改节点弹窗 -->
  <el-dialog
    :title="isEditNode ? '修改节点' : '添加节点'"
    v-model="nodeDialogVisible"
    width="600px"
    destroy-on-close
  >
    <el-form ref="nodeForm" :model="nodeForm" :rules="nodeFormRules" label-width="100px">
      <el-form-item label="节点名称" prop="name">
        <el-input v-model="nodeForm.name" placeholder="请输入节点名称" />
      </el-form-item>
      <el-form-item label="节点描述" prop="desc">
        <el-input
          v-model="nodeForm.desc"
          type="textarea"
          :rows="3"
          placeholder="请输入节点描述"
        />
      </el-form-item>
      <el-form-item label="模块名称" prop="module">
        <el-select
          v-model="nodeForm.module"
          placeholder="请选择模块名称"
          @change="handleModuleChange"
        >
          <el-option
            v-for="option in moduleOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="函数名称" prop="func">
        <el-select
          v-model="nodeForm.func"
          placeholder="请选择函数名称"
        >
          <el-option
            v-for="option in funcOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参数配置">
        <div v-for="(arg, index) in nodeForm.args" :key="index" class="param-item">
          <el-input
            v-model="arg.name"
            placeholder="参数名称"
            style="width: 150px; margin-right: 10px"
          />
          <el-select
            v-model="arg.type"
            placeholder="参数类型"
            style="width: 100px; margin-right: 10px"
          >
            <el-option
              v-for="option in paramTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-button
            type="danger"
            size="small"
            @click="removeParam(index)"
            :disabled="nodeForm.args.length <= 1"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
        <el-button type="primary" size="small" @click="addParam" style="margin-top: 10px">
          <el-icon><Plus /></el-icon> 添加参数
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="nodeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNode">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { Tools, Plus, Edit, Delete, Folder, CircleCheck, InfoFilled, Expand, Fold } from '@element-plus/icons-vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElMessage } from 'element-plus'

// 暂时注释掉未使用的API导入
import { getAllBehavior } from '@/api/behavior/behavior'

export default {
  name: 'MeterConfigResultSetting',
  components: {
    Tools,
    Plus,
    Edit,
    Delete,
    Folder,
    CircleCheck,
    InfoFilled,
    Expand,
    Fold,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElButton
  },
  setup() {
    return {
      Plus,
      Edit,
      Delete,
      Folder,
      CircleCheck,
      InfoFilled,
      Expand,
      Fold
    }
  },
  data() {
    return {
      // 分组相关
      behaviorGroupList: [
        {
            id:-1,
            group_name:'基础分组',
            group_desc:'基础行为节点',
            expanded: true, // 添加展开状态标志
            behaviors:[
                {id: -2,name: "根节点", desc: "基础节点，包含一个子节点",group_id: -1, sort: 0 },
                {id: -3,name: "永真节点", desc: "无论子节点执行结果如何，本节点都返回success",group_id: -1, sort: 1 },
                {id: -4,name: "ifelse节点", desc: "根据check节点的返回结果决定执行success或fail节点",group_id: -1, sort: 2 },
                {id: -5,name: "循环节点（次数）", desc: "循环执行子节点指定次数",group_id: -1, sort: 3 },
                {id: -6,name: "循环节点（判断结果）", desc: "循环执行子节点直到返回结果与设定值相同",group_id: -1, sort: 4 },
                {id: -7,name: "选择节点", desc: "从左到右执行子节点，遇到第一个success即停止并返回success",group_id: -1, sort: 5 },
                {id: -8,name: "顺序节点", desc: "从左到右执行子节点，遇到第一个fail即停止并返回fail",group_id: -1, sort: 6 },
                {id: -9,name: "取反节点", desc: "对子节点的结果取反并作为本节点的结果返回",group_id: -1, sort: 7 },
                {id: -10,name: "平行节点", desc: "执行所有子节点，将最后一个节点的结果作为本节点的结果返回",group_id: -1, sort: 8 }
            ]
        }
      ],
      
      // 分组弹窗相关
      groupDialogVisible: false,
      isEditGroup: false,
      currentGroup: null,
      groupForm: {
        group_name: '',
        group_desc: ''
      },
      groupFormRules: {
        group_name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      
      // 节点弹窗相关
      nodeDialogVisible: false,
      isEditNode: false,
      currentNode: null,
      currentGroupId: null,
      nodeForm: {
        name: '',
        desc: '',
        module: '',
        func: '',
        args: []
      },
      nodeFormRules: {
        name: [
          { required: true, message: '请输入节点名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        module: [
          { required: true, message: '请选择模块名称', trigger: 'change' }
        ],
        func: [
          { required: true, message: '请选择函数名称', trigger: 'change' }
        ]
      },
      
      // 模块和函数选项（模拟数据）
      moduleOptions: [
        { label: 'measure_behavior_base', value: 'measure_behavior_base' },
        { label: 'control_behavior', value: 'control_behavior' },
        { label: 'report_behavior', value: 'report_behavior' }
      ],
      
      funcOptions: [],
      
      // 参数类型选项
      paramTypeOptions: [
        { label: '整数', value: 'int' },
        { label: '字符串', value: 'string' },
        { label: '原子值', value: 'atom' }
      ]
    }
  },
  mounted() {
    this.initData()
    console.log('分组列表:', this.behaviorGroupList)
  },
  
  methods: {
    initData(){
        // 注释掉实际API调用，使用本地模拟数据
        getAllBehavior().then(res => {
            // 为API返回的数据添加展开状态
            this.behaviorGroupList = this.behaviorGroupList.concat(res.map(group => ({
              ...group,
              expanded: false
            }))
        )})        
    },
    
    // 切换分组展开/收起状态
    toggleGroup(group) {
      group.expanded = !group.expanded
    },
    
    // 打开添加分组弹窗
    addResultGroup() {
      this.isEditGroup = false
      this.groupForm = {
        group_name: '',
        group_desc: ''
      }
      this.groupDialogVisible = true
    },
    
    // 打开编辑分组弹窗
    editGroup(group) {
      this.isEditGroup = true
      this.currentGroup = group
      this.groupForm = {
        group_name: group.group_name,
        group_desc: group.group_desc
      }
      this.groupDialogVisible = true
    },
    
    // 保存分组
    saveGroup() {
      this.$refs.groupForm.validate((valid) => {
        if (valid) {
          if (this.isEditGroup) {
            // 修改分组
            this.currentGroup.group_name = this.groupForm.group_name
            this.currentGroup.group_desc = this.groupForm.group_desc
            ElMessage.success('分组修改成功')
          } else {
            // 添加分组
            const newGroup = {
              id: Date.now(),
              group_name: this.groupForm.group_name,
              group_desc: this.groupForm.group_desc,
              expanded: true,
              behaviors: []
            }
            this.behaviorGroupList.push(newGroup)
            ElMessage.success('分组添加成功')
          }
          this.groupDialogVisible = false
        }
      })
    },
    
    // 删除分组
    deleteGroup(groupId) {
      this.$confirm('确定要删除该分组吗？删除后该分组下的所有节点也将被删除。', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.behaviorGroupList.findIndex(group => group.id === groupId)
        if (index !== -1) {
          this.behaviorGroupList.splice(index, 1)
          ElMessage.success('分组删除成功')
        }
      }).catch(() => {
        // 取消删除
      })
    },
    
    // 打开添加节点弹窗
    addNode(groupId) {
      this.isEditNode = false
      this.currentGroupId = groupId
      this.nodeForm = {
        name: '',
        desc: '',
        module: '',
        func: '',
        args: [{
          name: '',
          type: 'int'
        }]
      }
      this.nodeDialogVisible = true
    },
    
    // 打开编辑节点弹窗
    editNode(node) {
      this.isEditNode = true
      this.currentNode = node
      this.currentGroupId = node.group_id
      this.nodeForm = {
        name: node.name,
        desc: node.desc,
        module: node.module,
        func: node.func,
        args: JSON.parse(JSON.stringify(node.args))
      }
      this.nodeDialogVisible = true
    },
    
    // 保存节点
    saveNode() {
      this.$refs.nodeForm.validate((valid) => {
        if (valid) {
          // 过滤掉空参数
          const validArgs = this.nodeForm.args.filter(arg => arg.name.trim() !== '')
          
          if (this.isEditNode) {
            // 修改节点
            this.currentNode.name = this.nodeForm.name
            this.currentNode.desc = this.nodeForm.desc
            this.currentNode.module = this.nodeForm.module
            this.currentNode.func = this.nodeForm.func
            this.currentNode.args = validArgs
            ElMessage.success('节点修改成功')
          } else {
            // 添加节点
            const newNode = {
              id: Date.now(),
              name: this.nodeForm.name,
              desc: this.nodeForm.desc,
              module: this.nodeForm.module,
              func: this.nodeForm.func,
              group_id: this.currentGroupId,
              args: validArgs,
              sort: 0
            }
            
            // 找到对应的分组并添加节点
            const group = this.behaviorGroupList.find(g => g.id === this.currentGroupId)
            if (group) {
              group.behaviors.push(newNode)
              ElMessage.success('节点添加成功')
            }
          }
          this.nodeDialogVisible = false
        }
      })
    },
    
    // 删除节点
    deleteNode(nodeId) {
      this.$confirm('确定要删除该节点吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 在所有分组中查找并删除节点
        for (const group of this.behaviorGroupList) {
          const index = group.behaviors.findIndex(node => node.id === nodeId)
          if (index !== -1) {
            group.behaviors.splice(index, 1)
            ElMessage.success('节点删除成功')
            return
          }
        }
      }).catch(() => {
        // 取消删除
      })
    },
    
    // 查看节点信息
    viewNodeInfo(node) {
      console.log('查看节点信息:', node)
      // 可以实现查看节点详情的弹窗
      ElMessage.info('节点详情：' + node.name + ' - ' + node.desc)
    },
    
    // 添加参数
    addParam() {
      this.nodeForm.args.push({
        name: '',
        type: 'int'
      })
    },
    
    // 删除参数
    removeParam(index) {
      this.nodeForm.args.splice(index, 1)
    },
    
    // 模块变化时更新函数选项（模拟）
    handleModuleChange() {
      // 根据选择的模块模拟函数选项
      this.funcOptions = []
      if (this.nodeForm.module) {
        this.funcOptions = [
          { label: this.nodeForm.module + '_func1', value: this.nodeForm.module + '_func1' },
          { label: this.nodeForm.module + '_func2', value: this.nodeForm.module + '_func2' },
          { label: this.nodeForm.module + '_func3', value: this.nodeForm.module + '_func3' }
        ]
      }
    }
  }
}
</script>

<style scoped>
.config-card {
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}
:deep(.el-card__body) {
  /* 隐藏滚动条 - Chrome, Safari, Edge */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.group-container:-webkit-scrollbar {
  display: none;
}


.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-icon {
  font-size: 20px;
  color: #409eff;
}

.tips-text {
  font-size: 12px;
  color: #409eff;
  margin-left: 8px;
}

.param-btn {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

/* 分组容器 */
.group-container {
  margin-top: 20px;
}

/* 分组项 */
.group-item {
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.group-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 分组头部 */
.group-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.group-header:hover {
  background-color: #ecf5ff;
}

.group-icon {
  font-size: 18px;
  color: #67c23a;
  margin-right: 8px;
}

.group-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-right: 12px;
}

.node-count {
  font-size: 12px;
  color: #909399;
  margin-right: auto;
}

.expand-icon {
  font-size: 20px;
  color: #909399;
  margin-right: auto;
  margin-top: auto;
  margin-left: auto;
  transition: transform 0.3s ease;
}

.group-actions {
  display: flex;
  gap: 8px;
}

/* 节点列表 */
.node-list {
  padding: 12px 16px;
}

/* 节点项 */
.node-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;
  transition: background-color 0.3s ease;
}

.node-item:last-child {
  border-bottom: none;
}

.node-item:hover {
  background-color: #f5f7fa;
}

.node-icon {
  font-size: 16px;
  color: #67c23a;
  margin-right: 12px;
}

/* 节点信息容器 */
.node-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 12px;
}

/* 节点名称 */
.node-name {
  font-size: 16px;
  color: #2ea300;
  line-height: 1.4;
}

/* 节点描述 */
.node-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
  margin-top: 2px;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 1;
  margin-right: 30px;
}

/* 展开收起动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  padding: 0 16px;
}
</style>