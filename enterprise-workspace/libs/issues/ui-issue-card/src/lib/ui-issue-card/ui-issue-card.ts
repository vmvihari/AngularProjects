import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { UiCard } from '@enterprise-workspace/ui-card';
import { AuthStore } from '@enterprise-workspace/shared-util-auth'; // <-- Import the Store!
// 🔥 Import the new directives!
import { StatusHighlightDirective, TooltipDirective } from '@enterprise-workspace/ui-directives';
import { TimeAgoPipe } from '@enterprise-workspace/ui-pipes';
import { UiButton } from '@enterprise-workspace/ui-button';

@Component({
  selector: 'lib-ui-issue-card',
  imports: [UiCard, TimeAgoPipe, UiButton],
  templateUrl: './ui-issue-card.html',
  styleUrl: './ui-issue-card.css',
  // 🔥 Apply the composition right here!
  hostDirectives: [
    {
      directive: TooltipDirective,
      inputs: ['appTooltip'] // Exposes the tooltip input to consumers
    },
    {
      directive: StatusHighlightDirective,
      inputs: ['appStatusHighlight'] // Exposes the highlight input to consumers
    }
  ]
})
export class UiIssueCard {
  // Inject the Store!
  public authStore = inject(AuthStore);
  
  @Input({ required: true }) issue!: any;
  @Output() resolve = new EventEmitter<number>();
  @Output() view = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();

  onResolve() {
    this.resolve.emit(this.issue.id);
  }

  onView() {
    this.view.emit();
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit(this.issue.id);
  }
}
