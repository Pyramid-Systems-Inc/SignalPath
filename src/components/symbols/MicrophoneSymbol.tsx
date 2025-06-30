import React from 'react';
import { Group, Circle, Line, Rect, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useSchematicStore } from '../../store/schematicStore';
import { componentLibrary } from '../../lib/componentLibrary';

interface MicrophoneSymbolProps {
  id: string;
  libraryId: string;
  componentPosition: { x: number; y: number };
  x: number;
  y: number;
  rotation: number;
}

const MicrophoneSymbol: React.FC<MicrophoneSymbolProps> = ({ id, libraryId, componentPosition, x, y, rotation }) => {
  const selectComponent = useSchematicStore((state) => state.selectComponent);
  const startWire = useSchematicStore((state) => state.startWire);

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

    console.log(`Pin clicked: ${pinId} on component ${id} at position:`, absolutePosition);
    startWire(id, pinId, absolutePosition);
  };

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Microphone capsule (circle) */}
      <Circle
        x={0}
        y={0}
        radius={12}
        stroke="#000000"
        strokeWidth={2}
        fill="none"
      />
      
      {/* Inner circle to represent capsule detail */}
      <Circle
        x={0}
        y={0}
        radius={8}
        stroke="#000000"
        strokeWidth={1}
        fill="none"
      />
      
      {/* Positive terminal line */}
      <Line
        points={[0, -12, 0, -22]}
        stroke="#000000"
        strokeWidth={2}
      />
      
      {/* Negative terminal line */}
      <Line
        points={[0, 12, 0, 22]}
        stroke="#000000"
        strokeWidth={2}
      />
      
      {/* Plus symbol for positive terminal */}
      <Line
        points={[-3, -18, 3, -18]}
        stroke="#000000"
        strokeWidth={1}
      />
      <Line
        points={[0, -21, 0, -15]}
        stroke="#000000"
        strokeWidth={1}
      />
      
      {/* Minus symbol for negative terminal */}
      <Line
        points={[-3, 18, 3, 18]}
        stroke="#000000"
        strokeWidth={1}
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
            x={pin.position.x + 8}
            y={pin.position.y - 4}
            text={pin.name}
            fontSize={8}
            fill="#2d3436"
            fontFamily="Arial"
            align="left"
          />
        </Group>
      ))}
    </Group>
  );
};

export default MicrophoneSymbol;