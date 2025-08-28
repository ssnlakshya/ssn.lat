'use client'

import { MeshGradient, MeshGradientProps } from '@paper-design/shaders-react'

export function MeshGradientComponent({ speed = 1, ...props }: MeshGradientProps) {
  return <MeshGradient {...props} speed={speed} />
}
