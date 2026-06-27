import { Routes } from '@angular/router';

import { IssueListComponent } from './issues/issue-list/issue-list.component';

export const routes: Routes = [
    // Redirect the root URL to /issues
    { path: '', redirectTo: '/issues', pathMatch: 'full' },
    // Render IssueListComponent when the URL is /issues
    { path: 'issues', component: IssueListComponent }
];
