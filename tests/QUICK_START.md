# Dashboard Tests - Quick Start Guide

Get started with dashboard route testing in 5 minutes!

## 🚀 Quick Installation

```bash
# From project root
npm install

# This will install Cypress and all dependencies
```

## ▶️ Run Tests (3 Ways)

### 1. Interactive Mode (Recommended)
Best for development - see tests run in real browser:

```bash
npm run test:e2e
```

Then:
1. Click "E2E Testing"
2. Choose Chrome browser
3. Click `dashboard.cy.js`
4. Watch tests run!

### 2. Headless Mode
Run all tests in terminal:

```bash
npm run test:e2e:headless
```

### 3. Dashboard Tests Only
Run just the dashboard tests:

```bash
npm run test:dashboard
```

## 📋 Prerequisites Checklist

Before running tests, ensure:

- [ ] Frontend is running on `http://localhost:3000`
  ```bash
  cd frontend
  npm run dev
  ```

- [ ] Backend API is accessible
  ```bash
  cd backend
  npm run dev
  ```

- [ ] Node.js 18+ is installed
  ```bash
  node --version
  ```

## 🎯 What Gets Tested

✅ **30+ Tests** covering:
- All dashboard routes load correctly
- Data fetches from API
- Loading spinners show/hide
- Error messages display
- Navigation works
- Authentication enforced
- Mobile responsive

## 📊 View Results

### During Interactive Mode:
- See live browser interaction
- View before/after states
- Click to retry failed tests
- Time travel through test steps

### After Headless Mode:
- Check terminal output
- View screenshots (if tests fail): `cypress/screenshots/`
- Watch videos (optional): `cypress/videos/`

## 🔧 Common Commands

```bash
# Open Cypress UI
npm run cypress:open

# Run specific browser
npm run test:e2e:chrome
npm run test:e2e:firefox

# Run for CI/CD
npm run test:ci

# Run all tests (backend + e2e)
npm run test:all
```

## 🐛 Quick Troubleshooting

### Problem: "Cannot find Cypress"
**Solution:**
```bash
npm install --save-dev cypress
npx cypress verify
```

### Problem: Tests fail with "Cannot connect"
**Solution:** Make sure frontend is running
```bash
cd frontend
npm run dev
# Wait for "Ready on http://localhost:3000"
```

### Problem: "Network timeout"
**Solution:** Increase timeout in `cypress.config.js`:
```javascript
defaultCommandTimeout: 15000,
requestTimeout: 15000,
```

### Problem: Authentication tests fail
**Solution:** Tests mock authentication automatically. If failing:
1. Check `cypress/support/commands.js`
2. Verify localStorage is being set
3. Clear browser cache: `Ctrl+Shift+Delete`

## 📁 Test Files Location

```
Dashdig/
├── cypress/
│   ├── e2e/
│   │   └── dashboard.cy.js      # ← Main test file
│   └── support/
│       ├── commands.js          # ← Custom helpers
│       └── e2e.js              # ← Global config
├── cypress.config.js            # ← Cypress settings
└── tests/
    ├── DASHBOARD_TEST_README.md # ← Full documentation
    └── QUICK_START.md          # ← You are here!
```

## ✏️ Write Your First Test

Add to `cypress/e2e/dashboard.cy.js`:

```javascript
it('should display welcome message', () => {
  cy.login();
  cy.visit('/dashboard');
  cy.contains('Welcome').should('be.visible');
});
```

Run it:
```bash
npm run test:dashboard
```

## 🎓 Next Steps

1. ✅ Run tests in interactive mode
2. ✅ Explore test coverage in terminal
3. 📖 Read full docs: `tests/DASHBOARD_TEST_README.md`
4. ✏️ Write custom tests for new features
5. 🔄 Add to CI/CD pipeline

## 📞 Need Help?

- 📖 Full Documentation: `tests/DASHBOARD_TEST_README.md`
- 🌐 Cypress Docs: https://docs.cypress.io
- 💬 Open an issue in the repository

---

**Happy Testing! 🎉**

Time to run: **`npm run test:e2e`**
