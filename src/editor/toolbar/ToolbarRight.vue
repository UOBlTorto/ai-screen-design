<template>
    <div class="flex gap-20 toolbar-right justify-end">
        <span>
            <Icon icon="icon-park-outline:preview-open"></Icon>
        </span>
        <span>
            <Icon icon="si:json-duotone"></Icon>
        </span>
        <span>
            <Icon icon="entypo:publish"></Icon>
        </span>
        <span>
            <Icon icon="mdi:import"></Icon>
        </span>
        <span>
            <Icon icon="mdi:export"></Icon>
        </span>
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'ToolBarRight'
})
</script>

<style lang="scss" scoped>
.toolbar-right{
    span{
        border:1px solid #ccc;
        border-radius:4px;
        cursor:pointer;
    }
}
</style>