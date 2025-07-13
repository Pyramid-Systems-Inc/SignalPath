# SignalPath Intercom Designer

<div align="center">

![SignalPath Logo](build/icon.svg)

**A professional intercom system designer and schematic editor for signal path visualization**

[![Version](https://img.shields.io/github/v/release/OmarAglan/SignalPath?style=flat-square)](https://github.com/OmarAglan/SignalPath/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/OmarAglan/SignalPath/build-and-release.yml?style=flat-square)](https://github.com/OmarAglan/SignalPath/actions)
[![License](https://img.shields.io/github/license/OmarAglan/SignalPath?style=flat-square)](LICENSE)
[![Downloads](https://img.shields.io/github/downloads/OmarAglan/SignalPath/total?style=flat-square)](https://github.com/OmarAglan/SignalPath/releases)

[Download Latest Release](https://github.com/OmarAglan/SignalPath/releases) • [Documentation](docs/) • [Changelog](CHANGELOG.md)

</div>

## ✨ Features

SignalPath Intercom Designer is a modern, cross-platform desktop application built for professional intercom system design and signal path visualization. The application combines an intuitive interface with powerful functionality to streamline your workflow.

### 🎯 Core Capabilities

- **Professional Wiring System** - Complete wire drawing workflow with click-to-start, drag-to-route, click-to-finish functionality
- **Advanced Wire Routing** - Intelligent Manhattan routing with component boundary avoidance and 15px clearance
- **Pin Connection Management** - Visual pin indicators with click handlers and one-wire-per-pin validation
- **Real-time Connection Status** - Live properties panel showing pin connections, net IDs, and connected components
- **Rubber Band Wire Feedback** - Real-time visual wire preview following cursor during drawing
- **Component Avoidance Routing** - Sophisticated algorithms that route wires around component boundaries
- **Interactive Component Palette** - Comprehensive library of intercom system components with drag-and-drop functionality
- **Visual Canvas Editor** - Zoomable/pannable schematic design canvas with real-time feedback and component placement
- **Complete Component Interaction** - Professional selection, drag-to-move, properties editing, and deletion workflows
- **Component Lifecycle Management** - Full Place → Select → Move → Edit → Delete → Wire functionality with visual feedback
- **Enhanced Properties Panel** - Dynamic component and connection information with form-based editing and real-time updates
- **Professional Selection System** - Click-based component selection with visual highlighting and state management
- **Grid-Snapped Movement** - Smooth drag-to-move functionality with grid alignment and precise positioning
- **Multiple Deletion Methods** - Keyboard shortcuts (Delete/Backspace) and visual delete buttons for component removal
- **Schematic Symbol Rendering** - Professional react-konva powered symbols with clickable pins for wire connections
- **Net Management System** - Complete electrical connectivity tracking with unique net IDs and connection arrays
- **State Management** - Real-time component and wiring state tracking with persistent schematic data using Zustand
- **Interactive Design Surface** - Pan, zoom, and grid functionality for precise component positioning and wire routing

### 🛠️ Technical Highlights

- **Modern Architecture** - Built with Electron, React 19, and TypeScript
- **Advanced Wiring Engine** - Professional wire routing with component avoidance and Manhattan routing algorithms
- **Interactive Canvas** - React-Konva powered zoomable/pannable design surface with real-time wire rendering
- **Component Pin System** - TypeScript-based component definitions with clickable pin interfaces and position mapping
- **Net Management** - Complete electrical connectivity tracking with validation and real-time connection status
- **State Management** - Zustand for efficient application and wiring state handling with TypeScript integration
- **Professional Wire Routing** - Intelligent path planning with component boundary detection and clearance management
- **Real-time Validation** - One-wire-per-pin enforcement with visual feedback and connection status tracking
- **Cross-Platform** - Native desktop application for Windows, macOS, and Linux
- **Professional Packaging** - Code-signed installers with custom branding
- **Automated Updates** - Semantic versioning with automated release pipeline

## 💻 Installation

### Download Pre-built Applications

Download the latest version for your operating system from the [releases page](https://github.com/OmarAglan/SignalPath/releases):

| Platform | Download | Architecture |
|----------|----------|--------------|
| **Windows** | [NSIS Installer](https://github.com/OmarAglan/SignalPath/releases) | x64, x86 |
| **macOS** | [DMG Package](https://github.com/OmarAglan/SignalPath/releases) | Intel, Apple Silicon |
| **Linux** | [AppImage](https://github.com/OmarAglan/SignalPath/releases) / [DEB Package](https://github.com/OmarAglan/SignalPath/releases) | x64 |

### System Requirements

#### Windows

- Windows 10 or later
- 2GB RAM minimum
- 500MB disk space

#### macOS  

- macOS 10.15 (Catalina) or later
- 2GB RAM minimum
- 500MB disk space

#### Linux

- Ubuntu 18.04+ / Debian 10+ / Fedora 32+
- 2GB RAM minimum
- 500MB disk space

## 🏗️ Development

### Prerequisites

- **Node.js** 18.0 or later
- **npm** 8.0 or later
- **Git** for version control

### Quick Start

```bash
# Clone the repository
git clone https://github.com/OmarAglan/SignalPath.git
cd SignalPath

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run preview      # Preview production build

# Building
npm run build        # Build for production
npm run build:package # Build and create installers

# Quality Assurance
npm run lint         # Run ESLint
npm test            # Run test suite

# Distribution
npm run electron:pack # Package without creating installers
npm run electron:dist # Create distribution packages
```

### Project Structure

```
SignalPath/
├── src/                    # React application source
│   ├── components/         # React components
│   │   ├── Canvas.tsx     # Main design canvas with wire rendering
│   │   ├── ComponentPalette.tsx # Component library with drag-and-drop
│   │   ├── PropertiesPanel.tsx  # Properties and connection status panel
│   │   └── symbols/       # Component symbol definitions
│   │       ├── ResistorSymbol.tsx    # Resistor schematic symbol with pins
│   │       ├── OpAmpSymbol.tsx       # Op-amp symbol with pin handlers
│   │       └── MicrophoneSymbol.tsx  # Microphone symbol with connections
│   ├── lib/               # Library definitions
│   │   └── componentLibrary.ts # Component and pin definitions
│   ├── store/             # Zustand state management
│   │   └── schematicStore.ts # Application state with wiring support
│   └── App.tsx            # Main application component
├── electron/              # Electron main process
│   ├── main.ts           # Main process entry point
│   └── preload.ts        # Preload scripts for security
├── public/               # Static assets
│   └── icons/           # Component SVG icons
├── build/                # Application assets and icons
├── docs/                 # Comprehensive documentation
├── .github/workflows/    # CI/CD automation
└── release/             # Build output directory
```

## 🏛️ Architecture

### Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Desktop Runtime**: Electron 36
- **Canvas Rendering**: React-Konva 19 with Konva 9.3 for high-performance graphics
- **State Management**: Zustand 5.0 for application and wiring state
- **Wire Routing**: Custom algorithms with component avoidance and Manhattan routing
- **Build System**: Electron-Vite 3.1 for fast development and hot reload
- **Package Builder**: Electron-Builder 26 for cross-platform distribution
- **Development Tools**: ESLint 9, TypeScript 5.8, Vite 6.3

### Key Design Decisions

- **TypeScript First** - Strong typing throughout the application including wiring interfaces
- **Component Architecture** - Modular, reusable React components with pin-based interaction
- **Professional Wire Routing** - Manhattan routing algorithms with component avoidance
- **Real-time State Management** - Zustand for efficient wiring and component state handling
- **Canvas-Based Rendering** - React-Konva for high-performance schematic visualization
- **Pin-Centric Design** - Component pins as first-class citizens for electrical connections
- **Electron Security** - Context isolation and preload scripts
- **Modern Tooling** - Fast development with Vite and hot reload
- **Cross-Platform** - Native look and feel on each operating system

## 🤝 Contributing

We welcome contributions to SignalPath! Here's how to get started:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** using conventional commits: `git commit -m "feat: add amazing feature"`
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request


### Code Quality

- Follow TypeScript best practices
- Maintain test coverage
- Use ESLint configuration
- Write clear, descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Omar Aglan**

- Email: <Omar.aglan91@gmail.com>
- GitHub: [@OmarAglan](https://github.com/OmarAglan)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/OmarAglan/SignalPath/issues)
- **Discussions**: [GitHub Discussions](https://github.com/OmarAglan/SignalPath/discussions)
- **Documentation**: [Project Documentation](docs/)

## 📈 Project Status

![Current Version](https://img.shields.io/github/v/release/OmarAglan/SignalPath?style=for-the-badge)

**Status**: ✅ **Stage 3 Complete - Professional Wiring and Net Creation System**

SignalPath has achieved its most sophisticated milestone with Stage 3 completion. The project now features a complete professional-grade wiring system that rivals commercial EDA tools:

- ✅ **Professional Wiring System** - Complete click-to-start, drag-to-route, click-to-finish wire drawing workflow
- ✅ **Advanced Wire Routing** - Intelligent Manhattan routing with component boundary avoidance and clearance
- ✅ **Pin Connection Validation** - One-wire-per-pin enforcement with visual feedback and connection status
- ✅ **Real-time Connection Status** - Live properties panel showing pin connections, net IDs, and connected components
- ✅ **Component Pin System** - Visual pin indicators with click handlers for wire connections
- ✅ **Net Management** - Complete electrical connectivity tracking with unique net IDs and connection arrays
- ✅ **Rubber Band Wires** - Real-time visual feedback during wire drawing with mouse tracking
- ✅ **Component Avoidance** - Sophisticated routing algorithms that navigate around component boundaries
- ✅ **Complete Component Interaction** - Professional Place → Select → Move → Edit → Delete → Wire workflow
- ✅ **Visual Selection System** - Click-based component selection with highlighting and state management
- ✅ **Drag-to-Move Functionality** - Smooth component repositioning with grid snapping and real-time updates
- ✅ **Properties Panel Integration** - Real-time component and connection information with form synchronization
- ✅ **Multiple Deletion Methods** - Keyboard shortcuts (Delete/Backspace) and visual delete buttons
- ✅ **Enhanced UX Features** - Hover effects, cursor management, auto-selection, and comprehensive visual feedback
- ✅ **Interactive Canvas** - Professional pan/zoom/grid functionality with react-konva
- ✅ **Component Library** - Drag-and-drop palette with intercom-specific components and pin definitions
- ✅ **Symbol Rendering** - Professional schematic symbols with clickable pins for wire connections
- ✅ **State Management** - Complete Zustand integration with TypeScript support and wiring state
- ✅ **Cross-platform Desktop Application** - Modern Electron + React architecture
- ✅ **Professional CI/CD Pipeline** - Automated releases and comprehensive documentation
- ✅ **Ready for Stage 4** - Foundation prepared for design analysis and export capabilities

**Current Capabilities**: Users can now create complete professional intercom schematics with full electrical connectivity - placing components, drawing wires between pins, managing connections, and editing properties through an intuitive interface with advanced wire routing and real-time connection validation.

---

<div align="center">

**Built with ❤️ using Electron, React, and TypeScript**

[⬆ Back to Top](#signalpath-intercom-designer)

</div>
