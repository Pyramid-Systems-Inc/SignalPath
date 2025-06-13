import React from 'react'

const ComponentPalette: React.FC = () => {
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
      <p style={{ fontSize: '14px', color: '#666' }}>
        Component library will be displayed here
      </p>
    </div>
  )
}

export default ComponentPalette