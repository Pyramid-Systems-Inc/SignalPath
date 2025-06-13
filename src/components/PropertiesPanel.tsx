import React from 'react'

const PropertiesPanel: React.FC = () => {
  return (
    <div style={{
      width: '250px',
      minWidth: '250px',
      height: '100%',
      backgroundColor: '#f5f5f5',
      padding: '16px',
      borderRight: '1px solid #ccc',
      boxSizing: 'border-box',
      flexShrink: 0
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Properties Panel</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Component properties and settings will be displayed here
      </p>
    </div>
  )
}

export default PropertiesPanel