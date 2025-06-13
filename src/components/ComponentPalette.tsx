import React from 'react'
import { componentLibrary, type ComponentDef } from '../lib/componentLibrary'

const ComponentPalette: React.FC = () => {
  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, component: ComponentDef) => {
    event.dataTransfer.setData('text/plain', component.id)
    event.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '200px',
      height: 'calc(100vh - 40px)',
      backgroundColor: 'rgba(240, 248, 255, 0.95)',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
      zIndex: 10,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'auto'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Component Palette</h3>
      
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0 
      }}>
        {componentLibrary.map((component) => (
          <li
            key={component.id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, component)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'grab',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.cursor = 'grabbing'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.cursor = 'grab'
            }}
          >
            <div style={{ 
              marginRight: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px'
            }}>
              <img 
                src={`/icons/${component.id.toLowerCase().split('_')[0]}.svg`}
                alt={component.name}
                style={{ 
                  width: '24px', 
                  height: '24px',
                  pointerEvents: 'none'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '500', 
                fontSize: '14px', 
                color: '#333',
                marginBottom: '2px'
              }}>
                {component.name}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#666'
              }}>
                {component.category}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ComponentPalette