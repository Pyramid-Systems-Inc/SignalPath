import React from 'react'
import ComponentPalette from './components/ComponentPalette'
import Canvas from './components/Canvas'
import PropertiesPanel from './components/PropertiesPanel'
import './App.css'

function App() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      <PropertiesPanel />
      <Canvas />
      <ComponentPalette />
    </div>
  )
}

export default App
