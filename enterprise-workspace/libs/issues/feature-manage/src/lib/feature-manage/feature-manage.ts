import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UiIssueCard } from '@enterprise-workspace/ui-issue-card';
import { UiIssueFilters } from '@enterprise-workspace/ui-issue-filters';
import { IssueService } from '@enterprise-workspace/data-access'; // Import 

@Component({
  selector: 'lib-feature-manage',
  imports: [UiIssueCard, UiIssueFilters],
  templateUrl: './feature-manage.html',
  styleUrl: './feature-manage.css',
})
export class FeatureManage {

  // Inject the service using modern Angular DI!
  private issueService = inject(IssueService);
  private router = inject(Router);

  // Expose the issues to the HTML template using a getter!
  get issues() {
    return this.issueService.getIssues();
  }

  resolveIssue(issueId: number) {
    // Tell the service to do the work!
    this.issueService.resolveIssue(issueId);
  }

  filterIssues(status: string) {
    console.log('Filtering by:', status);
  }

  viewIssue(issueId: number) {
    this.router.navigate(['/issues', issueId]);
  }
}
