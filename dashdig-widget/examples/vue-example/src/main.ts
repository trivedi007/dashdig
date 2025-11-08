/**
 * DashDig Widget - Vue 3 Example Application
 * Demonstrates all integration methods
 */

import { createApp } from 'vue';
import App from './App.vue';

// Import the DashDig plugin (for global installation example)
// import { DashdigPlugin } from '@dashdig/widget/vue';

const app = createApp(App);

// Option 1: Install globally with plugin (uncomment to use)
// app.use(DashdigPlugin, {
//   apiKey: 'demo-api-key',
//   position: 'bottom-right',
//   theme: 'light',
//   autoShow: false
// });

app.mount('#app');





