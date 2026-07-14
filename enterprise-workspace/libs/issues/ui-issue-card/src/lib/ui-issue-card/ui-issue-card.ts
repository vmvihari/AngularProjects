import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UiCard } from '@enterprise-workspace/ui-card';

@Component({
  selector: 'lib-ui-issue-card',
  imports: [UiCard],
  templateUrl: './ui-issue-card.html',
  styleUrl: './ui-issue-card.css',
})
export class UiIssueCard {
  @Input({ required: true }) issue!: any;
  @Output() resolve = new EventEmitter<number>();

  onResolve() {
    this.resolve.emit(this.issue.id);
  }
}
