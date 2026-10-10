const nullNode = {node_type: 'null_node'}

const nodeinfo = {
    'root': {
        nodeTreeStruct: {
            node_type: 'root',
            node: nullNode
        },
        node_name: '根节点',
    },
    'always_true_node': {
        nodeTreeStruct: {
            node_type: 'always_true_node',
            node: nullNode
        },
        node_name: '永真节点',
    },
    'ifelse_node': {
        nodeTreeStruct: {
            node_type: 'ifelse_node',
            check: nullNode,
            success: nullNode,
            fail: nullNode,
            unknown:nullNode
        },
        node_name: 'ifelse节点 ',
    },
    'loop_bool_node': {
        nodeTreeStruct: {
            node_type: 'loop_bool_node',
            bool:false,
            node: nullNode
        },
        node_name: '循环节点(判断结果)',
    },
    'loop_num_node': {
        nodeTreeStruct: {
            node_type: 'loop_num_node',
            num:1,
            node: nullNode
        },
        node_name: '循环节点(次数)',
    },
    'selector_node': {
        nodeTreeStruct: {
            node_type: 'selector_node',
            nodes: [ nullNode ]
        },
        node_name: '选择节点',
    },
    'sequence_node': {
        nodeTreeStruct: {
            node_type: 'sequence_node',
            nodes: [nullNode ]
        },
        node_name: '顺序节点',
    },
    'parallel_node': {
        nodeTreeStruct: {
            node_type: 'parallel_node',
            nodes: [nullNode]
        },
        node_name: '平行节点',
    },
    'negation_node': {
        nodeTreeStruct: {
            node_type: 'negation_node',
            node: nullNode
        },
        node_name: '取反节点',
    },
    'leaf': {
        nodeTreeStruct: {
            node_type: 'leaf',
            behavior_id: 0,
            args:[]
        },
        node_name: '叶节点',  //对于行为节点来说，这个参数没啥用
    },
    'null_node': {
        nodeTreeStruct: nullNode,
        node_name: '空节点',
    }
}

const treeNodeTypeToVueFlowNodeType = {
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


const baseGroupBehavior = [
    {
      id: -1,
      group_name: "基础分组",
      group_desc: "基础行为节点",
      behaviors: [
        { id: -2,node_type:"root", name: "根节点", desc: "基础节点，包含一个子节点", group_id: -1, sort: 0 },
        { id: -3,node_type:"always_true_node", name: "永真节点", desc: "无论子节点执行结果如何，本节点都返回success", group_id: -1, sort: 1 },
        { id: -4,node_type:"ifelse_node", name: "ifelse节点", desc: "根据check节点的返回结果决定执行success或fail节点", group_id: -1, sort: 2 },
        { id: -5,node_type:"loop_num_node", name: "循环节点（次数）", desc: "循环执行子节点指定次数", group_id: -1, sort: 3 },
        { id: -6,node_type:"loop_bool_node", name: "循环节点（判断结果）", desc: "循环执行子节点直到返回结果与设定值相同", group_id: -1, sort: 4 },
        { id: -7,node_type:"selector_node", name: "选择节点", "desc": "从左到右执行子节点，遇到第一个success即停止并返回success", "group_id": -1, sort: 5 },
        { id: -8,node_type:"sequence_node", name: "顺序节点", "desc": "从左到右执行子节点，遇到第一个fail即停止并返回fail", "group_id": -1, sort: 6 },
        { id: -9,node_type:"negation_node", name: "取反节点", "desc": "对子节点的结果取反并作为本节点的结果返回", "group_id": -1, sort: 7 },
        { id: -10,node_type:"parallel_node", name: "并行节点", "desc": "执行所有子节点，将最后一个节点的结果作为本节点的结果返回", "group_id": -1, sort: 8 }
      ]
    }
]

//获取基础分组行为
export function  getBaseGroupBehavior() {
     return JSON.parse(JSON.stringify(baseGroupBehavior)) 
}

//根据节点类型获取节点信息
export function getNodeInfo(nodeType = 'leaf',behavior = {id :0, name:'', args:[]}) {
    if(nodeType === 'leaf'){
        const localleafNode = JSON.parse(JSON.stringify(nodeinfo['leaf']))
        localleafNode.nodeTreeStruct.behavior_id = behavior.id
        localleafNode.nodeTreeStruct.args = behavior.args.map((arg)=> 
            {
              if(arg.type === 'int') return 0
              if(arg.type === 'string') return ''  
              if(arg.type === 'atom') return '' 
            })
        localleafNode.node_name = behavior.name
        return localleafNode
    } else {
        return JSON.parse(JSON.stringify(nodeinfo[nodeType]))
    }
}

//根据树节点类型获取流节点类型
export function getTreeNodeTypeToVueFlowNodeType() {
    return treeNodeTypeToVueFlowNodeType
}

//获取基础节点的信息
export function getBaseNodeInfo() {
    const baseNodeMap = baseGroupBehavior[0].behaviors.reduce((map, item) => {
        map[item.node_type] = {name: item.name, behavior_id: item.id, description: item.desc}
        return map
    }, {})
    return  JSON.parse(JSON.stringify(baseNodeMap))
}
