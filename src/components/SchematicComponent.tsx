import React from 'react';
import type { Component } from '../store/schematicStore';
import { ResistorSymbol, OpAmpSymbol, MicrophoneSymbol } from './symbols';

interface SchematicComponentProps {
  component: Component;
}

const SchematicComponent: React.FC<SchematicComponentProps> = ({ component }) => {
  const { libraryId, position, rotation } = component;

  // Switch between different symbol components based on library ID
  switch (libraryId) {
    case 'RESISTOR_GENERIC':
      return (
        <ResistorSymbol
          x={position.x}
          y={position.y}
          rotation={rotation}
        />
      );
    
    case 'OPAMP_LM386':
      return (
        <OpAmpSymbol
          x={position.x}
          y={position.y}
          rotation={rotation}
        />
      );
    
    case 'ELECTRET_MICROPHONE':
      return (
        <MicrophoneSymbol
          x={position.x}
          y={position.y}
          rotation={rotation}
        />
      );
    
    default:
      // Fallback for unknown component types
      console.warn(`Unknown component library ID: ${libraryId}`);
      return null;
  }
};

export default SchematicComponent;