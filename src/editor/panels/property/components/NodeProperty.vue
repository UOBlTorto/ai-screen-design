<template>
    <div class="node-property">
        <el-collapse v-model="active" according>
            <el-collapse-item title="布局属性" name="layout">
                <FormCreate :setters="layoutSetters" :selected-node="selectedNode"></FormCreate>
            </el-collapse-item>
            <el-collapse-item title="组件属性" name="node">
                <FormCreate :setters="setters" :selected-node="selectedNode"></FormCreate>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script setup lang="ts">
import { getSetters } from '@/materials';
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';
import FormCreate from './FormCreate.vue';
defineOptions({
    name: 'NodeProperty'
})
const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)

/**
 *   setters:[
    {
      key:'props.content',
      type: 'input',
      label:'内容',
    },{
      key:'style.color',
      type:'color',
      label:'颜色'
    }
  ],
 */
const setters = getSetters(selectedNode.value.type)

const layoutSetters = [
    {
        key: 'layout.width',
        type: 'number',
        label: '宽度',
        span: 12
    },
    {
        key: 'layout.height',
        type: 'number',
        label: '高度',
        span: 12
    },
    {
        key: 'layout.x',
        type: 'number',
        label: 'X',
        span: 12
    },
    {
        key: 'layout.y',
        type: 'number',
        label: 'Y',
        span: 12
    }
]
//element折叠面板激活属性
const active = ref('node')

</script>

<style scoped lang="scss">
.node-property {
    :deep(.el-collapse) {
        --el-collapse-border-color: var(--border-color);
        --el-collapse-header-height: 48px;
        --el-collapse-header-bg-color: transparent;
        --el-collapse-header-text-color: var(--el-text-color-primary);
        --el-collapse-header-font-size: 13px;
        --el-collapse-content-bg-color: transparent;
        --el-collapse-content-font-size: 13px;
        --el-collapse-content-text-color: var(--el-text-color-primary);
        border-top: 1px solid var(--el-collapse-border-color);
        border-bottom: 1px solid var(--el-collapse-border-color);
        .el-collapse-item__header{
            padding-left: 20px;
        }
    }
}
</style>