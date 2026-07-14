# Phase 1, Lesson 9: Content Projection (ng-content)

So far, we have built Dumb components that accept data via `@Input()`. But what if you want a Dumb component that acts as a generic wrapper, and you want to pass entire blocks of HTML into it? 

Think about a generic UI Card, a Dialog Modal, or an Accordion. The component shouldn't care what data is inside it; its only job is to provide the styling and structure around whatever HTML the parent component passes in.

This is solved using **Content Projection**.

## Basic Projection (`<ng-content>`)

If you place `<ng-content></ng-content>` inside a child component's template, it acts as a placeholder. Any HTML that the parent places *between* the child's opening and closing tags will be injected precisely where that placeholder is!

```html
<!-- my-wrapper.component.html (Child) -->
<div class="fancy-border">
  <ng-content></ng-content>
</div>
```

```html
<!-- feature.component.html (Parent) -->
<app-my-wrapper>
  <h2>I am being projected!</h2>
  <p>All of this HTML will be stuffed into the child's fancy border.</p>
</app-my-wrapper>
```

## Multi-Slot Projection (`select`)

What if your wrapper is complex and has multiple slots? For example, a card might have a specific header area and a body area. You can use the `select` attribute to target specific HTML elements, classes, or custom attributes!

```html
<!-- my-card.component.html (Child) -->
<div class="card">
  <div class="header">
    <ng-content select="[card-title]"></ng-content>
  </div>
  <div class="body">
    <ng-content></ng-content> <!-- The default slot catches everything else -->
  </div>
</div>
```

```html
<!-- feature.component.html (Parent) -->
<app-my-card>
  <h3 card-title>User Profile</h3>
  <p>This paragraph goes into the default body slot.</p>
</app-my-card>
```

---

## 🎯 Bootcamp Task: Create a Reusable UI Card

Let's build a highly reusable, generic UI Card that can be used across the entire enterprise to wrap anything!

### Step 1: Generate a Shared UI Library
Since a generic Card isn't specific to the `issues` domain, we should place it in a `shared` domain so any feature can use it!

```bash
npx nx g @nx/angular:library --directory=libs/shared/ui-card
```

### Step 2: Build the Wrapper with `<ng-content>`
Open `libs/shared/ui-card/src/lib/ui-card/ui-card.html`. Replace the boilerplate with a multi-slot layout:

```html
<div class="enterprise-card">
  <div class="card-header">
    <ng-content select="[card-title]"></ng-content>
  </div>
  <div class="card-body">
    <ng-content></ng-content>
  </div>
  <div class="card-footer">
    <ng-content select="[card-footer]"></ng-content>
  </div>
</div>
```
*(Add some basic padding and border CSS to `ui-card.css` so you can see the layout!)*

### Step 3: Implement the Wrapper
Go back to your `libs/issues/ui-issue-card/src/lib/ui-issue-card/ui-issue-card.html`. Instead of a basic `div`, let's wrap our issue details in our brand new generic card!

1. Open `ui-issue-card.ts` and add `UiCard` to the `imports: []` array. *(Hint: import it from `@enterprise-workspace/ui-card`)*
2. Update `ui-issue-card.html` to look something like this:

```html
<lib-ui-card>
  <!-- This goes to the title slot -->
  <strong card-title>{{ issue.title }}</strong>

  <!-- This goes to the default body slot -->
  @if (issue.status === 'Open') {
    <span class="badge open">(Needs Attention)</span>
  } @else {
    <span class="badge closed">(Resolved)</span>
  }

  <!-- This goes to the footer slot -->
  @if (issue.status === 'Open') {
    <button card-footer (click)="onResolve()">Mark Resolved</button>
  }
</lib-ui-card>
```

**Congratulations!** You have completed Phase 1 of the bootcamp. You now understand the core fundamentals of building modern Angular applications in an Enterprise Nx Architecture!
