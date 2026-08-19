<template>
    <div class="material-panel flex">
        <div class="nav w-56">
            <div class="active">
                <span>
                    <Icon icon="solar:chart-bold"></Icon>
                </span>
                <span>图表</span>
            </div>
            <div>
                <span>
                    <Icon icon="ant-design:form-outlined"></Icon>
                </span>
                <span>表单</span>
            </div>
        </div>
        <div class="material-list flex-1 p-10 overflow-auto">
            <MaterialItem class="mt-10" v-for="value in 20" :key="value"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import MaterialItem from './components/MaterialItem.vue';

defineOptions({
    name: 'MaterialPanel'
})
</script>

<style scoped lang="scss">
.material-panel {
    background: bg-mix(20%);

    .nav {
        border-right: 1px solid var(--border-color);

        div {
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
    .material-list{
        scrollbar-color: #446b6b transparent;
        scrollbar-width: auto;
    }
}
</style>