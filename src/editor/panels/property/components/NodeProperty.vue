<template>
    <div class="node-property">
        <!-- json编辑器 -->
        <div class="node-title">
            <span>{{ selectedNode.name }}</span>
            <span class="cursor-pointer" @click="previewJson">
                <Icon icon="si:json-duotone"></Icon>
            </span>
        </div>
        <el-tabs v-model="activeTab" stretch>
            <el-tab-pane label="属性" name="property">
                <!-- 属性主体 -->
                <el-collapse v-model="active" accordion>
                    <el-collapse-item title="布局属性" name="layout">
                        <FormCreate :setters="layoutSetters" :selected-node="selectedNode"></FormCreate>
                    </el-collapse-item>
                    <el-collapse-item title="组件属性" name="node">
                        <FormCreate :setters="setters" :selected-node="selectedNode"></FormCreate>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="数据源" name="data-source">
                <DataSources></DataSources>
            </el-tab-pane>
        </el-tabs>

        <!-- 弹窗 -->
        <el-drawer destroy-on-close v-model="visible" title="编辑 JSON" size="800">
            <MonacoEditor v-model="jsonText"></MonacoEditor>

            <template #footer>
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="onConfirm">确认</el-button>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { getSetters } from '@/materials';
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';
import FormCreate from './FormCreate.vue';
import DataSources from './DataSources.vue';
defineOptions({
    name: 'NodeProperty'
})
const visible = ref(false)
const jsonText = ref('')
const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)
const activeTab = ref('property')

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
const setters = computed(() => getSetters(selectedNode.value.type))

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
// 点击预览
function previewJson() {
    jsonText.value = JSON.stringify(selectedNode.value, null, 2)
    visible.value = true
}
function onConfirm() {
    const newNode = JSON.parse(jsonText.value)
    editorStore.updateNode(selectedNode.value.id, {
        ...newNode,
        id: selectedNode.value.id,
        type: selectedNode.value.type
    })
    visible.value = false
}

</script>

<style scoped lang="scss">
.node-property {
    .node-title {
        height: 50px;
        display: flex;
        align-items: center;
        font-weight: 600;
        padding: 0 20px;
        background-color: bg-mix(40%);
        justify-content: space-between;
    }

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

        .el-collapse-item__header {
            padding-left: 20px;
        }
    }
}
</style>
