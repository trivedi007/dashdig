<script setup lang="ts">
import { ref, inject, getCurrentInstance } from 'vue';
import type { DashdigGlobal } from '@dashdig/widget/vue';

// Try to get $dashdig from both inject and getCurrentInstance
const dashdigInjected = inject<DashdigGlobal>('dashdig', null as any);
const instance = getCurrentInstance();
const dashdigGlobal = instance?.proxy?.$dashdig;

// Use whichever is available
const dashdig = dashdigInjected || dashdigGlobal;

// Check if plugin is installed
const isPluginInstalled = ref(!!dashdig);

// Event tracking state
const eventName = ref('plugin_button_click');
const eventData = ref('{"source": "plugin_example"}');

// Control methods
const showWidget = () => {
  if (dashdig) {
    dashdig.show();
  } else {
    alert('Plugin not installed. Uncomment plugin installation in main.ts');
  }
};

const hideWidget = () => {
  if (dashdig) {
    dashdig.hide();
  } else {
    alert('Plugin not installed. Uncomment plugin installation in main.ts');
  }
};

const trackEvent = () => {
  if (dashdig) {
    try {
      const data = eventData.value ? JSON.parse(eventData.value) : undefined;
      dashdig.track(eventName.value, data);
      alert(`Event tracked: ${eventName.value}`);
    } catch (error) {
      alert('Invalid JSON in event data');
    }
  } else {
    alert('Plugin not installed. Uncomment plugin installation in main.ts');
  }
};

const checkStatus = () => {
  if (dashdig) {
    const isLoaded = dashdig.isLoaded();
    const instance = dashdig.getInstance();
    alert(`Plugin Status:\nLoaded: ${isLoaded}\nInstance: ${instance ? 'Available' : 'Null'}`);
  }
};
</script>

<template>
  <div class="example">
    <div class="example-header">
      <h2>🔌 Global Plugin</h2>
      <p class="description">
        Install DashDig globally using the <code>DashdigPlugin</code>.
        Access via <code>$dashdig</code> in all components.
      </p>
    </div>

    <div class="example-content">
      <!-- Installation Status -->
      <div class="section" :class="{ warning: !isPluginInstalled }">
        <h3>Plugin Status</h3>
        <div class="status-banner" :class="{ installed: isPluginInstalled, 'not-installed': !isPluginInstalled }">
          <div class="status-icon">
            {{ isPluginInstalled ? '✅' : '⚠️' }}
          </div>
          <div class="status-content">
            <h4>{{ isPluginInstalled ? 'Plugin Installed' : 'Plugin Not Installed' }}</h4>
            <p v-if="isPluginInstalled">
              The DashDig plugin is active and available globally.
            </p>
            <p v-else>
              To use this example, uncomment the plugin installation in <code>main.ts</code>:
            </p>
            <pre v-if="!isPluginInstalled" class="install-code"><code>import { DashdigPlugin } from '@dashdig/widget/vue';

app.use(DashdigPlugin, {
  apiKey: 'your-api-key',
  position: 'bottom-right',
  theme: 'light'
});</code></pre>
          </div>
        </div>
      </div>

      <!-- Plugin Configuration -->
      <div class="section">
        <h3>Plugin Configuration</h3>
        <p class="section-description">
          The plugin is configured once during app initialization and is available throughout your application.
        </p>
        <div class="config-example">
          <h4>Installation Example</h4>
          <pre class="code-block"><code>// main.ts
import { createApp } from 'vue';
import { DashdigPlugin } from '@dashdig/widget/vue';
import App from './App.vue';

const app = createApp(App);

app.use(DashdigPlugin, {
  apiKey: 'your-api-key',    // Required
  position: 'bottom-right',  // Optional
  theme: 'light',            // Optional
  autoShow: true,            // Optional
  apiUrl: 'https://...'      // Optional
});

app.mount('#app');</code></pre>
        </div>
      </div>

      <!-- Usage Methods -->
      <div class="section">
        <h3>Access Methods</h3>
        <div class="access-methods">
          <div class="method-card">
            <h4>Options API</h4>
            <pre class="code-block"><code>export default {
  methods: {
    showWidget() {
      this.$dashdig.show();
    },
    hideWidget() {
      this.$dashdig.hide();
    },
    trackEvent() {
      this.$dashdig.track('event', data);
    }
  }
}</code></pre>
          </div>

          <div class="method-card">
            <h4>Composition API</h4>
            <pre class="code-block"><code>&lt;script setup&gt;
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const dashdig = instance?.proxy?.$dashdig;

