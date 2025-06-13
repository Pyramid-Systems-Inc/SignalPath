import React from 'react'

const PropertiesPanel: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      width: '250px',
      height: 'calc(100vh - 40px)',
      backgroundColor: 'rgba(245, 245, 245, 0.95)',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
      zIndex: 10,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'auto'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Properties Panel</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Component properties and settings will be displayed here
      </p>
    </div>
  )
}

export default PropertiesPanel