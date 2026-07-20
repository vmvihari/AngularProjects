import { Route } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@enterprise-workspace/feature-auth').then(m => m.FeatureAuthComponent)
  },{
    path: 'dashboard',
    loadComponent: () => import('@enterprise-workspace/feature-dashboard').then(m => m.FeatureDashboard)
  },
  {
    path: 'issues',
    canActivate: [authGuard], // <-- Protect this route!
    loadComponent: () => import('@enterprise-workspace/feature-manage').then(m => m.FeatureManage)
  },
  {
     path: 'issues/create',
     canActivate: [authGuard, roleGuard(['Admin', 'Manager', 'Developer'])], // <-- Only Admins, Managers, and Developers can access!
     loadComponent: () => import('@enterprise-workspace/feature-issue-create').then(m => m.FeatureIssueCreate)
  },
  {
    path: 'issues/:id', // <-- Notice the dynamic :id parameter!
    canActivate: [authGuard], // <-- Protect this route too!
    loadComponent: () => import('@enterprise-workspace/feature-issue-detail').then(m => m.FeatureIssueDetail)
  },
  {
    path: 'settings',
    canActivate: [authGuard, roleGuard(['Admin', 'Manager'])], // <-- Only Admins and Managers can access!
    loadComponent: () => import('@enterprise-workspace/feature-settings').then(m => m.FeatureSettings)
  },
  {
    path: '', // Default route
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];