import React from 'react';
import { Group, Line, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useSchematicStore } from '../../store/schematicStore';

interface OpAmpSymbolProps {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

const OpAmpSymbol: React.FC<OpAmpSymbolProps> = ({ id, x, y, rotation }) => {
  const selectComponent = useSchematicStore((state) => state.selectComponent);

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent event propagation to canvas
    selectComponent(id);
  };

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Triangle body of op-amp */}
      <Line
        points={[-20, -15, -20, 15, 20, 0, -20, -15]}
        stroke="#000000"
        strokeWidth={2}
        fill="none"
        closed={true}
      />
      
      {/* Positive input line */}
      <Line
        points={[-30, -8, -20, -8]}
        stroke="#000000"
        strokeWidth={2}
      />
      
      {/* Negative input line */}
      <Line
        points={[-30, 8, -20, 8]}
        stroke="#000000"
        strokeWidth={2}
      />
      
      {/* Output line */}
      <Line
        points={[20, 0, 30, 0]}
        stroke="#000000"
        strokeWidth={2}
      />
      
      {/* Plus symbol for positive input */}
      <Text
        x={-18}
        y={-12}
        text="+"
        fontSize={10}
        fill="#000000"
        fontFamily="Arial"
      />
      
      {/* Minus symbol for negative input */}
      <Text
        x={-18}
        y={4}
        text="−"
        fontSize={10}
        fill="#000000"
        fontFamily="Arial"
      />
    </Group>
  );
};

export default OpAmpSymbol;