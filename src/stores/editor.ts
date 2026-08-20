import type { MaterialSchema } from '@/schema/material'
import type { PageSchema } from '@/schema/page'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  // 控制工具栏按钮进行画布面板的显示与隐藏
  const panelVisible = reactive({
    material: true,
    layer: true,
    property: true,
  })

  
  // 页面page的DSL、schema设置、获取
  const page = ref<PageSchema>({
    canvas:{
      width:1920,
      height:1080,
      backgroundColor:'#0d121b'
    },
    // 这个nodes理论上和上面那个nodes一样，但是我们把这里聚合起来
    nodes:[],
  })
  const canvas = toRef(page.value,'canvas')


  // 选中节点拖放和缩放相关变量----单选
  const nodes = toRef(page.value,'nodes')
  const selectedNodeIdList = ref<string[]>([])
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
    selectedNodeIdList.value = []
  }
  // 选中节点拖放和缩放相关变量------多选
  function selectedNodes(idList:string[]){
    selectedNodeIdList.value = idList
  }
  function findNode(id){
    return nodes.value.find(item=>item.id===id)
  }


  return {
    canvas,
    page,

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
