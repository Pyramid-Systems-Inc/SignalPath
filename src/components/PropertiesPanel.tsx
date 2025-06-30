import React from 'react'
import { useSchematicStore } from '../store/schematicStore'
import { componentLibrary } from '../lib/componentLibrary'

const PropertiesPanel: React.FC = () => {
  const { selectedComponentId, components, nets, updateComponentProperties, deleteComponent } = useSchematicStore()

  // Find the selected component
  const selectedComponent = selectedComponentId
    ? components.find(component => component.id === selectedComponentId)
    : null

  // Get component display name from library
  const getComponentDisplayName = (libraryId: string): string => {
    const componentDef = componentLibrary.find(comp => comp.id === libraryId)
    return componentDef ? componentDef.name : libraryId
  }

  // Get pin connection information for a component
  const getPinConnections = (componentId: string) => {
    if (!selectedComponent) return []

    const componentDef = componentLibrary.find(comp => comp.id === selectedComponent.libraryId)
    if (!componentDef) return []

    return componentDef.pins.map(pin => {
      // Find if this pin is connected
      const connectedNet = nets.find(net =>
        net.connections.some(conn =>
          conn.componentId === componentId && conn.pinId === pin.id
        )
      )

      if (connectedNet) {
        // Find the other connection in this net
        const otherConnection = connectedNet.connections.find(conn =>
          !(conn.componentId === componentId && conn.pinId === pin.id)
        )

        if (otherConnection) {
          const otherComponent = components.find(comp => comp.id === otherConnection.componentId)
          const otherComponentDef = componentLibrary.find(comp => comp.id === otherComponent?.libraryId)
          const otherPin = otherComponentDef?.pins.find(p => p.id === otherConnection.pinId)

          return {
            pin,
            isConnected: true,
            netId: connectedNet.id,
            connectedTo: {
              componentId: otherConnection.componentId,
              componentName: otherComponent?.properties.refDes || 'Unknown',
              pinName: otherPin?.name || otherConnection.pinId
            }
          }
        }
      }

      return {
        pin,
        isConnected: false,
        netId: null,
        connectedTo: null
      }
    })
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

          {/* Connections Section */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#555',
              marginBottom: '8px'
            }}>
              Pin Connections:
            </label>
            <div style={{
              backgroundColor: '#f8f8f8',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '8px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {getPinConnections(selectedComponent.id).map((pinInfo, index) => (
                <div key={pinInfo.pin.id} style={{
                  marginBottom: index < getPinConnections(selectedComponent.id).length - 1 ? '8px' : '0',
                  padding: '6px',
                  backgroundColor: pinInfo.isConnected ? '#e8f5e8' : '#fff3cd',
                  border: `1px solid ${pinInfo.isConnected ? '#c3e6c3' : '#ffeaa7'}`,
                  borderRadius: '3px',
                  fontSize: '11px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                    Pin {pinInfo.pin.name} ({pinInfo.pin.id})
                  </div>
                  {pinInfo.isConnected ? (
                    <div>
                      <div style={{ color: '#28a745' }}>✓ Connected</div>
                      <div style={{ color: '#666', fontSize: '10px' }}>
                        To: {pinInfo.connectedTo?.componentName}.{pinInfo.connectedTo?.pinName}
                      </div>
                      <div style={{ color: '#666', fontSize: '10px', fontFamily: 'monospace' }}>
                        Net: {pinInfo.netId?.substring(0, 8)}...
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#856404' }}>○ Unconnected</div>
                  )}
                </div>
              ))}
              {getPinConnections(selectedComponent.id).length === 0 && (
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  padding: '8px'
                }}>
                  No pins defined for this component
                </div>
              )}
            </div>
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