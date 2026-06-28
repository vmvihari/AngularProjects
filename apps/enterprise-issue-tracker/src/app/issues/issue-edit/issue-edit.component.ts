import { Component, inject } from '@angular/core';

import { IssueService } from '../issue.service';
import { ToastService } from '../../shared/service/toast.service';

@Component({
  selector: 'app-issue-edit',
  imports: [],
  templateUrl: './issue-edit.component.html',
  styleUrl: './issue-edit.component.css'
})
export class IssueEditComponent {
  issueService = inject(IssueService);
  toastService = inject(ToastService);

  onSaveEdit() {
    const selected = this.issueService.selectedIssue();
    if (selected) {
      this.issueService.updateIssueTitle(selected.id, this.issueService.draftTitle());
      this.issueService.selectedIssue.set(null); // <-- Add this line to hide the form!
      
      // Programmatically spawn the toast!
      this.toastService.show('Issue successfully updated!');
    }
  }
}
