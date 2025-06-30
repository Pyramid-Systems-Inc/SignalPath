import React, { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import Konva from 'konva'
import Grid from './Grid'
import { useSchematicStore } from '../store/schematicStore'
import SchematicComponent from './SchematicComponent'
import { componentLibrary } from '../lib/componentLibrary'

const Canvas: React.FC = () => {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [stageScale, setStageScale] = useState(1)
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const addComponent = useSchematicStore((state) => state.addComponent)
  const components = useSchematicStore((state) => state.components)
  const nets = useSchematicStore((state) => state.nets)
  const selectComponent = useSchematicStore((state) => state.selectComponent)
  const hoveredComponentId = useSchematicStore((state) => state.hoveredComponentId)
  const wiringState = useSchematicStore((state) => state.wiringState)
  const updateWire = useSchematicStore((state) => state.updateWire)
  const cancelWire = useSchematicStore((state) => state.cancelWire)

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

  // Handle keyboard events for wire cancellation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && wiringState.active) {
        console.log('ESC pressed - cancelling wire')
        cancelWire()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [wiringState.active, cancelWire])

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

  // Handle mouse move for rubber band wire
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only update wire position if we're in wiring mode
    if (!wiringState.active) return

    const stage = stageRef.current
    if (!stage) return

    const pointer = stage.getPointerPosition()
    if (!pointer) return

    // Convert screen coordinates to stage coordinates
    // Account for current pan and zoom transforms
    const stageX = (pointer.x - stagePosition.x) / stageScale
    const stageY = (pointer.y - stagePosition.y) / stageScale

    updateWire({ x: stageX, y: stageY })
  }

  // Handle right-click for wire cancellation
  const handleContextMenu = (e: Konva.KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault() // Prevent browser context menu

    if (wiringState.active) {
      console.log('Right-click - cancelling wire')
      cancelWire()
    }
  }

  // Helper function to get component bounds
  const getComponentBounds = (libraryId: string) => {
    switch (libraryId) {
      case 'RESISTOR_GENERIC':
        return { width: 44, height: 16, offsetX: -22, offsetY: -8 };
      case 'OPAMP_LM386':
        return { width: 64, height: 34, offsetX: -32, offsetY: -17 };
      case 'ELECTRET_MICROPHONE':
        return { width: 28, height: 48, offsetX: -14, offsetY: -24 };
      default:
        return { width: 44, height: 16, offsetX: -22, offsetY: -8 };
    }
  }

  // Helper function to get absolute pin position
  const getPinPosition = (componentId: string, pinId: string): { x: number; y: number } | null => {
    // Find the component
    const component = components.find(c => c.id === componentId)
    if (!component) return null

    // Find the component definition to get pin data
    const componentDef = componentLibrary.find(def => def.id === component.libraryId)
    if (!componentDef) return null

    // Find the specific pin
    const pin = componentDef.pins.find(p => p.id === pinId)
    if (!pin) return null

    // Calculate absolute position
    return {
      x: component.position.x + pin.position.x,
      y: component.position.y + pin.position.y
    }
  }

  // Helper function to get wire connection point with edge offset
  const getWireConnectionPoint = (componentId: string, pinId: string): { x: number; y: number } | null => {
    const pinPos = getPinPosition(componentId, pinId)
    if (!pinPos) return null

    const component = components.find(c => c.id === componentId)
    if (!component) return null

    const bounds = getComponentBounds(component.libraryId)
    const EDGE_OFFSET = 8 // 8px offset from component edge

    // Calculate component edges
    const componentLeft = component.position.x + bounds.offsetX
    const componentRight = component.position.x + bounds.offsetX + bounds.width
    const componentTop = component.position.y + bounds.offsetY
    const componentBottom = component.position.y + bounds.offsetY + bounds.height

    // Determine which edge the pin is closest to and apply offset
    const pinRelativeX = pinPos.x - component.position.x
    const pinRelativeY = pinPos.y - component.position.y

    let connectionPoint = { ...pinPos }

    // Apply edge offset based on pin position relative to component center
    if (pinRelativeX < bounds.offsetX + bounds.width * 0.25) {
      // Pin is on the left side
      connectionPoint.x = componentLeft - EDGE_OFFSET
    } else if (pinRelativeX > bounds.offsetX + bounds.width * 0.75) {
      // Pin is on the right side
      connectionPoint.x = componentRight + EDGE_OFFSET
    }

    if (pinRelativeY < bounds.offsetY + bounds.height * 0.25) {
      // Pin is on the top side
      connectionPoint.y = componentTop - EDGE_OFFSET
    } else if (pinRelativeY > bounds.offsetY + bounds.height * 0.75) {
      // Pin is on the bottom side
      connectionPoint.y = componentBottom + EDGE_OFFSET
    }

    return connectionPoint
  }

  // Helper function to calculate routed wire points with component avoidance
  const getRoutedWirePoints = (startComponentId: string, startPinId: string, endComponentId: string, endPinId: string): number[] => {
    // Get connection points with edge offsets
    const startPos = getWireConnectionPoint(startComponentId, startPinId)
    const endPos = getWireConnectionPoint(endComponentId, endPinId)

    if (!startPos || !endPos) {
      // Fallback to pin positions if connection points fail
      const fallbackStart = getPinPosition(startComponentId, startPinId)
      const fallbackEnd = getPinPosition(endComponentId, endPinId)
      if (!fallbackStart || !fallbackEnd) return []
      return [fallbackStart.x, fallbackStart.y, fallbackEnd.x, fallbackEnd.y]
    }

    const dx = endPos.x - startPos.x
    const dy = endPos.y - startPos.y

    // If the wire is short, use direct routing
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
      return [startPos.x, startPos.y, endPos.x, endPos.y]
    }

    // Use intelligent right-angle routing with component avoidance
    const CLEARANCE = 15 // Additional clearance around components

    // Get component bounds for avoidance
    const startComponent = components.find(c => c.id === startComponentId)
    const endComponent = components.find(c => c.id === endComponentId)

    if (!startComponent || !endComponent) {
      // Fallback to simple routing
      const midX = startPos.x + dx * 0.5
      return [
        startPos.x, startPos.y,
        midX, startPos.y,
        midX, endPos.y,
        endPos.x, endPos.y
      ]
    }

    const startBounds = getComponentBounds(startComponent.libraryId)
    const endBounds = getComponentBounds(endComponent.libraryId)

    // Calculate component boundaries with clearance
    const startLeft = startComponent.position.x + startBounds.offsetX - CLEARANCE
    const startRight = startComponent.position.x + startBounds.offsetX + startBounds.width + CLEARANCE
    const startTop = startComponent.position.y + startBounds.offsetY - CLEARANCE
    const startBottom = startComponent.position.y + startBounds.offsetY + startBounds.height + CLEARANCE

    const endLeft = endComponent.position.x + endBounds.offsetX - CLEARANCE
    const endRight = endComponent.position.x + endBounds.offsetX + endBounds.width + CLEARANCE
    const endTop = endComponent.position.y + endBounds.offsetY - CLEARANCE
    const endBottom = endComponent.position.y + endBounds.offsetY + endBounds.height + CLEARANCE

    // Determine routing strategy based on component positions
    let midX: number
    let midY: number

    if (Math.abs(dx) > Math.abs(dy)) {
      // Primarily horizontal routing
      if (startPos.x < endPos.x) {
        // Left to right
        midX = Math.max(startRight, endRight) + CLEARANCE
      } else {
        // Right to left
        midX = Math.min(startLeft, endLeft) - CLEARANCE
      }

      // Route around components vertically if needed
      if (startPos.y < endPos.y) {
        midY = Math.max(startBottom, endBottom) + CLEARANCE
      } else {
        midY = Math.min(startTop, endTop) - CLEARANCE
      }
    } else {
      // Primarily vertical routing
      if (startPos.y < endPos.y) {
        // Top to bottom
        midY = Math.max(startBottom, endBottom) + CLEARANCE
      } else {
        // Bottom to top
        midY = Math.min(startTop, endTop) - CLEARANCE
      }

      // Route around components horizontally if needed
      if (startPos.x < endPos.x) {
        midX = Math.max(startRight, endRight) + CLEARANCE
      } else {
        midX = Math.min(startLeft, endLeft) - CLEARANCE
      }
    }

    // Create the routed path
    return [
      startPos.x, startPos.y,    // Start point
      startPos.x, midY,          // Vertical segment from start
      midX, midY,                // Horizontal segment
      midX, endPos.y,            // Vertical segment to end
      endPos.x, endPos.y         // End point
    ]
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

  // Determine cursor style based on hover state
  const getCursorStyle = () => {
    return hoveredComponentId ? 'pointer' : 'grab'
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
        cursor: getCursorStyle(),
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
        onMouseMove={handleMouseMove}
        onContextMenu={handleContextMenu}
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

          {/* Render permanent wires */}
          {nets.map((net) => {
            // Only render nets with exactly 2 connections (point-to-point wires)
            if (net.connections.length !== 2) return null

            // Get routed wire points with component avoidance
            const routedPoints = getRoutedWirePoints(
              net.connections[0].componentId,
              net.connections[0].pinId,
              net.connections[1].componentId,
              net.connections[1].pinId
            )

            // Only render if routing was successful
            if (routedPoints.length === 0) return null

            return (
              <Line
                key={net.id}
                points={routedPoints}
                stroke="#0066cc"
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
                listening={false} // Don't interfere with mouse events
              />
            )
          })}

          {/* Render rubber band wire when in wiring mode */}
          {wiringState.active && wiringState.startPos && wiringState.currentPos && (
            <Line
              points={[
                wiringState.startPos.x,
                wiringState.startPos.y,
                wiringState.currentPos.x,
                wiringState.currentPos.y
              ]}
              stroke="#00ff00"
              strokeWidth={2}
              dash={[5, 5]}
              lineCap="round"
              listening={false} // Don't interfere with mouse events
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
}

export default Canvas