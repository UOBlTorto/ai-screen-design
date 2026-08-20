import type { MaterialSchema } from '@/schema/material'

interface CanvasSchema {
  width: number
  height: number
  backgroundColor: string
}
export interface PageSchema {
  canvas: CanvasSchema
  nodes: MaterialSchema[]
}
