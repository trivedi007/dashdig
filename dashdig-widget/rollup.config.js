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
  
  // Resolve node modules with tree-shaking optimization
  plugins.push(
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue'],
      // Enable module side effects tracking for better tree-shaking
      modulesOnly: true,
      // Dedupe dependencies
      dedupe: ['react', 'react-dom', 'vue', '@angular/core']
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

  // Add terser minification only in production with aggressive optimization
  if (enableTerser && isProduction) {
    plugins.push(
      terser({
        compress: {
          drop_console: true,  // Remove all console statements
          drop_debugger: true,  // Remove debugger statements
          pure_funcs: ['console.log', 'console.debug', 'console.info', 'console.warn'],  // Remove unused functions
          passes: 3,  // More passes for better optimization
          unsafe: true,  // Enable unsafe optimizations
          unsafe_arrows: true,  // Convert arrow functions
          unsafe_comps: true,  // Optimize comparisons
          unsafe_math: true,  // Optimize math operations
          unsafe_methods: true,  // Optimize method calls
          dead_code: true,  // Remove dead code
          collapse_vars: true,  // Collapse single-use variables
          reduce_vars: true,  // Reduce variables
          hoist_props: true,  // Hoist property accesses
          join_vars: true,  // Join variable declarations
          loops: true,  // Optimize loops
          toplevel: true,  // Enable top-level optimizations
          booleans_as_integers: true  // Convert booleans to integers
        },
        output: {
          comments: false,
          ecma: 2020  // Use modern ES syntax for smaller output
        },
        mangle: {
          safari10: true,
          toplevel: true,  // Mangle top-level names
          properties: {
            regex: /^_/  // Mangle properties starting with underscore
          }
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
  // 1. Standalone/Embed Bundle - Vanilla JavaScript (URL Shortener)
  // ==========================================================================
  
  /**
   * UMD Bundle - For script tag usage
   * Includes URL shortening and analytics tracking
   * Target: < 2KB gzipped
   */
  {
    _target: 'core',
    input: 'src/standalone/index.ts',
    output: {
      file: 'dist/dashdig.min.js',
      format: 'umd',
      name: 'Dashdig',
      sourcemap: true,
      globals: {},
      compact: true,
      // Inline dynamic imports for smaller bundle
      inlineDynamicImports: true
    },
    plugins: getPlugins(true, 'core-umd'),
    // Aggressive tree-shaking for smallest bundle
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
      unknownGlobalSideEffects: false,
      // Remove unused code
      correctVarValueBeforeDeclaration: false
    }
  },

  /**
   * ESM Bundle - For modern bundlers with tree-shaking
   * Target: < 2KB gzipped
   */
  {
    _target: 'core',
    input: 'src/standalone/index.ts',
    output: {
      file: 'dist/dashdig.esm.js',
      format: 'esm',
      sourcemap: true,
      compact: true,
      // Inline for smallest size
      inlineDynamicImports: true
    },
    plugins: getPlugins(true, 'core-esm'),
    // Maximum tree-shaking for ESM
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
      unknownGlobalSideEffects: false,
      correctVarValueBeforeDeclaration: false
    }
  },

  // ==========================================================================
  // 2. React Integration Bundle
  // ==========================================================================
  
  /**
   * UMD Bundle - For script tag usage with React
   * Expects React and ReactDOM to be available globally
   * Target: < 5KB gzipped (with Provider, Hook, and Component)
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
      },
      compact: true,
      inlineDynamicImports: true
    },
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    plugins: getPlugins(true, 'react-umd'),
    // Maximum tree-shaking for React bundle
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
      unknownGlobalSideEffects: false,
      correctVarValueBeforeDeclaration: false
    }
  },

  /**
   * ESM Bundle - For modern React apps using bundlers
   * Better tree-shaking support
   * Target: < 5KB gzipped
   */
  {
    _target: 'react',
    input: 'src/integrations/react/index.ts',
    output: {
      file: 'dist/dashdig-react.esm.js',
      format: 'esm',
      sourcemap: true,
      compact: true,
      inlineDynamicImports: true
    },
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    plugins: getPlugins(true, 'react-esm'),
    // Maximum tree-shaking for React ESM
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
      unknownGlobalSideEffects: false,
      correctVarValueBeforeDeclaration: false
    }
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

