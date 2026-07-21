import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { UiCard } from '@enterprise-workspace/ui-card';
import { AuthStore } from '@enterprise-workspace/shared-util-auth'; // <-- Import the Store!

@Component({
  selector: 'lib-ui-issue-card',
  imports: [UiCard],
  templateUrl: './ui-issue-card.html',
  styleUrl: './ui-issue-card.css',
})
export class UiIssueCard {
  // Inject the Store!
  public authStore = inject(AuthStore);
  
  @Input({ required: true }) issue!: any;
  @Output() resolve = new EventEmitter<number>();
  @Output() view = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  onResolve() {
    this.resolve.emit(this.issue.id);
  }

  onView() {
    this.view.emit();
  }

  onEdit() {
    this.edit.emit();
  }
}
