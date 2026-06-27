import { Component, input, inject, computed } from '@angular/core';

import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue-detail',
  imports: [],
  templateUrl: './issue-detail.component.html',
  styleUrl: './issue-detail.component.css'
})
export class IssueDetailComponent {
  // This automatically binds to the route parameter
  id = input.required<string>();

  issueService = inject(IssueService);

  issue = computed(() => 
    (this.issueService.issuesResource.value() ?? []).find(issue => issue.id === Number(this.id()))
  );
}
