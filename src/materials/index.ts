// 拓展物料面板-物料
const materials = [
    {
        name: '柱状图',
        group:'charts',
        icon: 'fluent-color:list-bar-16'
    },
    {
        name: '文本',
        group:'info',
        icon: 'solar:text-bold',
    }
]
// 拓展物料面板-分类
const groups = [
    {
        name: '图表',
        icon: 'solar:chart-bold',
        key: 'charts'
    },
    {
        name: '详情',
        icon: 'ant-design:form-outlined',
        key: 'info'
    }
]



/**
 * 查物料
 */
export function getMaterialsByGroup(activeGroup:string){
    return materials.filter(item=>item.group === activeGroup)
}
/**
 * 查所有组
 */
export function getGroups(){
    return groups
}