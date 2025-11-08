# Publishing Quick Reference

Quick reference card for publishing @dashdig/widget to NPM.

---

## ⚡ Quick Publish

```bash
# Full workflow (5 commands)
npm run validate              # Check everything
npm run build:prod           # Build production
npm version patch            # Bump version
npm publish                  # Publish to NPM
git push origin main --tags  # Push to GitHub
```

---

## 📦 Version Bumping

```bash
npm version patch   # 1.0.0 → 1.0.1 (bug fixes)
npm version minor   # 1.0.1 → 1.1.0 (new features)
npm version major   # 1.1.0 → 2.0.0 (breaking changes)
```

---

## 🔍 Pre-Publish Checks

```bash
npm run validate        # All checks
npm run test           # Run tests
npm run build:prod     # Build production
npm publish --dry-run  # Test publish
```

---

## 🚀 First Time Setup

```bash
# 1. Login to NPM
npm login

# 2. Publish (scoped package needs --access public)
npm publish --access public

# 3. Verify
open https://www.npmjs.com/package/@dashdig/widget
```

---

## 🔄 Update Package

```bash
# 1. Make changes
# 2. Test
npm test

# 3. Build
npm run build:prod

# 4. Version bump
npm version patch  # or minor/major

# 5. Publish
npm publish

# 6. Push to GitHub
git push origin main --tags
```

---

## ✅ Verification

```bash
# Check publication
open https://www.npmjs.com/package/@dashdig/widget

# Test installation
mkdir test && cd test
npm init -y
npm install @dashdig/widget

# Test imports
node -e "console.log(require('@dashdig/widget'))"
node -e "console.log(require('@dashdig/widget/react'))"
node -e "console.log(require('@dashdig/widget/vue'))"
node -e "console.log(require('@dashdig/widget/angular'))"
```

---

## 📊 Package Info

```bash
# Check who you're logged in as
npm whoami

# View package info
npm view @dashdig/widget

# Check version
npm view @dashdig/widget version

# Check downloads
npm view @dashdig/widget

# List all versions
npm view @dashdig/widget versions
```

---

## 🐛 Troubleshooting

### Not logged in
```bash
npm login
npm whoami
```

### Version conflict
```bash
npm version patch  # Bump version first
```

### Build fails
```bash
npm run clean
npm install
npm run build:prod
```

### Tests fail
```bash
npm test -- --verbose
```

---

## 📋 Files Included

```
✅ Included:
  • dist/           (all bundles)
  • docs/           (documentation)
  • README.md
  • LICENSE

❌ Excluded:
  • src/            (source code)
  • tests/          (test files)
  • examples/       (example projects)
  • .github/        (CI config)
  • *.config.js     (build configs)
```

---

## 🎯 Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run validate` | Run all checks |
| `npm run build:prod` | Production build |
| `npm run verify` | Verify build |
| `npm test` | Run tests |
| `npm version patch` | Bump patch |
| `npm version minor` | Bump minor |
| `npm version major` | Bump major |
| `npm publish` | Publish to NPM |
| `npm publish --dry-run` | Test publish |

---

## 🔗 Quick Links

- NPM: https://www.npmjs.com/package/@dashdig/widget
- GitHub: https://github.com/dashdig/widget
- Docs: https://dashdig.com/docs/widget

---

**Print this for offline reference!** 📄

