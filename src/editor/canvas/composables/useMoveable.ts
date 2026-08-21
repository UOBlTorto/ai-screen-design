import { useUndoRedo } from '@/composables/useUndoRedo'
import { useEditorStore } from '@/stores/editor'
import { type OnDrag, type OnDragGroup, type OnResize, type OnResizeGroup } from 'vue3-moveable'

export function useMoveable(moveableRef) {
  const editorStore = useEditorStore()
  const { applyChange, startBatch, commitBatch } = useUndoRedo()
  watch(()=>editorStore.nodes.map(node=>node.layout),()=>{
    moveableRef.value.updateRect(undefined,true)
  },{
    flush:'post'
  })

  // 批处理功能--拖拽
  function onStart() {
    startBatch()
  }
  function onEnd() {
    commitBatch()
  }

  // ==========moveable第三方组件的拖动事件================
  function onDrag(e: OnDrag) {
    // HACK: 移动时机早于 异步的页面更新，导致文字超出框
    e.target.style.left = e.left + 'px'
    e.target.style.top = e.top + 'px'

    const node = getNodeByTarget(e.target as HTMLElement)

    applyChange(node, 'layout', {
      ...node.layout,
      x: e.left,
      y: e.top,
    })
  }
  // ==========moveable第三方组件的缩放事件================
  function onResize(e: OnResize) {
    // HACK: 移动时机早于 异步的页面更新，导致文字超出框
    e.target.style.width = e.width + 'px'
    e.target.style.height = e.height + 'px'

    const node = getNodeByTarget(e.target as HTMLElement)

    node.layout.width = e.width
    node.layout.height = e.height
    applyChange(node, 'layout', {
      ...node.layout,
      width: e.width,
      height: e.height,
    })

    // HACK: 往左边缩放会跑去缩放右边，得手动更新X、Y轴
    onDrag(e.drag)
  }
  // 框选后成组拖拽
  function onDragGroup(e: OnDragGroup) {
    e.events.forEach(onDrag)
  }
  // 框选辅助方法-根据ele获取id,然后根据Id获取node
  function getNodeByTarget(ele: HTMLElement) {
    const id = ele.getAttribute('data-node-id')
    const node = editorStore.findNode(id)
    return node
  }
  // 框选后成组缩放
  function onResizeGroup(e: OnResizeGroup) {
    e.events.forEach(onResize)
  }
  return {
    onResize,
    onDrag,
    onResizeGroup,
    onDragGroup,
    onStart,
    onEnd
  }
}
