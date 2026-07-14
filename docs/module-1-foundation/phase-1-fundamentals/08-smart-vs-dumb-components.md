# Phase 1, Lesson 8: Smart vs. Dumb Components

In the last lesson, you successfully extracted the `UiIssueCard` out of your `FeatureManage` component. By doing this, you naturally stumbled into the most important architectural pattern in Angular: **The Smart vs. Dumb Component pattern** (also known as Container vs. Presentational).

Understanding this pattern is the key difference between a junior developer building a tangled mess and a senior developer building a scalable enterprise application.

## 🧠 Smart Components (Feature / Container)

Smart components are the "brains" of your application. In our Nx Monorepo, these live in `feature-*` libraries (like `libs/issues/feature-manage`).

**Characteristics:**
*   They know about your application's state and data services.
*   They fetch data and pass it *down* to Dumb components.
*   They listen for events flowing *up* from Dumb components and handle the business logic (like making an API call to save a record).
*   They are usually tied directly to a Route.

## 🧱 Dumb Components (UI / Presentational)

Dumb components are purely cosmetic. In our Nx Monorepo, these live in `ui-*` libraries (like `libs/issues/ui-issue-card`).

**Characteristics:**
*   They have absolutely no idea where their data comes from. They rely entirely on `@Input()` to receive data.
*   They never mutate data or inject data services directly. If something happens (e.g., a button is clicked), they simply emit an `@Output()` event.
*   Because they have no dependencies on state or services, they are incredibly easy to write Unit Tests for, and they are highly reusable across different Smart components.

---

## 🎯 Bootcamp Task: Compose the UI

To really cement this architecture, let's create a second Dumb component to compose alongside our Issue Cards. We are going to build a Filter Bar!

### Step 1: Generate the Filter UI Library
Run the Nx generator to create a new Dumb component library for our issue domain:
```bash
npx nx g @nx/angular:library --directory=libs/issues/ui-issue-filters
```
*(Remember: if your dev server is running, restart it after this command so it picks up the new `tsconfig.base.json` path!)*

### Step 2: Define the Dumb Component Logic
Open `libs/issues/ui-issue-filters/src/lib/ui-issue-filters/ui-issue-filters.ts`. It doesn't need any Inputs, but it needs an Output to tell the Smart component when the user changes a filter!

```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-ui-issue-filters',
  imports: [],
  templateUrl: './ui-issue-filters.html',
  styleUrl: './ui-issue-filters.css',
})
export class UiIssueFilters {
  @Output() filterChange = new EventEmitter<string>();

  onSelectFilter(status: string) {
    this.filterChange.emit(status);
  }
}
```

### Step 3: Build the Filter Template
Open `ui-issue-filters.html` and add some simple filter buttons:

```html
<div class="filter-bar">
  <span>Filter by:</span>
  <button (click)="onSelectFilter('All')">All</button>
  <button (click)="onSelectFilter('Open')">Open</button>
  <button (click)="onSelectFilter('Closed')">Closed</button>
</div>
```

*Note: Feel free to add some CSS in `ui-issue-filters.css` to make the `.filter-bar` and buttons look great!*

### Step 4: Wire it up to the Smart Component
Go back to your Smart component (`libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts`).

1. Import `UiIssueFilters` into the `imports: []` array.
2. Add a `filterIssues(status: string)` method to the class. For now, just `console.log('Filtering by:', status)` inside the method.
3. Open `feature-manage.html` and add your new Dumb component right above the `<ul class="issue-list">`:

```html
<lib-ui-issue-filters (filterChange)="filterIssues($event)"></lib-ui-issue-filters>
```

**Congratulations!** You now have a classic Enterprise Architecture. Your Smart Component (`FeatureManage`) is the orchestrator, passing data down to one Dumb Component (`UiIssueCard`) and listening for actions from another Dumb Component (`UiIssueFilters`).
