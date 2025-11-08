'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console for debugging
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('🚨 Error Boundary Caught Error:')
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('Error:', error)
    console.error('Error Message:', error.message)
    console.error('Error Stack:', error.stack)
    console.error('Component Stack:', errorInfo.componentStack)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    this.setState({ errorInfo })
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Error Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <i className="fas fa-exclamation-triangle text-3xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Oops! Something went wrong
                  </h2>
                  <p className="text-red-100">
                    We encountered an unexpected error
                  </p>
                </div>
              </div>
            </div>

            {/* Error Details */}
            <div className="p-6 space-y-6">
              {/* Error Message */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Error Message
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-900 font-mono text-sm">
                    {this.state.error?.message || 'Unknown error occurred'}
                  </p>
                </div>
              </div>

              {/* Error Stack (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Stack Trace
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
                    window.location.reload()
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-200 hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <i className="fas fa-sync-alt"></i>
                  Reload Page
                </button>
                
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
                    window.history.back()
                  }}
                  className="flex-1 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-arrow-left"></i>
                  Go Back
                </button>
              </div>

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 font-semibold mb-1">
                      What to do next?
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Try reloading the page</li>
                      <li>• Check your internet connection</li>
                      <li>• Clear your browser cache and try again</li>
                      <li>• If the problem persists, please contact support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional component wrapper for easier use
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

