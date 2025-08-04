# SignalPath Development Roadmap: Blazor + Tauri Edition

This roadmap outlines the development plan for the SignalPath Intercom Designer, leveraging a Blazor WebAssembly frontend with a Tauri backend.

---

### **Technology Stack**

*   **UI Framework:** Blazor WebAssembly with .NET 8
*   **Desktop Runtime:** Tauri
*   **Canvas Library:** HTML5 Canvas API via Blazor's JavaScript Interop.
*   **State Management:** A singleton C# service injected via Dependency Injection.
*   **File I/O:** Tauri's `fs` and `dialog` APIs, accessed from C# via JS Interop.

---

### **Stage 1: Application Layout & State Foundation** ✅ **COMPLETED**

**Goal:** Establish the main application layout and set up the core state management service.

*   **1.1: Create the Three-Panel Layout:** ✅
    *   ✅ Created MainLayout.razor with a three-panel layout using CSS:
        *   ✅ **ComponentPalette:** A fixed-width panel on the left.
        *   ✅ **Canvas:** A flexible, central panel for the schematic.
        *   ✅ **PropertiesPanel:** A fixed-width panel on the right.
    *   ✅ Added toolbar with action buttons at the top.
    *   ✅ Added status bar at the bottom for application feedback.
    *   ✅ Implemented responsive design and dark mode support.

*   **1.2: Initialize State Management:** ✅
    *   ✅ Created a C# class `SchematicState.cs` to hold the application's state (components, nets, etc.).
    *   ✅ Defined the core data models: `Component`, `Net`, `Pin`, `WireSegment`.
    *   ✅ Created additional data models in the Models folder for project management and application settings.
    *   ✅ Registered `SchematicState` as a singleton service in `Program.cs` so it can be injected into any component.
    *   ✅ Implemented `INotifyPropertyChanged` for reactive UI updates.

*   **1.3: Set Up Dependency Injection:** ✅
    *   ✅ Updated `Program.cs` to register SignalPath services as singletons.
    *   ✅ Registered `ComponentLibrary` service for component definitions and management.
    *   ✅ Registered `SchematicState` service for application state management.

*   **1.4: Create Home Page:** ✅
    *   ✅ Updated `Home.razor` to serve as a welcoming home page with quick actions and recent projects section.
    *   ✅ Added action buttons for New Schematic, Open Schematic, and Getting Started.
    *   ✅ Implemented recent projects section with project list.

---

### **Stage 2: Component Library & Canvas Placement** 🔄 **IN PROGRESS**

**Goal:** Define the library of intercom components, display them in the palette, and implement drag-and-drop placement onto the canvas.

*   **2.1: Define the Component Library:** ✅
    *   ✅ Created a `ComponentLibrary.cs` service.
    *   ✅ Defined component definitions for a Resistor, Op-Amp, and Microphone, including their pins and visual properties.
    *   ✅ Implemented `ComponentDefinition` and `PinDefinition` classes.

*   **2.2: Implement the Component Palette:**
    *   [ ] Inject the `ComponentLibrary` into `ComponentPalette.razor`.
    *   [ ] Render the list of available components, each with an icon and name.
    *   [ ] Make each component item draggable using Blazor's built-in drag-and-drop event handlers (`@ondragstart`).

*   **2.3: Implement Drop on Canvas:**
    *   [ ] Add drop event handlers (`@ondrop`, `@ondragover`) to the `Canvas` component.
    *   [ ] When a component is dropped, capture its library ID and the drop coordinates.
    *   [ ] Add the new component instance to the `SchematicState`.

*   **2.4: Render Components on Canvas:**
    *   [ ] Create a C# wrapper for the HTML5 Canvas API using JS Interop.
    *   [ ] When the state changes, clear the canvas and redraw all components from the `SchematicState` at their specified positions.
    *   [ ] Implement zoom and pan functionality for the canvas.

---

### **Stage 3: Component Interaction & Wiring**

**Goal:** Implement selection, movement, deletion, and the core wiring functionality.

*   **3.1: Selection & Properties:**
    *   [ ] Implement click detection on the canvas to identify which component is selected.
    *   [ ] Update the `SchematicState` with the `SelectedComponentId`.
    *   [ ] The `PropertiesPanel` will display the details of the selected component.
    *   [ ] Implement visual highlighting for selected components.

*   **3.2: Drag-to-Move:**
    *   [ ] Implement drag handlers on the canvas to move the selected component.
    *   [ ] Update the component's position in the `SchematicState` at the end of the drag operation.
    *   [ ] The canvas will automatically re-render.
    *   [ ] Implement grid-snapped movement for precise positioning.

