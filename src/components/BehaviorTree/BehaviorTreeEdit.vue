<template>
    <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init class="behavior-tree-edit"> 

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
import { Background } from '@vue-flow/background'
import { MarkerType, VueFlow } from '@vue-flow/core'
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
      nodes: [
        {id: '1', position: { x: 50, y: 50 },data: { label: 'Node 1' } },
        {id: '2', type: 'root', position: { x: 400, y: 50 },  data: { label: 'root' } },
        { id: '3', type: 'alwaysTrueNode', position: { x: 200, y: 200 },  data: { label: '永真节点' } },
        { id: '4', type: 'ifElseNode', position: { x: 400, y: 200 },   data: { label: 'ifelse节点' }  },
        {  id: '5',type: 'loopBoolNode',  position: { x: 50, y: 200 }, data: { label: '循环节点判断结果' }},
        { id: '6',  type: 'loopNumNode', position: { x: 50, y: 400 },  data: { label: '循环节点判断次数' } },
        {id: '7', type: 'selectorNode', position: { x: 200, y: 400 },  data: { label: '选择节点' } },
        {  id: '8', type: 'sequenceNode',  position: { x: 400, y: 400 },  data: { label: '顺序节点' } },
        {  id: '9',  type: 'negationNode',  position: { x: 600, y: 400 },  data: { label: '取反节点' } },
        {  id: '10', type: 'parallelNode',   position: { x: 800, y: 400 }, data: { label: '平行节点' } },
        { id: '11', type: 'leaf', position: { x: 1000, y: 400 }, data: { label: '叶子节点' } }
      ],
      edges: [ ]
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