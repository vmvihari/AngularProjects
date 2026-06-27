import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { IssueCardComponent } from '../issue-card/issue-card.component'; // Import the wrapper
import { IssueService } from '../issue.service'; // Import the service

@Component({
    selector: 'app-issue-list',
    imports: [IssueCardComponent], // Add to imports
    templateUrl: './issue-list.component.html',
    styleUrl: './issue-list.component.css'
})
export class IssueListComponent {
  // Inject the service to access the resource and methods
  issueService = inject(IssueService); 
  // Inject the router service to navigate to the issue detail page
  router = inject(Router);

  onSaveEdit() {
    const selected = this.issueService.selectedIssue();
    if (selected) {
      this.issueService.updateIssueTitle(selected.id, this.issueService.draftTitle());
      this.issueService.selectedIssue.set(null); // <-- Add this line to hide the form!
    }
  }

  viewDetails(id: number) {
    // Programmatic navigation to the issue detail page
    this.router.navigate(['/issues', id]); 
  }
}
