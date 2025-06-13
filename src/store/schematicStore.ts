import { create } from 'zustand'
import { nanoid } from 'nanoid'

// TypeScript interfaces
export interface Component {
  id: string
  libraryId: string
  position: { x: number; y: number }
  rotation: number
}

export interface Net {
  id: string
  componentIds: string[]
  points: { x: number; y: number }[]
}

export interface SchematicState {
  components: Component[]
  nets: Net[]
  addComponent: (libraryId: string, position: { x: number; y: number }) => void
  removeComponent: (id: string) => void
  updateComponent: (id: string, updates: Partial<Component>) => void
  addNet: (net: Net) => void
  removeNet: (id: string) => void
  updateNet: (id: string, updates: Partial<Net>) => void
}

// Zustand store
export const useSchematicStore = create<SchematicState>((set) => ({
  components: [],
  nets: [],
  
  addComponent: (libraryId, position) =>
    set((state) => ({
      components: [...state.components, {
        id: nanoid(),
        libraryId,
        position,
        rotation: 0
      }],
    })),
  
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