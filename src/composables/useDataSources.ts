import type { DataSourceSchema } from '@/schema/page'
import axios from 'axios'

export function useDataSources(dataId: Ref<string>) {
  const dataSources = inject<Ref<DataSourceSchema[]>>('dataSources')

  const data = ref()
  const source = computed(() => {
    const sources = dataSources?.value.find((item) => item.id === dataId.value)
    return sources
  })

  let timer
  async function loadData() {
    if (!source.value) return
    if (source.value.type === 'api') {
      // 接口请求
      const url = source.value.url
      try {
        const res = await axios.get(url)
        data.value = res.data
      } finally {
        if (source.value.intervel) {
          timer = setTimeout(() => {
            loadData()
          }, source.value.intervel)
        }
      }
    } else {
      // 静态数据源
      data.value = source.value.data
    }
  }

  onBeforeUnmount(()=>{
    clearTimeout(timer)
  })
  watch(source, loadData, { immediate: true })
  return {
    data,
  }
}
