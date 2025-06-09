import React from 'react'

const ComponentPalette: React.FC = () => {
  return (
    <div style={{
      width: '200px',
      height: '100%',
      backgroundColor: '#f0f8ff',
      padding: '16px',
      borderRight: '1px solid #ccc',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Component Palette</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Component library will be displayed here
      </p>
    </div>
  )
}

export default ComponentPalette