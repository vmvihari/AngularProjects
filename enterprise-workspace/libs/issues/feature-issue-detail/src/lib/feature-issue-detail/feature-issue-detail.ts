import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssueService } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-issue-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './feature-issue-detail.html',
  styleUrl: './feature-issue-detail.css',
})
export class FeatureIssueDetail {
  private issueService = inject(IssueService);
  
  // Angular will automatically populate this from the URL (e.g. /issues/1)
  // Note: URL parameters are always strings, so we must define it as a string!
  @Input() id!: string; 

  get issue() {
    // Convert the string ID back to a number to query our service
    return this.issueService.getIssueById(Number(this.id));
  }
}
