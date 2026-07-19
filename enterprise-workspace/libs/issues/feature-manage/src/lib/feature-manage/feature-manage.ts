import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UiIssueCard } from '@enterprise-workspace/ui-issue-card';
import { UiIssueFilters } from '@enterprise-workspace/ui-issue-filters';
import { IssueStore } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-manage',
  imports: [UiIssueCard, UiIssueFilters, ReactiveFormsModule],
  templateUrl: './feature-manage.html',
  styleUrl: './feature-manage.css',
})
export class FeatureManage {

  // Inject the service using modern Angular DI!
  public issueStore = inject(IssueStore);
  private router = inject(Router);

  ngOnInit() {
    // Only load if we don't have data yet. 
    // This allows loadIssues() to still be used for a 'Refresh' button later!
    if (this.issueStore.issues().length === 0) {
      this.issueStore.loadIssues();
    }
  }

  // 1. Create a FormControl for our search input
  searchControl = new FormControl('');

  // 2. Build an RxJS Pipeline with a 300ms debounce
  private search$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  // 3. Convert the Observable to a Signal!
  searchTerm = toSignal(this.search$, { initialValue: '' });

  // 4. Create a computed signal that combines the issues from the service with our local search term!
  filteredIssues = computed(() => {
    const term = this.searchTerm()?.toLowerCase() || '';
    const allIssues = this.issueStore.issues();
    
    if (!term) return allIssues;
    
    return allIssues.filter(issue => 
      issue.title.toLowerCase().includes(term)
    );
  });

  resolveIssue(issueId: number) {
    this.issueStore.resolveIssue(issueId);
  }

  filterIssues(status: string) {
    // Using type assertion to match our strict types
    this.issueStore.updateFilter(status as any);
  }

  viewIssue(issueId: number) {
    this.router.navigate(['/issues', issueId]);
  }
}
