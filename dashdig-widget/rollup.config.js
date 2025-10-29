import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Detect development mode (watch mode)
 * In watch mode, skip minification for faster builds
 */
const isProduction = !process.env.ROLLUP_WATCH;

/**
 * Check which bundle to build (if specified)
 * Usage: rollup -c --environment BUILD:react
 */
const buildTarget = process.env.BUILD;

/**
 * Enable bundle analysis
 * Usage: rollup -c --environment ANALYZE
 */
const shouldAnalyze = process.env.ANALYZE === 'true' || process.env.ANALYZE === '1';

/**
 * Get plugins for a bundle
 * @param {boolean} enableTerser - Whether to enable minification
 * @param {string} bundleName - Name for the visualizer output
 * @param {boolean} isVueBuild - Whether this is a Vue build (adds Vue plugin)
 */
function getPlugins(enableTerser = true, bundleName = 'bundle', isVueBuild = false) {
  const plugins = [];
  
  // Add Vue plugin for Vue builds (must come before TypeScript)
  if (isVueBuild) {
    plugins.push(
      vue({
        isProduction: isProduction,
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('dashdig-')
          }
        }
      })
    );
  }
  
  // Resolve node modules
  plugins.push(
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue']
    })
  );
  
  // Convert CommonJS modules to ES6
  plugins.push(commonjs());
  
  // Compile TypeScript
  plugins.push(
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationMap: true,
      sourceMap: true
    })
  );

  // Add terser minification only in production
  if (enableTerser && isProduction) {
    plugins.push(
      terser({
        compress: {
          drop_console: false,
          pure_funcs: ['console.log'],
          passes: 2
        },
        output: {
          comments: false
        },
        mangle: {
          safari10: true
        }
      })
    );
  }

  // Add bundle analyzer if enabled
  if (shouldAnalyze) {
    plugins.push(
      visualizer({
        filename: `dist/stats-${bundleName}.html`,
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap'
      })
    );
  }

  return plugins;
}

// ============================================================================
// Bundle Configurations
// ============================================================================

const allBundles = [
  // ==========================================================================
  // 1. Standalone/Embed Bundle - Vanilla JavaScript
  // ==========================================================================
  
  /**
   * UMD Bundle - For script tag usage
   * Includes all core files, can be used directly in browsers
   */
  {
    _target: 'core',
    input: 'src/standalone/embed.ts',
    output: {
      file: 'dist/dashdig.min.js',
      format: 'umd',
      name: 'Dashdig',
      sourcemap: true,
      globals: {}
    },
    plugins: getPlugins(true, 'core-umd')
  },

  /**
   * ESM Bundle - For modern bundlers with tree-shaking
   */
  {
    _target: 'core',
    input: 'src/standalone/embed.ts',
    output: {
      file: 'dist/dashdig.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: getPlugins(true, 'core-esm')
  },

  // ==========================================================================
  // 2. React Integration Bundle
  // ==========================================================================
  
  /**
   * UMD Bundle - For script tag usage with React
   * Expects React and ReactDOM to be available globally
   */
  {
    _target: 'react',
    input: 'src/integrations/react/index.ts',
    output: {
      file: 'dist/dashdig-react.min.js',
      format: 'umd',
      name: 'DashdigReact',
      sourcemap: true,
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
      }
    },
    external: ['react', 'react-dom'],
    plugins: getPlugins(true, 'react-umd')
  },

  /**
   * ESM Bundle - For modern React apps using bundlers
   * Better tree-shaking support
   */
  {
    _target: 'react',
    input: 'src/integrations/react/index.ts',
    output: {
      file: 'dist/dashdig-react.esm.js',
      format: 'esm',
      sourcemap: true
    },
    external: ['react', 'react-dom'],
    plugins: getPlugins(true, 'react-esm')
  }

  // ==========================================================================
  // NOTE: Vue and Angular bundles temporarily disabled
  // ==========================================================================
  // Vue and Angular integration bundles will be added later after additional
  // plugin configuration and testing. For now, we're focusing on getting the
  // core vanilla JavaScript bundle and React integration ready for deployment.
  //
  // To enable Vue bundles, uncomment the Vue configuration below and ensure
  // @vitejs/plugin-vue is properly configured in getPlugins().
  //
  // To enable Angular bundles, uncomment the Angular configuration below.
  // ==========================================================================

  // // ==========================================================================
  // // 3. Vue 3 Integration Bundle (DISABLED - Coming Soon)
  // // ==========================================================================
  // 
  // /**
  //  * UMD Bundle - For script tag usage with Vue 3
  //  * Expects Vue to be available globally
  //  */
  // {
  //   _target: 'vue',
  //   input: 'src/integrations/vue/index.ts',
  //   output: {
  //     file: 'dist/dashdig-vue.min.js',
  //     format: 'umd',
  //     name: 'DashdigVue',
  //     sourcemap: true,
  //     globals: {
  //       'vue': 'Vue'
  //     }
  //   },
  //   external: ['vue'],
  //   plugins: getPlugins(true, 'vue-umd', true)
  // },
  //
  // /**
  //  * ESM Bundle - For Vue 3 apps using Vite or other modern bundlers
  //  * Better tree-shaking support
  //  */
  // {
  //   _target: 'vue',
  //   input: 'src/integrations/vue/index.ts',
  //   output: {
  //     file: 'dist/dashdig-vue.esm.js',
  //     format: 'esm',
  //     sourcemap: true
  //   },
  //   external: ['vue'],
  //   plugins: getPlugins(true, 'vue-esm', true)
  // },

  // // ==========================================================================
  // // 4. Angular Integration Bundle (DISABLED - Coming Soon)
  // // ==========================================================================
  // 
  // /**
  //  * UMD Bundle - For script tag usage with Angular
  //  * Expects Angular core and common to be available globally
  //  */
  // {
  //   _target: 'angular',
  //   input: 'src/integrations/angular/index.ts',
  //   output: {
  //     file: 'dist/dashdig-angular.min.js',
  //     format: 'umd',
  //     name: 'DashdigAngular',
  //     sourcemap: true,
  //     globals: {
  //       '@angular/core': 'ng.core',
  //       '@angular/common': 'ng.common'
  //     }
  //   },
  //   external: [
  //     '@angular/core',
  //     '@angular/common',
  //     'rxjs',
  //     'rxjs/operators'
  //   ],
  //   plugins: getPlugins(true, 'angular-umd')
  // },
  //
  // /**
  //  * ESM Bundle - For Angular apps using Angular CLI
  //  * Better tree-shaking support
  //  */
  // {
  //   _target: 'angular',
  //   input: 'src/integrations/angular/index.ts',
  //   output: {
  //     file: 'dist/dashdig-angular.esm.js',
  //     format: 'esm',
  //     sourcemap: true
  //   },
  //   external: [
  //     '@angular/core',
  //     '@angular/common',
  //     'rxjs',
  //     'rxjs/operators'
  //   ],
  //   plugins: getPlugins(true, 'angular-esm')
  // }
];

// ============================================================================
// Export Configuration
// ============================================================================

/**
 * Filter bundles based on BUILD environment variable
 * If BUILD is set, only export bundles matching that target
 * Otherwise, export all bundles
 */
export default buildTarget
  ? allBundles.filter(bundle => bundle._target === buildTarget)
  : allBundles;

