import type { MaterialSchema } from '@/materials/type'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  // 控制工具栏按钮进行画布面板的显示与隐藏
  const panelVisible = reactive({
    material: true,
    layer: true,
    property: true,
  })
  // 选中节点拖放和缩放相关变量----单选
  const nodes = ref<MaterialSchema[]>([])
  const selectedNodeId = computed(()=>selectedNodeIdList.value.length === 1?selectedNodeIdList[0]:null)
  const selectedNode = computed(() => nodes.value.find((item) => item.id === selectedNodeId.value))
  function addNode(node: MaterialSchema) {
    nodes.value.push(node)
  }
  function selectNode(id: string) {
    // selectedNodeId.value = id
    selectedNodeIdList.value = [id]
  }
  function clearSelected(){
    selectedNodeIdList.value = null
  }
  // 选中节点拖放和缩放相关变量------多选
  const selectedNodeIdList = ref([])
  function selectedNodes(idList:string[]){
    selectedNodeIdList.value = idList
  }
  function findNode(id){
    return nodes.value.find(item=>item.id===id)
  }
  return {
    panelVisible,
    nodes,
    selectedNode,
    selectedNodeId,

    selectedNodeIdList,
    selectedNodes,
    findNode,
    addNode,
    selectNode,
    clearSelected
  }
})
