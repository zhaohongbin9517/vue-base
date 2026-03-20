<template>
  <el-button type="primary" @click="printTree">打印</el-button>
  <el-button type="primary" @click="setEdgesType('smoothstep')">平滑</el-button>
  <el-button type="primary" @click="setEdgesType('step')">阶梯</el-button>
  <el-button type="primary" @click="setEdgesType('bezier')">贝塞尔</el-button>
  <el-button type="primary" @click="setEdgesType('straight')">直线</el-button>

  <VueFlow 
    v-model:edges="edges"
    v-model:nodes="nodes"
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
    <!-- <InteractionControls /> -->
    <Background />
  </VueFlow>
</template>

<script>
import { ref } from 'vue'
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

import baseData from '@/assets/json/baseData.json'

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
  },
  setup() {
    // 1. 修复：ref变量用const声明（仅引用不可变，值可改）
    const position = ref({ x: 0, y: 0, zoom: 1 })
    const { nodesDraggable, setViewport, getViewport, onMoveEnd } = useVueFlow()
    
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
      // 修复：data中无需ref，Vue自动做响应式
      nodes: [],
      edges: [],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    setEdgesType(type){
      this.edgesType = type
      this.edges.forEach(edge => {
        edge.type = type
      })
    },
    async init() {
      this.tree = baseData.baseTree
      this.traverseTree(this.tree)
    },
    generateEdges(treeNode, nodes, parentSourceHandle = null) {
      if (!treeNode || !treeNode.node_type) {
        return
      }

      let children = []
      if (treeNode.node) {
        children = [treeNode.node]
      } else if (treeNode.nodes) {
        children = treeNode.nodes
      } else if (treeNode.check || treeNode.success || treeNode.fail || treeNode.unknown) {
        if (treeNode.check) children.push({ ...treeNode.check, handle: 'check' })
        if (treeNode.success) children.push({ ...treeNode.success, handle: 'success' })
        if (treeNode.fail) children.push({ ...treeNode.fail, handle: 'fail' })
        if (treeNode.unknown) children.push({ ...treeNode.unknown, handle: 'unknown' })
      }

      const parentId = `node-${0}-${0}`
      const nodeType = this.getNodeType(treeNode.node_type)

      children.forEach((child) => {
        if (!child.node_type) {
          return
        }

        const childNodeId = this.findNodeId(child, nodes)
        if (childNodeId) {
          const sourceHandle = parentSourceHandle || (nodeType === 'ifElseNode' ? child.handle : undefined)
          const edge = {
            id: `e${parentId}-${childNodeId}`,
            source: parentId,
            target: childNodeId,
            // 修复：绑定响应式的edgesType
            type: this.edgesType,
            sourceHandle: sourceHandle || undefined
          }
          this.edges.push(edge)
        }

        this.generateEdges(child, nodes)
      })
    },
    findNodeId(treeNode, nodes) {
      if (!treeNode || !treeNode.node_type) {
        return null
      }

      const nodeType = this.getNodeType(treeNode.node_type)
      const label = this.getNodeLabel(treeNode.node_type)

      if (treeNode.node_type === 'leaf') {
        return nodes.find(node => 
          node.type === nodeType && 
          node.data.behaviorId === treeNode.behavior_id
        )?.id || null
      }

      return nodes.find(node => 
        node.type === nodeType && 
        node.data.label === label
      )?.id || null
    },
    traverseTree(treeNode, level = 0, startX = 0) {
      if (!treeNode || !treeNode.node_type) {
        return { nodes: [], nextX: startX }
      }

      // 修复：节点ID生成规则（避免重复）
      const nodeId = `node-${Date.now()}-${level}-${startX}`
      const nodeType = this.getNodeType(treeNode.node_type)
      const y = 100 + level * 150

      let children = []
      if (treeNode.node) {
        children = [treeNode.node]
      } else if (treeNode.nodes) {
        children = treeNode.nodes
      } else if (treeNode.check || treeNode.success || treeNode.fail || treeNode.unknown) {
        if (treeNode.check) children.push(treeNode.check)
        if (treeNode.success) children.push(treeNode.success)
        if (treeNode.fail) children.push(treeNode.fail)
        if (treeNode.unknown) children.push(treeNode.unknown)
      }

      if (children.length === 0) {
        const node = {
          id: nodeId,
          type: nodeType,
          position: { x: this.calcXPoint(treeNode.node_type, startX), y },
          data: { label: this.getNodeLabel(treeNode.node_type) }
        }
        if (treeNode.node_type === 'leaf') {
          node.data.behaviorId = treeNode.behavior_id
        }
        this.nodes.push(node)
        return { node: node, nextX: startX + 150 }
      }

      let currentX = startX
      let sourceHandle = null
      let sourceHandleIndex = 1

      children.forEach((child) => {
        const result = this.traverseTree(child, level + 1, currentX)
        
        // 优化：switch简化条件判断
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
        this.edges.push({
          id: `e${nodeId}-${result.node.id}`,
          source: nodeId,
          target: result.node.id,
          sourceHandle: sourceHandle || undefined,
          type: this.edgesType
        })
        currentX = result.nextX
      })

      const node = {
        id: nodeId,
        type: nodeType,
        position: { x: this.calcXPoint(treeNode.node_type, (startX - 150 + currentX) / 2), y },
        data: { label: this.getNodeLabel(treeNode.node_type) }
      }
      if (treeNode.node_type === 'leaf') {
        node.data.behaviorId = treeNode.behavior_id
      }

      this.nodes.push(node)
      return { node: node, nextX: currentX }
    },
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
        'leaf': 'leaf'
      }
      return typeMap[nodeType] || 'root'
    },
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
    calcXPoint(nodeType, X) {
      if (nodeType === 'leaf') return X - 48
      if (nodeType === 'root') return X - 48
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
    printTree() {
      console.log('当前连线类型:', this.edgesType)
      // console.log('生成的节点:', this.nodes)
      // console.log('生成的边:', this.edges)
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