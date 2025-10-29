/**
 * Component Example
 * 
 * This example demonstrates using the DashdigReactWidget component
 * for declarative widget integration. This approach is ideal when you
 * want the widget to be managed as a React component with automatic
 * lifecycle management.
 */

import React, { useState } from 'react';
import { DashdigReactWidget } from '../../../../dist/integrations/react/DashdigWidget';

function ComponentExample() {
  // State to control widget mounting/unmounting
  const [isWidgetMounted, setIsWidgetMounted] = useState(true);
  
  // State to control widget configuration
  const [config, setConfig] = useState({
    apiKey: 'demo-api-key-12345',
    position: 'bottom-right',
    theme: 'light',
    autoShow: true
  });

  // State for tracking load and error states
  const [loadState, setLoadState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handle widget load event
   * Called when widget successfully initializes
   */
  const handleWidgetLoad = () => {
    console.log('[Component Example] Widget loaded successfully');
    setLoadState('loaded');
    setErrorMessage('');
  };

  /**
   * Handle widget error event
   * Called when widget encounters an error during initialization
   */
  const handleWidgetError = (error) => {
    console.error('[Component Example] Widget error:', error);
    setLoadState('error');
    setErrorMessage(error.message);
  };

  /**
   * Toggle widget position between bottom-right and bottom-left
   */
  const togglePosition = () => {
    setConfig(prev => ({
      ...prev,
      position: prev.position === 'bottom-right' ? 'bottom-left' : 'bottom-right'
    }));
    // Note: Changing config will remount the widget
    setIsWidgetMounted(false);
    setTimeout(() => setIsWidgetMounted(true), 100);
  };

  /**
   * Toggle widget theme between light and dark
   */
  const toggleTheme = () => {
    setConfig(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
    // Note: Changing config will remount the widget
    setIsWidgetMounted(false);
    setTimeout(() => setIsWidgetMounted(true), 100);
  };

  /**
   * Mount/unmount the widget
   */
  const toggleMount = () => {
    setIsWidgetMounted(prev => !prev);
    if (isWidgetMounted) {
      setLoadState('idle');
    }
  };

  return (
    <div>
      {/* Introduction Section */}
      <div className="section">
        <h2>📦 Component-Based Integration</h2>
        <p>
          The <code>&lt;DashdigReactWidget&gt;</code> component provides a declarative way to integrate
          the DashDig widget into your React application. The component handles the widget lifecycle
          automatically - it initializes on mount and cleans up on unmount.
        </p>
        <p>
          This approach is recommended when you want simple, declarative integration without needing
          programmatic control over widget methods.
        </p>
      </div>

      {/* Current Configuration Section */}
      <div className="section">
        <h3>⚙️ Current Configuration</h3>
        <div className="status-card">
          <div className="status-item">
            <span className="status-label">Widget Status:</span>
            <span className="status-value">
              {isWidgetMounted ? (
                <span className="status-badge success">Mounted</span>
              ) : (
                <span className="status-badge error">Unmounted</span>
              )}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Load State:</span>
            <span className="status-value">
              {loadState === 'loaded' && <span className="status-badge success">{loadState}</span>}
              {loadState === 'error' && <span className="status-badge error">{loadState}</span>}
              {loadState === 'idle' && <span className="status-badge warning">{loadState}</span>}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">API Key:</span>
            <span className="status-value">{config.apiKey}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Position:</span>
            <span className="status-value">{config.position}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Theme:</span>
            <span className="status-value">{config.theme}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Auto Show:</span>
            <span className="status-value">{config.autoShow ? 'true' : 'false'}</span>
          </div>
        </div>

        {/* Error message display */}
        {errorMessage && (
          <div className="alert alert-warning">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="section">
        <h3>🎮 Widget Controls</h3>
        <p>
          Use these controls to test different widget configurations. Note that changing
          configuration requires remounting the widget component.
        </p>
        
        <div className="controls">
          <button 
            className="btn btn-primary"
            onClick={toggleMount}
          >
            {isWidgetMounted ? 'Unmount Widget' : 'Mount Widget'}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={togglePosition}
            disabled={!isWidgetMounted}
          >
            Toggle Position
          </button>
          
          <button 
            className="btn btn-info"
            onClick={toggleTheme}
            disabled={!isWidgetMounted}
          >
            Toggle Theme
          </button>
        </div>

        <div className="alert alert-info">
          <strong>Note:</strong> The component approach automatically manages the widget lifecycle.
          When you unmount the component, the widget is automatically destroyed and cleaned up.
        </div>
      </div>

      {/* Code Example Section */}
      <div className="section">
        <h3>💻 Implementation Code</h3>
        <p>Here's the code used in this example:</p>
        
        <div className="code-block">
          <code>{`import React from 'react';
import { DashdigReactWidget } from '@dashdig/widget/dist/integrations/react';

function ComponentExample() {
  const handleLoad = () => {
    console.log('Widget loaded!');
  };

  const handleError = (error) => {
    console.error('Widget error:', error);
  };

  return (
    <DashdigReactWidget
      apiKey="your-api-key-here"
      position="bottom-right"
      theme="light"
      autoShow={true}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}

export default ComponentExample;`}</code>
        </div>
      </div>

      {/* Features Section */}
      <div className="section">
        <h3>✨ Key Features</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🎯 Declarative</h3>
            <p>
              Simple JSX syntax makes it easy to add the widget to any component.
              No manual initialization or cleanup required.
            </p>
          </div>
          <div className="feature-card">
            <h3>♻️ Lifecycle Managed</h3>
            <p>
              Widget automatically initializes on mount and cleans up on unmount.
              React handles all the lifecycle management for you.
            </p>
          </div>
          <div className="feature-card">
            <h3>🎨 Fully Configurable</h3>
            <p>
              Pass configuration as props. All widget options are supported
              through a clean React component API.
            </p>
          </div>
          <div className="feature-card">
            <h3>🔔 Event Callbacks</h3>
            <p>
              Optional onLoad and onError callbacks let you respond to
              widget initialization events.
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices Section */}
      <div className="section">
        <h3>📚 Best Practices</h3>
        <ul style={{ listStylePosition: 'inside', color: '#555', lineHeight: 2 }}>
          <li>Mount only one widget instance per application</li>
          <li>Store API key in environment variables, not in code</li>
          <li>Use error callbacks to handle initialization failures gracefully</li>
          <li>Consider conditional rendering based on user preferences</li>
          <li>Test with different themes and positions for optimal UX</li>
        </ul>
      </div>

      {/* Render the actual widget component */}
      {isWidgetMounted && (
        <DashdigReactWidget
          apiKey={config.apiKey}
          position={config.position}
          theme={config.theme}
          autoShow={config.autoShow}
          onLoad={handleWidgetLoad}
          onError={handleWidgetError}
        />
      )}
    </div>
  );
}

export default ComponentExample;

