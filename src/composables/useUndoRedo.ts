import { getValue, setValue } from '@/utils'

/**
 * 基础的撤销重做操作
 */
const undoStack = shallowReactive([])
const redoStack = shallowReactive([])
export function useUndoRedo() {
    // 按钮控制器
    const canUndo = computed(()=>undoStack.length>0)
    const canRedo = computed(()=>redoStack.length>0)
  // 记录的函数
  function applyChange(target, key, val) {
    // 改变之前
    const oldValue = getValue(target, key)
    const newValue = val
    if (oldValue === newValue) return
    const record = {
      target,
      key,
      oldValue,
      newValue,
    }
    undoStack.push(record)
    setValue(target, key, newValue)

    // 只有撤销完才能重做，正常更新不会重做
    // redo 里存的"被撤销的操作",只对"撤销前的状态"有效;一旦你做了新修改,旧的重做路径就失效了,必须清掉。
    redoStack.length = 0
  }

  function undo() {
    const record = undoStack.pop()
    if (!record) return
    const { target, key, oldValue } = record
    setValue(target, key, oldValue)
    redoStack.push(record)
  }
  function redo() {
    const record = redoStack.pop()
    if (!record) return
    const { target, key, newValue } = record
    setValue(target, key, newValue)
    undoStack.push(record)
  }
  return {
    canRedo,
    canUndo,
    undo,
    redo,
    applyChange,
  }
}
