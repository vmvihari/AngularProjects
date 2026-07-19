import { Component, input, inject, computed, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssueStore } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-issue-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './feature-issue-detail.html',
  styleUrl: './feature-issue-detail.css',
})
export class FeatureIssueDetail {
  private issueStore = inject(IssueStore);
  
  // 1. Upgrade to a Signal Input!
  id = input.required<string>(); 

  // 2. Upgrade to a Computed Signal!
  // It automatically recalculates whenever the URL 'id' changes!
  issue = computed(() => this.issueStore.getIssueById(Number(this.id())));

  // 3. Create a Linked Signal!
  // It defaults to the issue's title, but can be overwritten by the user!
  draftTitle = linkedSignal(() => this.issue()?.title ?? '');

  // 4. Success state signal
  showSuccess = signal(false);

  saveTitle() {
    const currentIssue = this.issue();
    if (currentIssue) {
      this.issueStore.updateTitle(currentIssue.id, this.draftTitle());
      
      // Show success message briefly
      this.showSuccess.set(true);
      setTimeout(() => this.showSuccess.set(false), 2500);
    }
  }
}
