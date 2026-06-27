import { Injectable, resource, computed, signal, linkedSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor() { }

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

  // Move the derived state here!
  openIssuesCount = computed(() => 
    (this.issuesResource.value() ?? []).filter(issue => issue.status === 'Open').length
  );

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

  // Track the issue currently being edited
  selectedIssue = signal<{id: number, title: string, status: string} | null>(null);

  // linkedSignal: defaults to the selected issue's title, but updates freely when typed in!
  draftTitle = linkedSignal(() => this.selectedIssue()?.title ?? '')  

  editIssue(issueId: number) {
    const issue = (this.issuesResource.value() ?? []).find(i => i.id === issueId);
    this.selectedIssue.set(issue || null);
  }
  
  // Update the local resource value using .value.update()
  onResolveIssue(issueId: number) {
    // 3. Update the signal using an immutable pattern
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue =>
        issue.id === issueId ? { ...issue, status: 'Closed' } : issue
      )
    )
  }

  updateIssueTitle(issueId: number, newTitle: string) {
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue => 
        issue.id === issueId ? { ...issue, title: newTitle } : issue
      )
    );
  }

  addIssue(title: string, description: string) {
    this.issuesResource.value.update(issues => [
      ...(issues ?? []),
      { id: Date.now(), title, status: 'Open' }
    ])
  }
}
