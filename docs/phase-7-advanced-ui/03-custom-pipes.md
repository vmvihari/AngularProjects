# Module 3: Custom Pipes

Pipes are a simple way to transform data for display directly within your HTML templates. Angular comes with built-in pipes like `DatePipe` and `CurrencyPipe`, but you will frequently need to build custom ones.

## Your Task: Build a "Time Ago" Pipe

Right now, if we print `issue.createdAt`, it displays an ugly ISO string like `2024-03-15T12:00:00Z`. Let's build a `TimeAgoPipe` to transform that into human-readable text like "2 hours ago" or "Just now".

### 1. Generate the Pipe
```bash
ng generate pipe shared/pipes/time-ago
```

### 2. Implement the Logic
Open `src/app/shared/pipes/time-ago.pipe.ts`. 
A Pipe is just a class that implements the `PipeTransform` interface.

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  // standalone: true is the default in Angular 19
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

### 3. Pure vs Impure Pipes
Notice the `@Pipe({ name: 'timeAgo' })` decorator. By default, pipes are **Pure**.
- **Pure Pipes:** Angular only executes the `transform()` method when it detects a pure change to the input value (like a primitive string changing). This is *extremely* fast and highly optimized.
- **Impure Pipes:** If you set `pure: false`, Angular will execute the `transform()` method on *every single change detection cycle* (every keystroke, every mouse movement). 

**Never** use an impure pipe unless absolutely necessary, as it will destroy your application's performance. Our `TimeAgoPipe` is pure!

### 4. Use It In the UI!
1. Add `TimeAgoPipe` to the `imports: []` of `IssueListComponent`.
2. Use it in your template! (Note: You may need to add a `createdAt` property to your `Issue` interface and `.NET API` to test this properly).

```html
<small class="text-muted">Created {{ issue.createdAt | timeAgo }}</small>
```
