<template>
  <div class="behavior-tree-edit-container">
    <el-button type="primary" @click="printTree">打印</el-button>
    <el-button type="primary" @click="setEdgesType('smoothstep')">平滑</el-button>
    <el-button type="primary" @click="setEdgesType('step')">阶梯</el-button>
    <el-button type="primary" @click="setEdgesType('bezier')">贝塞尔</el-button>
    <el-button type="primary" @click="setEdgesType('straight')">直线</el-button>
    <el-button type="primary" @click="unfold()">全部展开</el-button>
    <el-button type="primary" @click="fold()">全部收起</el-button>
    <el-button type="primary" @click="initViewport()">定位root节点</el-button>
  </div>
  <VueFlow 
    v-model:edges="edges"
    v-model:nodes="nodes"
    :min-zoom="1"
    :max-zoom="1"
    @viewport-change="syncFlowToViewport"
    @node-click="nodeClick"
    @pane-click="paneClick"
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
    <!-- <InteractionControls /> -->
     <MiniMap />
     <NodeSelectInfo 
       :selectedNode="selectedNode" 
       :nodeMap="nodeMap"
       @delete-node="deleteNode"
       @collapse-expand="collapseExpand"
       @left-move="leftMove"
       @right-move="rightMove"
     />
  </VueFlow>
</template>

<script>
import { ref, nextTick } from 'vue'
import { Background } from '@vue-flow/background'
import { MarkerType, VueFlow, useVueFlow } from '@vue-flow/core'

import rootNode from './BehaviorTreeEditChile/nodes/root.vue'
import alwaysTrueNode from './BehaviorTreeEditChile/nodes/AlwaysTrueNode.vue'
import ifElseNode from './BehaviorTreeEditChile/nodes/IfElseNode.vue'
import loopBoolNode from './BehaviorTreeEditChile/nodes/LoopBoolNode.vue'
import loopNumNode from './BehaviorTreeEditChile/nodes/LoopNumNode.vue'
import selectorNode from './BehaviorTreeEditChile/nodes/SelectorNode.vue'
import sequenceNode from './BehaviorTreeEditChile/nodes/SequenceNode.vue'
import negationNode from './BehaviorTreeEditChile/nodes/NegationNode.vue'
import parallelNode from './BehaviorTreeEditChile/nodes/ParallelNode.vue'
import leafNode from './BehaviorTreeEditChile/nodes/LeafNode.vue'
import nullNode from './BehaviorTreeEditChile/nodes/NullNode.vue'
// import InteractionControls from './BehaviorTreeEditChile/InteractionControls.vue'
import { MiniMap } from '@vue-flow/minimap'
import NodeSelectInfo from './BehaviorTreeEditChile/NodeSelectInfo.vue'

import baseData from '@/assets/json/baseData.json'

// 生成唯一节点ID（解决Date.now()重复问题）
let nodeIndex = 0
const generateUniqueNodeId = (level, path) => {
  nodeIndex++
  return `node-${level}-${path}-${nodeIndex}`
}

