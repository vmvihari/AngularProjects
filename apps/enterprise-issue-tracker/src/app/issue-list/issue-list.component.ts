import { Component, input, output } from '@angular/core';

import { IssueCardComponent } from '../issue-card/issue-card.component'; // Import the wrapper

@Component({
    selector: 'app-issue-list',
    imports: [IssueCardComponent], // Add to imports
    templateUrl: './issue-list.component.html',
    styleUrl: './issue-list.component.css'
})
export class IssueListComponent {
  // Input: expects an array of issues from the parent
  issues = input<{ id: number; title: string; status: string }[]>();

  // Output: emits the ID of the issue to resolve
  resolveIssue = output<number>();

  // New output
  editIssue = output<number>();
}
