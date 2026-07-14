import { Injectable, resource, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IssueService {
  // 1. Replace 'signal' with 'resource'
  private issuesResource = resource({
    loader: async () => {
      // Simulate a 1-second network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { id: 1, title: 'Fix login validation', status: 'Open' },
        { id: 2, title: 'Update routing module', status: 'Closed' },
        { id: 3, title: 'Build issue list component', status: 'Open' }
      ];
    }
  });

  // 2. Expose the data and loading state
  // Notice the fallback to `?? []` since resource.value() is undefined while loading!
  issues = computed(() => this.issuesResource.value() ?? []);
  isLoading = this.issuesResource.isLoading;
  // 2. Create Computed Signals for our Dashboard!
  // These will ONLY recalculate when the 'state' signal actually changes.
  totalIssuesCount = computed(() => this.issues().length);
  openIssuesCount = computed(() => this.issues().filter(i => i.status === 'Open').length);

  getIssueById(id: number) {
    return this.issues().find(i => i.id === id);
  }

  resolveIssue(issueId: number) {
    this.issuesResource.value.update(currentIssues => 
      (currentIssues ?? []).map(issue => 
        issue.id === issueId ? { ...issue, status: 'Closed' } : issue
      )
    );
  }

  updateTitle(issueId: number, newTitle: string) {
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue => 
        issue.id === issueId ? { ...issue, title: newTitle } : issue
      )
    );
  }
}