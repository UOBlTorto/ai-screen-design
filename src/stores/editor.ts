import { useUndoRedo } from '@/composables/useUndoRedo'
import type { MaterialSchema } from '@/schema/material'
import type { PageSchema } from '@/schema/page'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const { applyChange } = useUndoRedo()

  // 控制工具栏按钮进行画布面板的显示与隐藏
  const panelVisible = reactive({
    material: true,
    layer: true,
    property: true,
  })

  // 页面page的DSL、schema设置、获取
  const page = ref<PageSchema>({
    canvas: {
      width: 1920,
      height: 1080,
      backgroundColor: '#0d121b',
    },
    // 这个nodes理论上和上面那个nodes一样，但是我们把这里聚合起来
    nodes: [],
  })
  const canvas = toRef(page.value, 'canvas')

  // 选中节点拖放和缩放相关变量----单选
  const nodes = toRef(page.value, 'nodes')
  const selectedNodeIdList = ref<string[]>([])
  const selectedNodeId = computed(() =>
    selectedNodeIdList.value.length === 1 ? selectedNodeIdList.value[0] : null,
  )
  const selectedNode = computed(() => nodes.value.find((item) => item.id === selectedNodeId.value))

  function addNode(node: MaterialSchema) {
    setNodes([...nodes.value, node])
  }
  function selectNode(id: string) {
    // selectedNodeId.value = id
    selectedNodeIdList.value = [id]
  }
  function clearSelected() {
    selectedNodeIdList.value = []
  }
  // 选中节点拖放和缩放相关变量------多选
  function selectedNodes(idList: string[]) {
    selectedNodeIdList.value = idList
  }
  function findNode(id) {
    return nodes.value.find((item) => item.id === id)
  }

  /**
   * 右键菜单功能
   * */
  function copyNode(node: MaterialSchema) {
    // 拷贝
    const newNode = JSON.parse(JSON.stringify(node))
    newNode.id = crypto.randomUUID()
    // 偏移
    newNode.layout.x += 20
    newNode.layout.y += 20
    addNode(newNode)
    selectNode(newNode.id)
  }
  function removeNode(node: MaterialSchema) {
    setNodes(nodes.value.filter((item) => item.id !== node.id))
    selectedNodeIdList.value = selectedNodeIdList.value.filter((id) => id !== node.id)
  }
  function moveTop(node: MaterialSchema) {
    const index = nodes.value.findIndex((item) => item.id === node.id)
    const splicedNodes = nodes.value.toSpliced(index, 1)
    setNodes([node,...splicedNodes])
  }
  function moveBottom(node: MaterialSchema) {
    const index = nodes.value.findIndex((item) => item.id === node.id)
    const splicedNodes = nodes.value.toSpliced(index, 1)
    setNodes([...splicedNodes,node])
  }
  function toggleLock(node: MaterialSchema) {
    node.locked = !node.locked
    applyChange(node,'locked',!node.locked)
  }

  /**
   * 批处理功能
   * 关键逻辑：
   * const {applyChange} = useUndoRedo()
   * addNode时
   */

  function setNodes(newnodes){
    applyChange(nodes,'value',newnodes)
  }


  function updateNode(id,newNode){
    const newNodeList=nodes.value.map(node=>node.id===id?newNode:node)
    setNodes(newNodeList)
  }

  /**
   * 页面schema的导入导出
   */
  function setPage(newPage:PageSchema){
    Object.assign(page.value,newPage)
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
    clearSelected,

    copyNode,
    moveBottom,
    moveTop,
    toggleLock,
    removeNode,

    updateNode,

    setPage,
  }
})
