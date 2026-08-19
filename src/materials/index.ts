import type { MaterialDefinition } from "./type"

// 拓展物料面板-物料
const materials = []
/**
 * 扩展|注册 物料的方法
 * 
 * 类型text-->TextMaterial组件
 * 类型charts-->ChartsMaterial组件
 */
const componentMap = new Map()
function register(material:MaterialDefinition,component:Component){
    materials.push(material)
    componentMap.set(material.schema.type,component)
}
const materiaMosdulel = import.meta.glob('@/materials/*/*.ts',{eager:true})
for(const key in materiaMosdulel){
    const item = materiaMosdulel[key]
    // @ts-ignore
    item.install(register)
}

// 拓展物料面板-分类
const groups = [
  {
    name: '图表',
    icon: 'solar:chart-bold',
    key: 'charts',
  },
  {
    name: '详情',
    icon: 'ant-design:form-outlined',
    key: 'info',
  },
]

/**
 * 查物料
 */
export function getMaterialsByGroup(activeGroup: string) {
  return materials.filter((item) => item.group === activeGroup)
}
/**
 * 查所有组
 */
export function getGroups() {
  return groups
}

/**
 * 查物料对应组件
 */
export function getComponent(type:string){
  return componentMap.get(type)
}

/**
 * 创建物料节点
 */
export function createnode(node){
    return {
        ...node,
        id:crypto.randomUUID()
    }
}