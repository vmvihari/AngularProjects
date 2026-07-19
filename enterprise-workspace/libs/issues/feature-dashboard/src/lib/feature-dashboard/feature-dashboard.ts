import { Component, inject } from '@angular/core';
import { IssueStore } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-dashboard',
  imports: [],
  templateUrl: './feature-dashboard.html',
  styleUrl: './feature-dashboard.css',
})
export class FeatureDashboard {
  public issueStore = inject(IssueStore);
}
