<template>
  <el-button type="primary" @click="printTree">打印</el-button>
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

    <template #edge-button="buttonEdgeProps">
      <EdgeWithButton
        :id="buttonEdgeProps.id"
        :source-x="buttonEdgeProps.sourceX"
        :source-y="buttonEdgeProps.sourceY"
        :target-x="buttonEdgeProps.targetX"
        :target-y="buttonEdgeProps.targetY"
        :source-position="buttonEdgeProps.sourcePosition"
        :target-position="buttonEdgeProps.targetPosition"
        :marker-end="buttonEdgeProps.markerEnd"
        :style="buttonEdgeProps.style"
      />
    </template>

    <template #edge-custom="customEdgeProps">
      <CustomEdge
        :id="customEdgeProps.id"
        :source-x="customEdgeProps.sourceX"
        :source-y="customEdgeProps.sourceY"
        :target-x="customEdgeProps.targetX"
        :target-y="customEdgeProps.targetY"
        :source-position="customEdgeProps.sourcePosition"
        :target-position="customEdgeProps.targetPosition"
        :data="customEdgeProps.data"
        :marker-end="customEdgeProps.markerEnd"
        :style="customEdgeProps.style"
      />
    </template>
    <InteractionControls />
    <Background />
  </VueFlow>
</template>

<script>
import { ref } from 'vue'

import { Background } from '@vue-flow/background'
import { MarkerType, VueFlow ,useVueFlow} from '@vue-flow/core'
import EdgeWithButton from './BehaviorTreeEditChile/EdgeWithButton.vue'
import CustomEdge from './BehaviorTreeEditChile/CustomEdge.vue'
import InteractionControls from './BehaviorTreeEditChile/InteractionControls.vue'

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

export default {
  name: 'BehaviorTreeEdit',
  setup() {
    let position = ref({ x: 0, y: 0, zoom: 1 })
    const { setViewport,getViewport,onMoveEnd} = useVueFlow()
    onMoveEnd(() =>  {position.value = getViewport()})
    return {
      position,
      setViewport,
      getViewport
    }
  },
  components: {
    VueFlow,
    Background,
    EdgeWithButton,
    CustomEdge,
    InteractionControls,
    // 移除未在模板中直接使用的 CustomEdgeLabel

    // 注册节点组件
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
  data() {
    return {
      MarkerType,
      nodes: ref([]),
      // [
      //   { id: '2', type: 'root', position: { x: 400, y: 50 },  data: { label: 'root' } },
      //   { id: '3', type: 'alwaysTrueNode', position: { x: 200, y: 200 },  data: { label: '永真节点' } },
      //   { id: '4', type: 'ifElseNode', position: { x: 400, y: 200 },   data: { label: 'ifelse节点' }  },
      //   { id: '5',type: 'loopBoolNode',  position: { x: 50, y: 200 }, data: { label: '循环节点判断结果' }},
      //   { id: '6',  type: 'loopNumNode', position: { x: 50, y: 400 },  data: { label: '循环节点判断次数' } },
      //   { id: '7', type: 'selectorNode', position: { x: 200, y: 400 },  data: { label: '选择节点' } },
      //   { id: '8', type: 'sequenceNode',  position: { x: 400, y: 400 },  data: { label: '顺序节点' } },
      //   { id: '9',  type: 'negationNode',  position: { x: 600, y: 400 },  data: { label: '取反节点' } },
      //   { id: '10', type: 'parallelNode',   position: { x: 800, y: 400 }, data: { label: '平行节点' } },
      //   { id: '11', type: 'leaf', position: { x: 1000, y: 400 }, data: { label: '叶子节点' } }
      // ],
      edges: ref([])
      // [ 
      //   { id: 'e3', source: '4', target: '5', type: 'smoothstep', data: { label: '边3' } },
      //   { id: 'e5', source: '4', sourceHandle:'if-else-success', target: '7', type: 'smoothstep', data: { label: '边4' } }
      // ]
    }
  },
  mounted() {
  },
  methods: {
    init(){
      const treeData = {
        "node_name":"root",
        "child":[
          {
            "node_name":"ifelse",
            "child":[
              {
                "node_name":"check",
                "child":[
                  { "node_name":"check1", "child":[] },
                  { "node_name":"check2", "child":[] }
                ]
              },
              {
                "node_name":"success",
                "child":[
                  { "node_name":"success1", "child":[] },
                  { "node_name":"success2", "child":[] }
                ]
              },
              { "node_name":"fail", "child":[] }
            ]
          }
        ]
      }
      this.parseTreeToElements(treeData)
    },
    parseTreeToElements(node, level = 0, parentId = '', siblingIndex = 0){
      // 1. 生成当前节点的唯一ID（避免重复）
      const nodeId = `${node.node_name}_${Date.now()}_${level}_${siblingIndex}`
      
      // 2. 计算节点位置（按层级分配y，同层级分配x）
      const position = {
        x: NODE_CONFIG.startX + siblingIndex * NODE_CONFIG.xStep,
        y: NODE_CONFIG.startY + level * NODE_CONFIG.yStep
      }

      // 3. 生成 Vue Flow 节点对象
      const flowNode = {
        id: nodeId,
        type: 'default', // 默认节点类型，可自定义
        label: node.node_name,
        position
      }
      elements.value.push(flowNode)

      // 4. 生成父子节点连线（如果有父节点）
      if (parentId) {
        const edge = {
          id: `edge_${parentId}_${nodeId}`,
          source: parentId, // 父节点ID
          target: nodeId,   // 子节点ID
          type: 'default'   // 默认连线类型
        }
        elements.value.push(edge)
      }

      // 5. 递归处理子节点
      if (node.child && node.child.length > 0) {
        node.child.forEach((child, index) => {
          parseTreeToElements(child, level + 1, nodeId, index)
        })
      }
    },
    printTree() {
      console.log('viewport', this.position)
      this.setViewport(this.position)
      // 打印当前节点和边信息
      console.log('nodes', this.nodes)
      console.log('edges', this.edges)
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