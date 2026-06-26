import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IssueListComponent } from './issue-list/issue-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IssueListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'enterprise-issue-tracker';

  // The data now lives in the parent
  issuesList = [
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ];

  // The method to handle the output event
  onResolveIssue(issueId: number) {
    const issue = this.issuesList.find(i => i.id === issueId);
    if (issue) {
      issue.status = 'Closed';
    }
  }
}
