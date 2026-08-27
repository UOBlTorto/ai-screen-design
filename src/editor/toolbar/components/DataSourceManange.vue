<template>
    <div class="data-source-container">
        <div class="data-source-slider">
            <el-button @click="onAdd" type="primary" size="small">新增</el-button>
            <div class="data-source-item" v-for="source in data" :key="source.id" @click="selectedSource(source)"
                :class="{ active: source.id === activeSource?.id }">
                <span>{{ source.name }}</span>
                <span @click.stop="removeDataSource(source.id)">
                    <Icon icon="mdi:remove"></Icon>
                </span>
            </div>

        </div>
        <div class="data-source-content">
            <el-form label-width="80">
                <el-form-item label="名称">
                    <el-input v-model="activeSource.name"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="activeSource.type">
                        <el-radio-button label="静态数据" value="static"></el-radio-button>
                        <el-radio-button label="api数据"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="数据" v-if="activeSource.type === 'static'">
                    <MonacoEditor v-model="activeSource.data"></MonacoEditor>
                </el-form-item>
                <div v-else>
                    <!-- api -->
                    <el-form-item label="请求地址">
                        <el-input v-model="activeSource.url"></el-input>
                    </el-form-item>
                    <el-form-item label="轮询时间">
                        <el-input v-model="activeSource.intervel"></el-input>
                    </el-form-item>
                    <el-form-item label="参数">
                        <el-input v-model="activeSource.params"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor';
import { deepClone } from '@/utils';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import MonacoEditor from '@/components/MonacoEditor/index.vue'



const editoStore = useEditorStore()
const { dataSources } = storeToRefs(editoStore)

const data = ref(
    deepClone(dataSources.value).map(item => {
        return {
            ...item,
            data: item.data ? JSON.stringify(item.data, null, 2) : undefined,
            params: item.params ? JSON.stringify(item.params, null, 2) : undefined
        }
    })
)

defineExpose({
    save() {
        const _data = deepClone(data.value).map(item => {
            return {
                ...item,
                data: item.data ? JSON.parse(item.data) : undefined,
                params: item.params ? JSON.parse(item.params) : undefined
            }
        })
        // 更新页面数据
        editoStore.page.dataSources = _data
    }
})

const activeSource = ref(data.value[0])
function selectedSource(source) {
    activeSource.value = source
}

function onAdd() {
    data.value.push({
        id: crypto.randomUUID(),
        name: '未命名',
        type: 'static',
        data: '',
        params: '{}'
    })
    selectedSource(data.value.at(-1))
}
function removeDataSource(id: string) {
    data.value = data.value.filter(item => item.id !== id)
    selectedSource(null)
}
</script>

<style lang="scss" scoped>
.data-source-container {
    display: flex;
    height: 600px;
    gap: 20px;

    .data-source-slider {
        overflow: auto;
        width: 200px;
        flex: none;
        padding: 10px;
        border: 1px solid var(--border-color);

        .data-source-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            padding-left: 20px;
            margin-top: 10px;
            cursor: pointer;
            background-color: bg-mix(80%);

            &.active {
                background-color: var(--el-color-primary);
            }
        }
    }

    .data-source-content {
        flex: 1;
        border: 1px solid var(--border-color);
        padding: 10px;
        overflow: auto;

    }
}
</style>