*   **3.3: Wiring Mode:**
    *   [ ] Implement click detection for component pins.
    *   [ ] When a pin is clicked, enter "wiring mode" in the `SchematicState`.
    *   [ ] Draw a "rubber band" line from the starting pin to the current mouse cursor position in real-time.

*   **3.4: Finalize Connections:**
    *   [ ] When a second pin is clicked while in wiring mode, create a `Net` object in the `SchematicState`.
    *   [ ] A `Net` connects two or more pins.
    *   [ ] Draw the permanent wire on the canvas.
    *   [ ] Wires must automatically update their positions when connected components are moved.

*   **3.5: Advanced Wire Routing:**
    *   [ ] Implement Manhattan routing algorithms with component boundary avoidance.
    *   [ ] Add 15px clearance between wires and components.
    *   [ ] Optimize wire paths for minimal crossings and clean appearance.

---

### **Stage 4: Analysis, File I/O, and Build**

**Goal:** Add project saving/loading and prepare the application for distribution.

*   **4.1: Project Save/Load:**
    *   [ ] Create "Save" and "Open" buttons in the toolbar.
    *   [ ] Use JS Interop to call Tauri's `dialog` API to show native file dialogs.
    *   [ ] For saving, serialize the `SchematicState` to a JSON string. Use Tauri's `fs` API to write the string to a file.
    *   [ ] For loading, read the JSON file using Tauri's API, deserialize it, and load the data into the `SchematicState`.

*   **4.2: Undo/Redo System:**
    *   [ ] Implement undo/redo functionality using command pattern.
    *   [ ] Add keyboard shortcuts for undo (Ctrl+Z) and redo (Ctrl+Y).
    *   [ ] Update toolbar buttons to reflect undo/redo availability.

*   **4.3: Prepare for Distribution:**
    *   [ ] Configure `tauri.conf.json` with the application name, icons, and identifier.
    *   [ ] Use the `tauri build` command to produce installers for Windows, macOS, and Linux.
    *   [ ] Set up CI/CD pipeline for automated builds and releases.

---

## Progress Overview

### Completed Work ✅

- ✅ **Phase 1 Complete** - Professional application layout with three-panel design
- ✅ **Modern Architecture** - Blazor WebAssembly + .NET 8 + Tauri technology stack
- ✅ **State Management** - C# singleton service with reactive updates
- ✅ **Data Models** - Comprehensive models for components, pins, nets, and schematic elements
- ✅ **Dependency Injection** - Proper .NET service registration and injection
- ✅ **Component Library Foundation** - Service with component definitions for resistor, op-amp, and microphone
- ✅ **Professional UI** - Toolbar, status bar, and responsive design with dark mode support
- ✅ **Home Page** - Welcome screen with quick actions and recent projects section

### Current Work 🔄

- 🔄 **Stage 2 In Progress** - Component library and canvas placement functionality
- 🔄 **Component Palette Implementation** - Rendering components with drag-and-drop capability
- 🔄 **Canvas Integration** - HTML5 Canvas wrapper with component rendering

### Future Work 📋

- 📋 **Canvas Interaction** - Component selection, movement, and deletion
- 📋 **Wiring System** - Pin-to-pin connections with Manhattan routing
- 📋 **Advanced Features** - Undo/redo, project save/load, and export capabilities
- 📋 **Distribution** - Cross-platform installers and CI/CD pipeline

## Technical Implementation Notes

### Key Design Decisions

- **Blazor WebAssembly over Blazor Hybrid**: Chosen for better compatibility with existing web technologies while maintaining desktop capabilities through Tauri.
- **C# Singleton State Management**: Provides strong typing and better performance than JavaScript-based solutions.
- **HTML5 Canvas via JS Interop**: Offers full control over rendering performance while maintaining cross-platform compatibility.
- **Tauri for Desktop**: Provides lightweight, secure desktop applications with small binary size compared to Electron.

### Architecture Benefits

- **Performance**: Blazor WebAssembly provides near-native performance with .NET's optimized runtime.
- **Security**: Tauri's security model ensures safe API access and context isolation.
- **Maintainability**: Strong typing with C# reduces runtime errors and improves code maintainability.
- **Cross-Platform**: Single codebase compiles to native applications on Windows, macOS, and Linux.
- **Developer Experience**: Hot reload during development and comprehensive tooling support.

### Challenges and Solutions

- **Canvas Integration**: Solved by creating a JS Interop wrapper for HTML5 Canvas API.
- **State Management**: Addressed with C# singleton service implementing INotifyPropertyChanged for reactive updates.
- **Component Architecture**: Designed with modularity in mind, allowing for easy extension and maintenance.
- **Cross-Platform Consistency**: Tauri ensures consistent behavior across all supported platforms.