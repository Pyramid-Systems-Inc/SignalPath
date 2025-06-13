import React from 'react';
import { Group, Circle, Line } from 'react-konva';

interface MicrophoneSymbolProps {
  x: number;
  y: number;
  rotation: number;
}

const MicrophoneSymbol: React.FC<MicrophoneSymbolProps> = ({ x, y, rotation }) => {
  return (
    <Group x={x} y={y} rotation={rotation}>
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
    </Group>
  );
};

export default MicrophoneSymbol;