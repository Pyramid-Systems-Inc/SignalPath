/**
 * Component Library for SignalPath Intercom Designer
 * Defines the available components for circuit design
 */

export interface ComponentDef {
  id: string;
  name: string;
  category: string;
  symbol: string;
}

/**
 * Component library focused on intercom system components
 */
export const componentLibrary: ComponentDef[] = [
  {
    id: 'RESISTOR_GENERIC',
    name: 'Resistor',
    category: 'Passive',
    symbol: 'resistor-symbol'
  },
  {
    id: 'OPAMP_LM386',
    name: 'Op-Amp (LM386)',
    category: 'Active',
    symbol: 'opamp-symbol'
  },
  {
    id: 'ELECTRET_MICROPHONE',
    name: 'Electret Microphone',
    category: 'Input',
    symbol: 'microphone-symbol'
  }
];