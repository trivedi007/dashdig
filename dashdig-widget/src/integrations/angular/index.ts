/**
 * DashDig Widget - Angular Integration
 * Export all Angular module, components, and services
 */

// Export module
export { DashdigModule, DASHDIG_CONFIG } from './dashdig.module';
export type { DashdigConfig } from './dashdig.module';

// Export component
export { DashdigComponent } from './dashdig.component';

// Export service
export { DashdigService } from './dashdig.service';

// Re-export core widget for advanced usage
export { default as DashdigWidget } from '../../core/widget';
export type { DashdigConfig as CoreDashdigConfig } from '../../core/widget';


