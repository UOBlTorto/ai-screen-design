<template>
    <div class="editor h-screen">
        <header class="h-56 header flex items-center px-20"></header>
        <main class="editor-main flex">
            <!-- material  -->
            <aside class="w-256">material</aside>
            <!-- layer -->
            <aside class="w-156 ">layer</aside>
            <!-- canvas -->
            <div class="canvas flex-1">canvas</div>
            <!-- propertery -->
            <aside class="w-260 ">propertery</aside>
        </main>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'ScreenEditor'
})
</script>

<style scoped lang="scss">
.editor {
    background: var(--bg-color);

    .header {
        border-bottom: 1px solid var(--border-color);
    }

    .editor-main {
        height: calc(100% - 56px);

        .material,
        .layer {
            border-right: 1px solid var(--border-color)
        }

        .property {
            border-left: 1px solid var(--border-color);
        }
    }
}
</style>