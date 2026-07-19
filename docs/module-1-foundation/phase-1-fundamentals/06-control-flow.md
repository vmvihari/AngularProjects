# Phase 1, Lesson 6: Modern Control Flow

Angular's modern control flow allows you to use `@if` and `@for` directly inside your HTML templates. This built-in syntax is much more intuitive, requires no imports (goodbye `CommonModule`!), and performs better than the older structural directives (like `*ngIf` and `*ngFor`).

## The @if Block
The new `@if` block works exactly like you would expect in any standard programming language. You can also easily chain `@else if` and `@else` blocks!

```html
@if (issue.status === 'Open') {
  <span class="badge-red">Needs Attention</span>
} @else if (issue.status === 'In Progress') {
  <span class="badge-yellow">Working</span>
} @else {
  <span class="badge-green">Resolved</span>
}
```

## The @for Block
When using a `@for` loop, Angular requires a `track` expression (like an ID) so it can optimize performance by tracking exactly which DOM nodes need to be updated when your data changes.

It also comes with an incredibly handy `@empty` block that renders automatically if your array is empty!

```html
@for (issue of issues; track issue.id) {
  <li>{{ issue.title }}</li>
} @empty {
  <li>No issues found! Everything is working perfectly.</li>
}
```

---

## 🎯 Bootcamp Task: Build the Issues List

Let's use our new control flow syntax to build out the feature component that Nx generated for us in the DDD lesson.

### Step 1: Update the Feature Component logic
Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts` and add some mock data for our template to iterate over:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'lib-feature-manage',
  imports: [],
  templateUrl: './feature-manage.html',
  styleUrl: './feature-manage.css',
})
export class FeatureManage {
  // Mock data representing our issues
  issues = [
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ];
}
```

### Step 2: Build the UI with Control Flow
Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.html` and replace its contents with our list:

```html
<div class="feature-container">
  <h2>Manage Issues</h2>
  
  <ul class="issue-list">
    @for (issue of issues; track issue.id) {
      <li class="issue-item">
        <strong>{{ issue.title }}</strong> 
        
        @if (issue.status === 'Open') {
          <span class="badge open">(Needs Attention)</span>
        } @else {
          <span class="badge closed">(Resolved)</span>
        }
      </li>
    } @empty {
      <li class="empty-state">No issues found. Everything is great!</li>
    }
  </ul>
</div>
```

### Step 3: Add some Enterprise Styling
Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.css` and add this styling:

```css
.feature-container {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-top: 0;
  color: #0f172a;
}

.issue-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.issue-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: transform 0.2s;
}

.issue-item:hover {
  transform: translateX(4px);
  border-color: #cbd5e1;
}

.badge {
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.badge.open {
  background: #fee2e2;
  color: #ef4444;
}

.badge.closed {
  background: #f1f5f9;
  color: #64748b;
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: #64748b;
  font-style: italic;
}
```

### Step 4: Hook up the Route
So far, our shell layout has a `<router-outlet></router-outlet>`, but we haven't told Angular what to load there!

Open `apps/issue-tracker/src/app/app.routes.ts` and add a lazy-loaded route pointing to our new feature library:

```typescript
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@enterprise-workspace/feature-manage').then(m => m.FeatureManage)
  }
];
```

Check your browser! You should see your new Issue List loaded perfectly inside the main content area of your shell.
