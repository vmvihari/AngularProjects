import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@enterprise-workspace/feature-manage').then(m => m.FeatureManage)
  }
];