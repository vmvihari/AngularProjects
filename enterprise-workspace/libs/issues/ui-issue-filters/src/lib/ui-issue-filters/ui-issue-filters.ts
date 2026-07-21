import { Component, Output, EventEmitter, input } from '@angular/core';

import { UiButton } from '@enterprise-workspace/ui-button';

@Component({
  selector: 'lib-ui-issue-filters',
  imports: [UiButton],
  templateUrl: './ui-issue-filters.html',
  styleUrl: './ui-issue-filters.css',
})
export class UiIssueFilters {
  // Use a modern signal input to receive the active filter state
  activeFilter = input<string>('All');
  
  @Output() filterChange = new EventEmitter<string>();

  onSelectFilter(status: string) {
    this.filterChange.emit(status);
  }
}
