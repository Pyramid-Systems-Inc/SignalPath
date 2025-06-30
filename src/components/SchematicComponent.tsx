import React from 'react';
import { Group, Rect } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Component } from '../store/schematicStore';
import { useSchematicStore } from '../store/schematicStore';
import { ResistorSymbol, OpAmpSymbol, MicrophoneSymbol } from './symbols';

interface SchematicComponentProps {
  component: Component;
}

const SchematicComponent: React.FC<SchematicComponentProps> = ({ component }) => {
  const { id, libraryId, position, rotation } = component;
  const selectedComponentId = useSchematicStore((state) => state.selectedComponentId);
  const hoveredComponentId = useSchematicStore((state) => state.hoveredComponentId);
  const moveComponent = useSchematicStore((state) => state.moveComponent);
  const setHoveredComponent = useSchematicStore((state) => state.setHoveredComponent);
  const isSelected = selectedComponentId === id;
  const isHovered = hoveredComponentId === id;

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    // Prevent event propagation to stop canvas from dragging
    e.cancelBubble = true;
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    // Prevent event propagation during drag to stop canvas from dragging
    e.cancelBubble = true;

    // Update component position in real-time during drag for wire updates
    const position = e.target.position();
    moveComponent(id, { x: position.x, y: position.y });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    // Prevent event propagation
    e.cancelBubble = true;
    
    const position = e.target.position();
    // Grid snapping with 10px grid
    const snappedX = Math.round(position.x / 10) * 10;
    const snappedY = Math.round(position.y / 10) * 10;
    moveComponent(id, { x: snappedX, y: snappedY });
  };

  const handleMouseEnter = () => {
    setHoveredComponent(id);
  };

  const handleMouseLeave = () => {
    setHoveredComponent(null);
  };

  // Get symbol dimensions for selection highlighting
  const getSymbolBounds = (libraryId: string) => {
    switch (libraryId) {
      case 'RESISTOR_GENERIC':
        return { width: 44, height: 16, offsetX: -22, offsetY: -8 };
      case 'OPAMP_LM386':
        return { width: 64, height: 34, offsetX: -32, offsetY: -17 };
      case 'ELECTRET_MICROPHONE':
        return { width: 28, height: 48, offsetX: -14, offsetY: -24 };
      default:
        return { width: 44, height: 16, offsetX: -22, offsetY: -8 };
    }
  };

  const bounds = getSymbolBounds(libraryId);

  // Render the symbol component based on library ID
  const renderSymbol = () => {
    switch (libraryId) {
      case 'RESISTOR_GENERIC':
        return (
          <ResistorSymbol
            id={id}
            libraryId={libraryId}
            componentPosition={position}
            x={0}
            y={0}
            rotation={0}
          />
        );

      case 'OPAMP_LM386':
        return (
          <OpAmpSymbol
            id={id}
            libraryId={libraryId}
            componentPosition={position}
            x={0}
            y={0}
            rotation={0}
          />
        );

      case 'ELECTRET_MICROPHONE':
        return (
          <MicrophoneSymbol
            id={id}
            libraryId={libraryId}
            componentPosition={position}
            x={0}
            y={0}
            rotation={0}
          />
        );
      
      default:
        // Fallback for unknown component types
        console.warn(`Unknown component library ID: ${libraryId}`);
        return null;
    }
  };

  return (
    <Group
      x={position.x}
      y={position.y}
      rotation={rotation}
      draggable={true}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Selection highlight - render behind the symbol */}
      {isSelected && (
        <Rect
          x={bounds.offsetX - 2}
          y={bounds.offsetY - 2}
          width={bounds.width + 4}
          height={bounds.height + 4}
          fill="rgba(0, 123, 255, 0.2)"
          stroke="#007bff"
          strokeWidth={2}
          cornerRadius={2}
        />
      )}

      {/* Hover highlight - render behind the symbol but above selection */}
      {isHovered && !isSelected && (
        <Rect
          x={bounds.offsetX - 1}
          y={bounds.offsetY - 1}
          width={bounds.width + 2}
          height={bounds.height + 2}
          fill="rgba(0, 123, 255, 0.1)"
          stroke="#007bff"
          strokeWidth={1}
          cornerRadius={2}
          opacity={0.8}
        />
      )}
      
      {/* Render the symbol */}
      {renderSymbol()}
    </Group>
  );
};

export default SchematicComponent;