export default {
  name: 'BehaviorTreeEdit',
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
    // InteractionControls,
    MiniMap,
    nullNode,
    NodeSelectInfo
  },
  setup() {
    const position = ref({ x: 0, y: 0, zoom: 1 })
    const { nodesDraggable, setViewport, getViewport,onMoveEnd} = useVueFlow()
    
    onMoveEnd(() => {
      position.value = getViewport()
    })
    nodesDraggable.value = false


    return {
      position,
      setViewport,
      getViewport,
      nodesDraggable
    }
  },
  data() {
    return {
      edgesType: 'smoothstep',
      MarkerType,
      tree: {},
      xPointIndex: 0,
      nodes: [],
      edges: [],
      //nodeName-NodeType 映射
      nodeTypeMap: {},
      // 根节点坐标
      rootNodePosition :{x: 100, y: 100}, 
      // 新增：临时存储边数据，避免直接操作v-model绑定的edges
      tempEdges: [],
      // 当前画布位置
      viewport: { x: 0,    y: 0,  zoom: 0.75 },
      //节点名-trreeNode map
      nodeMap: {},
      //选中节点id
      selectedNodeId: null,
      //选中节点对象
      selectedNode: null,

      flowMethods: null
    }
  },
  created() {
    // 初始化 VueFlow 方法（在 created 中解构，保证时机）
    this.flowMethods = useVueFlow()
  },
  mounted() {
    this.initNodeTypeMap()
    this.nodeMap = {}
    this.addIsUnfoldToTree(baseData.baseTree, false)
    this.init()
    this.edges = [...this.tempEdges]
    setTimeout(() => {
      this.initViewport()
    }, 100);
  },
  methods: {
    initNodeTypeMap(){
      this.nodeTypeMap = baseData.BasebehaviorGroupList[0].behaviors.reduce((map, item) => {
        map[item.node_type] = {name: item.name, behavior_id: item.id}
        return map
      }, {})
    },
    //节点缩放事件
    async collapseExpand(NodeId){
      let treeNode = this.nodeMap[NodeId].node
      nodeIndex = 0
      this.nodeMap = {}
      this.nodes = []
      this.edges = []
      this.tempEdges = []
      if(treeNode.isUnfold){
        // 如果当前是展开状态，收起全部子节点，并且子节点也收起
        this.addIsUnfoldToTree(treeNode, !treeNode.isUnfold)
      } else {
        // 如果当前是收起状态，展开当前节点，但是子节点不展开
        treeNode.isUnfold = true
      }
      await this.init()
      await nextTick()
      this.edges = [...this.tempEdges]
      setTimeout(() => {
        this.useViewportPosition()
      }, 100);
    },
    // 删除节点事件
    async deleteNode(NodeId){
      const nodeParentId = this.nodeMap[NodeId].parentId
      const idx = this.nodeMap[NodeId].index
      let parentNode = this.nodeMap[nodeParentId].node
      if (parentNode.node) {
        parentNode.node = {node_type: 'null_node'}
      } else if (parentNode.nodes) {
        parentNode.nodes.splice(idx, 1)
      } else if (parentNode.node_type === 'ifelse_node') {
        switch (idx) {
          case 0: parentNode.check = {node_type: 'null_node'}; break
          case 1: parentNode.success = {node_type: 'null_node'}; break
          case 2: parentNode.fail = {node_type: 'null_node'}; break
          default: parentNode.unknown = {node_type: 'null_node'}; break
        }
      }
      //重新初始化节点映射
      nodeIndex = 0
      this.nodeMap = {}
      this.nodes = []
      this.edges = []
      this.tempEdges = []
      this.selectedNode = null
      await this.init()
      await nextTick()
      this.edges = [...this.tempEdges]
      setTimeout(() => {
        this.useViewportPosition()
      }, 100);
    },
    //左移
    leftMove(NodeId){
      const nodeParentId = this.nodeMap[NodeId].parentId
      const idx = this.nodeMap[NodeId].index
      let parentNode = this.nodeMap[nodeParentId].node
      if (parentNode.nodes) {
        let arr = parentNode.nodes
        [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
      }
    },
    //右移
    rightMove(NodeId){
      const nodeParentId = this.nodeMap[NodeId].parentId
      const idx = this.nodeMap[NodeId].index
      let parentNode = this.nodeMap[nodeParentId].node
      if (parentNode.nodes) {
        let arr = parentNode.nodes
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      }
    },
    // 初始化画布位置
    initViewport(){
      const containerEl = document.querySelector('.vue-flow')
      this.flowMethods.setViewport({
        x: -this.rootNodePosition.x/1+ containerEl.clientWidth/2 - 56, 
        y: -this.rootNodePosition.y + containerEl.clientHeight/2 + 56, 
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
        y: -position.y + containerEl.clientHeight/2 + 56, 
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
      nodeIndex = 0
      this.nodeMap = {}
      this.nodes = []
      this.edges = []
      this.tempEdges = []
      this.addIsUnfoldToTree(baseData.baseTree, true)
      await this.init()
      await nextTick()
      this.edges = [...this.tempEdges]
      setTimeout(() => {
        this.initViewport()
      }, 100);
    },
    // 全部收起
    async fold() {
      nodeIndex = 0
      this.nodeMap = {}
      this.nodes = []
      this.edges = []
      this.tempEdges = []
      this.addIsUnfoldToTree(baseData.baseTree, false)
      await this.init()
      await nextTick()
      this.edges = [...this.tempEdges]
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
    // 修改连线样式（更新所有边的类型）
    setEdgesType(type) {
      this.edgesType = type
      this.edges = this.edges.map(edge => ({ ...edge, type }))
    },
    //初始化
    async init() {
      this.tree = baseData.baseTree
      this.tempEdges = []
      this.traverseTree(this.tree)
    },
    // 遍历树生成节点和边（核心：边存入临时数组）
    traverseTree(treeNode, level = 0, startX = 0, path = '', parentId = null,idx = 0) {
      if (!treeNode || !treeNode.node_type) {
        return { node: null, nextX: startX }
      }

      // 修复1：使用稳定的唯一ID
      const nodeId = generateUniqueNodeId(level, path)
      const nodeType = this.getNodeType(treeNode.node_type)
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
          children.push(treeNode.check ? treeNode.check : {node_type: 'null_node'})
          children.push(treeNode.success ? treeNode.success : {node_type: 'null_node'})
          children.push(treeNode.fail ? treeNode.fail : {node_type: 'null_node'})
          children.push(treeNode.unknown ? treeNode.unknown : {node_type: 'null_node'})
        }
      }

      // 无子节点的情况
      if (children.length === 0) {
        const node = {
          id: nodeId,
          type: nodeType,
          position: { x: this.calcXPoint(treeNode.node_type, startX), y },
          data: { 
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
          this.rootNodePosition = { x: node.position.x, y: 100 }
        }
        //缓存节点名-原始treeNode 映射
        this.nodeMap[nodeId] = {node:treeNode,parentId:parentId,index:idx,position:node.position,node_id:nodeId}
        return { node: node, nextX: startX + 150 }
      }

      let currentX = startX
      let sourceHandle = null
      let sourceHandleIndex = 1

      // 遍历子节点生成边
      children.forEach((child, nodeIdx) => {
        const childPath = `${path}-${nodeIdx}`
        const result = this.traverseTree(child, level + 1, currentX, childPath, nodeId,nodeIdx)
        
        if (result.node) {
          // ifelse节点处理sourceHandle
          if (treeNode.node_type === 'ifelse_node') {
            switch (sourceHandleIndex) {
              case 1: sourceHandle = 'if-else-check'; break
              case 2: sourceHandle = 'if-else-success'; break
              case 3: sourceHandle = 'if-else-fail'; break
              case 4: sourceHandle = 'if-else-error'; break
              default: sourceHandle = null
            }
          }
          sourceHandleIndex++
          this.tempEdges.push({
            id: `e${nodeId}-${result.node.id}`,
            source: nodeId,
            target: result.node.id,
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
        this.rootNodePosition = { x: node.position.x, y: 100 }
      }
      this.nodeMap[nodeId] = {node:treeNode,parentId:parentId,index:idx,position:node.position,node_id:nodeId}
      return { node: node, nextX: currentX }
    },
    // 节点类型映射
    getNodeType(nodeType) {
      const typeMap = {
        'root': 'root',
        'always_true_node': 'alwaysTrueNode',
        'ifelse_node': 'ifElseNode',
        'loop_bool_node': 'loopBoolNode',
        'loop_num_node': 'loopNumNode',
        'selector_node': 'selectorNode',
        'sequence_node': 'sequenceNode',
        'negation_node': 'negationNode',
        'parallel_node': 'parallelNode',
        'null_node': 'nullNode',
        'leaf': 'leaf'
      }
      return typeMap[nodeType] || 'root'
    },
    // 节点标签映射
    getNodeLabel(treeNode) {
      const nodeType = treeNode.node_type
      if (nodeType === 'leaf') {
        return treeNode.behavior_id || '叶子节点'
      } else if (nodeType === 'null_node') {
        return '添加节点'
      } else {
        return this.nodeTypeMap[nodeType].name || nodeType
      }
    },
    // 计算节点X坐标
    calcXPoint(nodeType, X) {
      if (nodeType === 'leaf') return X - 56
      if (nodeType === 'null_node') return X - 48
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
  min-height: 81vh;
  max-height: 81vh;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}
</style>