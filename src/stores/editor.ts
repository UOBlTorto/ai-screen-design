import type { MaterialSchema } from '@/materials/type'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  // 控制工具栏按钮进行画布面板的显示与隐藏
  const panelVisible = reactive({
    material: true,
    layer: true,
    property: true,
  })
  // 选中节点拖放和缩放相关变量
  const nodes = ref<MaterialSchema[]>([])
const selectedNodeId = ref()
const selectedNode = computed(() => nodes.value.find(item => item.id === selectedNodeId.value))
function addNode(node:MaterialSchema){
  nodes.value.push(node)
}
function selectNode(id:string){
  selectedNodeId.value = id
}
  return { 
    panelVisible,
    nodes,
    selectedNode,
    selectedNodeId,
    addNode,
    selectNode
   }
})
