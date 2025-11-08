/**
 * Simple React Example - Quick Start
 * 
 * This example shows the simplest way to integrate DashDig widget
 * Copy this code to get started in 30 seconds!
 */

import React from 'react';
import { DashdigWidget } from '@dashdig/widget/react';

function SimpleExample() {
  return (
    <div className="simple-example">
      <h1>🚀 DashDig Widget - Quick Start</h1>
      <p>This is the simplest way to add DashDig to your React app!</p>

      {/* 
        BASIC USAGE - Just 3 props! 
        ============================
        Replace with your actual API key
      */}
      <DashdigWidget 
        apiKey="ddg_test_key_12345"
        position="bottom-right"
        theme="light"
      />

      <div className="info">
        <h2>✅ That's it! The widget is now active.</h2>
        <p>It will automatically track page views and user interactions.</p>
      </div>

      <div className="code-example">
        <h3>The Code:</h3>
        <pre><code>{`import { DashdigWidget } from '@dashdig/widget/react';

function App() {
  return (
    <DashdigWidget 
      apiKey="your-api-key"
      position="bottom-right"
      theme="light"
    />
  );
}`}</code></pre>
      </div>

      <div className="next-steps">
        <h3>Next Steps:</h3>
        <ul>
          <li>✅ Get your API key from <a href="https://dashdig.com" target="_blank">dashdig.com</a></li>
          <li>✅ Replace "ddg_test_key_12345" with your real key</li>
          <li>✅ Check the Component Example tab for advanced features</li>
          <li>✅ Check the Hook Example tab for programmatic control</li>
        </ul>
      </div>

      <style jsx>{`
        .simple-example {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .info {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #d4edda;
          border-left: 4px solid #28a745;
          border-radius: 8px;
        }

        .info h2 {
          color: #155724;
          margin-bottom: 0.5rem;
        }

        .code-example {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .code-example pre {
          background: #272822;
          color: #f8f8f2;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
        }

        .next-steps {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #d1ecf1;
          border-left: 4px solid #0c5460;
          border-radius: 8px;
        }

        .next-steps ul {
          list-style: none;
          padding-left: 0;
        }

        .next-steps li {
          padding: 0.5rem 0;
          font-size: 1.1rem;
        }

        a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default SimpleExample;

