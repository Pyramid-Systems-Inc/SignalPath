import React, { useState, useRef, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'
import Konva from 'konva'
import Grid from './Grid'
import { useSchematicStore } from '../store/schematicStore'
import SchematicComponent from './SchematicComponent'

const Canvas: React.FC = () => {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [stageScale, setStageScale] = useState(1)
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const addComponent = useSchematicStore((state) => state.addComponent)
  const components = useSchematicStore((state) => state.components)
  const selectComponent = useSchematicStore((state) => state.selectComponent)

  // Handle container resizing
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current
        setStageSize({ width: offsetWidth, height: offsetHeight })
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
      // Set initial size
      const { offsetWidth, offsetHeight } = containerRef.current
      setStageSize({ width: offsetWidth, height: offsetHeight })
    }

    return () => resizeObserver.disconnect()
  }, [])

  // Handle wheel zoom
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    
    const stage = stageRef.current
    if (!stage) return

    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    
    if (!pointer) return
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const scaleBy = 1.2
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy
    
    // Limit zoom range
    const clampedScale = Math.max(0.1, Math.min(5, newScale))
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    }

    setStageScale(clampedScale)
    setStagePosition(newPos)
  }

  // Handle stage drag end
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setStagePosition({
      x: e.target.x(),
      y: e.target.y(),
    })
  }

  // Handle background click to deselect
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only handle clicks on the stage itself (background)
    if (e.target === e.target.getStage()) {
      selectComponent(null)
    }
  }

  // Handle drag over to allow drops
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  // Handle component drop from palette
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    
    // Get the library ID from the drag data
    const libraryId = e.dataTransfer.getData('text/plain')
    if (!libraryId) return

    // Calculate drop position relative to canvas, accounting for pan/zoom
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return

    // Get mouse position relative to container
    const dropX = e.clientX - containerRect.left
    const dropY = e.clientY - containerRect.top

    // Convert screen coordinates to canvas coordinates
    // Account for current pan and zoom transforms
    const canvasX = (dropX - stagePosition.x) / stageScale
    const canvasY = (dropY - stagePosition.y) / stageScale

    // Add component to store
    addComponent(libraryId, { x: canvasX, y: canvasY })
  }

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        cursor: 'grab',
        zIndex: 1
      }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onWheel={handleWheel}
        draggable
        x={stagePosition.x}
        y={stagePosition.y}
        scaleX={stageScale}
        scaleY={stageScale}
        onDragEnd={handleDragEnd}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          <Grid
            width={stageSize.width}
            height={stageSize.height}
            scale={stageScale}
            position={stagePosition}
          />
          {/* Render all components from store */}
          {components.map((component) => (
            <SchematicComponent key={component.id} component={component} />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default Canvas