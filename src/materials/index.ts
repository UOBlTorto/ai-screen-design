// 拓展物料面板-物料
const materials = []
/**
 * 扩展|注册 物料的方法
 */
function register(material){
    materials.push(material)
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
