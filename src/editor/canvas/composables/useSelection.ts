import type { MaterialSchema } from '@/schema/material'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

export function useSelection({stageRef,moveableRef}) {
  const editorStore = useEditorStore()
  const {selectedNodeIdList} = storeToRefs(editorStore)
  /**
   * 图层面板排序与画布联动
   *
   */
  // HACK：点击图层的节点更新的是Id，但是没有更新selectedTarget，所以不能选中
  const selectedTarget = shallowRef<HTMLElement[]>()

  watch(
    selectedNodeIdList,
    (idList) => {
      selectedTarget.value = idList.map((id) =>
        stageRef.value.querySelector(`[data-node-id='${id}']:not([data-node-locked='true'])`),
      )
    },
    { deep: true, flush: 'post' },
  )
  // ===========鼠标按下，选中节点=========================

  function onSelect(node: MaterialSchema, e: MouseEvent) {
    editorStore.selectNode(node.id)
    // HACK: 第一次选中识别不到
    nextTick(() => {
      moveableRef.value.dragStart(e)
    })
  }

  // =========点击画布让选中的元素清空==================
  function onClearSelected() {
    editorStore.clearSelected()
  }

  /**
   * 框选和多选功能
   */
  // 框选后拿到选中的元素
  function onSelectEnd(e) {
    // 获取Id
    const idList = e.selected.map((ele) => ele.getAttribute('data-node-id'))
    editorStore.selectedNodes(idList)
  }
  return {
    onSelect,
    onSelectEnd,
    onClearSelected,
    selectedTarget
  }
}
