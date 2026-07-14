import { Component, inject } from '@angular/core';
import { IssueService } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-dashboard',
  imports: [],
  templateUrl: './feature-dashboard.html',
  styleUrl: './feature-dashboard.css',
})
export class FeatureDashboard {
  private issueService = inject(IssueService);

  get totalIssues() {
    return this.issueService.getIssues().length;
  }

  get openIssues() {
    return this.issueService.getIssues().filter(i => i.status === 'Open').length;
  }
}
