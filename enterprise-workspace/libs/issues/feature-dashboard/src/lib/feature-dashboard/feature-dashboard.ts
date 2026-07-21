import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IssueStore } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './feature-dashboard.html',
  styleUrl: './feature-dashboard.css',
})
export class FeatureDashboard {
  public issueStore = inject(IssueStore);
}
