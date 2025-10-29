/**
 * Hook Example
 * 
 * This example demonstrates using the useDashdig hook for programmatic
 * widget control. This approach is ideal when you need fine-grained
 * control over widget behavior and want to interact with it through
 * JavaScript methods.
 */

import React, { useState, useEffect } from 'react';
import { useDashdig } from '../../../../dist/integrations/react/useDashdig';

function HookExample() {
  // Configuration for the widget
  const [config, setConfig] = useState({
    apiKey: 'demo-api-key-12345',
    position: 'bottom-left',
    theme: 'dark',
    autoShow: false
  });

  // Initialize the widget using the hook
  // The hook returns methods and state for controlling the widget
  const { 
    show,           // Function to show the widget
    hide,           // Function to hide the widget
    track,          // Function to track custom events
    isLoaded,       // Boolean: true when widget is initialized
    isVisible,      // Boolean: true when widget is visible
    widget          // Reference to the widget instance (for advanced usage)
  } = useDashdig(config.apiKey, {
    position: config.position,
    theme: config.theme,
    autoShow: config.autoShow
  });

  // Track number of custom events
  const [eventCount, setEventCount] = useState(0);

  // Log when widget loads
  useEffect(() => {
    if (isLoaded) {
      console.log('[Hook Example] Widget loaded successfully');
      console.log('[Hook Example] Widget configuration:', widget?.getConfig());
    }
  }, [isLoaded, widget]);

  /**
   * Show the widget
   */
  const handleShow = () => {
    show();
    console.log('[Hook Example] Widget shown via hook');
  };

  /**
   * Hide the widget
   */
  const handleHide = () => {
    hide();
    console.log('[Hook Example] Widget hidden via hook');
  };

  /**
   * Track a custom event with sample data
   */
  const handleTrackEvent = () => {
    const eventData = {
      action: 'button_clicked',
      timestamp: new Date().toISOString(),
      page: 'hook-example',
      count: eventCount + 1
    };
    
    track('custom_event', eventData);
    setEventCount(prev => prev + 1);
    console.log('[Hook Example] Event tracked:', eventData);
  };

  /**
   * Track page view event
   */
  const handleTrackPageView = () => {
    track('page_view', {
      page: 'hook-example',
      timestamp: new Date().toISOString()
    });
    setEventCount(prev => prev + 1);
    console.log('[Hook Example] Page view tracked');
  };

  /**
   * Track user action event
   */
  const handleTrackUserAction = () => {
    track('user_action', {
      action: 'example_interaction',
      component: 'HookExample',
      timestamp: new Date().toISOString()
    });
    setEventCount(prev => prev + 1);
    console.log('[Hook Example] User action tracked');
  };

  /**
   * Get widget configuration (advanced usage)
   */
  const handleGetConfig = () => {
    if (widget) {
      const widgetConfig = widget.getConfig();
      console.log('[Hook Example] Current widget config:', widgetConfig);
      alert(JSON.stringify(widgetConfig, null, 2));
    }
  };

  return (
    <div>
      {/* Introduction Section */}
      <div className="section">
        <h2>🎣 Hook-Based Integration</h2>
        <p>
          The <code>useDashdig</code> hook provides programmatic control over the DashDig widget.
          It returns methods for showing, hiding, and tracking events, along with state information
          about the widget's loading and visibility status.
        </p>
        <p>
          This approach is recommended when you need fine-grained control over the widget's behavior
          and want to trigger widget actions in response to application events.
        </p>
      </div>

      {/* Widget Status Section */}
      <div className="section">
        <h3>📊 Widget Status</h3>
        <div className="status-card">
          <div className="status-item">
            <span className="status-label">Widget Loaded:</span>
            <span className="status-value">
              {isLoaded ? (
                <span className="status-badge success">Yes</span>
              ) : (
                <span className="status-badge warning">No</span>
              )}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Visibility:</span>
            <span className="status-value">
              {isVisible ? (
                <span className="status-badge success">Visible</span>
              ) : (
                <span className="status-badge error">Hidden</span>
              )}
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
          <div className="status-item">
            <span className="status-label">Events Tracked:</span>
            <span className="status-value">{eventCount}</span>
          </div>
        </div>
      </div>

      {/* Visibility Controls Section */}
      <div className="section">
        <h3>👁️ Visibility Controls</h3>
        <p>
          Control when the widget appears or disappears. These methods give you full control
          over the widget's visibility state.
        </p>
        
        <div className="controls">
          <button 
            className="btn btn-primary"
            onClick={handleShow}
            disabled={!isLoaded || isVisible}
          >
            Show Widget
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={handleHide}
            disabled={!isLoaded || !isVisible}
          >
            Hide Widget
          </button>
        </div>
      </div>

      {/* Event Tracking Section */}
      <div className="section">
        <h3>📈 Event Tracking</h3>
        <p>
          Track custom events to understand user behavior. Each event can include custom
          data that helps you analyze user interactions with your application.
        </p>
        
        <div className="controls">
          <button 
            className="btn btn-success"
            onClick={handleTrackEvent}
            disabled={!isLoaded}
          >
            Track Custom Event
          </button>
          
          <button 
            className="btn btn-info"
            onClick={handleTrackPageView}
            disabled={!isLoaded}
          >
            Track Page View
          </button>
          
          <button 
            className="btn btn-warning"
            onClick={handleTrackUserAction}
            disabled={!isLoaded}
          >
            Track User Action
          </button>
        </div>

        {eventCount > 0 && (
          <div className="alert alert-success">
            <strong>Success!</strong> You've tracked {eventCount} event{eventCount !== 1 ? 's' : ''}. 
            Check the browser console for details.
          </div>
        )}
      </div>

      {/* Advanced Features Section */}
      <div className="section">
        <h3>🔧 Advanced Features</h3>
        <p>
          Access the underlying widget instance for advanced use cases. The hook exposes
          the widget instance for when you need direct access to widget methods.
        </p>
        
        <div className="controls">
          <button 
            className="btn btn-info"
            onClick={handleGetConfig}
            disabled={!isLoaded}
          >
            Get Widget Config
          </button>
        </div>
      </div>

      {/* Code Example Section */}
      <div className="section">
        <h3>💻 Implementation Code</h3>
        <p>Here's the code used in this example:</p>
        
        <div className="code-block">
          <code>{`import React from 'react';
import { useDashdig } from '@dashdig/widget/dist/integrations/react';

function HookExample() {
  // Initialize the hook with API key and options
  const { show, hide, track, isLoaded, isVisible } = useDashdig(
    'your-api-key-here',
    {
      position: 'bottom-left',
      theme: 'dark',
      autoShow: false
    }
  );

  return (
    <div>
      {/* Control widget visibility */}
      <button onClick={show} disabled={!isLoaded}>
        Show Widget
      </button>
      <button onClick={hide} disabled={!isLoaded}>
        Hide Widget
      </button>

      {/* Track custom events */}
      <button onClick={() => track('button_click', { button: 'example' })}>
        Track Event
      </button>

      {/* Display widget state */}
      <p>Widget is {isVisible ? 'visible' : 'hidden'}</p>
    </div>
  );
}

export default HookExample;`}</code>
        </div>
      </div>

      {/* Hook API Reference Section */}
      <div className="section">
        <h3>📚 Hook API Reference</h3>
        
        <div className="feature-grid">
          <div className="feature-card">
            <h3>show()</h3>
            <p>
              Display the widget on the page. Does nothing if the widget is already visible
              or not loaded yet.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>hide()</h3>
            <p>
              Hide the widget from the page. The widget remains initialized and can be
              shown again without reloading.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>track(event, data?)</h3>
            <p>
              Track a custom analytics event with optional data. Events are queued and
              sent to the API automatically.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>isLoaded</h3>
            <p>
              Boolean state indicating whether the widget has successfully loaded and
              is ready to use.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>isVisible</h3>
            <p>
              Boolean state indicating whether the widget is currently visible on the page.
              Updates automatically when show/hide is called.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>widget</h3>
            <p>
              Reference to the underlying widget instance for advanced usage. Provides
              access to additional methods like getConfig() and isShown().
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices Section */}
      <div className="section">
        <h3>✅ Best Practices</h3>
        <ul style={{ listStylePosition: 'inside', color: '#555', lineHeight: 2 }}>
          <li>Always check <code>isLoaded</code> before calling widget methods</li>
          <li>Use <code>isVisible</code> to conditionally render UI based on widget state</li>
          <li>Track meaningful events that help you understand user behavior</li>
          <li>Include relevant context data with tracked events</li>
          <li>Handle the case where the widget fails to load gracefully</li>
          <li>Use the hook at the top level of your component (React rules of hooks)</li>
        </ul>
      </div>

      {/* Loading State Message */}
      {!isLoaded && (
        <div className="alert alert-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="loading-spinner"></div>
            <span>Widget is initializing...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default HookExample;

