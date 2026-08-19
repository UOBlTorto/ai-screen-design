import type { MaterialDefinition } from '../type'

const textMaterial: MaterialDefinition = {
  name: '文本',
  group: 'info',
  icon: 'solar:text-bold',
  // 。。。
  schema: {
    // dsl
    type: 'text',
    name: '普通文本',
    layout: {
      width: 300,
      height: 50,
      x: 0,
      y: 0,
    },
    style: {
      color: 'black',
    },
    props: {
      content: 'hello',
    },
  },
}
export function install(register) {
  register(textMaterial)
}
