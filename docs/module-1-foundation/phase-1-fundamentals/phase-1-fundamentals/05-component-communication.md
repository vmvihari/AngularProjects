# Module 5: Component Communication

Now let's tackle Component Communication: passing data between components. 

In Angular, the overarching rule is that **data flows down** to children via `Inputs`, and **events flow up** to parents via `Outputs`.

## Inputs (Data Flowing Down)
Inputs are exactly like settable public properties on a C# class. They allow a parent component to pass data down into a child component. 

Modern Angular (v17+) provides a new `input()` function for this. When you use `input()`, Angular returns a read-only **Signal** containing the data.

## Outputs (Events Flowing Up)
Outputs are exactly like C# events (or delegates). They allow a child component to notify its parent when something happens (like a button click or form submission).

We use the modern `output()` function and call its `.emit()` method to broadcast the event and its associated payload up to the parent component.

Your Task: Let's refactor our IssueListComponent so it no longer hardcodes its own data. Instead, it will accept the issues from the parent and emit an event when an issue is resolved.

Update src/app/issue-list/issue-list.component.ts with this code:
import { Component, input, output } from '@angular/core';

```typescript
@Component({
  selector: 'app-issue-list',
  standalone: true,
  template: `
    <h2>Current Issues</h2>
    <ul>
      <!-- Note: We now call issues() because it is a Signal -->
      @for (issue of issues(); track issue.id) {
        <li>
          <strong>{{ issue.title }}</strong> 
          @if (issue.status === 'Open') {
            <span style="color: red; margin-left: 10px;">(Needs Attention)</span>
            <!-- Emit the output event when clicked -->
            <button (click)="resolveIssue.emit(issue.id)" style="margin-left: 10px;">Resolve</button>
          }
        </li>
      } @empty {
        <li>No issues found.</li>
      }
    </ul>
  `
})
export class IssueListComponent {
  // Input: expects an array of issues from the parent
  issues = input<{id: number, title: string, status: string}[]>([]);

  // Output: emits the ID of the issue to resolve
  resolveIssue = output<number>();
}
```

## Connecting Parent and Child

Now we need to connect the parent (AppComponent) to the child (IssueListComponent).

1. In Angular, you pass data into a child component's Input using square brackets `[ ]` (Property Binding).
2. You listen to a child component's Output event using parentheses `( )` (Event Binding).
3. When the event emits, the data passed along with it is accessed in the template using a special `$event` variable.

Your Task: Update src/app/app.component.ts to hold the mock data, bind it to <app-issue-list>, and create a method to handle the resolution event. Replace your current app.component.ts with this:

```typescript
import { Component } from '@angular/core';
import { IssueListComponent } from './issue-list/issue-list.component';

@Component({
  selector: 'app-root',
  imports: [IssueListComponent],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h2>Issue Tracker</h2>
        <nav>Issues</nav>
      </aside>
      <main class="content">
        <!-- Pass data in with [issues], listen to events with (resolveIssue) -->
        <app-issue-list 
          [issues]="issuesList" 
          (resolveIssue)="onResolve($event)">
        </app-issue-list>
      </main>
    </div>
  `,
  styles: [`
    .layout { display: flex; height: 100vh; font-family: sans-serif; margin: -8px; }
    .sidebar { width: 220px; background: #2c3e50; color: white; padding: 20px; }
    .content { flex: 1; padding: 20px; background: #ecf0f1; }
  `]
})
export class AppComponent {
  // The data now lives in the parent
  issuesList = [
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ];

  // The method to handle the output event
  onResolve(issueId: number) {
    const issue = this.issuesList.find(i => i.id === issueId);
    if (issue) {
      issue.status = 'Closed';
    }
  }
}
```

Try clicking the "Resolve" button in your browser. The issue should immediately update and remove the button because our @if block in the child template reacts to the status change.