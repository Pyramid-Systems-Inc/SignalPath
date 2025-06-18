import { create } from 'zustand'
import { nanoid } from 'nanoid'

// TypeScript interfaces
export interface ComponentProperties {
  refDes: string
  [key: string]: string | number | boolean
}

export interface Component {
  id: string
  libraryId: string
  position: { x: number; y: number }
  rotation: number
  properties: ComponentProperties
}

export interface Net {
  id: string
  componentIds: string[]
  points: { x: number; y: number }[]
}

export interface SchematicState {
  components: Component[]
  nets: Net[]
  selectedComponentId: string | null
  hoveredComponentId: string | null
  addComponent: (libraryId: string, position: { x: number; y: number }) => void
  removeComponent: (id: string) => void
  updateComponent: (id: string, updates: Partial<Component>) => void
  moveComponent: (id: string, position: { x: number; y: number }) => void
  selectComponent: (id: string | null) => void
  setHoveredComponent: (id: string | null) => void
  updateComponentProperties: (id: string, newProperties: Partial<ComponentProperties>) => void
  addNet: (net: Net) => void
  removeNet: (id: string) => void
  updateNet: (id: string, updates: Partial<Net>) => void
}

// Zustand store
export const useSchematicStore = create<SchematicState>((set) => ({
  components: [],
  nets: [],
  selectedComponentId: null,
  hoveredComponentId: null,
  
  addComponent: (libraryId, position) => {
    // Define default properties based on component type
    const getDefaultProperties = (libraryId: string) => {
      switch (libraryId) {
        case 'RESISTOR_GENERIC':
          return { refDes: 'R?' }
        case 'OPAMP_LM386':
          return { refDes: 'U?' }
        case 'ELECTRET_MICROPHONE':
          return { refDes: 'MIC?' }
        default:
          return { refDes: 'X?' }
      }
    }

    set((state) => ({
      components: [...state.components, {
        id: nanoid(),
        libraryId,
        position,
        rotation: 0,
        properties: getDefaultProperties(libraryId)
      }],
    }))
  },
  
  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((component) => component.id !== id),
    })),
  
  updateComponent: (id, updates) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id ? { ...component, ...updates } : component
      ),
    })),
  
  moveComponent: (id, position) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id ? { ...component, position } : component
      ),
    })),

  selectComponent: (id) =>
    set(() => ({
      selectedComponentId: id,
    })),

  setHoveredComponent: (id) =>
    set(() => ({
      hoveredComponentId: id,
    })),

  updateComponentProperties: (id, newProperties) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id
          ? { ...component, properties: { ...component.properties, ...newProperties } as ComponentProperties }
          : component
      ),
    })),
  
  addNet: (net) =>
    set((state) => ({
      nets: [...state.nets, net],
    })),
  
  removeNet: (id) =>
    set((state) => ({
      nets: state.nets.filter((net) => net.id !== id),
    })),
  
  updateNet: (id, updates) =>
    set((state) => ({
      nets: state.nets.map((net) =>
        net.id === id ? { ...net, ...updates } : net
      ),
    })),
}))