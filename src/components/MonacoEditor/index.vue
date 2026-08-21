<template>
    <div class="editor-container" ref="editorElement">

    </div>
</template>

<script setup lang="ts">
import { editor } from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

defineOptions({
    name:'MonacoEditor'
})
const editorElement = ref()
const props = defineProps<{lang?: string}>()
const modelValue = defineModel<string>()
let instance: editor.IStandaloneCodeEditor | null = null

onMounted(()=>{
    instance = editor.create(editorElement.value,{
        value:modelValue.value,
        theme:'vs-dark',
        fontSize:14,
        language:props.lang || 'json',
        tabSize:2,
        automaticLayout:true,//自适应父节点宽高
    })
    instance.onDidChangeModelContent(()=>{
        modelValue.value = instance.getValue()
    })

    onBeforeUnmount(()=>instance.dispose())
})

watch(modelValue, (val) => {
    if (instance && val !== instance.getValue()) {
        instance.setValue(val ?? '')
    }
})

window.MonacoEnvironment = {
    getWorker(_,label){
        if(label==='json') return new JsonWorker()
        if(label==='javascript' || label === 'typescript') return new TsWorker()
        return new EditorWorker()
    }
}

</script>

<style scoped lang="scss">
.editor-container{
    width: 100%;
    min-height: 400px;
    height: 100%;
}
</style>
