<template>
    <div class="h-full">
        <div class="layer-panel h-full overflow-auto">
            <div :class="{ active: selectedNodeIdList.includes(nodeItem.id) }" v-for="nodeItem in nodes"
                :key="nodeItem.id"
                @click="editorStore.selectNode(nodeItem.id)">
                <span>{{ nodeItem.name }}</span>
                <span>
                    <Icon icon="fluent:list-bar-24-filled"></Icon>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';
import { useDraggable } from 'vue-draggable-plus';

defineOptions({
    name: 'LayerPanel'
})
const editorStore = useEditorStore()
const { nodes, selectedNodeIdList } = storeToRefs(editorStore)

/**
 * 图层拖拽排序功能
 */
useDraggable('.layer-panel',nodes,{animation:150,direction:'horizontal'})

</script>

<style scoped lang="scss">
.layer-panel {
    padding: 10px;
    background: bg-mix(50%);
    display: flex;
    flex-direction: column-reverse;
    justify-content: start;

    &>div {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 10px;
        justify-content: space-between;
        height: 30px;
        border: 1px solid var(--border-color);
        background: bg-mix(70%);
        font-size: 12px;
        border-radius: 4px;

        &.active {
            background: #0e8da7;
        }
    }

}
</style>