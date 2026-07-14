import { Route } from '@angular/router';
import { authGuard } from '@enterprise-workspace/data-access';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () => import('@enterprise-workspace/feature-dashboard').then(m => m.FeatureDashboard)
  },
  {
    path: 'issues',
    canActivate: [authGuard], // <-- Protect this route!
    loadComponent: () => import('@enterprise-workspace/feature-manage').then(m => m.FeatureManage)
  },
  {
    path: 'issues/:id', // <-- Notice the dynamic :id parameter!
    canActivate: [authGuard], // <-- Protect this route too!
    loadComponent: () => import('@enterprise-workspace/feature-issue-detail').then(m => m.FeatureIssueDetail)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('@enterprise-workspace/feature-settings').then(m => m.FeatureSettings)
  },
  {
    path: '', // Default route
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];