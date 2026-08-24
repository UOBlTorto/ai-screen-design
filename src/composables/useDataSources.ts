import type { DataSourceSchema } from '@/schema/page'

export function useDataSources(dataId: Ref<string>) {
  const dataSources = inject<Ref<DataSourceSchema[]>>('dataSources')

  const source = computed(() => {
    const sources = dataSources?.value.find((item) => item.id === dataId.value)
    return sources
  })

  const data = computed(() => source.value?.data)
  return {
    data,
  }
}
