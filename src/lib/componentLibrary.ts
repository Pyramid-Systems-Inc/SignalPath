/**
 * Component Library for SignalPath Intercom Designer
 * Defines the available components for circuit design
 */

export interface ComponentPin {
  id: string;
  name: string;
  position: { x: number; y: number };
}

export interface ComponentDef {
  id: string;
  name: string;
  category: string;
  symbol: string;
  pins: ComponentPin[];
}

/**
 * Component library focused on intercom system components
 */
export const componentLibrary: ComponentDef[] = [
  {
    id: 'RESISTOR_GENERIC',
    name: 'Resistor',
    category: 'Passive',
    symbol: 'resistor-symbol',
    pins: [
      { id: 'p1', name: '1', position: { x: -20, y: 0 } },
      { id: 'p2', name: '2', position: { x: 20, y: 0 } }
    ]
  },
  {
    id: 'OPAMP_LM386',
    name: 'Op-Amp (LM386)',
    category: 'Active',
    symbol: 'opamp-symbol',
    pins: [
      { id: 'in_pos', name: 'IN+', position: { x: -30, y: -8 } },
      { id: 'in_neg', name: 'IN-', position: { x: -30, y: 8 } },
      { id: 'vcc', name: 'V+', position: { x: 0, y: -20 } },
      { id: 'vss', name: 'V-', position: { x: 0, y: 20 } },
      { id: 'out', name: 'OUT', position: { x: 30, y: 0 } }
    ]
  },
  {
    id: 'ELECTRET_MICROPHONE',
    name: 'Electret Microphone',
    category: 'Input',
    symbol: 'microphone-symbol',
    pins: [
      { id: 'pos', name: '+', position: { x: 0, y: -22 } },
      { id: 'neg', name: '-', position: { x: 0, y: 22 } }
    ]
  }
];