<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>节点管理<span class="tips-text">(基础分组+自定义分组)</span></span>
        <div class="param-btn">
          <el-button type="primary" size="large" @click="addResultGroup">
            <el-icon><plus /></el-icon>
            添加分组
          </el-button>
        </div>
      </div>
    </template>

    <!-- 分组卡片展示 -->
    <div class="group-container">
      <div v-for="group in behaviorGroupList" :key="group.id" class="group-item">
        <!-- 分组头部 -->
        <div class="group-header" @click="toggleGroup(group)">
          <el-icon class="group-icon"><Folder /></el-icon>
          <span class="group-name">{{ group.group_name }}</span>
          <span class="node-count">{{ group.behaviors.length }}个节点</span>
          
          <div v-if="group.id != -1" class="group-actions">
            <el-button type="success" size="small" @click.stop="addNode(group.id)">
              <el-icon><Plus /></el-icon>
              添加节点
            </el-button>
            <el-button type="primary" size="small" @click.stop="editGroup(group)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click.stop="deleteGroup(group.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
            <el-button type="warning" size="small" @click.stop="toggleGroup(group)" :title="expandedGroups[group.id] ? '收起分组' : '展开分组'">
              <el-icon >
                <Expand v-if="expandedGroups[group.id]" />
                <Fold v-else />
              </el-icon>
            </el-button>
          </div>
        </div>
        
        <!-- 节点列表 -->
        <transition name="slide-fade">
          <div v-if="expandedGroups[group.id]" class="node-list">
            <div v-for="node in group.behaviors" :key="node.id" class="node-item">
              <el-icon class="node-icon"><CircleCheck /></el-icon>
              <!-- 节点名称和描述 -->
              <div class="node-info">
                <span class="node-name">{{ node.name }}</span>
                <span class="node-desc">{{'描述：'+ node.desc + ' 模块：' + node.module+ ' 函数：' + node.func }}</span>
              </div>
              <div class="node-args" >
                <div v-for="arg in node.args" :key="arg.name" class="node-arg-item">
                   <el-tag type="primary" size="small" >{{ arg.name }} : {{ arg.type }}</el-tag>
                </div>
              </div>
               <!-- 节点操作按钮 -->
              <div v-if="group.id != -1" class="node-actions">
                <el-button type="primary" size="small" circle @click="viewNodeInfo(node)">
                  <el-icon><InfoFilled /></el-icon>
                </el-button>
                <el-button type="success" size="small" circle @click="editNode(node)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle @click="deleteNode(node.id)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </el-card>

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
    :title="nodeOperationTitle[nodeOperationType]"
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
          filterable
          placeholder="请选择模块名称"
        >
          <el-option
            v-for="option in moduleOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          >
            <span style="float: left">{{ option.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{option.value }}</span> 
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="函数名称" prop="func">
        <el-select
          v-model="nodeForm.func"
          filterable
          placeholder="请选择函数名称"
        >
          <el-option
            v-for="option in funcOptions[nodeForm.module]"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          >
          <span style="float: left">{{ option.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{option.value }}</span> 
        </el-option>
        </el-select>
      </el-form-item>
      <el-card class="param-card" shadow="hover">
        <template #header>
          <div class="param-card-header">
            <el-icon class="param-header-icon"><tools /></el-icon>
            <span>参数</span>
            <div class="param-btn">
              <el-button type="primary" size="small" @click="addParam">
                  <el-icon><Plus /></el-icon> 添加参数
              </el-button>
            </div>
          </div>
        </template>
        <el-table :data="nodeForm.args" border class="config-table" stripe>
              <el-table-column prop="type" label="参数类型" min-width="200">
                <template #default="{ row }">
                  <el-select 
                    v-model="row.type" 
                    placeholder="请选择参数类型"
                    filterable
                  >
                      <el-option 
                        v-for="option in paramTypeOptions" 
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="参数名称" min-width="200">
                <template #default="{ row }">
                  <el-input 
                    v-model="row.name" 
                    placeholder="请输入参数名称" 
                    controls-position="right"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="{ $index }">
                  <el-button type="danger" size="small" circle @click="removeParam($index)" >
                    <el-icon><delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
      </el-card>
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
import baseData from '@/assets/json/baseData.json'

// 暂时注释掉未使用的API导入
import {getBehaviorMFA, getAllBehavior, addBehaviorGroup, updateBehaviorGroup, addBehavior, updateBehavior, deleteBehaviorGroup, deleteBehavior } from '@/api/behavior/behavior'

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
      behaviorGroupList: [],
      // 从JSON文件导入基础分组数据
      BasebehaviorGroupList: baseData.BasebehaviorGroupList,
      expandedGroups: {},
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
      nodeOperationType: "add", // add, edit, view
      nodeOperationTitle: {
        add: '添加节点',
        edit: '修改节点',
        view: '查看节点信息'
      },
      currentGroupId: null,
      nodeForm: {
        id: null,
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
        // { label: 'measure_behavior_base', value: 'measure_behavior_base' },
        // { label: 'control_behavior', value: 'control_behavior' },
        // { label: 'report_behavior', value: 'report_behavior' }
      ],
      
      funcOptions: {
        // measure_behavior_base: [
        //   { label: 'measure_behavior_base', value: 'measure_behavior_base' },
        // ],
        // control_behavior: [
        //   { label: 'control_behavior', value: 'control_behavior' },
        // ],
        // report_behavior: [
        //   { label: 'report_behavior', value: 'report_behavior' },
        // ],
      },
      
      // 参数类型选项
      paramTypeOptions: [
        { label: '整数', value: 'int' },
        { label: '字符串', value: 'string' },
        { label: '原子值', value: 'atom' }
      ]
    }
  },
  mounted() {
    this.initBehaviorMFA()
    this.initData()
  },
  
  methods: {
    initBehaviorMFA(){

      getBehaviorMFA().then(res => {
        // 处理MFA数据
        this.moduleOptions = res.map(item => ({
          label: item.desc,
          value: item.module
        }))
        this.funcOptions = res.reduce((acc, item) => {
          acc[item.module] = item.func.map(fItem => ({
            label: fItem.desc,
            value: fItem.func
          }))
          return acc
        }, {})
      })
    },
    initData(){
        // 注释掉实际API调用，使用本地模拟数据
        getAllBehavior().then(res => {
            // 为API返回的数据添加展开状态
            this.behaviorGroupList = structuredClone(this.BasebehaviorGroupList.concat(res)),
            // 初始化展开状态
            this.behaviorGroupList.forEach(group => {
                this.expandedGroups[group.id] = this.expandedGroups[group.id] ? this.expandedGroups[group.id] : false
            })
        })
    },
    
    // 切换分组展开/收起状态
    toggleGroup(group) {
      this.expandedGroups[group.id] = !this.expandedGroups[group.id]
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
    
    deleteGroup(groupId) {
      // 确认删除
      this.$confirm('确认删除选中的分组吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实现删除分组逻辑
        deleteBehaviorGroup(groupId).then(res => {
          if(res.code == 200 || res.code == 0){
            ElMessage.success('分组删除成功')
            this.initData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除分组'
        })
      })
    },
    
    // 查看节点信息
    viewNodeInfo(node) {
      this.nodeOperationType = "view"
      console.log('查看节点信息:', node)
      // 实现查看节点信息逻辑
      this.currentGroupId = node.group_id
      this.nodeForm = node
      this.nodeDialogVisible = true
    },

    // 打开添加节点弹窗
    addNode(groupId) {
      this.nodeOperationType = "add"
      this.currentGroupId = groupId
      this.nodeForm = {
        id: null,
        name: '',
        desc: '',
        module: '',
        func: '',
        args: []
      }
      this.nodeDialogVisible = true
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

    editNode(node) {
      this.nodeOperationType = "edit"
      console.log('编辑节点:', node)
      // 实现编辑节点逻辑
      this.currentGroupId = node.group_id
      this.nodeForm = node
      this.nodeDialogVisible = true
    },
    
    deleteNode(nodeId) {
      // 确认还原
      this.$confirm('确认还原选中的节点吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBehavior(nodeId).then(res => {
          if(res.code == 200 || res.code == 0){
            ElMessage.success('节点删除成功')
            this.initData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除节点'
        })
      })
    },

    // 保存节点
    saveNode() {
      this.$refs.nodeForm.validate((valid) => {
        if (valid) {
          // 过滤掉空参数
        
          switch (this.nodeOperationType) {
            case 'add': {
              // 添加节点
              const validArgs = this.nodeForm.args.filter(arg => arg.name.trim() !== '')
              const newNode = {
                name: this.nodeForm.name,
                desc: this.nodeForm.desc,
                module: this.nodeForm.module,
                func: this.nodeForm.func,
                group_id: this.currentGroupId,
                args: validArgs,
                sort: 0
              }
              addBehavior(newNode).then(res => {
                console.log(res)
                if(res.id !== undefined && res.id > null){
                    ElMessage.success('节点添加成功')
                    this.initData()
                }
              })
              break;
            }
            case 'edit': {
              // 修改节点
              const validArgs = this.nodeForm.args.filter(arg => arg.name.trim() !== '')
              const data = {
                id: this.nodeForm.id,
                name: this.nodeForm.name,
                desc: this.nodeForm.desc,
                module: this.nodeForm.module,
                func: this.nodeForm.func,
                group_id: this.currentGroupId,
                args: validArgs,
                sort: 0
              }
              updateBehavior(data).then(res => {
                if(res.id === this.nodeForm.id){
                    ElMessage.success('节点修改成功')
                    this.initData()
                }
              })
              break;
            }
            case 'view':
              // 查看节点信息
              break;
          }
          this.nodeDialogVisible = false
        }
      })
    },

    // 保存分组
    saveGroup() {
      this.$refs.groupForm.validate((valid) => {
        if (valid) {
          if (this.isEditGroup) {
            // 修改分组
            this.currentGroup.group_name = this.groupForm.group_name
            this.currentGroup.group_desc = this.groupForm.group_desc
            const data = {
              id: this.currentGroup.id,
              group_name: this.groupForm.group_name,
              group_desc: this.groupForm.group_desc,
            }
            updateBehaviorGroup(data).then(res => {
                if(res.code == 200 || res.code == 0){
                    ElMessage.success('分组修改成功')
                    this.initData()
                }
            })  
          } else {
            // 添加分组
            const newGroup = {
              group_name: this.groupForm.group_name,
              group_desc: this.groupForm.group_desc,
            }
            addBehaviorGroup(newGroup).then(res => {
              console.log(res)
                if(res.id !== undefined && res.id > 0){
                    ElMessage.success('分组添加成功')
                    this.initData()
                }
            })
          }
          this.groupDialogVisible = false
        }
      })
    }
  }
}
</script>

<style scoped>
.config-card {
  min-height: 83vh;
  max-height: 83vh;
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

.param-card-header {
  display: flex;
  height: 14px;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: auto;
  color: #303133;
}

.param-header-icon {
  font-size: 16px;
  color: #409eff;
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

.node-args{
  margin-right: 180px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.node-arg-item{
  margin-right: 14px;
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