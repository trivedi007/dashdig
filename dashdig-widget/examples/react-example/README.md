# DashDig Widget - React Example

This is a complete React application demonstrating how to integrate the DashDig embeddable widget into your React projects.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm 8+
- Basic knowledge of React

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
react-example/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx            # Application entry point
│   ├── App.css             # Application styles
│   ├── components/
│   │   ├── ComponentExample.jsx    # Widget component usage example
│   │   └── HookExample.jsx         # Widget hook usage example
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md              # This file
```

## 💡 Examples Included

### 1. Component Usage (`ComponentExample.jsx`)

Demonstrates using the `<DashdigReactWidget>` component for declarative widget integration.

```jsx
import { DashdigReactWidget } from '@dashdig/widget/dist/integrations/react';

function ComponentExample() {
  return (
    <DashdigReactWidget
      apiKey="your-api-key"
      position="bottom-right"
      theme="light"
      autoShow={true}
    />
  );
}
```

### 2. Hook Usage (`HookExample.jsx`)

Demonstrates using the `useDashdig` hook for programmatic widget control.

```jsx
import { useDashdig } from '@dashdig/widget/dist/integrations/react';

function HookExample() {
  const { show, hide, track, isLoaded } = useDashdig('your-api-key', {
    position: 'bottom-right',
    theme: 'dark',
    autoShow: false
  });

  return (
    <div>
      <button onClick={show}>Show Widget</button>
      <button onClick={hide}>Hide Widget</button>
      <button onClick={() => track('event', { data: 'value' })}>
        Track Event
      </button>
    </div>
  );
}
```

## 🎯 Key Features Demonstrated

- **Component Integration:** Declarative widget usage with React component
- **Hook Integration:** Programmatic control with custom React hook
- **Event Tracking:** Custom event tracking examples
- **State Management:** Widget state management and visibility control
- **Error Handling:** Proper error handling and loading states
- **Lifecycle Management:** Automatic cleanup on component unmount
- **TypeScript Support:** Full TypeScript types and interfaces

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### API Key

Replace the demo API key in the examples with your actual DashDig API key:

```jsx
// In ComponentExample.jsx or HookExample.jsx
apiKey="your-actual-api-key-here"
```

### Widget Options

Customize widget behavior by modifying the configuration:

```jsx
{
  apiKey: 'your-api-key',
  position: 'bottom-right', // or 'bottom-left'
  theme: 'light',           // or 'dark'
  autoShow: true,          // or false
  apiUrl: 'https://api.dashdig.com' // custom API endpoint (optional)
}
```

## 🐛 Troubleshooting

### Widget Not Appearing

1. Check that you have a valid API key
2. Verify the widget component is rendered
3. Check browser console for errors
4. Ensure `autoShow` is set to `true` or manually call `show()`

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Import Errors

Make sure you're importing from the correct path:

```jsx
// Correct import paths
import { DashdigReactWidget } from '@dashdig/widget/dist/integrations/react';
import { useDashdig } from '@dashdig/widget/dist/integrations/react';
```

## 📚 Learn More

- [DashDig Widget Documentation](https://dashdig.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

MIT - See LICENSE file in root directory