function showWidget() {
  dashdig?.show();
}
&lt;/script&gt;</code></pre>
          </div>

          <div class="method-card">
            <h4>Provide/Inject</h4>
            <pre class="code-block"><code>&lt;script setup&gt;
import { inject } from 'vue';

const dashdig = inject('dashdig');

function showWidget() {
  dashdig?.show();
}
&lt;/script&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="section">
        <h3>Widget Controls</h3>
        <div class="button-group">
          <button @click="showWidget" class="btn btn-primary" :disabled="!isPluginInstalled">
            👁️ Show Widget
          </button>
          <button @click="hideWidget" class="btn btn-secondary" :disabled="!isPluginInstalled">
            🙈 Hide Widget
          </button>
          <button @click="checkStatus" class="btn btn-info" :disabled="!isPluginInstalled">
            ℹ️ Check Status
          </button>
        </div>
      </div>

      <!-- Tracking Section -->
      <div class="section">
        <h3>Event Tracking</h3>
        <div class="track-form">
          <div class="form-group">
            <label>Event Name</label>
            <input
              v-model="eventName"
              type="text"
              placeholder="button_click"
              :disabled="!isPluginInstalled"
            />
          </div>
          <div class="form-group">
            <label>Event Data (JSON)</label>
            <textarea
              v-model="eventData"
              placeholder='{"key": "value"}'
              rows="3"
              :disabled="!isPluginInstalled"
            ></textarea>
          </div>
          <button @click="trackEvent" class="btn btn-success" :disabled="!isPluginInstalled">
            📊 Track Event
          </button>
        </div>
      </div>

      <!-- Global Methods -->
      <div class="section">
        <h3>Global $dashdig Methods</h3>
        <div class="methods-info">
          <div class="method-item">
            <code>$dashdig.show()</code>
            <span>Show the widget</span>
          </div>
          <div class="method-item">
            <code>$dashdig.hide()</code>
            <span>Hide the widget</span>
          </div>
          <div class="method-item">
            <code>$dashdig.track(event, data)</code>
            <span>Track custom events</span>
          </div>
          <div class="method-item">
            <code>$dashdig.getInstance()</code>
            <span>Get the widget instance</span>
          </div>
          <div class="method-item">
            <code>$dashdig.isLoaded()</code>
            <span>Check if widget is loaded</span>
          </div>
        </div>
      </div>

      <!-- Advantages -->
      <div class="section advantages">
        <h3>Advantages of Plugin Approach</h3>
        <ul>
          <li>✓ Single initialization for entire app</li>
          <li>✓ Available in all components without imports</li>
          <li>✓ Consistent configuration across app</li>
          <li>✓ Automatic cleanup on app unmount</li>
          <li>✓ TypeScript support via module augmentation</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.example {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.example-header h2 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
}

.description {
  color: #666;
  line-height: 1.6;
}

.description code {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  color: #667eea;
}

.example-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
}

.section.warning {
  border-color: #ffc107;
  background: #fff9e6;
}

.section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.section-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.status-banner {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  align-items: flex-start;
}

.status-banner.installed {
  background: #d4edda;
  border: 2px solid #28a745;
}

.status-banner.not-installed {
  background: #fff3cd;
  border: 2px solid #ffc107;
}

.status-icon {
  font-size: 3rem;
  line-height: 1;
}

.status-content {
  flex: 1;
}

.status-content h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.status-content p {
  margin: 0 0 1rem 0;
  color: #666;
  line-height: 1.6;
}

.status-content p code {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.install-code {
  background: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.config-example h4 {
  margin-bottom: 0.75rem;
  color: #555;
  font-size: 1rem;
}

.access-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.method-card {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  background: #f9f9f9;
}

.method-card h4 {
  margin: 0 0 0.75rem 0;
  color: #667eea;
  font-size: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: #138496;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}

.track-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.methods-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.method-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.method-item code {
  background: #667eea;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  white-space: nowrap;
}

.method-item span {
  color: #666;
  line-height: 1.6;
}

.advantages {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.advantages h3 {
  color: white;
}

.advantages ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.advantages li {
  padding: 0.5rem 0;
  font-size: 1rem;
  line-height: 1.6;
}

.code-block {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.code-block code {
  color: #333;
}

@media (max-width: 768px) {
  .access-methods {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>



