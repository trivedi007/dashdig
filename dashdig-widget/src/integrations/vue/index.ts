/**
 * DashDig Widget - Vue 3 Integration
 * Export all Vue components, composables, and plugins
 */

// Export component
// Note: DashdigWidget.vue will be handled by vue plugin at build time
export { default as DashdigWidget } from './DashdigWidget.vue';

// Export composable
export { useDashdig } from './composable';
export type { UseDashdigOptions, UseDashdigReturn } from './composable';

// Export plugin
export { DashdigPlugin, default as default } from './plugin';
export type { DashdigPluginOptions, DashdigGlobal } from './plugin';

// Re-export core types for convenience
export type { DashdigConfig } from '../../core/widget';

