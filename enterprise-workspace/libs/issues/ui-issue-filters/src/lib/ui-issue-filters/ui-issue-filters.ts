import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-ui-issue-filters',
  imports: [],
  templateUrl: './ui-issue-filters.html',
  styleUrl: './ui-issue-filters.css',
})
export class UiIssueFilters {
  @Output() filterChange = new EventEmitter<string>();

  onSelectFilter(status: string) {
    this.filterChange.emit(status);
  }
}
