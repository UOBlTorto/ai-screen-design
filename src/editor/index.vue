<template>
    <div class="editor h-screen">
        <header class="h-56 header flex items-center px-20">
            <ToolbarLeft class="w-300"/>
            <div class="flex-1 text-center">title</div>
            <ToolbarRight class="w-300"/>
        </header>
        <main class="editor-main flex">
            <!-- material  -->
            <aside class="material w-256 overflow-hidden" :style="{width:materialWidth}">material</aside>
            <!-- layer -->
            <aside class="layer w-156 overflow-hidden" :style="{width:layerWidth}">layer</aside>
            <!-- canvas -->
            <div class="canvas flex-1">canvas</div>
            <!-- property -->
            <aside class="property w-260 overflow-hidden" :style="{width:propertyWidth}">propertery</aside>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor.ts';
import ToolbarLeft from './toolbar/ToolbarLeft.vue';
import ToolbarRight from './toolbar/ToolbarRight.vue';

defineOptions({
    name: 'ScreenEditor'
})
const editorStore = useEditorStore()
const materialWidth = computed(()=>editorStore.panelVisible.material?'260px':'0')
const layerWidth = computed(()=>editorStore.panelVisible.layer?'260px':'0')
const propertyWidth = computed(()=>editorStore.panelVisible.property?'260px':'0')
</script>

<style scoped lang="scss">
.editor {
    background: var(--bg-color);

    .header {
        border-bottom: 1px solid var(--border-color);
    }

    .editor-main {
        height: calc(100% - 56px);

        .material,
        .layer {
            border-right: 1px solid var(--border-color)
        }

        .property {
            border-left: 1px solid var(--border-color);
        }
    }
}
</style>