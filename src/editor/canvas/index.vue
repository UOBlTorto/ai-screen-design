<template>
    <div class="canvas-root">
        <div class="canvas-stage" @dragover.prevent @drop="onDrop">
            <div v-for="nodeItem in nodes" :key="nodeItem.id">
                <component :is="getComponent(nodeItem.type)" :schema="nodeItem"></component>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { getComponent, createnode } from '@/materials'
import type { MaterialSchema } from '@/materials/type'

defineOptions({
    name: 'CanvasRoot'
})
const nodes = ref<MaterialSchema[]>([])
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
    const node = JSON.parse(e.dataTransfer.getData('schema'))
    createnode(node)
    nodes.value.push(node)
}

</script>

<style scoped lang="scss">
.canvas-root {
    .canvas-stage {
        width: 600px;
        height: 500px;
        background: bg-mix(40%);
        margin: 100px;
    }
}
</style>