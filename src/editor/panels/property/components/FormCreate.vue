<template>
    <div>
        <el-form class="p-20" size="small" label-width="60">
            <el-row>
                <el-col v-for="setterItem in setters" :key="setterItem.key" :span="setterItem.span || 24">
                    <el-form-item :label="setterItem.label">
                        <component :is="componentMap[setterItem.type]"
                            :modelValue="getValue(selectedNode, setterItem.key)"
                            @update:modelValue="(val) => applyChange(selectedNode, setterItem.key, val)"
                            @focus="startBatch" @blur="commitBatch"
                            ></component>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ElColorPicker, ElInput, ElInputNumber } from 'element-plus';
import { getValue } from '@/utils';
import { useUndoRedo } from '@/composables/useUndoRedo';

defineOptions({
    name: 'FormCreate'
})
defineProps(['setters', 'selectedNode'])
const componentMap = {
    input: ElInput,
    number: (props) => h(ElInputNumber, { precision: 0, ...props }),
    color: ElColorPicker
}
// 撤销重做
const { applyChange,startBatch,commitBatch } = useUndoRedo()
</script>

<style scoped></style>