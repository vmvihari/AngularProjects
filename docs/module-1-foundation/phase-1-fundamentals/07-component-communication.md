# Phase 1, Lesson 7: Component Communication (@Input, @Output)

As your Enterprise application grows, you cannot keep all your HTML and logic inside a single massive component. You need to break it down into smaller, reusable pieces. 

However, when you split a component in two, they need a way to talk to each other! In Angular, data flows **down** to child components, and events flow **up** to parent components.

## @Input(): Passing Data Down
To pass data from a parent component into a child component, you use the `@Input()` decorator. This exposes a property that the parent can bind to using square brackets `[ ]`.

```typescript
// child.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<h3>Hello, {{ name }}!</h3>`
})
export class ChildComponent {
  @Input({ required: true }) name!: string; 
}
```

```html
<!-- parent.component.html -->
<app-child [name]="'Enterprise Developer'"></app-child>
```

> [!TIP]
> **Modern Angular Tip:** In Angular 17.1+, you can use the new Signal-based `input()` function instead of the `@Input()` decorator! We will dive deep into Signals in Module 2, but you will see both styles in the wild.

## @Output(): Passing Events Up
Child components should not mutate data directly. Instead, if something happens (like a button click), they should emit an event to tell the parent to take action. You do this using the `@Output()` decorator and an `EventEmitter`. The parent listens to it using parentheses `( )`.

```typescript
// child.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<button (click)="notifyParent()">Click Me</button>`
})
export class ChildComponent {
  @Output() actionClicked = new EventEmitter<string>();

  notifyParent() {
    this.actionClicked.emit('The button was pressed!');
  }
}
```

```html
<!-- parent.component.html -->
<app-child (actionClicked)="handleAction($event)"></app-child>
```

---

## 🎯 Bootcamp Task: Extract an Issue Card Component

Right now, our `FeatureManage` component does everything: it manages the list data AND it defines exactly how an individual issue looks. Let's fix that by extracting the issue UI into a reusable "Dumb" component.

### Step 1: Generate a UI Library
In an Nx workspace, reusable UI components belong in their own `ui-*` libraries! Run this command in your terminal to generate a UI library for our issue cards:

```bash
npx nx g @nx/angular:library --directory=libs/issues/ui-issue-card
```

### Step 2: Define Inputs and Outputs
Open the newly generated `libs/issues/ui-issue-card/src/lib/ui-issue-card/ui-issue-card.ts`. Update it to accept an `issue` input and emit a `resolve` output:

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-ui-issue-card',
  imports: [],
  templateUrl: './ui-issue-card.html',
  styleUrl: './ui-issue-card.css',
})
export class UiIssueCard {
  @Input({ required: true }) issue!: any;
  @Output() resolve = new EventEmitter<number>();

  onResolve() {
    this.resolve.emit(this.issue.id);
  }
}
```

### Step 3: Build the Card UI
Open `ui-issue-card.html` and move our issue layout into it, adding a button that triggers our output:

```html
<div class="issue-item">
  <strong>{{ issue.title }}</strong> 
  
  @if (issue.status === 'Open') {
    <span class="badge open">(Needs Attention)</span>
  } @else {
    <span class="badge closed">(Resolved)</span>
  }

  @if (issue.status === 'Open') {
    <button class="resolve-btn" (click)="onResolve()">Mark Resolved</button>
  }
</div>
```

*Note: Don't forget to move the `.issue-item` and `.badge` CSS classes from `feature-manage.css` over to `ui-issue-card.css`! You can also add some basic styling for `.resolve-btn`.*

### Step 4: Use the Card in the Feature Component
Now, go back to your `FeatureManage` component (`libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts`).
1. Import `UiIssueCard` into the `imports: []` array. *(Hint: import it from `@enterprise-workspace/ui-issue-card`)*
2. Add a `resolveIssue(id: number)` method to the class that finds the issue by ID and changes its status to 'Closed'.

Finally, update `feature-manage.html` to use your new component inside the loop:

```html
<ul class="issue-list">
  @for (issue of issues; track issue.id) {
    <lib-ui-issue-card 
      [issue]="issue" 
      (resolve)="resolveIssue($event)">
    </lib-ui-issue-card>
  } @empty {
    <li class="empty-state">No issues found. Everything is great!</li>
  }
</ul>
```
