<template>
    <div class="h-full">
        <div class="layer-panel h-full overflow-auto">
            <div class="active">
                <span>123</span>
                <span>
                    <Icon icon="fluent:list-bar-24-filled"></Icon>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'LayerPanel'
})
</script>

<style scoped lang="scss">
.layer-panel {
    padding: 10px;
    background: bg-mix(50%);

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