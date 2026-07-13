# Module 4: Modern Control Flow

Angular's modern control flow allows you to use `@if` and `@for` directly inside your HTML templates. This built-in syntax is much more intuitive and performs better than the older structural directives (like `*ngIf` and `*ngFor`).

When using a `@for` loop, Angular requires a `track` expression (like an ID) so it can optimize performance by tracking exactly which DOM nodes need to be updated when your data changes.

Let's build the IssueListComponent.

First, run this command in your terminal to generate the component: `ng generate component issue-list`

Open the newly created src/app/issue-list/issue-list.component.ts and replace its contents with this code:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  template: `
    <h2>Current Issues</h2>
    <ul>
      @for (issue of issues; track issue.id) {
        <li>
          <strong>{{ issue.title }}</strong> 
          @if (issue.status === 'Open') {
            <span style="color: red; margin-left: 10px;">(Needs Attention)</span>
          }
        </li>
      } @empty {
        <li>No issues found.</li>
      }
    </ul>
  `
})
export class IssueListComponent {
  // Mock data representing our issues
  issues = [
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ];
}
```

To see this in action, we need to temporarily render it in our main layout. Open src/app/app.component.ts and:

- Add `IssueListComponent` to the imports array.
- Replace the `<router-outlet></router-outlet>` tag in the template with `<app-issue-list></app-issue-list>`.