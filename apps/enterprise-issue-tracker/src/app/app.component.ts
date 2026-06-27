import { Component, signal, computed, linkedSignal, resource } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';

import { IssueListComponent } from './issue-list/issue-list.component';

@Component({
    selector: 'app-root',
    imports: [IssueListComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'enterprise-issue-tracker';

  /*
  // The data now lives in the parent
  // Create a Writable Signal
  issuesList = signal([
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ]);

  // Create a Computed Signal
  openIssuesCount = computed(() =>
    this.issuesList().filter(issue => issue.status === 'Open').length
  )
  */

  // Replace issuesList signal with a resource
  issuesResource = resource({
    loader: async() => {
      // Simulate a 1-second network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { id: 1, title: 'Fix login validation', status: 'Open' },
        { id: 2, title: 'Update routing module', status: 'Closed' },
        { id: 3, title: 'Build issue list component', status: 'Open' }
      ];
    }
  });

  // Update computed to safely read from issuesResource.value()
  openIssuesCount = computed(() =>
    (this.issuesResource.value() ?? []).filter(issue => issue.status === 'Open').length
  )

  // Track the issue currently being edited
  selectedIssue = signal<{id: number, title: string, status: string} | null>(null);

  // linkedSignal: defaults to the selected issue's title, but updates freely when typed in!
  draftTitle = linkedSignal(() => this.selectedIssue()?.title ?? '')

  /*
  // The method to handle the output event
  onResolveIssue(issueId: number) {
    // 3. Update the signal using an immutable pattern
    this.issuesList.update(issues =>
      issues.map(issue =>
        issue.id === issueId ? { ...issue, status: 'Closed' } : issue
      )
    )
  }

  onEdit(issueId: number) {
    const issue = this.issuesList().find(i => i.id === issueId);
    this.selectedIssue.set(issue || null);
  }

  onSaveEdit() {
    this.issuesList.update(issues => 
      issues.map(issue => 
        issue.id === this.selectedIssue()?.id ? { ...issue, title: this.draftTitle() } : issue
      )
    );
    this.selectedIssue.set(null); // Close the editor
  }
  */

  // Update the local resource value using .value.update()
  onResolveIssue(issueId: number) {
    // 3. Update the signal using an immutable pattern
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue =>
        issue.id === issueId ? { ...issue, status: 'Closed' } : issue
      )
    )
  }

  onEdit(issueId: number) {
    const issue = (this.issuesResource.value() ?? []).find(i => i.id === issueId);
    this.selectedIssue.set(issue || null);
  }

  onSaveEdit() {
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue => 
        issue.id === this.selectedIssue()?.id ? { ...issue, title: this.draftTitle() } : issue
      )
    );
    this.selectedIssue.set(null); // Close the editor
  }

  // --- NEW RXJS INTEROP LOGIC ---
  searchTerm = signal('');

  // Convert Signal to Observable to use RxJS operators
  searchTerm$ = toObservable(this.searchTerm).pipe(debounceTime(300));

  // Convert Observable back to Signal (requires an initial value)
  debounceSearch = toSignal(this.searchTerm$, { initialValue: '' });

  // Computed signal to filter the issues list
  filteredIssues = computed(() => {
    const issues = this.issuesResource.value() ?? [];
    const term = this.debounceSearch().toLowerCase();
    return issues.filter(i => i.title.toLowerCase().includes(term));
  });
}
