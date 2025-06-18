import React from 'react'
import { useSchematicStore } from '../store/schematicStore'
import { componentLibrary } from '../lib/componentLibrary'

const PropertiesPanel: React.FC = () => {
  const { selectedComponentId, components, updateComponentProperties, deleteComponent } = useSchematicStore()

  // Find the selected component
  const selectedComponent = selectedComponentId
    ? components.find(component => component.id === selectedComponentId)
    : null

  // Get component display name from library
  const getComponentDisplayName = (libraryId: string): string => {
    const componentDef = componentLibrary.find(comp => comp.id === libraryId)
    return componentDef ? componentDef.name : libraryId
  }

  // Handle RefDes change
  const handleRefDesChange = (newRefDes: string) => {
    if (selectedComponent) {
      updateComponentProperties(selectedComponent.id, { refDes: newRefDes })
    }
  }

  // Handle component deletion
  const handleDeleteComponent = () => {
    if (selectedComponent) {
      deleteComponent(selectedComponent.id)
    }
  }

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
      <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Component Properties</h3>
      
      {selectedComponent ? (
        <div>
          {/* Component ID */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#555',
              marginBottom: '4px'
            }}>
              ID:
            </label>
            <div style={{
              padding: '6px 8px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#666',
              fontFamily: 'monospace'
            }}>
              {selectedComponent.id}
            </div>
          </div>

          {/* Component Type */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#555',
              marginBottom: '4px'
            }}>
              Type:
            </label>
            <div style={{
              padding: '6px 8px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#666'
            }}>
              {getComponentDisplayName(selectedComponent.libraryId)}
            </div>
          </div>

          {/* Reference Designator */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#555',
              marginBottom: '4px'
            }}>
              Reference Designator:
            </label>
            <input
              type="text"
              value={selectedComponent.properties.refDes}
              onChange={(e) => handleRefDesChange(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
                boxSizing: 'border-box',
                fontFamily: 'monospace'
              }}
              placeholder="Enter reference designator"
            />
          </div>

          {/* Delete Button */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleDeleteComponent}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#c82333'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#dc3545'
              }}
            >
              🗑️ Delete Component
            </button>
          </div>
        </div>
      ) : (
        <p style={{
          fontSize: '14px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Select a component to see its properties
        </p>
      )}
    </div>
  )
}

export default PropertiesPanel