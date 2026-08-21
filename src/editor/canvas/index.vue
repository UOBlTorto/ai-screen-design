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
                            <el-dropdown-item command="toggleLock">{{ nodeItem.locked ? '解锁' : '锁定'
                                }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </SketchRuler>

        <!-- 移动、缩放 节点 -->
        <Moveable ref="moveable" :target="selectedTarget" :origin="false" :draggable="true" @drag="onDrag"
            @drag-group="onDragGroup" @resize-group="onResizeGroup" :resizable="true" @resize="onResize"
            @drag-start="onStart" @drag-end="onEnd" @resize-start="onStart" @resize-end="onEnd"
            @drag-group-start="onStart" @drag-group-end="onEnd" @resize-group-start="onStart" @resize-group-end="onEnd"
            ></Moveable>
        <Selecto v-if="stageRef" :container="stageRef" :dragContainer="stageRef" :selectable-targets="['.canvas-node']"
            @select-end="onSelectEnd" :select-from-inside="false"
            ></Selecto>
    </div>
</template>

<script setup lang="ts">
import { getComponent, createnode } from '@/materials'
import type { MaterialSchema } from '@/schema/material'
import Moveable from 'vue3-moveable'
import { useEditorStore } from '@/stores/editor.ts'
import { storeToRefs } from 'pinia'
import Selecto from 'vue3-selecto'
import SketchRuler from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import { useCanvasRuler } from './composables/useCanvasRuler'
import { useMoveable } from './composables/useMoveable'
import { useSelection } from './composables/useSelection'
defineOptions({
    name: 'CanvasRoot'
})

const editorStore = useEditorStore()
const { nodes } = storeToRefs(editorStore)
const stageRef = useTemplateRef('stage')

// 标尺卡逻辑
const canvasRootRef = useTemplateRef('canvasRoot')
const moveableRef = useTemplateRef('moveable')

const {
    canvasStyle,
    canvasWidth,
    canvasHeight,
    canvasRootWidth,
    canvasRootHeight,
    lines,
    scale,
    palette,
    onZoomChange

} = useCanvasRuler({ canvasRootRef, moveableRef })
// 节点拖动逻辑
const {
    onResize,
    onDrag,
    onResizeGroup,
    onDragGroup,
    onStart,
    onEnd
} = useMoveable(moveableRef)
//   框选逻辑
const {
    onSelect,
    onSelectEnd,
    onClearSelected,
    selectedTarget
} = useSelection({ stageRef, moveableRef })

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

/**
 * 右键功能
 */
const commandMap = {
    copy: () => editorStore.copyNode(editorStore.selectedNode),
    remove: () => editorStore.removeNode(editorStore.selectedNode),
    moveBottom: () => editorStore.moveTop(editorStore.selectedNode),
    moveTop: () => editorStore.moveBottom(editorStore.selectedNode),
    toggleLock: () => {
        editorStore.toggleLock(editorStore.selectedNode)
        selectedTarget.value = []
    }
}
function onCommand(command: string) {
    commandMap[command]()
}
</script>

<style scoped lang="scss">
.canvas-root {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    .canvas-stage {
        position: relative;
        margin: 50px;

        .canvas-node {
            position: absolute;
        }
    }
}
</style>