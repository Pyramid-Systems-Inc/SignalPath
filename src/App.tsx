import React from 'react'
import './App.css'
import Canvas from './components/Canvas'
import ComponentPalette from './components/ComponentPalette'
import PropertiesPanel from './components/PropertiesPanel'

function App() {
  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Canvas layer - behind everything */}
      <Canvas />

      {/* Properties Panel - floating overlay on left */}
      <PropertiesPanel />

      {/* Component Palette - floating overlay on right */}
      <ComponentPalette />
    </div>
  )
}

export default App
