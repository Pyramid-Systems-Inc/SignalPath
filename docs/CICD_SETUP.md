# CI/CD Setup and Documentation

## Overview

This document describes the comprehensive CI/CD pipeline setup for the SignalPath Intercom Designer application using GitHub Actions. The pipeline automates building, testing, versioning, and releasing the Electron application across multiple platforms.

## Workflow Features

### 🚀 Automated Triggers
- **Push to main**: Triggers full CI/CD pipeline with potential release
- **Pull requests**: Runs tests and builds for validation
- **Manual dispatch**: Allows manual releases with custom version bump types

### 🏗️ Build Process
- Cross-platform builds (Windows, macOS, Linux)
- Multiple architectures (x64, ia32, arm64)
- Optimized production builds using electron-builder
- Automated dependency caching for faster builds

### 📦 Semantic Versioning
- Automatic version bumping based on conventional commits
- Changelog generation
- Git tagging with semantic versions
- Branch-based release strategy

### 🎯 Artifact Management
- Platform-specific build artifacts
- Organized by architecture and platform
- 30-day retention policy
- Downloadable from GitHub Actions

### 🚢 Release Automation
- Automatic GitHub releases
- Asset uploads for all platforms
- Rich release notes with download instructions
- Proper semantic version tagging

## Workflow Jobs

### 1. Test and Lint (`test`)
- Runs on Ubuntu (fastest for basic validation)
- Installs dependencies with npm cache
- Executes linting with ESLint
- Builds application to verify compilation

### 2. Semantic Versioning (`semantic-version`)
- Only runs on main branch pushes
- Uses semantic-release to determine version bumps
- Analyzes commit messages for version increment
- Outputs new version information for other jobs

### 3. Multi-Platform Build (`build`)
- Matrix strategy for multiple OS/architecture combinations
- Builds native installers for each platform
- Updates version from semantic-release
- Uploads platform-specific artifacts

**Build Matrix:**
- Windows: x64, ia32 (NSIS installer)
- macOS: x64, arm64 (DMG installer)
- Linux: x64 (AppImage, DEB package)

### 4. Release Creation (`release`)
- Creates GitHub releases with rich descriptions
- Downloads all build artifacts
- Uploads installers as release assets
- Generates installation instructions

### 5. Manual Release (`manual-release`)
- Triggered by workflow_dispatch
- Allows custom version bump selection
- Bypasses semantic analysis for manual control

## Commit Message Convention

The pipeline uses conventional commits for automatic versioning:

### Version Bump Types
- `fix:` → Patch version (0.0.X)
- `feat:` → Minor version (0.X.0)
- `BREAKING CHANGE:` → Major version (X.0.0)

### Examples
```bash
# Patch release (bug fix)
git commit -m "fix: resolve canvas rendering issue on Windows"

# Minor release (new feature)
git commit -m "feat: add component auto-alignment feature"

# Major release (breaking change)
git commit -m "feat: redesign component API

BREAKING CHANGE: Component interface has changed, existing plugins need updates"
```

## Required GitHub Secrets

### Automatic Setup
Most functionality works with default GitHub tokens and permissions.

### Optional Secrets
- **`GITHUB_TOKEN`**: Auto-provided by GitHub Actions (no setup needed)
- **Custom secrets**: None required for basic functionality

## Platform-Specific Build Outputs

### Windows
- **NSIS Installer**: `SignalPath-Intercom-Designer-Setup-{version}.exe`
- **Portable**: `SignalPath-Intercom-Designer-{version}-win.zip`
- **Architectures**: x64, ia32

### macOS
- **DMG Installer**: `SignalPath-Intercom-Designer-{version}.dmg`
- **ZIP Archive**: `SignalPath-Intercom-Designer-{version}-mac.zip`
- **Architectures**: x64 (Intel), arm64 (Apple Silicon)

### Linux
- **AppImage**: `SignalPath-Intercom-Designer-{version}.AppImage`
- **DEB Package**: `signalpath_{version}_amd64.deb`
- **TAR Archive**: `SignalPath-Intercom-Designer-{version}.tar.gz`

## Status Badges

Add these badges to your README.md:

```markdown
![Build Status](https://github.com/YOUR_USERNAME/SignalPath/workflows/Build%20and%20Release/badge.svg)
![Release](https://img.shields.io/github/v/release/YOUR_USERNAME/SignalPath)
![License](https://img.shields.io/github/license/YOUR_USERNAME/SignalPath)
```

## Local Development

### Testing Build Process
```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Build application
npm run build

# Create installers locally
npm run electron:dist
```

### Testing Semantic Release (Dry Run)
```bash
# Install semantic-release globally
npm install -g semantic-release

# Dry run (doesn't actually release)
semantic-release --dry-run
```

## Troubleshooting

### Common Issues

#### Build Failures
- **Node.js version mismatch**: Workflow uses Node.js 20
- **Missing dependencies**: Check package.json for all required devDependencies
- **Platform-specific issues**: Review electron-builder configuration

#### Version Not Bumping
- **Commit message format**: Ensure conventional commit format
- **Branch protection**: Check if main branch allows semantic-release commits
- **Previous release**: Verify last release tag exists

#### Artifact Upload Issues
- **File paths**: Check electron-builder output directory configuration
- **Permissions**: Verify GitHub Actions permissions for releases

### Debug Steps

1. **Check workflow logs**: GitHub Actions provides detailed logs
2. **Local build test**: Run `npm run electron:dist` locally
3. **Commit message validation**: Use conventional commit format
4. **Dependencies**: Ensure all devDependencies are installed

## Performance Optimizations

### Build Speed
- **Dependency caching**: Uses npm cache between runs
- **Matrix parallelization**: Builds run simultaneously
- **Selective triggers**: Only runs full pipeline on main branch

### Artifact Size
- **Compression**: electron-builder optimizes package sizes
- **Platform targeting**: Separate builds reduce individual sizes
- **Resource optimization**: Excludes development files

## Security Considerations

### Token Security
- Uses GitHub-provided tokens (automatically rotated)
- No hardcoded secrets in workflow files
- Minimal permission requirements

### Build Security
- Dependency pinning with exact versions
- Official GitHub Actions only
- Audit logs for all releases

## Extending the Pipeline

### Adding Tests
Update the `test` job to include actual test suites:

```yaml
- name: Run tests
  run: npm test

- name: Run e2e tests
  run: npm run test:e2e
```

### Adding Code Coverage
```yaml
- name: Generate coverage
  run: npm run coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

### Custom Build Steps
Add pre/post build hooks in package.json scripts or workflow steps.

## Maintenance

### Regular Updates
- Update Node.js version in workflow
- Keep semantic-release plugins updated
- Review and update electron-builder configuration
- Monitor GitHub Actions usage limits

### Monitoring
- Set up notifications for failed builds
- Monitor release download statistics
- Review workflow execution times

---

For additional support, see the [GitHub Actions documentation](https://docs.github.com/en/actions) or [electron-builder documentation](https://www.electron.build/).