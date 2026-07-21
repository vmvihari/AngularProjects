# Phase 11, Lesson 3: Custom Pipes

Pipes are a simple way to transform data for display directly within your HTML templates. Angular comes with built-in pipes like `DatePipe` and `CurrencyPipe`, but you will frequently need to build custom ones.

## Your Task: Build a "Time Ago" Pipe

Right now, if we print a date, it displays an ugly ISO string like `2024-03-15T12:00:00Z`. Let's build a `TimeAgoPipe` to transform that into human-readable text like "2 hours ago" or "Just now".

### 1. Update the Model
Our current Issue model doesn't actually have a date! Before we build the pipe, let's add one.

1. Open `apps/IssueTracker.Api/Program.cs` and update your `Issue` record:
```csharp
public record Issue(int Id, string Title, string Status, string CreatedAt);
```
*Note: Make sure to update the dummy data in your `issues` List to include a date string, e.g., `"2024-01-01T12:00:00Z"`!*

2. Open `libs/issues/data-access/src/lib/issue.store.ts` and update the `Issue` interface:
```typescript
export interface Issue {
  id: number;
  title: string;
  status: string;
  description?: string;
  tags?: string[];
  createdAt: string; // <-- Add this!
}
```

### 2. Generate the Library
To keep our workspace modular, we will create a dedicated Nx Library for formatting pipes that any application in our monorepo can use.

```bash
npx nx g @nx/angular:library --directory=libs/shared/ui-pipes
```

### 3. Implement the Logic
Inside your new library, create `libs/shared/ui-pipes/src/lib/time-ago.pipe.ts`. 

A Pipe is just a class that implements the `PipeTransform` interface.

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date | undefined): string {
    if (!value) return '';

    const d = new Date(value);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));

    if (seconds <= 45) return 'Just now';
    if (seconds <= 90) return 'A minute ago';
    if (minutes <= 45) return `${minutes} minutes ago`;
    if (minutes <= 90) return 'An hour ago';
    if (hours <= 22) return `${hours} hours ago`;
    if (hours <= 36) return 'A day ago';
    
    return `${days} days ago`;
  }
}
```

*Don't forget to explicitly export this class from `libs/shared/ui-pipes/src/index.ts`!*

### 4. Pure vs Impure Pipes
Notice the `@Pipe({ name: 'timeAgo' })` decorator. By default, pipes are **Pure**.
- **Pure Pipes:** Angular only executes the `transform()` method when it detects a pure change to the input value (like a primitive string changing). This is *extremely* fast and highly optimized.
- **Impure Pipes:** If you set `pure: false`, Angular will execute the `transform()` method on *every single change detection cycle* (every keystroke, every mouse movement). 

**Never** use an impure pipe unless absolutely necessary, as it will destroy your application's performance. Our `TimeAgoPipe` is pure!

### 5. Use It In the UI!
Let's add it to our `UiIssueCard`.

1. Open `libs/issues/ui-issue-card/src/lib/ui-issue-card/ui-issue-card.ts` and add `TimeAgoPipe` to the `imports: []` array. (You'll need to import it from `@enterprise-workspace/shared-ui-pipes` or whatever your library name mapped to).
2. Open `ui-issue-card.html` and use it in your template!

```html
<div class="issue-body-content">
  <!-- ... existing status badge ... -->
  <small class="text-muted" style="margin-left: 10px; color: #64748b;">
    Created {{ issue.createdAt | timeAgo }}
  </small>
</div>
```

Run your app! You should now see beautiful human-readable timestamps on your issue cards!
