import { getValue, setValue } from '@/utils'

/**
 * 基础的撤销重做操作
 */
const MAX_HISTORY_LENGTH = 1000
function pushRecord(record){
    undoStack.push(record)
    if(undoStack.length>MAX_HISTORY_LENGTH){
        undoStack.shift()
    }
}

const undoStack = shallowReactive([])
const redoStack = shallowReactive([])
export function useUndoRedo() {
  // 按钮控制器
  const canUndo = computed(() => undoStack.length > 0)
  const canRedo = computed(() => redoStack.length > 0)

  //===========批处理=======================
  let activeBatch = null
  function startBatch() {
    // 如果要按批处理，让这一批初始化一个数组
    activeBatch = []
  }
  function commitBatch() {
    if (!activeBatch.length) return
    pushRecord(activeBatch)
    activeBatch = null
  }
  //==========end==========================

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
    // 如果这一批有（空数组的boolean是true），那就放到这一批数组里
    if (activeBatch) {
      const _record = activeBatch.find((item) => item.target === target && item.key === key)
      if (_record) {
        _record.newValue = newValue
      } else {
        activeBatch.push(record)
      }
    } else {
      pushRecord([record])
    }
    setValue(target, key, newValue)

    // 只有撤销完才能重做，正常更新不会重做
    // redo 里存的"被撤销的操作",只对"撤销前的状态"有效;一旦你做了新修改,旧的重做路径就失效了,必须清掉。
    redoStack.length = 0
  }

  function undo() {
    const recordList = undoStack.pop()
    if (!recordList) return

    recordList.toReversed().forEach((record) => {
      const { target, key, oldValue } = record
      setValue(target, key, oldValue)
    })

    redoStack.push(recordList)
  }
  function redo() {
    const recordList = redoStack.pop()
    if (!recordList) return

    recordList.forEach((record) => {
      const { target, key, newValue } = record
      setValue(target, key, newValue)
    })
    pushRecord(recordList)
  }
  return {
    canRedo,
    canUndo,
    undo,
    redo,
    applyChange,
    startBatch,
    commitBatch,
  }
}
