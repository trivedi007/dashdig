'use client'

/**
 * Dashboard Styles Demo Page
 * 
 * This page demonstrates all the utility classes and components
 * available in the dashboard.css global stylesheet.
 */

export default function StylesDemoPage() {
  return (
    <div className="p-8 bg-gray">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Dashboard Styles Demo
          </h1>
          <p className="text-secondary">
            Explore all available utility classes and components from dashboard.css
          </p>
        </div>

        {/* Buttons Section */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="text-2xl font-semibold">Buttons</h2>
          </div>
          <div className="card-body">
            <div className="flex flex-wrap gap-3 mb-4">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-primary btn-sm">Small Primary</button>
              <button className="btn-primary btn-lg">Large Primary</button>
              <button className="btn-primary" disabled>
                Disabled Primary
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <button className="btn-secondary">Secondary Button</button>
              <button className="btn-secondary btn-sm">Small Secondary</button>
              <button className="btn-secondary btn-lg">Large Secondary</button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn-icon" title="Home">
                🏠
              </button>
              <button className="btn-icon" title="Settings">
                ⚙️
              </button>
              <button className="btn-icon" title="Delete">
                🗑️
              </button>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="text-2xl font-semibold">Typography</h2>
          </div>
          <div className="card-body">
            <div className="mb-6">
              <h1 className="mb-2">Heading 1 (h1)</h1>
              <h2 className="mb-2">Heading 2 (h2)</h2>
              <h3 className="mb-2">Heading 3 (h3)</h3>
              <h4 className="mb-2">Heading 4 (h4)</h4>
              <h5 className="mb-2">Heading 5 (h5)</h5>
              <h6 className="mb-2">Heading 6 (h6)</h6>
            </div>
            <div className="mb-6">
              <p className="text-4xl mb-2">Text 4XL (36px)</p>
              <p className="text-3xl mb-2">Text 3XL (30px)</p>
              <p className="text-2xl mb-2">Text 2XL (24px)</p>
              <p className="text-xl mb-2">Text XL (20px)</p>
              <p className="text-lg mb-2">Text Large (18px)</p>
              <p className="text-base mb-2">Text Base (16px)</p>
              <p className="text-sm mb-2">Text Small (14px)</p>
              <p className="text-xs mb-2">Text XS (12px)</p>
            </div>
            <div className="mb-4">
              <p className="font-normal mb-2">Normal Weight (400)</p>
              <p className="font-medium mb-2">Medium Weight (500)</p>
              <p className="font-semibold mb-2">Semibold Weight (600)</p>
              <p className="font-bold mb-2">Bold Weight (700)</p>
            </div>
            <div>
              <p className="text-primary mb-2">Primary Text Color</p>
              <p className="text-secondary mb-2">Secondary Text Color</p>
              <p className="text-muted mb-2">Muted Text Color</p>
              <p className="text-orange mb-2">Orange Text Color</p>
              <p className="text-success mb-2">Success Text Color</p>
              <p className="text-error mb-2">Error Text Color</p>
            </div>
          </div>
        </section>

        {/* Card Variants Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Card Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-2">Standard Card</h3>
                <p className="text-secondary">
                  Default card with subtle shadow
                </p>
              </div>
            </div>
            <div className="card card-flat">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-2">Flat Card</h3>
                <p className="text-secondary">Card without shadow</p>
              </div>
            </div>
            <div className="card card-elevated">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
                <p className="text-secondary">Card with larger shadow</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stat Cards Grid */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Stat Cards Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="card card-hoverable">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-light rounded-lg">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-secondary font-semibold">
                      TOTAL URLS
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">42</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card card-hoverable">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-light rounded-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-secondary font-semibold">
                      TOTAL CLICKS
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      12,345
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card card-hoverable">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-success-light rounded-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-secondary font-semibold">
                      AVG CLICKS
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">293</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card card-hoverable">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-success-light rounded-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-secondary font-semibold">
                      ACTIVE LINKS
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">38</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alert Boxes */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="text-2xl font-semibold">Alert Boxes</h2>
          </div>
          <div className="card-body">
            <div className="flex flex-col gap-4">
              {/* Success Alert */}
              <div className="flex items-start gap-3 p-4 bg-success-light border border-success rounded-lg">
                <span className="text-success text-xl">✓</span>
                <div className="flex-1">
                  <p className="font-semibold text-success mb-1">Success!</p>
                  <p className="text-sm text-primary">
                    Your link has been created successfully.
                  </p>
                </div>
              </div>

              {/* Error Alert */}
              <div className="flex items-start gap-3 p-4 bg-error-light border border-error rounded-lg">
                <span className="text-error text-xl">✕</span>
                <div className="flex-1">
                  <p className="font-semibold text-error mb-1">Error</p>
                  <p className="text-sm text-primary">
                    Something went wrong. Please try again.
                  </p>
                </div>
              </div>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-info-blue-light border border-info-blue rounded-lg">
                <span className="text-info text-xl">ℹ</span>
                <div className="flex-1">
                  <p className="font-semibold text-info mb-1">Information</p>
                  <p className="text-sm text-primary">
                    Your API key will expire in 30 days.
                  </p>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="flex items-start gap-3 p-4 bg-warning-amber-light border border-warning-amber rounded-lg">
                <span className="text-warning text-xl">⚠</span>
                <div className="flex-1">
                  <p className="font-semibold text-warning mb-1">Warning</p>
                  <p className="text-sm text-primary">
                    Keep your API key secure and never commit it to public
                    repositories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="text-2xl font-semibold">Form Elements</h2>
          </div>
          <div className="card-body">
            <div className="flex flex-col gap-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Text Input
                </label>
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Email Input
                </label>
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  URL Input
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full"
                />
                <p className="text-xs text-secondary mt-1">
                  Enter the full URL including https://
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Textarea
                </label>
                <textarea
                  placeholder="Enter description..."
                  rows={4}
                  className="w-full"
                />
              </div>
              <div>
                <button className="btn-primary w-full">Submit Form</button>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing Examples */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="text-2xl font-semibold">Spacing Utilities</h2>
          </div>
          <div className="card-body">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold mb-2">Margin Examples:</p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-2 bg-slate rounded">
                    <code className="text-xs">.mt-1</code>
                  </div>
                  <div className="px-3 py-2 bg-slate rounded">
                    <code className="text-xs">.mt-2</code>
                  </div>
                  <div className="px-3 py-2 bg-slate rounded">
                    <code className="text-xs">.mt-3</code>
                  </div>
                  <div className="px-3 py-2 bg-slate rounded">
                    <code className="text-xs">.mt-4</code>
                  </div>
                  <div className="px-3 py-2 bg-slate rounded">
                    <code className="text-xs">.mt-5</code>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Padding Examples:</p>
                <div className="flex flex-wrap gap-2">
                  <div className="p-1 bg-slate rounded">
                    <code className="text-xs">.p-1</code>
                  </div>
                  <div className="p-2 bg-slate rounded">
                    <code className="text-xs">.p-2</code>
                  </div>
                  <div className="p-3 bg-slate rounded">
                    <code className="text-xs">.p-3</code>
                  </div>
                  <div className="p-4 bg-slate rounded">
                    <code className="text-xs">.p-4</code>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Gap Examples:</p>
                <div className="flex gap-1 mb-2">
                  <div className="w-12 h-12 bg-orange rounded"></div>
                  <div className="w-12 h-12 bg-orange rounded"></div>
                  <div className="w-12 h-12 bg-orange rounded"></div>
                </div>
                <p className="text-xs text-secondary">
                  <code>.flex .gap-1</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Grid */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="text-2xl font-semibold">Responsive Grid</h2>
            <p className="text-sm text-secondary mt-1">
              Resize your browser to see the grid adapt
            </p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div
                  key={num}
                  className="flex items-center justify-center h-24 bg-orange-light rounded-lg text-orange font-bold"
                >
                  Item {num}
                </div>
              ))}
            </div>
            <p className="text-xs text-secondary mt-4">
              <code>
                .grid .grid-cols-1 .md:grid-cols-2 .lg:grid-cols-4 .gap-4
              </code>
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="card">
          <div className="card-body text-center">
            <p className="text-secondary">
              📚 For complete documentation, see{' '}
              <code className="px-2 py-1 bg-slate rounded text-xs">
                /styles/USAGE_GUIDE.md
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


