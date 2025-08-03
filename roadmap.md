# SignalPath Development Roadmap: Blazor + Tauri Edition

This roadmap outlines the development plan for the SignalPath Intercom Designer, leveraging a Blazor Hybrid frontend with a Tauri backend.

---

### **Technology Stack**

*   **UI Framework:** Blazor Hybrid with .NET 8
*   **Desktop Runtime:** Tauri
*   **Canvas Library:** HTML5 Canvas API via Blazor's JavaScript Interop.
*   **State Management:** A singleton C# service injected via Dependency Injection.
*   **File I/O:** Tauri's `fs` and `dialog` APIs, accessed from C# via JS Interop.

---

### **Stage 1: Application Layout & State Foundation**

**Goal:** Establish the main application layout and set up the core state management service.

*   **1.1: Create the Three-Panel Layout:**
    *   Modify the main Razor component to create a three-panel layout using CSS:
        *   **ComponentPalette:** A fixed-width panel on the left.
        *   **Canvas:** A flexible, central panel for the schematic.
        *   **PropertiesPanel:** A fixed-width panel on the right.
    *   Create placeholder Razor components for each panel.

*   **1.2: Initialize State Management:**
    *   Create a C# class `SchematicState.cs` to hold the application's state (components, nets, etc.).
    *   Define the core data models: `Component`, `Net`, `Pin`.
    *   Register `SchematicState` as a singleton service in `Program.cs` so it can be injected into any component.

---

### **Stage 2: Component Library & Canvas Placement**

**Goal:** Define the library of intercom components, display them in the palette, and implement drag-and-drop placement onto the canvas.

*   **2.1: Define the Component Library:**
    *   Create a `ComponentLibrary.cs` service.
    *   Define component definitions for a Resistor, Op-Amp, and Microphone, including their pins and visual properties.

*   **2.2: Implement the Component Palette:**
    *   Inject the `ComponentLibrary` into `ComponentPalette.razor`.
    *   Render the list of available components, each with an icon and name.
    *   Make each component item draggable using Blazor's built-in drag-and-drop event handlers (`@ondragstart`).

*   **2.3: Implement Drop on Canvas:**
    *   Add drop event handlers (`@ondrop`, `@ondragover`) to the `Canvas` component.
    *   When a component is dropped, capture its library ID and the drop coordinates.
    *   Add the new component instance to the `SchematicState`.

*   **2.4: Render Components on Canvas:**
    *   Create a C# wrapper for the HTML5 Canvas API using JS Interop.
    *   When the state changes, clear the canvas and redraw all components from the `SchematicState` at their specified positions.

---

### **Stage 3: Component Interaction & Wiring**

**Goal:** Implement selection, movement, deletion, and the core wiring functionality.

*   **3.1: Selection & Properties:**
    *   Implement click detection on the canvas to identify which component is selected.
    *   Update the `SchematicState` with the `SelectedComponentId`.
    *   The `PropertiesPanel` will display the details of the selected component.

*   **3.2: Drag-to-Move:**
    *   Implement drag handlers on the canvas to move the selected component.
    *   Update the component's position in the `SchematicState` at the end of the drag operation. The canvas will automatically re-render.

*   **3.3: Wiring Mode:**
    *   Implement click detection for component pins.
    *   When a pin is clicked, enter "wiring mode" in the `SchematicState`.
    *   Draw a "rubber band" line from the starting pin to the current mouse cursor position in real-time.

*   **3.4: Finalize Connections:**
    *   When a second pin is clicked while in wiring mode, create a `Net` object in the `SchematicState`.
    *   A `Net` connects two or more pins.
    *   Draw the permanent wire on the canvas. Wires must automatically update their positions when connected components are moved.

---

### **Stage 4: Analysis, File I/O, and Build**

**Goal:** Add project saving/loading and prepare the application for distribution.

*   **4.1: Project Save/Load:**
    *   Create "Save" and "Open" buttons.
    *   Use JS Interop to call Tauri's `dialog` API to show native file dialogs.
    *   For saving, serialize the `SchematicState` to a JSON string. Use Tauri's `fs` API to write the string to a file.
    *   For loading, read the JSON file using Tauri's API, deserialize it, and load the data into the `SchematicState`.

*   **4.2: Prepare for Distribution:**
    *   Configure `tauri.conf.json` with the application name, icons, and identifier.
    *   Use the `tauri build` command to produce installers for Windows, macOS, and Linux.