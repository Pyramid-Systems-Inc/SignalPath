# GitHub Repository Setup Instructions

## Quick Setup Guide

After pushing the CI/CD workflow to your repository, follow these steps to enable automated releases:

### 1. Repository Settings

#### Enable GitHub Actions
1. Go to your repository settings
2. Navigate to **Actions** → **General**
3. Ensure "Allow all actions and reusable workflows" is selected
4. Save settings

#### Configure Branch Protection (Recommended)
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - "Require status checks to pass before merging"
   - "Require branches to be up to date before merging"
   - Select "Test and Lint" as required status check

### 2. Permissions Setup

#### GitHub Token Permissions
The workflow uses the default `GITHUB_TOKEN` with these required permissions:
- **Contents**: write (for creating releases)
- **Pull requests**: write (for PR status checks)
- **Actions**: read (for workflow execution)
- **Metadata**: read (for repository information)

These permissions are automatically granted to the default token.

### 3. First Release Setup

#### Initialize Semantic Versioning
1. Ensure your first commit follows conventional commit format
2. Push to main branch to trigger first automated release
3. Or use manual release trigger from Actions tab

#### Example First Commit
```bash
git add .
git commit -m "feat: initial release of SignalPath Intercom Designer

- Complete Electron + React application
- Component palette and canvas functionality  
- Properties panel for component configuration
- Cross-platform desktop application support"
git push origin main
```

### 4. Manual Release Trigger

If you need to create a release manually:

1. Go to **Actions** tab in your repository
2. Select "Build and Release" workflow
3. Click "Run workflow"
4. Choose release type:
   - **patch**: Bug fixes (0.0.X)
   - **minor**: New features (0.X.0)  
   - **major**: Breaking changes (X.0.0)
5. Click "Run workflow"

### 5. Status Badges

Add these badges to your main README.md:

```markdown
[![Build and Release](https://github.com/YOUR_USERNAME/SignalPath/workflows/Build%20and%20Release/badge.svg)](https://github.com/YOUR_USERNAME/SignalPath/actions)
[![Latest Release](https://img.shields.io/github/v/release/YOUR_USERNAME/SignalPath)](https://github.com/YOUR_USERNAME/SignalPath/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/YOUR_USERNAME/SignalPath/total)](https://github.com/YOUR_USERNAME/SignalPath/releases)
[![License](https://img.shields.io/github/license/YOUR_USERNAME/SignalPath)](LICENSE)
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Workflow Verification

### Check Workflow Status
1. Navigate to **Actions** tab
2. Verify "Build and Release" workflow appears
3. Check that workflow runs successfully on push to main

### Test Pull Request Workflow
1. Create a new branch: `git checkout -b test-workflow`
2. Make a small change and commit
3. Push branch and create pull request
4. Verify that workflow runs on PR and shows status checks

### Verify Release Process
1. Make a commit with conventional format to main branch
2. Check that workflow runs automatically
3. Verify new release appears in **Releases** section
4. Download and test generated installers

## Troubleshooting

### Common Setup Issues

#### Workflow Not Running
- Check if Actions are enabled in repository settings
- Verify workflow file is in `.github/workflows/` directory
- Ensure file has `.yml` or `.yaml` extension

#### Permission Errors
- Verify `GITHUB_TOKEN` has required permissions
- Check repository settings for Actions permissions
- Ensure branch protection rules allow Actions

#### Build Failures
- Review workflow logs in Actions tab
- Check Node.js version compatibility (workflow uses Node 20)
- Verify all dependencies are listed in package.json

#### Release Not Created
- Ensure commits follow conventional commit format
- Check that semantic-release dependencies are installed
- Verify main branch protection allows automated commits

### Getting Help

1. **Workflow Logs**: Check Actions tab for detailed error messages
2. **Documentation**: Review [CI/CD Setup Guide](CICD_SETUP.md)
3. **Issues**: Create GitHub issue with workflow logs attached

## Advanced Configuration

### Custom Release Branches
To release from multiple branches, update `.releaserc.json`:

```json
{
  "branches": [
    "main",
    {"name": "develop", "prerelease": true}
  ]
}
```

### Environment-Specific Builds
Add environment variables to workflow:

```yaml
env:
  NODE_ENV: production
  ELECTRON_BUILDER_CACHE: .cache/electron-builder
```

### Custom Build Matrix
Modify the build matrix in workflow to add/remove platforms:

```yaml
strategy:
  matrix:
    include:
      - os: ubuntu-latest
        platform: linux
        arch: arm64  # Add ARM64 Linux builds
```

## Security Notes

### Token Security
- Never commit secrets or tokens to repository
- Use repository secrets for sensitive configuration
- Regularly review Actions permissions

### Dependency Security
- Keep dependencies updated using Dependabot
- Review security advisories for used packages
- Use exact version pinning for critical dependencies

### Build Security
- Workflow runs in isolated GitHub-hosted runners
- Build artifacts are automatically scanned
- Release assets are cryptographically signed by GitHub

---

**Next Steps**: After completing setup, see [CI/CD Setup Documentation](CICD_SETUP.md) for detailed workflow information and customization options.