<template>
    <div class="material-panel flex">
        <div class="nav w-56">
            <div :class="{ active: activeGroup === groupItem.key }" @click="() => activeGroup = groupItem.key"
                v-for="groupItem in groups" :key="groupItem.name">
                <span>
                    <Icon :icon="groupItem.icon"></Icon>
                </span>
                <span>{{ groupItem.name }}</span>
            </div>

        </div>
        <div class="material-list flex-1 p-10 overflow-auto">
            <MaterialItem class="mt-10" v-for="materialItem in curMateriali" :key="materialItem.name"
                :material="materialItem" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getGroups, getMaterialsByGroup } from '@/materials/index.ts';
import MaterialItem from './components/MaterialItem.vue';

defineOptions({
    name: 'MaterialPanel'
})
// 被激活的分组
const activeGroup = ref('info')

// 拓展物料面板-分类
const groups = getGroups()
const curMateriali = computed(()=>getMaterialsByGroup(activeGroup.value))
</script>

<style scoped lang="scss">
.material-panel {
    background: bg-mix(20%);

    .nav {
        border-right: 1px solid var(--border-color);

        div {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 50px;
            font-size: 12px;

            &.active {
                background: bg-mix(70%);
            }
        }
    }

    .material-list {
        scrollbar-color: #446b6b transparent;
        scrollbar-width: auto;
    }
}
</style>