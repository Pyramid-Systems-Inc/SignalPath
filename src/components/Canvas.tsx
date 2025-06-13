import React, { useState, useRef, useCallback } from 'react'

const Canvas: React.FC = () => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setLastPosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - lastPosition.x
    const deltaY = e.clientY - lastPosition.y
    
    setTransform(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }))
    
    setLastPosition({ x: e.clientX, y: e.clientY })
  }, [isDragging, lastPosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.1, Math.min(5, transform.scale * delta))
    
    setTransform(prev => ({
      ...prev,
      scale: newScale
    }))
  }, [transform.scale])

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        cursor: isDragging ? 'grabbing' : 'grab',
        overflow: 'hidden',
        zIndex: 1
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Canvas content with transform */}
      <div
        style={{
          position: 'relative',
          width: '2000px',
          height: '2000px',
          backgroundColor: '#ffffff',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        {/* Canvas grid pattern */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        
        {/* Canvas content */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '24px' }}>Schematic Canvas</h3>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Drag to pan • Scroll to zoom • Design your circuits here
          </p>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            Zoom: {Math.round(transform.scale * 100)}% | Position: ({Math.round(transform.x)}, {Math.round(transform.y)})
          </p>
        </div>
      </div>
    </div>
  )
}

export default Canvas