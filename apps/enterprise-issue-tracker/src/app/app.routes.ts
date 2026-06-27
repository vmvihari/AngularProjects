import { Routes } from '@angular/router';

import { IssueListComponent } from './issues/issue-list/issue-list.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    // Redirect the root URL to /issues
    { path: '', redirectTo: '/issues', pathMatch: 'full' },   
    // The guard is applied here:
    {
        path: 'issues/new',
        loadComponent: () => import('./issues/issue-create/issue-create.component').then(m => m.IssueCreateComponent),
        //canActivate: [authGuard]
    },    
    // Lazy loaded route!
    {
        path: 'issues/:id',
        loadComponent: () => import('./issues/issue-detail/issue-detail.component').then(m => m.IssueDetailComponent)
    },
    // Render IssueListComponent when the URL is /issues
    { path: 'issues', component: IssueListComponent }
];
