/**
 * DashDig Widget - React Integration
 * Export all React components and hooks
 */

// Export component (rename to avoid conflict with core widget class)
export { DashdigReactWidget as DashdigWidget, default as default } from './DashdigWidget';
export type { DashdigWidgetProps } from './DashdigWidget';

// Export hook
export { useDashdig } from './useDashdig';
export type { UseDashdigOptions, UseDashdigReturn } from './useDashdig';

// Re-export core types for convenience
export type { DashdigConfig } from '../../core/widget';

