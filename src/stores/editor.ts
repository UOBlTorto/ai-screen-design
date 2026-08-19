import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  // 控制工具栏按钮进行画布面板的显示与隐藏
  const panelVisible = reactive({
    material: true,
    layer: true,
    property: true,
  })

  return { panelVisible }
})
