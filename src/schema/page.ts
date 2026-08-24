import type { MaterialSchema } from '@/schema/material'

interface CanvasSchema {
  width: number
  height: number
  backgroundColor: string
}
export interface DataSourceSchema{
  /**
   * 数据源
   * static 静态数据源
   * API 接口请求的
   */
  type:'static' |'api'
  id:string
  name: string
  /**
   * 数据源载体
   */
  data:any

}
export interface PageSchema {
  canvas: CanvasSchema
  nodes: MaterialSchema[]
  dataSources:DataSourceSchema[]
}
