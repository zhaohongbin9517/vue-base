<!-- <template>
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
import { h } from 'vue'  // 移除未使用的 ref 导入
import { Background } from '@vue-flow/background'
import { MarkerType, VueFlow } from '@vue-flow/core'
import EdgeWithButton from './BehaviorTreeEditChile/EdgeWithButton.vue'
import CustomEdge from './BehaviorTreeEditChile/CustomEdge.vue'
import CustomEdgeLabel from './BehaviorTreeEditChile/CustomEdgeLabel.vue'  // 仍然需要导入用于 h 函数
import InteractionControls from './BehaviorTreeEditChile/InteractionControls.vue'

import rootNode from './BehaviorTreeEditChile/nodes/root.vue'
import alwaysTrueNode from './BehaviorTreeEditChile/nodes/alwaysTrue.vue'
import ifElseNode from './BehaviorTreeEditChile/nodes/ifElse.vue'
import loopBoolNode from './BehaviorTreeEditChile/nodes/loopBool.vue'
import loopNumNode from './BehaviorTreeEditChile/nodes/loopNum.vue'
import selectorNode from './BehaviorTreeEditChile/nodes/selector.vue'
import sequenceNode from './BehaviorTreeEditChile/nodes/sequence.vue'
import negationNode from './BehaviorTreeEditChile/nodes/negation.vue'
import parallelNode from './BehaviorTreeEditChile/nodes/parallel.vue'
import leafNode from './BehaviorTreeEditChile/nodes/leaf.vue'


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
        { id: '1',  label: 'Start',type: 'root', position: { x: 50, y: 0 }, style: { borderColor: '#10b981' } },
        { id: '2', label: 'Node 2', position: { x: 150, y: 100 } },
        { id: '2a', label: 'Node 2a', position: { x: 0, y: 180 } },
        { id: '3', label: 'Node 3', position: { x: 250, y: 200 } },
        { id: '4', label: 'Node 4', position: { x: 400, y: 300 } },
        { id: '3a', label: 'Node 3a', position: { x: 175, y: 300 } },
        { id: '5', label: 'Node 5', position: { x: 200, y: 400 } },
        { id: '6', type: 'output', label: 'Output 6', position: { x: 0, y: 350 } },
        { id: '7', type: 'output', label: 'Output 7', position: { x: 50, y: 600 } },
        { id: '8', type: 'output', label: 'Output 8', position: { x: 350, y: 600 } },
        { id: '9', type: 'output', label: 'Output 9', position: { x: 550, y: 400 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', label: 'bezier edge (default)', class: 'normal-edge' },
        { id: 'e2-2a', source: '2', target: '2a', type: 'smoothstep', label: 'smoothstep edge' },
        { id: 'e2-3', source: '2', target: '3', type: 'step', label: 'step edge' },
        { id: 'e3-4', source: '3', target: '4', type: 'straight', label: 'straight edge' },
        { id: 'e3-3a', source: '3', target: '3a', type: 'straight', label: 'label only edge', style: { stroke: 'none' } },
        { id: 'e3-5', source: '4', target: '5', animated: true, label: 'animated styled edge', style: { stroke: '#10b981' } },
        {
          id: 'e2a-6',
          source: '2a',
          target: '6',
          label: () => h(CustomEdgeLabel, { label: 'custom label text' }),
          labelStyle: { fill: '#10b981', fontWeight: 700 },
          markerEnd: MarkerType.Arrow,
        },
        {
          id: 'e5-7',
          source: '5',
          target: '7',
          label: 'label with bg',
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.7 },
          markerEnd: MarkerType.ArrowClosed,
        },
        {
          id: 'e5-8',
          source: '5',
          target: '8',
          type: 'button',
          data: { text: 'custom edge' },
          markerEnd: MarkerType.ArrowClosed,
        },
        {
          id: 'e4-9',
          source: '4',
          target: '9',
          type: 'custom',
          data: { text: 'styled custom edge label' },
        },
      ]
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
</style> -->