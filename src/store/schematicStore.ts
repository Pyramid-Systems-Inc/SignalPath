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

export interface NetConnection {
  componentId: string
  pinId: string
}

export interface Net {
  id: string
  connections: NetConnection[]
}

export interface WiringState {
  active: boolean
  startPin: { componentId: string; pinId: string } | null
  startPos: { x: number; y: number } | null
  currentPos: { x: number; y: number } | null
}

export interface SchematicState {
  components: Component[]
  nets: Net[]
  selectedComponentId: string | null
  hoveredComponentId: string | null
  wiringState: WiringState
  addComponent: (libraryId: string, position: { x: number; y: number }) => string
  removeComponent: (id: string) => void
  deleteComponent: (id: string) => void
  updateComponent: (id: string, updates: Partial<Component>) => void
  moveComponent: (id: string, position: { x: number; y: number }) => void
  selectComponent: (id: string | null) => void
  setHoveredComponent: (id: string | null) => void
  updateComponentProperties: (id: string, newProperties: Partial<ComponentProperties>) => void
  addNet: (net: Net) => void
  removeNet: (id: string) => void
  updateNet: (id: string, updates: Partial<Net>) => void
  startWire: (componentId: string, pinId: string, startPos: { x: number; y: number }) => void
  updateWire: (newPos: { x: number; y: number }) => void
  endWire: (endPin: { componentId: string; pinId: string }) => void
  cancelWire: () => void
  isPinConnected: (componentId: string, pinId: string) => boolean
  loadProject: (jsonContent: string) => void;
}

// Zustand store
export const useSchematicStore = create<SchematicState>((set) => ({
  components: [],
  nets: [],
  selectedComponentId: null,
  hoveredComponentId: null,
  wiringState: {
    active: false,
    startPin: null,
    startPos: null,
    currentPos: null
  },
  
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

    const newComponentId = nanoid()
    const newComponent = {
      id: newComponentId,
      libraryId,
      position,
      rotation: 0,
      properties: getDefaultProperties(libraryId)
    }

    set((state) => ({
      components: [...state.components, newComponent],
      selectedComponentId: newComponentId
    }))

    return newComponentId
  },
  loadProject: (jsonContent) => {
    try {
        const loadedState = JSON.parse(jsonContent);
        if (loadedState.components && loadedState.nets) {
            set({
                components: loadedState.components,
                nets: loadedState.nets,
                // Reset other transient state
                selectedComponentId: null,
                hoveredComponentId: null,
                wiringState: { active: false, startPin: null, startPos: null, currentPos: null },
            });
        } else {
            console.error("Invalid project file format.");
        }
    } catch (error) {
        console.error("Failed to parse project file:", error);
    }
},
  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((component) => component.id !== id),
    })),

  deleteComponent: (id) =>
    set((state) => ({
      components: state.components.filter((component) => component.id !== id),
      selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
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

  // Wiring actions
  startWire: (componentId, pinId, startPos) =>
    set(() => ({
      wiringState: {
        active: true,
        startPin: { componentId, pinId },
        startPos: startPos,
        currentPos: startPos
      }
    })),

  updateWire: (newPos) =>
    set((state) => ({
      wiringState: {
        ...state.wiringState,
        currentPos: newPos
      }
    })),

  endWire: (endPin) =>
    set((state) => {
      // Only create net if we're in active wiring mode
      if (!state.wiringState.active || !state.wiringState.startPin) {
        return state;
      }

      // Prevent self-connections (same component)
      if (state.wiringState.startPin.componentId === endPin.componentId) {
        console.warn('Cannot connect pins on the same component');
        // Reset wiring state without creating a net
        return {
          wiringState: {
            active: false,
            startPin: null,
            startPos: null,
            currentPos: null
          }
        };
      }

      // Check if either pin is already connected (one wire per pin validation)
      const isStartPinConnected = state.nets.some(net =>
        net.connections.some(conn =>
          conn.componentId === state.wiringState.startPin!.componentId &&
          conn.pinId === state.wiringState.startPin!.pinId
        )
      );

      const isEndPinConnected = state.nets.some(net =>
        net.connections.some(conn =>
          conn.componentId === endPin.componentId &&
          conn.pinId === endPin.pinId
        )
      );

      if (isStartPinConnected) {
        console.warn(`Start pin ${state.wiringState.startPin.pinId} on component ${state.wiringState.startPin.componentId} is already connected`);
        // Reset wiring state without creating a net
        return {
          wiringState: {
            active: false,
            startPin: null,
            startPos: null,
            currentPos: null
          }
        };
      }

      if (isEndPinConnected) {
        console.warn(`End pin ${endPin.pinId} on component ${endPin.componentId} is already connected`);
        // Reset wiring state without creating a net
        return {
          wiringState: {
            active: false,
            startPin: null,
            startPos: null,
            currentPos: null
          }
        };
      }

      // Create new net with unique ID
      const newNet: Net = {
        id: nanoid(),
        connections: [
          state.wiringState.startPin,
          endPin
        ]
      };

      return {
        nets: [...state.nets, newNet],
        wiringState: {
          active: false,
          startPin: null,
          startPos: null,
          currentPos: null
        }
      };
    }),

  cancelWire: () =>
    set(() => ({
      wiringState: {
        active: false,
        startPin: null,
        startPos: null,
        currentPos: null
      }
    })),

  isPinConnected: (componentId, pinId) => {
    const state = useSchematicStore.getState()
    return state.nets.some(net =>
      net.connections.some(conn =>
        conn.componentId === componentId && conn.pinId === pinId
      )
    )
  },
}))