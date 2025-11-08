/**
 * Main Application Component
 * 
 * This is the root component of the React example application.
 * It demonstrates both component-based and hook-based approaches
 * to integrating the DashDig widget.
 */

import React, { useState } from 'react';
import SimpleExample from './SimpleExample';
import ComponentExample from './components/ComponentExample';
import HookExample from './components/HookExample';

function App() {
  // State to manage which example tab is active
  const [activeTab, setActiveTab] = useState('simple');

  return (
    <div className="app">
      {/* Application Header */}
      <header className="app-header">
        <h1>🚀 DashDig Widget React Examples</h1>
        <p>
          Comprehensive examples showing how to integrate DashDig widget into your React application
        </p>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Tab Navigation */}
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'simple' ? 'active' : ''}`}
            onClick={() => setActiveTab('simple')}
          >
            ⚡ Quick Start
          </button>
          <button
            className={`tab-button ${activeTab === 'component' ? 'active' : ''}`}
            onClick={() => setActiveTab('component')}
          >
            📦 Component Usage
          </button>
          <button
            className={`tab-button ${activeTab === 'hook' ? 'active' : ''}`}
            onClick={() => setActiveTab('hook')}
          >
            🎣 Hook Usage
          </button>
        </nav>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'simple' && <SimpleExample />}
          {activeTab === 'component' && <ComponentExample />}
          {activeTab === 'hook' && <HookExample />}
        </div>
      </main>

      {/* Application Footer */}
      <footer className="app-footer">
        <p>
          Built with ❤️ by the <a href="https://dashdig.com" target="_blank" rel="noopener noreferrer">DashDig Team</a>
        </p>
        <div className="footer-links">
          <a href="https://github.com/dashdig/dashdig-widget" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://dashdig.com/docs" target="_blank" rel="noopener noreferrer">
            Documentation
          </a>
          <a href="https://npmjs.com/package/@dashdig/widget" target="_blank" rel="noopener noreferrer">
            NPM
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;

