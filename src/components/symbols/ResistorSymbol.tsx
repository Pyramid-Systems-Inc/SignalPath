import React from 'react';
import { Group, Rect, Line, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useSchematicStore } from '../../store/schematicStore';
import { componentLibrary } from '../../lib/componentLibrary';

interface ResistorSymbolProps {
  id: string;
  libraryId: string;
  componentPosition: { x: number; y: number };
  x: number;
  y: number;
  rotation: number;
}

const ResistorSymbol: React.FC<ResistorSymbolProps> = ({ id, libraryId, componentPosition, x, y, rotation }) => {
  const selectComponent = useSchematicStore((state) => state.selectComponent);
  const startWire = useSchematicStore((state) => state.startWire);
  const endWire = useSchematicStore((state) => state.endWire);
  const wiringState = useSchematicStore((state) => state.wiringState);

  // Get component definition to access pins
  const componentDef = componentLibrary.find(comp => comp.id === libraryId);
  const pins = componentDef?.pins || [];

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent event propagation to canvas
    selectComponent(id);
  };

  const handlePinClick = (e: KonvaEventObject<MouseEvent>, pinId: string) => {
    e.cancelBubble = true; // Prevent event propagation

    // Find the pin definition to get its position
    const pin = pins.find(p => p.id === pinId);
    if (!pin) return;

    // Calculate absolute position of the pin on the stage
    const absolutePosition = {
      x: componentPosition.x + pin.position.x,
      y: componentPosition.y + pin.position.y
    };

    if (wiringState.active) {
      // We're in wiring mode, so this click should end the wire
      console.log(`Ending wire at pin: ${pinId} on component ${id}`);
      endWire({ componentId: id, pinId });
    } else {
      // Start a new wire
      console.log(`Starting wire from pin: ${pinId} on component ${id} at position:`, absolutePosition);
      startWire(id, pinId, absolutePosition);
    }
  };

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Left connection line */}
      <Line
        points={[-20, 0, -10, 0]}
        stroke="#000000"
        strokeWidth={2}
      />
      
      {/* Resistor body (rectangle) */}
      <Rect
        x={-10}
        y={-5}
        width={20}
        height={10}
        stroke="#000000"
        strokeWidth={2}
        fill="none"
      />
      
      {/* Right connection line */}
      <Line
        points={[10, 0, 20, 0]}
        stroke="#000000"
        strokeWidth={2}
      />

      {/* Render pins */}
      {pins.map((pin) => (
        <Group key={pin.id}>
          {/* Pin clickable area */}
          <Rect
            x={pin.position.x - 3}
            y={pin.position.y - 3}
            width={6}
            height={6}
            fill="#ff6b6b"
            stroke="#d63031"
            strokeWidth={1}
            cornerRadius={1}
            onClick={(e) => handlePinClick(e, pin.id)}
            onTap={(e) => handlePinClick(e, pin.id)}
          />

          {/* Pin label */}
          <Text
            x={pin.position.x}
            y={pin.position.y - 15}
            text={pin.name}
            fontSize={8}
            fill="#2d3436"
            fontFamily="Arial"
            align="center"
            offsetX={4} // Center the text horizontally
          />
        </Group>
      ))}
    </Group>
  );
};

export default ResistorSymbol;