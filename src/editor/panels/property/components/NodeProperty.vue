<template>
    <div>
        123
    </div>
</template>

<script setup lang="ts">
import { getSetters } from '@/materials';
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';

defineOptions({
    name:'NodeProperty'
})
const editorStore = useEditorStore()
const {selectedNode} = storeToRefs(editorStore)

const setters = getSetters(selectedNode.value.type)
console.log(setters)
</script>

<style scoped lang="scss">

</style>