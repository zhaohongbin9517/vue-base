<template>
  <div class="behavior-tree-edit-container">
    <span style="margin-left: 20px;">缓存条数：</span>
    <el-input-number v-model="wsInfo.msgCacheLength" placeholder="缓存条数" style="width: 120px;"> </el-input-number>
    <el-input v-model="subscribeObjectId" placeholder="请输入对象id" style="margin-left: 10px;width: 200px;"></el-input>
    <el-button-group style="margin-left: 20px;">
      <el-button type="primary" size="mini" @click="subscribe" :loading = "subscribeStatus">订阅</el-button>
      <el-button type="danger" size="mini" @click="unsubscribe">停止</el-button>
      <el-button type="primary" size="mini" @click="prevLog">上一条</el-button>
      <el-button type="primary" size="mini" @click="nextLog">下一条</el-button>
      <el-button type="warning" @click="unfold">展开</el-button>
      <el-button type="warning" @click="fold">收起</el-button>
    </el-button-group>

    <el-dropdown @command="handleEdgeTypeChange" style="margin-right: 20px;margin-left: 20px;">
      <el-button type="primary">
        连线类型 <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="smoothstep">平滑</el-dropdown-item>
          <el-dropdown-item command="step">阶梯</el-dropdown-item>
          <el-dropdown-item command="bezier">贝塞尔</el-dropdown-item>
          <el-dropdown-item command="straight">直线</el-dropdown-item>

          <el-dropdown-item command="animated-smoothstep">动画-平滑</el-dropdown-item>
          <el-dropdown-item command="animated-step">动画-阶梯</el-dropdown-item>
          <el-dropdown-item command="animated-bezier">动画-贝塞尔</el-dropdown-item>
          <el-dropdown-item command="animated-straight">动画-直线</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span style="margin-left: 20px;">总条数：{{ wsInfo.msgList.length }} 当前显示：{{nowShowLogIndex + 1}}</span>
  </div>
  <VueFlow 
    ref="vueFlowRef"
    v-model:edges="edges"
    v-model:nodes="nodes"
    :min-zoom="0.5"
    :max-zoom="1"
    @viewport-change="syncFlowToViewport"
    @node-click="nodeClick"
    @pane-click="paneClick"
    @drop="onDrop"
    @dragover="onDragOver"
    fit-view-on-init class="behavior-tree-edit"> 

    <!-- 核心修复：增加空值保护，避免 node 为 undefined 时报错 -->
    <template #node-root="args">
      <root-node 
      :data="args.data || {}" 
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-alwaysTrueNode="args">
      <always-true-node 
      :data="args.data || {}" 
      :selected="args.selected"
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-ifElseNode="args">
      <if-else-node 
      :data="args.data || {}" 
      :selected="args.selected"
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-loopBoolNode="args">
      <loop-bool-node 
      :data="args.data || {}" 
      :selected="args.selected"
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-loopNumNode="args">
      <loop-num-node 
      :data="args.data || {}" 
      :selected="args.selected"
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-selectorNode="args">
      <selector-node 
      :data="args.data || {}" 
      :selected="args.selected"
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-sequenceNode="args">
      <sequence-node 
      :data="args.data || {}" 
      :selected="args.selected"
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-negationNode="args">
      <negation-node 
      :data="args.data || {}" 
      :selected="args.selected"
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-parallelNode="args">
      <parallel-node 
      :data="args.data || {}" 
      :selected="args.selected"
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-leaf="args">
      <leaf-node 
      :data="args.data || {}" 
      :selected="args.selected"
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>
    <template #node-nullNode="args">
      <null-node 
      :data="args.data || {}" 
      @collapse-expand="collapseExpand"
      @delete-node="deleteNode"
      />
    </template>

    <Background />

    <logNodeSelectInfo 
       :selectedNode="selectedNode" 
       :nodeMap="nodeMap"
       :nodeTypeMap="nodeTypeMap"
       :expandedGroups="expandedGroups"
       @collapse-expand="collapseExpand"
     />

  </VueFlow>
</template>

<script>
import { ref, nextTick } from 'vue'
import { Background } from '@vue-flow/background'
import { MarkerType, VueFlow, useVueFlow } from '@vue-flow/core'
import { ArrowDown, ArrowLeft } from '@element-plus/icons-vue'

import rootNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/root.vue'
import alwaysTrueNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/AlwaysTrueNode.vue'
import ifElseNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/IfElseNode.vue'
import loopBoolNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/LoopBoolNode.vue'
import loopNumNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/LoopNumNode.vue'
import selectorNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/SelectorNode.vue'
import sequenceNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/SequenceNode.vue'
import negationNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/NegationNode.vue'
import parallelNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/ParallelNode.vue'
import leafNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/LeafNode.vue'
import nullNode from '../BehaviorTreeEdit/BehaviorTreeEditChile/nodes/NullNode.vue'
import logNodeSelectInfo from '../BehaviorTreeLog/LogNodeSelectInfo.vue'

import { getBehaviorTree, getAllBehavior,getAllBehaviorTree } from '@/api/behavior/behavior'

import {getBaseGroupBehavior, getBaseNodeInfo, getTreeNodeTypeToVueFlowNodeType } from '@/store/node'

// 生成唯一节点ID（解决Date.now()重复问题）
let nodeIndex = 0
const generateUniqueNodeId = (level, path) => {
  nodeIndex++
  return `node-${level}-${path}-${nodeIndex}`
}

export default {
  name: 'BehaviorTreeLog',
  components: {
    VueFlow,
    Background,
    rootNode,
    alwaysTrueNode,
    ifElseNode,
    loopBoolNode,
    loopNumNode,
    selectorNode,
    sequenceNode,
    negationNode,
    parallelNode,
    leafNode,
    nullNode,
    ArrowDown,
    logNodeSelectInfo
  },
  setup() {
    const position = ref({ x: 0, y: 0, zoom: 1 })
    const { nodesDraggable, setViewport, getViewport,onMoveEnd } = useVueFlow()
    
    onMoveEnd(() => {
      position.value = getViewport()
    })
    nodesDraggable.value = false


    return {
      position,
      setViewport,
      getViewport,
      nodesDraggable,
      ArrowLeft
    }
  },
  data() {
    return {
      nodeTypeToVueFlowNodeType: getTreeNodeTypeToVueFlowNodeType(),
      // 新增：行为节点分组列表
      behaviorGroupList: [],
      // 新增：记录每个分组的展开状态
      expandedGroups: {},

      edgesType: 'smoothstep',
      MarkerType,
      treeInfo :null,
      tree: {},
      xPointIndex: 0,
      nodes: [],
      edges: [],
      //nodeName-NodeType 映射
      nodeTypeMap : getBaseNodeInfo(),
      // 根节点坐标
      rootNodePosition :{x: 0, y: 0}, 
      // 新增：临时存储边数据，避免直接操作v-model绑定的edges
      tempEdges: [],
      // 当前画布位置
      viewport: { x: 0,    y: 0,  zoom: 0.5 },
      //节点名-trreeNode map
      nodeMap: {},
      //选中节点id
      selectedNodeId: null,
      //选中节点对象
      selectedNode: null,

      flowMethods: null,

      //全部空节点
      allNullNode:[],

      //提示消息
      hintMMessage : '提示消息',

      // 订阅对象id
      subscribeObjectId:'',
      subscribeStatus: false,
      //ws 连接对象
      wsInfo: {
        //连接
        ws: null,
        // 新增：ws 连接状态
        wsStatus: false,
        // ws 接收消息列表
        msgList: [],
        // 消息缓存条数
        msgCacheLength: 10,
        // 心跳定时器
        heartTimer:null,
      },
      nowShowLogIndex: 0,
    }
  },
  created() {
    // 初始化 VueFlow 方法（在 created 中解构，保证时机）
    this.flowMethods = useVueFlow()
  },
  async mounted() {
    //获取节点
    await this.getBehaviorInfo()
  },
  methods: {
    //prevLog 上一条日志
    prevLog(){
      if (this.nowShowLogIndex <= 0) return;
      this.nowShowLogIndex--
      this.resetInit()
    },
    //nextLog 下一条日志
    nextLog(){
      if (this.nowShowLogIndex >= this.wsInfo.msgList.length - 1) return;
      this.nowShowLogIndex++
      this.resetInit()
    },
    //订阅日志
    subscribe(){
      if (!this.subscribeObjectId) return;
      this.subscribeStatus = true;
      // 重置界面
      this.treeInfo = null
      nodeIndex = 0
      this.nodeMap = {}
      this.nodes = []
      this.edges = []
      this.allNullNode = []
      this.tempEdges = []
      this.selectedNode = null
      this.edges = [...this.tempEdges]
      //订阅数据
      this.wsInfo =  {
        ws: null,
        wsStatus: false,
        msgList: [],
        msgCacheLength: this.wsInfo.msgCacheLength,
        heartTimer:null,
      },
      this.createWebSocket();
      setTimeout(() => {
        this.handleSend()
      }, 100);
    },
    //取消订阅
    async unsubscribe(){
      this.subscribeStatus = false;
      if (!this.wsInfo.ws) return;
      this.wsInfo.ws.close();
      this.wsInfo.wsStatus = "已断开";
      clearInterval(this.wsInfo.heartTimer);
      // 初始化第一个日志
      const firstLog =  this.wsInfo.msgList[0] 
      if (firstLog){
        const TreeName =  firstLog.log.info.tree_name
        await this.getTreeInfo(TreeName)
        this.addIsUnfoldToTree(this.tree, true)
        this.resetInit()
      }
    },
    // 创建连接
    createWebSocket() {
      // 这里换成你的后端 WS 地址
      const wsUrl = "ws://192.168.1.192:8426/ws_monitor_logs";

      this.wsInfo.ws = new WebSocket(wsUrl);

      console.log(this.wsInfo.ws)
      // 连接成功
      this.wsInfo.ws.onopen = () => {
        this.wsInfo.wsStatus = "已连接";
        this.startHeartBeat();
      };

      // 收到消息
      this.wsInfo.ws.onmessage = (e) => {
        this.wsInfo.msgList.push(JSON.parse(e.data));
        if(this.wsInfo.msgList.length >= this.wsInfo.msgCacheLength){
          this.wsInfo.msgList.shift(0,1)
        }
      };

      // 连接错误
      // eslint-disable-next-line no-unused-vars
      this.wsInfo.ws.onerror = (err) => {
        this.wsInfo.wsStatus = "连接失败";
        this.reconnect();
      };

      // 连接关闭
      this.wsInfo.ws.onclose = () => {
        this.wsInfo.wsStatus = "已断开";
      };
    },
    // 发送消息
    handleSend() {
      if (!this.subscribeObjectId) return;
      const sendMsg = {
        cmd:"register",
        content:{object_id:this.subscribeObjectId }
      }
      if (this.wsInfo.ws && this.wsInfo.ws.readyState === 1) {
        this.wsInfo.ws.send(JSON.stringify(sendMsg));
      } else {
        alert("未连接");
      }
    },
    // 心跳包（防止断开）
    startHeartBeat() {
      this.wsInfo.heartTimer = setInterval(() => {
        this.wsInfo.ws?.send("heartbeat");
      }, 30000);
    },
    // 自动重连
    reconnect() {
      setTimeout(() => {
        this.createWebSocket();
      }, 3000);
    },
    //获取节点基础信息
    async getBehaviorInfo(){
      //获取全部行为节点信息
      const Allbehavior = await getAllBehavior()
      this.behaviorGroupList = structuredClone(getBaseGroupBehavior().concat(Allbehavior)),
      this.behaviorGroupList.forEach(group => {
        group.behaviors.forEach(item => {
          this.expandedGroups[item.id] = item
        })
      })
    },
    //获取树信息
    async getTreeInfo(treeName){
      const allTree = await getAllBehaviorTree()
      // 查找树信息
      const tree = allTree.find(tree => tree.name === treeName)
      if (tree) {
        // 获取树信息
        const res = await getBehaviorTree(tree.id)
        this.treeInfo = res
        this.tree = this.treeInfo.tree
      }
    },
    //边线类型下拉选择
    handleEdgeTypeChange(Command) {
      const arr = Command.split('-') // 按 "-" 拆分
      let type = this.edgesType
      let animated = false
      if( arr.length > 1){
        type = arr[1]
        animated = true
      } else {
        type = arr[0]
        animated = false
      }
      this.edgesType = type
      this.edges = this.edges.map(edge => ({ ...edge, type,animated }))
    },
    //节点缩放事件
    async collapseExpand(NodeId){
      let treeNode = this.nodeMap[NodeId].node
      if(treeNode.isUnfold){
        // 如果当前是展开状态，收起全部子节点，并且子节点也收起
        this.addIsUnfoldToTree(treeNode, !treeNode.isUnfold)
      } else {
        // 如果当前是收起状态，展开当前节点，但是子节点不展开
        treeNode.isUnfold = true
      }
      this.resetInit()
      setTimeout(() => {
        this.useViewportPosition()
      }, 100);
    },
    //重置
    async resetInit(){
      //重新初始化节点映射
      nodeIndex = 0
      this.nodeMap = {}
      this.nodes = []
      this.edges = []
      this.allNullNode = []
      this.tempEdges = []
      this.selectedNode = null
      await this.init()
      await nextTick()
      this.edges = [...this.tempEdges]
    },
    // 初始化画布位置
    initViewport(){
      const containerEl = document.querySelector('.vue-flow')
      this.flowMethods.setViewport({
        x: -this.rootNodePosition.x + containerEl.clientWidth/2 - 56, 
        y: -this.rootNodePosition.y + containerEl.clientHeight/2 - 56, 
        zoom: this.viewport.zoom
      })
    },
    // 使用当前选中的阶段作为视图中间
    useViewportPosition(){
      const localNode = this.nodeMap[this.selectedNodeId] || {}
      const position = localNode.position || this.rootNodePosition
      const containerEl = document.querySelector('.vue-flow')
      let newPosition = {
        x: -position.x/1+ containerEl.clientWidth/2 - 56, 
        y: -position.y + containerEl.clientHeight/2 -56, 
        zoom: this.position.zoom
      }
      setTimeout(() => {
        this.flowMethods.setViewport(newPosition)
      }, 50);
    },
    // 同步画布位置到数据
    syncFlowToViewport(newViewport) {
      this.viewport = newViewport
    },
    // 点击空白区域事件
    paneClick() {
      this.selectedNode = null
    },
    // 节点点击事件
    nodeClick(node) {
      if(node.node.type !== "nullNode"){
        this.selectedNodeId = node.node.id
        this.selectedNode = this.nodeMap[this.selectedNodeId]
      }else {
        this.selectedNode = null
      }
    },
    // 全部展开
    async unfold() {
      this.addIsUnfoldToTree(this.tree, true)
      this.resetInit()
      setTimeout(() => {
        this.initViewport()
      }, 100);
    },
    // 全部收起
    async fold() {
      this.addIsUnfoldToTree(this.tree, false)
      this.resetInit()
      setTimeout(() => {
        this.initViewport()
      }, 100);
    },
    // 初始化节点展开状态
    addIsUnfoldToTree(node, bool = false) {
      if (!node || !node.node_type) return
      node.isUnfold = bool
      if (node.node) {
        this.addIsUnfoldToTree(node.node, bool)
      } else if (node.nodes) {
        node.nodes.forEach(child => this.addIsUnfoldToTree(child, bool))
      } else if (node.check || node.success || node.fail || node.unknown) {
        if (node.check) this.addIsUnfoldToTree(node.check, bool) 
        if (node.success) this.addIsUnfoldToTree(node.success, bool)
        if (node.fail) this.addIsUnfoldToTree(node.fail, bool)
        if (node.unknown) this.addIsUnfoldToTree(node.unknown, bool)
      }
    },
    //初始化
    async init() {
      this.tempEdges = []
      const log = this.wsInfo.msgList[this.nowShowLogIndex]
      console.log('log',log)
      this.traverseTree(this.tree,log.log)
    },
    // 遍历树生成节点和边（核心：边存入临时数组）
    // eslint-disable-next-line no-unused-vars
    traverseTree(treeNode,log = {node_type:'not_node_type',result:'unknown',sub_logs:[]}, level = 0, startX = 0, path = '', parentId = null,idx = 0) {
      if (!treeNode || !treeNode.node_type) {
        return { node: null, nextX: startX }
      }

      // 修复1：使用稳定的唯一ID
      const nodeId = generateUniqueNodeId(level, path)
      const nodeType = this.nodeTypeToVueFlowNodeType[treeNode.node_type]
      const y = level === 0 ? 0 : level === 1 ? 100 : 100 + (level - 1) * 100

      let children = []
      if (treeNode.isUnfold) {
        if (treeNode.node) {
          children = [treeNode.node]
        } else if (treeNode.nodes) {
          treeNode.nodes = treeNode.nodes.filter(child => child.node_type !== 'null_node')
          treeNode.nodes.push({node_type: 'null_node'})
          children = treeNode.nodes
        } else if (treeNode.node_type === 'ifelse_node') {
          treeNode.check = treeNode.check || {node_type: 'null_node'}
          treeNode.success = treeNode.success || {node_type: 'null_node'}
          treeNode.fail = treeNode.fail || {node_type: 'null_node'}
          treeNode.unknown = treeNode.unknown || {node_type: 'null_node'}
          
          children.push(treeNode.check)
          children.push(treeNode.success)
          children.push(treeNode.fail)
          children.push(treeNode.unknown)
        }
      }


      // 无子节点的情况
      if (children.length === 0) {
        const node = {
          id: nodeId,
          type: nodeType,
          position: { x: this.calcXPoint(treeNode.node_type, startX), y },
          data: { 
            log_info: log.info ? log.info : {},
            run_result: log.node_type === treeNode.node_type ? log.result : 'unknown',
            label: this.getNodeLabel(treeNode), 
            node_id : nodeId,
            node_data: treeNode 
          }
        }
        if (treeNode.node_type === 'leaf') {
          node.data.behaviorId = treeNode.behavior_id
        }
        this.nodes.push(node)
        //缓存根节点位置
        if(treeNode.node_type === 'root'){
          this.rootNodePosition = { x: node.position.x, y: node.position.y }
        }
        //缓存节点名-原始treeNode 映射
        this.nodeMap[nodeId] = {node:treeNode,parentId:parentId,index:idx,position:node.position,node_id:nodeId,log_info: log.info ? log.info : {}}
        // 缓存空节点信息
        if(treeNode.node_type === 'null_node'){
          this.allNullNode.push({parentId:parentId,position:node.position,index:idx})
        }
        return { node: node, nextX: startX + 150 }
      }

      let currentX = startX
      let sourceHandle = null
      let sourceHandleIndex = 1

      // 遍历子节点生成边
      children.forEach((child, nodeIdx) => {
        const childPath = `${path}-${nodeIdx}`
        const result = this.traverseTree(child, log.sub_logs[nodeIdx],level + 1, currentX, childPath, nodeId,nodeIdx)
        
        if (result.node) {
          let edgesLable  = ''
          // ifelse节点处理sourceHandle
          if (treeNode.node_type === 'ifelse_node') {
            switch (sourceHandleIndex) {
              case 1: sourceHandle = 'if-else-check'; edgesLable = '检查' ;break
              case 2: sourceHandle = 'if-else-success'; edgesLable = '成功'; break
              case 3: sourceHandle = 'if-else-fail'; edgesLable = '失败' ;break
              case 4: sourceHandle = 'if-else-error'; edgesLable = '错误' ;break
              default: sourceHandle = null
            }
          }
          sourceHandleIndex++
          this.tempEdges.push({
            id: `e${nodeId}-${result.node.id}`,
            label:edgesLable,
            source: nodeId,
            target: result.node.id,
            animated: true,
            deletable:false,
            sourceHandle: sourceHandle || undefined,
            type: this.edgesType
          })
          currentX = result.nextX
        }
      })

      // 创建当前节点
      const node = {
        id: nodeId,
        type: nodeType,
        position: { x: this.calcXPoint(treeNode.node_type, (startX - 150 + currentX) / 2), y },
        data: { 
          log_info: log.info ? log.info : {},
          run_result: log.node_type === treeNode.node_type ? log.result : 'unknown',
          label: this.getNodeLabel(treeNode), 
          node_id : nodeId,
          node_data: treeNode }
      }
      if (treeNode.node_type === 'leaf') {
        node.data.behaviorId = treeNode.behavior_id
      }
      this.nodes.push(node)

      //缓存根节点位置
      if(treeNode.node_type === 'root'){
        this.rootNodePosition = { x: node.position.x, y:  node.position.y }
      }
      this.nodeMap[nodeId] = {node:treeNode,parentId:parentId,index:idx,position:node.position,node_id:nodeId,log_info:log.info ? log.info : {}}
      return { node: node, nextX: currentX }
    },
    // 节点标签映射
    getNodeLabel(treeNode) {
      const nodeType = treeNode.node_type
      if (nodeType === 'leaf') {
        const leafNode =  this.expandedGroups[treeNode.behavior_id] || {}
        return leafNode.name || '叶子节点'
      } else if (nodeType === 'null_node') {
        return '添加节点'
      } else {
        return this.nodeTypeMap[nodeType].name || nodeType
      }
    },
    // 计算节点X坐标
    calcXPoint(nodeType, X) {
      if (nodeType === 'leaf') return X - 56
      if (nodeType === 'null_node') return X - 40
      if (nodeType === 'root') return X - 56
      if (nodeType === 'always_true_node') return X - 56
      if (nodeType === 'loop_bool_node') return X - 64
      if (nodeType === 'loop_num_node') return X - 64
      if (nodeType === 'selector_node') return X - 56
      if (nodeType === 'sequence_node') return X - 56
      if (nodeType === 'negation_node') return X - 56
      if (nodeType === 'parallel_node') return X - 56
      if (nodeType === 'ifelse_node') return X - 80
      return X
    },
    // 打印树信息
    printTree() {
      // console.log('当前连线类型:', this.edgesType)
      // console.log('生成的节点数:', this.nodes.length)
      // console.log('生成的边数:', this.edges.length)
      // console.log('当前视图位置:', this.position.value)
      console.log('当前树结构:', this.nodeTypeMap)
    }
  }
}
</script>

<style scoped>
.behavior-tree-edit {
  min-height: 87vh;
  max-height: 87vh;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}
</style>