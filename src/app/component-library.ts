export interface ComponentDef {
  id: string;
  name: string;
  category: string;
  iconUrl: string;
}

export const COMPONENT_LIBRARY: ComponentDef[] = [
  {
    id: 'RESISTOR_GENERIC',
    name: 'Resistor',
    category: 'Passives',
    iconUrl: 'icons/resistor.svg',
  },
  {
    id: 'OPAMP_LM386',
    name: 'Op-Amp (LM386)',
    category: 'ICs',
    iconUrl: 'icons/opamp.svg',
  },
  {
    id: 'MIC_ELECTRET',
    name: 'Electret Microphone',
    category: 'Transducers',
    iconUrl: 'icons/microphone.svg',
  },
];