import { Component, Output, EventEmitter, input } from '@angular/core';

@Component({
  selector: 'lib-ui-issue-filters',
  imports: [],
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
