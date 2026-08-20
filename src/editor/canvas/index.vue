<template>
    <div class="canvas-root" ref="canvasRoot">
        <!-- 画布主体 -->
        <SketchRuler :palette :width="canvasRootWidth" :height="canvasRootHeight" :canvas-width="canvasWidth"
            :canvas-height="canvasHeight" :lines :scale @zoomchange="onZoomChange">
            <div class="canvas-stage" :style="canvasStyle" ref="stage" @dragover.prevent @drop="onDrop"
                @mousedown.self="onClearSelected">
                <el-dropdown @command="onCommand" v-for="(nodeItem, index) in nodes" :key="nodeItem.id"
                    trigger="contextmenu">
                    <div class="canvas-node" :data-node-locked="nodeItem.locked" :data-node-id="nodeItem.id"
                        @mousedown="onSelect(nodeItem, $event)" :style="getNodeStyle(nodeItem, index)">
                        <component :is="getComponent(nodeItem.type)" :schema="nodeItem"></component>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="copy">复制</el-dropdown-item>
                            <el-dropdown-item command="remove">移除</el-dropdown-item>
                            <el-dropdown-item command="moveTop">置顶</el-dropdown-item>
                            <el-dropdown-item command="moveBottom">置底</el-dropdown-item>
                            <el-dropdown-item command="toggleLock">{{ nodeItem.locked ? '解锁' : '锁定' }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </SketchRuler>

        <!-- 移动、缩放 节点 -->
        <Moveable ref="moveable" :target="selectedTarget" :origin="false" :draggable="true" @drag="onDrag"
            @drag-group="onDragGroup" @resize-group="onResizeGroup" :resizable="true" @resize="onResize"></Moveable>
        <Selecto v-if="stageRef" :container="stageRef" :dragContainer="stageRef" :selectable-targets="['.canvas-node']"
            @select-end="onSelectEnd" :select-from-inside="false"></Selecto>
    </div>
</template>

<script setup lang="ts">
import { getComponent, createnode } from '@/materials'
import type { MaterialSchema } from '@/schema/material'
import Moveable, { type OnDrag, type OnDragGroup, type OnResize, type OnResizeGroup } from 'vue3-moveable'
import { useEditorStore } from '@/stores/editor.ts'
import { storeToRefs } from 'pinia'
import Selecto from 'vue3-selecto'
import SketchRuler from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import { debounce } from '@/utils'
defineOptions({
    name: 'CanvasRoot'
})

const selectedTarget = shallowRef<HTMLElement[]>()
const editorStore = useEditorStore()
const { nodes, selectedNodeIdList, canvas } = storeToRefs(editorStore)

function onDrop(e: DragEvent) {
    /*
    node结构: {
    // dsl
    type: 'text',
    name: '普通文本',
    layout: {
      width: 300,
      height: 50,
      x: 0,
      y: 0,
    },
    style: {
      color: 'black',
    },
    props: {
      content: 'hello',
    },*/
    const node: MaterialSchema = createnode(JSON.parse(e.dataTransfer.getData('schema')))
    // HACK: 放开的位置就是XY轴
    node.layout.x = e.offsetX - node.layout.width / 2
    node.layout.y = e.offsetY - node.layout.height / 2
    editorStore.addNode(node)
    // HACK: 拖过来就能选中
    editorStore.selectNode(node.id)
    // nextTick(() => {
    //     selectedTarget.value = vm.proxy.$el.querySelector(`[data-node-id='${node.id}']`)
    // })
}
/**
 * 功能点实现
 * 节点拖放和缩放 
 */
// ===========获取节点样式=========================
function getNodeStyle(node: MaterialSchema, index: number) {
    return {
        width: node.layout.width + 'px',
        height: node.layout.height + 'px',
        top: node.layout.y + 'px',
        left: node.layout.x + 'px',
        zIndex: index + 1,
    }
}
// ===========鼠标按下，选中节点=========================
// const selectedTarget = shallowRef<HTMLElement>()
// const selectedNodeId = ref()
// const selectedNode = computed(() => nodes.value.find(item => item.id === selectedNodeId.value))
const moveableRef = useTemplateRef('moveable')
function onSelect(node: MaterialSchema, e: MouseEvent) {
    editorStore.selectNode(node.id)
    // HACK: 第一次选中识别不到
    nextTick(() => {
        moveableRef.value.dragStart(e)
    })
}
// ==========moveable第三方组件的拖动事件================
function onDrag(e: OnDrag) {
    // HACK: 移动时机早于 异步的页面更新，导致文字超出框
    e.target.style.left = e.left + 'px'
    e.target.style.top = e.top + 'px'

    const node = getNodeByTarget(e.target as HTMLElement)

    node.layout.x = e.left
    node.layout.y = e.top
}
// ==========moveable第三方组件的缩放事件================
function onResize(e: OnResize) {
    // HACK: 移动时机早于 异步的页面更新，导致文字超出框
    e.target.style.width = e.width + 'px'
    e.target.style.height = e.height + 'px'

    const node = getNodeByTarget(e.target as HTMLElement)

    node.layout.width = e.width
    node.layout.height = e.height


    // HACK: 往左边缩放会跑去缩放右边，得手动更新X、Y轴
    onDrag(e.drag)
}
// =========点击画布让选中的元素清空==================
function onClearSelected() {
    editorStore.clearSelected()
}

/**
 * 框选和多选功能
 */
// 框选后拿到选中的元素
const stageRef = useTemplateRef('stage')
function onSelectEnd(e) {
    // 获取Id
    const idList = e.selected.map(ele => ele.getAttribute('data-node-id'))
    editorStore.selectedNodes(idList)
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

/**
 * 标尺卡功能
 */
const palette = {
    bgColor: '#1f2937',
    longfgColor: '#6b7280',
    fontColor: '#9ca3af',
    fontShadowColor: '#0e8da7',
    shadowColor: 'rgba(14, 141, 167, 0.14)',
    lineColor: '#22c55e',
    lineType: 'solid',
    lockLineColor: '#4b5563',
    borderColor: '#374151',
    hoverBg: '#111827',
    hoverColor: '#ffffff',
}
const lines = ref({ h: [], v: [] })
const scale = ref(1)
const canvasRootRef = useTemplateRef('canvasRoot')
const canvasRootWidth = ref(1000)
const canvasRootHeight = ref(800)
onMounted(() => {
    canvasRootWidth.value = canvasRootRef.value.getBoundingClientRect().width
    canvasRootHeight.value = canvasRootRef.value.getBoundingClientRect().height

    //  监听dom属性的变化API
    const ob = new ResizeObserver((entries) => {
        const entry = entries[0]
        const rect = entry.contentRect
        onRootResize(rect)

    })
    const onRootResize = debounce((rect) => {
        canvasRootWidth.value = rect.width
        canvasRootHeight.value = rect.height
    }, 300)
    ob.observe(canvasRootRef.value)


    onUnmounted(() => {
        ob.disconnect()
    })
})
// 移动画布让选框也跟着动
function onZoomChange() {
    moveableRef.value.updateRect()//更新选框的方法
}
const canvasWidth = toRef(canvas.value, 'width')
const canvasHeight = toRef(canvas.value, 'height')
const canvasStyle = computed(() => {
    return {
        width: canvasWidth.value + 'px',
        height: canvasHeight.value + 'px',
        backgroundColor: canvas.value.backgroundColor
    }
})
/**
 * 图层面板排序与画布联动
 * 
 */
// HACK：点击图层的节点更新的是Id，但是没有更新selectedTarget，所以不能选中
watch(selectedNodeIdList, (idList) => {
    selectedTarget.value = idList.map(id => stageRef.value.querySelector(`[data-node-id='${id}']:not([data-node-locked='true'])`))
}, { deep: true, flush: 'post' })

/**
 * 右键功能
 */
const commandMap = {
    copy:()=>editorStore.copyNode(editorStore.selectedNode),
    remove:()=>editorStore.removeNode(editorStore.selectedNode),
    moveBottom:()=>editorStore.moveTop(editorStore.selectedNode),
    moveTop:()=>editorStore.moveBottom(editorStore.selectedNode),
    toggleLock:()=>{
        editorStore.toggleLock(editorStore.selectedNode)
        selectedTarget.value = []
    }
}
function onCommand(command:string){
    commandMap[command]()
}
</script>

<style scoped lang="scss">
.canvas-root {
    .canvas-stage {
        position: relative;
        margin: 50px;

        .canvas-node {
            position: absolute;
        }
    }
}
</style>