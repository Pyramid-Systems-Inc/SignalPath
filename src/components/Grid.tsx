import React from 'react'
import { Line } from 'react-konva'

interface GridProps {
  width: number
  height: number
  scale: number
  position: { x: number; y: number }
}

const Grid: React.FC<GridProps> = ({ width, height, scale, position }) => {
  const gridSize = 50 // Base grid size in pixels
  const lines: React.ReactElement[] = []

  // Calculate the visible area bounds
  const visibleLeft = -position.x / scale
  const visibleTop = -position.y / scale
  const visibleRight = visibleLeft + width / scale
  const visibleBottom = visibleTop + height / scale

  // Extend the grid slightly beyond the visible area
  const padding = gridSize * 2
  const startX = Math.floor((visibleLeft - padding) / gridSize) * gridSize
  const endX = Math.ceil((visibleRight + padding) / gridSize) * gridSize
  const startY = Math.floor((visibleTop - padding) / gridSize) * gridSize
  const endY = Math.ceil((visibleBottom + padding) / gridSize) * gridSize

  // Generate vertical lines
  for (let x = startX; x <= endX; x += gridSize) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, startY, x, endY]}
        stroke="#e0e0e0"
        strokeWidth={0.5}
        listening={false}
      />
    )
  }

  // Generate horizontal lines
  for (let y = startY; y <= endY; y += gridSize) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[startX, y, endX, y]}
        stroke="#e0e0e0"
        strokeWidth={0.5}
        listening={false}
      />
    )
  }

  // Add major grid lines every 250 pixels (5 grid units)
  const majorGridSize = gridSize * 5

  // Major vertical lines
  for (let x = Math.floor(startX / majorGridSize) * majorGridSize; x <= endX; x += majorGridSize) {
    lines.push(
      <Line
        key={`major-v-${x}`}
        points={[x, startY, x, endY]}
        stroke="#c0c0c0"
        strokeWidth={1}
        listening={false}
      />
    )
  }

  // Major horizontal lines
  for (let y = Math.floor(startY / majorGridSize) * majorGridSize; y <= endY; y += majorGridSize) {
    lines.push(
      <Line
        key={`major-h-${y}`}
        points={[startX, y, endX, y]}
        stroke="#c0c0c0"
        strokeWidth={1}
        listening={false}
      />
    )
  }

  return <>{lines}</>
}

export default Grid