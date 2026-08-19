import type { MaterialDefinition } from '../type'

const chartsMaterial: MaterialDefinition = {
  name: '柱状图',
  group: 'charts',
  icon: 'fluent-color:list-bar-16',

  schema: {
    // dsl
    type: 'charts',
    name: '柱状图',
    layout: {
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    },
    props: {
      option: {},
    },
  },
}
export function install(register) {
  register(chartsMaterial)
}
