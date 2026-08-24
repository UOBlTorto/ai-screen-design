<template>
    <div class="flex gap-20 toolbar-right justify-end">
        <span>
            <Icon icon="icon-park-outline:preview-open"></Icon>
        </span>
        <span @click="previewJson">
            <Icon icon="si:json-duotone"></Icon>
        </span>
        <span>
            <Icon icon="entypo:publish"></Icon>
        </span>
        <span @click="onImport">
            <Icon icon="mdi:import"></Icon>
        </span>
        
        <span @click="onExport">
            <Icon icon="mdi:export"></Icon>
        </span>
        <input type="file" v-show="false" ref="inputRef" @change="onChange"/>
        <el-drawer title="编辑JSON" size="800" v-model="visible">
            <MonacoEditor v-model="jsonText"></MonacoEditor>
            <template #footer>
                <el-button>取消</el-button>
                <el-button @click="onConfirm" type="primary">确认</el-button>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { useEditorStore } from '@/stores/editor'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
defineOptions({
    name: 'ToolBarRight'
})
const editorStore = useEditorStore()
const { page } = storeToRefs(editorStore)

const jsonText = ref('')
const visible = ref(false)
function previewJson() {
    visible.value = true
    jsonText.value = JSON.stringify(page.value,null,2)
}
function onConfirm(){
    const newPage = JSON.parse(jsonText.value)
    editorStore.setPage(newPage)
    visible.value = false
}
// export
function onExport(){
    const json = JSON.stringify(page.value,null,2)
    const blob = new Blob([json],{type:'application/json;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'screen-design.json'

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(url)
}
const inputRef = useTemplateRef('inputRef')
function onImport(){
    inputRef.value.click()
}
async function onChange(e){
    const file:File = e.target.files[0]
    console.log(file)
    if(!file) return
    const text = await file.text()
    try {
        const json = JSON.parse(text)
        editorStore.setPage(json)
        ElMessage.success('导入成功')
    } catch (error) {
        ElMessage.error('请检查JSON 是否合法')
    }
}
</script>

<style lang="scss" scoped>
.toolbar-right {
    span {
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
    }
}
</style>