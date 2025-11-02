import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/component',
    pathMatch: 'full'
  },
  {
    path: 'component',
    loadComponent: () => import('./examples/component-example/component-example.component')
      .then(m => m.ComponentExampleComponent)
  },
  {
    path: 'service',
    loadComponent: () => import('./examples/service-example/service-example.component')
      .then(m => m.ServiceExampleComponent)
  },
  {
    path: 'standalone',
    loadComponent: () => import('./examples/standalone-example/standalone-example.component')
      .then(m => m.StandaloneExampleComponent)
  },
  {
    path: 'module',
    loadComponent: () => import('./examples/module-example/module-example.component')
      .then(m => m.ModuleExampleComponent)
  }
];


