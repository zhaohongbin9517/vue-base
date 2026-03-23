<template>
  <el-button type="primary" @click="printTree">打印</el-button>
  <el-button type="primary" @click="setEdgesType('smoothstep')">平滑</el-button>
  <el-button type="primary" @click="setEdgesType('step')">阶梯</el-button>
  <el-button type="primary" @click="setEdgesType('bezier')">贝塞尔</el-button>
  <el-button type="primary" @click="setEdgesType('straight')">直线</el-button>
  <el-button type="primary" @click="unfold()">全部展开</el-button>
  <el-button type="primary" @click="fold()">全部收起</el-button>
     <el-button type="primary" @click="initViewport()">定位root节点</el-button>

  <VueFlow 
    v-model:edges="edges"
    v-model:nodes="nodes"
    :min-zoom="0.75"
    :max-zoom="0.75"
    @viewport-change="syncFlowToViewport"
    fit-view-on-init class="behavior-tree-edit"> 

    <template #node-root>
      <root-node />
    </template>
    <template #node-alwaysTrueNode>
      <always-true-node />
    </template>
    <template #node-ifElseNode>
      <if-else-node />
    </template>
    <template #node-loopBoolNode>
      <loop-bool-node />
    </template>
    <template #node-loopNumNode>
      <loop-num-node />
    </template>
    <template #node-selectorNode>
      <selector-node />
    </template>
    <template #node-sequenceNode>
      <sequence-node />
    </template>
    <template #node-negationNode>
      <negation-node />
    </template>
    <template #node-parallelNode>
      <parallel-node />
    </template>
    <template #node-leaf>
      <leaf-node />
    </template>
    <template #node-nullNode>
      <null-node />
    </template>
    <Background />
    <!-- <InteractionControls /> -->
     <MiniMap />
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
    nullNode
  },
  setup() {
    const position = ref({ x: 0, y: 0, zoom: 0.75 })
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
      // 根节点坐标
      rootNodePosition :{x: 100, y: 100}, 
      // 新增：临时存储边数据，避免直接操作v-model绑定的edges
      tempEdges: [],
      // 当前画布位置
      viewport: { x: 0,    y: 0,  zoom: 0.75 },

      flowMethods: null
    }
  },
  created() {
    // 初始化 VueFlow 方法（在 created 中解构，保证时机）
    this.flowMethods = useVueFlow()
  },
  mounted() {
    this.addIsUnfoldToTree(baseData.baseTree, true)
    this.init()
    this.edges = [...this.tempEdges]
    setTimeout(() => {
      this.initViewport()
    }, 100);
  },
  methods: {
    // 初始化画布位置
    initViewport(){
      const containerEl = document.querySelector('.vue-flow')
      this.flowMethods.setViewport({
        x: -this.rootNodePosition.x/1.27 + containerEl.clientWidth/1.27, 
        y: this.rootNodePosition.y, 
        zoom: this.viewport.zoom
      })
    },
    // 使用当前画布位置更新根节点坐标
    useViewportPosition(){
      this.flowMethods.setViewport(this.viewport)
    },
    // 同步画布位置到数据
    syncFlowToViewport(newViewport) {
      this.viewport = newViewport
    },
    // 全部展开
    async unfold() {
      nodeIndex = 0
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
    traverseTree(treeNode, level = 0, startX = 0, path = '') {
      if (!treeNode || !treeNode.node_type) {
        return { node: null, nextX: startX }
      }

      // 修复1：使用稳定的唯一ID
      const nodeId = generateUniqueNodeId(level, path)
      const nodeType = this.getNodeType(treeNode.node_type)
      const y = level === 1 ? 200 : 100 + level * 150

      let children = []
      if (treeNode.isUnfold) {
        if (treeNode.node) {
          children = [treeNode.node]
        } else if (treeNode.nodes) {
          // 需要加一个null_node节点
          treeNode.nodes.filter(child => child.node_type !== 'null_node')
          children = treeNode.nodes
          children.push({node_type: 'null_node'})
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
          label: this.getNodeLabel(treeNode.node_type), 
          position: { x: this.calcXPoint(treeNode.node_type, startX), y },
          data: { 
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
        return { node: node, nextX: startX + 150 }
      }

      let currentX = startX
      let sourceHandle = null
      let sourceHandleIndex = 1

      // 遍历子节点生成边
      children.forEach((child, idx) => {
        const childPath = `${path}-${idx}`
        const result = this.traverseTree(child, level + 1, currentX, childPath)
        
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
        label: this.getNodeLabel(treeNode.node_type), 
        position: { x: this.calcXPoint(treeNode.node_type, (startX - 150 + currentX) / 2), y },
        data: { 
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
    getNodeLabel(nodeType) {
      const labelMap = {
        'root': '根节点',
        'always_true_node': '永真节点',
        'ifelse_node': 'ifelse节点',
        'loop_bool_node': '循环节点(结果)',
        'loop_num_node': '循环节点(次数)',
        'selector_node': '选择节点',
        'sequence_node': '顺序节点',
        'negation_node': '取反节点',
        'parallel_node': '平行节点',
        'leaf': '叶子节点'
      }
      return labelMap[nodeType] || nodeType
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