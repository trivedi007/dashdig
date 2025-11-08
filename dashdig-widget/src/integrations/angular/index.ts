/**
 * DashDig Widget - Angular Integration
 * Export all Angular module, components, and services
 */

// Export configuration
export { DASHDIG_CONFIG } from './dashdig.config';
export type { DashdigConfig } from './dashdig.config';

// Export module
export { DashdigModule } from './dashdig.module';

// Export component
export { DashdigComponent } from './dashdig.component';

// Export service
export { DashdigService } from './dashdig.service';

// Re-export core widget for advanced usage
export { default as DashdigWidget } from '../../core/widget';
export type { DashdigConfig as CoreDashdigConfig } from '../../core/widget';


