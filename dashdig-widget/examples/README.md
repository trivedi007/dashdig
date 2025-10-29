# DashDig Widget Examples

This directory contains comprehensive examples demonstrating how to integrate the DashDig embeddable widget into your projects.

## 📁 Available Examples

### 1. Vanilla JavaScript (`vanilla.html`)

A complete HTML example showing pure JavaScript integration without any frameworks.

**Features:**
- CDN-based widget loading
- Programmatic widget control
- Event tracking demonstrations
- Interactive controls for show/hide
- Real-time status display
- Responsive design

**To run:**
```bash
# Option 1: Open directly in browser
open vanilla.html

# Option 2: Use a local server (recommended)
npx serve .
# Then navigate to http://localhost:3000/vanilla.html
```

### 2. React Application (`react-example/`)

A full React application built with Vite demonstrating both component-based and hook-based integration approaches.

**Features:**
- Component-based integration with `<DashdigReactWidget>`
- Hook-based integration with `useDashdig`
- Tabbed interface showing both approaches
- Event tracking examples
- Configuration management
- Modern React best practices
- Fully responsive design

**To run:**
```bash
cd react-example
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## 🎯 Which Example Should I Use?

### Use Vanilla JavaScript Example If:
- You want the simplest possible integration
- You're not using a JavaScript framework
- You need to add the widget to existing HTML pages
- You want to understand the core widget API

### Use React Example If:
- You're building a React application
- You want to see both component and hook approaches
- You need programmatic control over the widget
- You want to integrate the widget into a modern build system

## 📚 Learning Path

We recommend following this learning path:

1. **Start with `vanilla.html`**
   - Understand basic widget initialization
   - Learn the core API methods
   - See event tracking in action

2. **Explore Component Usage** (React example)
   - Learn declarative widget integration
   - Understand React component lifecycle
   - See how to pass configuration as props

3. **Master Hook Usage** (React example)
   - Learn programmatic widget control
   - Understand state management with hooks
   - See advanced tracking patterns

## 🔑 API Key

All examples use a demo API key: `demo-api-key-12345`

For production use, replace this with your actual DashDig API key:
```javascript
// Vanilla JS
const widget = new DashdigWidget({
  apiKey: 'your-actual-api-key-here'
});

// React Component
<DashdigReactWidget apiKey="your-actual-api-key-here" />

// React Hook
const { show, hide, track } = useDashdig('your-actual-api-key-here');
```

Get your API key from the [DashDig Dashboard](https://dashdig.com/dashboard).

## 🎨 Customization

All examples demonstrate various customization options:

- **Position**: `bottom-right` or `bottom-left`
- **Theme**: `light` or `dark`
- **Auto Show**: `true` or `false`
- **API URL**: Custom endpoint (for self-hosted deployments)

Modify these settings in the examples to see how they affect the widget appearance and behavior.

## 🐛 Troubleshooting

### Widget Not Appearing

1. Check browser console for errors
2. Verify API key is set correctly
3. Ensure `autoShow` is `true` or manually call `show()`
4. Check that the widget script loaded successfully

### React Example Not Starting

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Import Errors in React

Make sure you're using the correct import paths:
```javascript
// Correct
import { DashdigReactWidget } from '@dashdig/widget/dist/integrations/react';

// Alternative (if using local package)
import { DashdigReactWidget } from '../../../dist/integrations/react/DashdigWidget';
```

## 📖 Additional Resources

- [Main Documentation](../README.md)
- [API Reference](https://dashdig.com/docs/api)
- [GitHub Repository](https://github.com/dashdig/dashdig-widget)
- [NPM Package](https://www.npmjs.com/package/@dashdig/widget)

## 💡 Need More Examples?

Want to see examples for other frameworks?

- **Vue.js**: Check the [Vue integration documentation](../README.md#vue-integration)
- **Angular**: Check the [Angular integration documentation](../README.md#angular-integration)
- **Svelte, Solid, etc.**: The vanilla JavaScript approach works with any framework!

## 🤝 Contributing Examples

Have an example you'd like to share? We welcome contributions!

1. Create your example in a new subdirectory
2. Include a README with setup instructions
3. Ensure code is well-commented
4. Submit a pull request

See [CONTRIBUTING.md](../README.md#contributing) for more details.

## 📄 License

All examples are licensed under MIT - feel free to use them as a starting point for your own projects!

