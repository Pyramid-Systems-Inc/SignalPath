import React, { useEffect } from 'react'
import './App.css'
import Canvas from './components/Canvas'
import ComponentPalette from './components/ComponentPalette'
import PropertiesPanel from './components/PropertiesPanel'
import { useSchematicStore } from './store/schematicStore'

function App() {
  const { selectedComponentId, deleteComponent } = useSchematicStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the user is typing in an input field
      if (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement) {
        return
      }

      // Handle Delete and Backspace keys
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedComponentId) {
        event.preventDefault()
        deleteComponent(selectedComponentId)
      }
    }

    // Add event listener to window
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedComponentId, deleteComponent])

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
