import { Component, inject, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UiIssueCard } from '@enterprise-workspace/ui-issue-card';
import { UiIssueFilters } from '@enterprise-workspace/ui-issue-filters';
import { IssueStore } from '@enterprise-workspace/data-access';
import { SkeletonLoaderDirective } from '@enterprise-workspace/ui-skeleton';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ToastService } from '@enterprise-workspace/ui-toast';

@Component({
  selector: 'lib-feature-manage',
  imports: [UiIssueCard, UiIssueFilters, ReactiveFormsModule, SkeletonLoaderDirective],
  templateUrl: './feature-manage.html',
  styleUrl: './feature-manage.css',
})
export class FeatureManage {

  // Inject the service using modern Angular DI!
  public issueStore = inject(IssueStore);
  private router = inject(Router);
  private announcer = inject(LiveAnnouncer);
  private toastService = inject(ToastService);

  constructor() {
    effect(() => {
      const isLoading = this.issueStore.isLoading();
      const issues = this.issueStore.issues();

      if (!isLoading && issues && issues.length > 0) {
        // This will silently read "Successfully loaded X issues" to a screen reader!
        // 'polite' means it waits for the user to finish their current screen reader sentence.
        this.announcer.announce(`Successfully loaded ${issues.length} issues`, 'polite');
      }
    });

    effect(() => {
      const deletedId = this.issueStore.lastDeletedIssueId();
      if (deletedId !== null) {
        this.toastService.show(`An issue (#${deletedId}) was just deleted by another user!`);
      }
    });
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
    // We read from the store's `filteredIssues()` so we respect the UI Filter (Open/Closed)
    // BEFORE applying the local text search!
    const activeIssues = this.issueStore.filteredIssues();
    
    if (!term) return activeIssues;
    
    return activeIssues.filter(issue => 
      issue.title.toLowerCase().includes(term)
    );
  });

  resolveIssue(issueId: number) {
    this.issueStore.resolveIssue(issueId);
  }

  deleteIssue(issueId: number) {
    this.issueStore.deleteIssue(issueId);
  }

  filterIssues(status: string) {
    // Using type assertion to match our strict types
    this.issueStore.updateFilter(status as any);
  }

  viewIssue(issueId: number) {
    this.router.navigate(['/issues', issueId]);
  }

  editIssue(issueId: number) {
    this.router.navigate(['/issues', issueId, 'edit']);
  }
}
