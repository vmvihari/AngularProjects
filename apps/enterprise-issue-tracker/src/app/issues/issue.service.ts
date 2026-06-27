import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal, linkedSignal, inject } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';

import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor() { }

  http = inject(HttpClient);
  apiUrl = `${environment.apiUrl}/issues`;
  // Replace issuesList signal with a resource
  issuesResource = rxResource({
    loader: () => this.http.get<any[]>(this.apiUrl)
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
  
  // UPDATE: Refactor mutations to make HTTP calls, and then optimistically update the local resource!
  // Update the local resource value using .value.update()
  onResolveIssue(issueId: number) {
    this.http.put<any>(`${this.apiUrl}/${issueId}`, { status: 'Closed' }).subscribe(() => {
      // Update the signal using an immutable pattern
      this.issuesResource.value.update(issues => 
        (issues ?? []).map(issue =>
          issue.id === issueId ? { ...issue, status: 'Closed' } : issue
        )
      )
    })
  }

  updateIssueTitle(issueId: number, newTitle: string) {
    this.http.put<any>(`${this.apiUrl}/${issueId}`, { title: newTitle }).subscribe(() => {
      this.issuesResource.value.update(issues => 
        (issues ?? []).map(issue => 
          issue.id === issueId ? { ...issue, title: newTitle } : issue
        )
      )
    })
  };

  // CREATE: Refactor addIssue to make a POST request
  addIssue(title: string, description: string) {
    this.http.post<any>(this.apiUrl, { title, description }).subscribe((newIssue) => {
    this.issuesResource.value.update(issues => [...(issues ?? []), newIssue]);
    });
  }

  // DELETE: Let's add a new delete method for full CRUD!
  deleteIssue(issueId: number) {
    this.http.delete(`${this.apiUrl}/${issueId}`).subscribe(() => {
      this.issuesResource.value.update(issues => 
        (issues ?? []).filter(issue => issue.id !== issueId)
      );
    });
  }
}
