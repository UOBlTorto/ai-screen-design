import type { MaterialDefinition } from '@/schema/material.ts'
import TextMatetial from './component.vue'
const textMaterial: MaterialDefinition = {
  name: '文本',
  group: 'info',
  icon: 'solar:text-bold',
  // 。。。
  setters:[
    {
      key:'props.content',
      type: 'input',
      label:'内容',
    },{
      key:'style.color',
      type:'color',
      label:'颜色'
    }
  ],
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
  register(textMaterial,TextMatetial)
}
