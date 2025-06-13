import React from 'react'

const Canvas: React.FC = () => {
  return (
    <div style={{
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      padding: '16px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0
    }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Canvas</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Schematic drawing area will be displayed here
        </p>
      </div>
    </div>
  )
}

export default Canvas