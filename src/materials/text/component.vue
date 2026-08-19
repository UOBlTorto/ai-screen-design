<template>
    <div>
        {{ schema.props.content }}
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name:'TextMaterial'
})
defineProps(['schema'])
</script>

<style scoped lang="scss">

</style>