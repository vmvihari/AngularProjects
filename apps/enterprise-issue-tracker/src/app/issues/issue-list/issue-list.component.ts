import { Component, input, output, inject } from '@angular/core';

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

  onSaveEdit() {
    const selected = this.issueService.selectedIssue();
    if (selected) {
      this.issueService.updateIssueTitle(selected.id, this.issueService.draftTitle());
      this.issueService.selectedIssue.set(null); // <-- Add this line to hide the form!
    }
  }
}
