# Phase 4, Lesson 2: Advanced Signals

Now that you've mastered `signal` and `computed`, let's dive into Advanced Signals! We will cover two massive upgrades: **Signal Inputs** and **Linked Signals**.

### 1. Signal Inputs
For the last decade, Angular developers have used the `@Input()` decorator to pass data into a component. In modern Angular, we use `input()` which returns a read-only Signal. This means you can now easily derive `computed()` state directly from your inputs!

### 2. Linked Signals
While a `computed` signal is entirely read-only, a `linkedSignal` lets you create a *writable* signal whose value is intrinsically linked to some other state. You provide it a computation function, but you can still manually update its value using `.set()` or `.update()`. If the underlying source state changes, the `linkedSignal` automatically resets itself!

---

## 🎯 Bootcamp Task: The Inline Editor

We are going to build an "Edit Title" feature on our Issue Details page. When the user navigates to an issue, a `draftTitle` signal will automatically populate with that issue's current title. Because it is a `linkedSignal`, the user can type into an input box to overwrite the draft. If they navigate to a different issue, the `draftTitle` will automatically reset!

### Step 1: Add a new Service Method
Open `libs/issues/data-access/src/lib/issue.service.ts` and add a new method to update a title:
```typescript
  updateTitle(issueId: number, newTitle: string) {
    this.state.update(issues => 
      issues.map(issue => 
        issue.id === issueId ? { ...issue, title: newTitle } : issue
      )
    );
  }
```

### Step 2: Upgrade your Component to Signal Inputs
Open `libs/issues/feature-issue-detail/src/lib/feature-issue-detail/feature-issue-detail.ts`.

Replace your old `@Input` and `get issue()` with modern Signals:
```typescript
import { Component, input, computed, linkedSignal, inject } from '@angular/core';
// ... (keep your other imports)

export class FeatureIssueDetail {
  private issueService = inject(IssueService);
  
  // 1. Upgrade to a Signal Input!
  id = input.required<string>(); 

  // 2. Upgrade to a Computed Signal!
  // It automatically recalculates whenever the URL 'id' changes!
  issue = computed(() => this.issueService.getIssueById(Number(this.id())));

  // 3. Create a Linked Signal!
  // It defaults to the issue's title, but can be overwritten by the user!
  draftTitle = linkedSignal(() => this.issue()?.title ?? '');

  saveTitle() {
    const currentIssue = this.issue();
    if (currentIssue) {
      this.issueService.updateTitle(currentIssue.id, this.draftTitle());
    }
  }
}
```

### Step 3: Update the Template
Open `feature-issue-detail.html` and update it to read your new signals, and add the new inline editor!

Replace your old `@if (issue)` block with this:
```html
<div class="detail-container">
  @if (issue(); as currentIssue) {
    <header class="detail-header">
      <div class="title-group">
        <a routerLink="/issues" class="back-btn">
          <!-- your existing SVG back arrow -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Issues
        </a>
        
        <!-- THE NEW INLINE EDITOR -->
        <div class="editor-group" style="margin-top: 16px; display: flex; gap: 8px;">
          <!-- Bind the input value to draftTitle(), and update the signal on keypress -->
          <input 
            [value]="draftTitle()" 
            (input)="draftTitle.set($any($event.target).value)" 
            class="title-input"
            style="font-size: 1.5rem; font-weight: 800; padding: 4px 12px; border-radius: 8px; border: 1px solid #e2e8f0; width: 400px;"
          />
          <button (click)="saveTitle()" class="resolve-btn" style="padding: 8px 16px;">Save</button>
        </div>
      </div>
      <!-- ... keep your existing status badge ... -->
      <span class="status-badge" [class.open]="currentIssue.status === 'Open'" [class.closed]="currentIssue.status === 'Closed'">
        {{ currentIssue.status }}
      </span>
    </header>
    <!-- ... keep your existing detail-body ... -->
    <div class="detail-body">
      <p>Detailed view for issue <strong>#{{ currentIssue.id }}</strong>.</p>
    </div>
  }
</div>
```

### Step 4: Validate!
1. Save your files and open your browser to the Dashboard.
2. Click on an Issue to view its details.
3. You should see an input box pre-populated with the issue's title!
4. Type a new title and click **Save**.
5. Click "Back to Issues". You will see your new title is now instantly reflected everywhere in the application!

> [!TIP]
> **Optional Enhancement**: You can further polish this feature by adding custom CSS to your Save button to make it pop, or by using another `signal` to temporarily display a "✅ Saved!" success message when the user clicks save. Feel free to enhance it as you see fit!

You've successfully mastered `linkedSignal` and `input()`. Onward to the next lesson!
