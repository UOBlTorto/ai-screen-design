<template>
    <div class="canvas-root">
        <!-- 画布主体 -->
        <div class="canvas-stage" @dragover.prevent @drop="onDrop" @mousedown.self="onClearSelected">
            <div class="canvas-node" :data-node-id="nodeItem.id" @mousedown="onSelect(nodeItem, $event)"
                v-for="nodeItem in nodes" :key="nodeItem.id" :style="getNodeStyle(nodeItem)">
                <component :is="getComponent(nodeItem.type)" :schema="nodeItem"></component>
            </div>
        </div>
        <!-- 移动、缩放 节点 -->
        <Moveable ref="moveable" :target="selectedTarget" :origin="false" :draggable="true" @drag="onDrag"
            :resizable="true" @resize="onResize"></Moveable>
    </div>
</template>

<script setup lang="ts">
import { getComponent, createnode } from '@/materials'
import type { MaterialSchema } from '@/materials/type'
import Moveable, { type OnDrag, type OnResize } from 'vue3-moveable'
import {useEditorStore} from '@/stores/editor.ts'
import { storeToRefs } from 'pinia'
defineOptions({
    name: 'CanvasRoot'
})
const vm = getCurrentInstance()

const selectedTarget = shallowRef<HTMLElement>()
const editorSotre = useEditorStore()
const {selectedNodeId,selectedNode,nodes} = storeToRefs(editorSotre)

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
    editorSotre.addNode(node)
    // HACK: 拖过来就能选中
    editorSotre.selectNode(node.id)
    nextTick(() => {
        selectedTarget.value = vm.proxy.$el.querySelector(`[data-node-id='${node.id}']`)
    })
}
/**
 * 功能点实现
 * 节点拖放和缩放 
 */
// ===========获取节点样式=========================
function getNodeStyle(node: MaterialSchema) {
    return {
        width: node.layout.width + 'px',
        height: node.layout.height + 'px',
        top: node.layout.y + 'px',
        left: node.layout.x + 'px',
    }
}
// ===========鼠标按下，选中节点=========================
// const selectedTarget = shallowRef<HTMLElement>()
// const selectedNodeId = ref()
// const selectedNode = computed(() => nodes.value.find(item => item.id === selectedNodeId.value))
const moveableRef = useTemplateRef('moveable')
function onSelect(node: MaterialSchema, e: MouseEvent) {
    selectedTarget.value = e.currentTarget as HTMLElement
editorSotre.selectNode(node.id)
    // HACK: 第一次选中识别不到
    nextTick(()=>{
        moveableRef.value.dragStart(e)
    })
}
// ==========moveable第三方组件的拖动事件================
function onDrag(e: OnDrag) {
    // HACK: 移动时机早于 异步的页面更新，导致文字超出框
    selectedTarget.value.style.left = e.left + 'px'
    selectedTarget.value.style.top = e.top + 'px'

    selectedNode.value.layout.x = e.left
    selectedNode.value.layout.y = e.top
}
// ==========moveable第三方组件的缩放事件================
function onResize(e: OnResize) {
    // HACK: 移动时机早于 异步的页面更新，导致文字超出框
    selectedTarget.value.style.width = e.width + 'px'
    selectedTarget.value.style.height = e.height + 'px'

    selectedNode.value.layout.width = e.width
    selectedNode.value.layout.height = e.height

    // HACK: 往左边缩放会跑去缩放右边，得手动更新X、Y轴
    onDrag(e.drag)
}
// =========点击画布让选中的元素清空==================
function onClearSelected() {
    selectedTarget.value = null
    selectedNodeId.value = null
}
</script>

<style scoped lang="scss">
.canvas-root {
    .canvas-stage {
        position: relative;
        width: 600px;
        height: 500px;
        background: bg-mix(40%);
        margin: 100px;

        .canvas-node {
            position: absolute;
        }
    }
}
</style>