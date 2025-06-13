# SignalPath Intercom Designer

<div align="center">

![SignalPath Logo](build/icon.png)

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
- **Interactive Component Palette** - Comprehensive library of intercom system components with drag-and-drop functionality
- **Visual Canvas Editor** - Zoomable/pannable schematic design canvas with real-time feedback
- **Properties Panel** - Advanced component configuration and parameter adjustment
- **Signal Path Visualization** - Clear representation of audio signal routing
- **Professional Output** - Export-ready schematics and documentation

### 🛠️ Technical Highlights
- **Modern Architecture** - Built with Electron, React 19, and TypeScript
- **Interactive Canvas** - React-Konva powered zoomable/pannable design surface
- **Component Library** - TypeScript-based component definitions with SVG icons
- **State Management** - Zustand for efficient application state handling
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
│   │   ├── Canvas.tsx     # Main design canvas
│   │   ├── ComponentPalette.tsx # Component library
│   │   └── PropertiesPanel.tsx  # Configuration panel
│   ├── store/             # Zustand state management
│   └── App.tsx            # Main application component
├── electron/              # Electron main process
│   ├── main.ts           # Main process entry point
│   └── preload.ts        # Preload scripts for security
├── build/                # Application assets and icons
├── docs/                 # Comprehensive documentation
├── .github/workflows/    # CI/CD automation
└── release/             # Build output directory
```

## 🚀 CI/CD Pipeline

SignalPath features a comprehensive automated pipeline powered by GitHub Actions:

### ⚡ Automated Workflows
- **Continuous Integration** - Automated testing and validation on every commit
- **Cross-Platform Builds** - Simultaneous builds for Windows, macOS, and Linux
- **Semantic Versioning** - Automatic version management using conventional commits
- **Release Automation** - GitHub releases with downloadable installers
- **Changelog Generation** - Automated documentation of changes

### 📦 Release Process

The application follows [semantic versioning](https://semver.org/) with automated releases:

```bash
# Bug fixes (patch: 1.1.3 → 1.1.4)
git commit -m "fix: resolve canvas rendering issue"

# New features (minor: 1.1.4 → 1.2.0)  
git commit -m "feat: add component templates"

# Breaking changes (major: 1.2.0 → 2.0.0)
git commit -m "feat: redesign component API
BREAKING CHANGE: Component interface changed"
```

Releases are automatically created when commits are pushed to the main branch. Each release includes:
- Cross-platform installers
- Automated changelog
- Release notes
- GitHub release with assets

### 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

- **[CI/CD Setup](docs/CICD_SETUP.md)** - Complete pipeline documentation
- **[GitHub Setup](docs/GITHUB_SETUP.md)** - Repository configuration guide
- **[CI/CD Overview](docs/README_CICD.md)** - Pipeline capabilities and features

## 🏛️ Architecture

### Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Desktop Runtime**: Electron 36
- **State Management**: Zustand
- **Build System**: Electron-Vite for fast development
- **Package Builder**: Electron-Builder for cross-platform distribution
- **Development Tools**: ESLint, TypeScript, Vite

### Key Design Decisions

- **TypeScript First** - Strong typing throughout the application
- **Component Architecture** - Modular, reusable React components
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

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes  
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Build process or auxiliary tool changes

### Code Quality

- Follow TypeScript best practices
- Maintain test coverage
- Use ESLint configuration
- Write clear, descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Omar Aglan**
- Email: Omar.aglan91@gmail.com
- GitHub: [@OmarAglan](https://github.com/OmarAglan)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/OmarAglan/SignalPath/issues)
- **Discussions**: [GitHub Discussions](https://github.com/OmarAglan/SignalPath/discussions)
- **Documentation**: [Project Documentation](docs/)

## 📈 Project Status

![Current Version](https://img.shields.io/github/v/release/OmarAglan/SignalPath?style=for-the-badge)

**Status**: ✅ **Active Development**

SignalPath is actively maintained and continuously improved. The project features:
- ✅ Complete cross-platform desktop application
- ✅ Professional CI/CD pipeline with automated releases
- ✅ Comprehensive documentation and setup guides
- ✅ Modern architecture with TypeScript and React
- ✅ Enterprise-grade build and distribution system

---

<div align="center">

**Built with ❤️ using Electron, React, and TypeScript**

[⬆ Back to Top](#signalpath-intercom-designer)

</div>
