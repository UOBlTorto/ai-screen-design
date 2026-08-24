interface Layout {
        x:number
        y:number
        width: number
        height: number
}

export interface MaterialSchema {
    type: string
    name: string
    id: string
    locked?:boolean
    layout: Layout
    style?: Record<string, any>
    props: Record<string, any>
    // 数据源id
    dataId?:string
}

export interface SetterSchema{
    key:string
    label:string
    type:string
    [key:string]:any

}
export interface MaterialDefinition {
    // region 物料元数据
    name: string
    group: string
    icon: string
    setters:SetterSchema[]
    // endregion
    schema: Omit<MaterialSchema,'id'>
}