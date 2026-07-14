import { Component } from '@angular/core';
import { UiIssueCard } from '@enterprise-workspace/ui-issue-card';
import { UiIssueFilters } from '@enterprise-workspace/ui-issue-filters';

@Component({
  selector: 'lib-feature-manage',
  imports: [UiIssueCard, UiIssueFilters],
  templateUrl: './feature-manage.html',
  styleUrl: './feature-manage.css',
})
export class FeatureManage {
  // Mock data representing our issues
  issues = [
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ];

  resolveIssue(issueId: number) {
    // Find the issue by ID and update its status to 'Closed'
    const issue = this.issues.find(i => i.id === issueId);
    if (issue) {
      issue.status = 'Closed';
    }
  }

  filterIssues(status: string) {
    console.log('Filtering by:', status);
  }
}
