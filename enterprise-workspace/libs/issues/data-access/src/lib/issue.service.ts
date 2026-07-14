import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IssueService {
  // We moved the mock data here!
  private issues = [
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ];

  getIssues() {
    return this.issues;
  }

  getIssueById(id: number) {
    return this.issues.find(i => i.id === id);
  }

  resolveIssue(issueId: number) {
    const issue = this.issues.find(i => i.id === issueId);
    if (issue) {
      issue.status = 'Closed';
    }
  }
}