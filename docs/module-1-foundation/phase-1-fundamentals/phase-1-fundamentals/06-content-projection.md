# Module 6: Content Projection

Content projection allows you to pass raw HTML or other components directly inside another component's tags. If you have used Blazor in .NET, this is very similar to a `RenderFragment`. In Angular, you use the `<ng-content>` element as a placeholder to mark where that injected content should render.

To make this a senior-level implementation, we won't just use a single slot. We will use **Multiple Content Placeholders** by utilizing the `select` attribute to route specific HTML to specific slots based on CSS selectors.

## Hands-On Task: Building a Reusable Card

Let's build a reusable UI wrapper for our issues called `IssueCardComponent`.

### 1. Generate the Component
Run the following command in your terminal to generate the component:
```bash
npx @angular/cli@18 generate component issue-card
```

### 2. Implement Multiple Content Projection
Replace the code in `src/app/issue-card/issue-card.component.ts` with this:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-issue-card',
  standalone: true,
  template: `
    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
      <div class="content">
        <!-- Default slot for the main content -->
        <ng-content></ng-content>
      </div>
      <div class="actions" style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 5px;">
        <!-- Named slot exclusively for action buttons -->
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `
})
export class IssueCardComponent {}
```

### 3. Project Content into the Card
In Angular, you project content simply by placing it between the opening and closing tags of the child component. To target a specific named slot, you apply the matching CSS selector (in our case, the `actions` attribute) directly to the element you want to project.

Update `src/app/issue-list/issue-list.component.ts` to import and use the new card component:

```typescript
import { Component, input, output } from '@angular/core';
import { IssueCardComponent } from '../issue-card/issue-card.component'; // Import the wrapper

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [IssueCardComponent], // Add to imports
  template: `
    <h2>Current Issues</h2>
    @for (issue of issues(); track issue.id) {
      <app-issue-card>
        <!-- Default slot: This text automatically goes into <ng-content> -->
        <strong>{{ issue.title }}</strong> 
        
        @if (issue.status === 'Open') {
          <span style="color: red; margin-left: 10px;">(Needs Attention)</span>
          
          <!-- Named slot: The 'actions' attribute targets <ng-content select="[actions]"> -->
          <button actions (click)="resolveIssue.emit(issue.id)">Resolve</button>
        }
      </app-issue-card>
    } @empty {
      <p>No issues found.</p>
    }
  `
})
export class IssueListComponent {
  issues = input<{id: number, title: string, status: string}[]>([]);
  resolveIssue = output<number>();
}
```

Save that, and you should see your issues nicely styled inside their new cards!
