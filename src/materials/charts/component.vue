<template>
    <div class="chart-material w-full h-full" ref="chartRef">

    </div>
</template>

<script setup lang="ts">
import type { MaterialSchema } from '@/schema/material';
import { init,type EChartsType } from 'echarts'
defineOptions({
    name: 'ChartMaterial'
})
const props = defineProps<{ schema: MaterialSchema }>()
const chartRef = useTemplateRef('chartRef')
let chart:EChartsType
onMounted(() => {
    chart = init(chartRef.value)
    chart.setOption(props.schema.props.option)

    const observer = new ResizeObserver(() => {
        chart.resize()

    })

    observer.observe(chartRef.value)

    onBeforeUnmount(()=>{
        observer.disconnect()
        chart.dispose()
    })
})
watch(()=>props.schema.props.option,()=>{
    chart.setOption(props.schema.props.option)
},{deep:true})
</script>

<style scoped lang="scss">
.chart-material {}
</style>