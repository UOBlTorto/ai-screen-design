<template>
    <div class="chart-material w-full h-full" ref="chartRef">

    </div>
</template>

<script setup lang="ts">
import type { MaterialSchema } from '@/schema/material';
import { init, type EChartsType } from 'echarts'
import { useDataSources } from '../../composables/useDataSources';
defineOptions({
    name: 'ChartMaterial'
})
const props = defineProps<{ schema: MaterialSchema }>()
const chartRef = useTemplateRef('chartRef')
let chart: EChartsType

const dataId = computed(() => props.schema.dataId)
const { data } = useDataSources(dataId)

const option = computed(() => {
    const _option = props.schema.props.option
    return {
        ..._option,
        dataset: {
            ..._option.dataset,
            source: data.value || _option.dataset.source,
        }
    }
})

function renderChart() {
    if (!chartRef.value) return
    if (!chart) {
        chart = init(chartRef.value)
    }
    chart.setOption(option.value, { notMerge: true })
}

onMounted(() => {
    renderChart()

    const observer = new ResizeObserver(() => {
        chart?.resize()

    })

    observer.observe(chartRef.value)

    onBeforeUnmount(() => {
        observer.disconnect()
        chart.dispose()
    })
})
// 数据源或 option 任意变化都重新渲染图表
watch(
    [() => props.schema.props.option, data],
    () => renderChart(),
    { deep: true },
)
</script>

<style scoped lang="scss">
.chart-material {}
</style>
