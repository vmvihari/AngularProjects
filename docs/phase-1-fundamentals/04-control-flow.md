# Module 4: Modern Control Flow

Angular's modern control flow allows you to use `@if` and `@for` directly inside your HTML templates. This built-in syntax is much more intuitive and performs better than the older structural directives (like `*ngIf` and `*ngFor`).

When using a `@for` loop, Angular requires a `track` expression (like an ID) so it can optimize performance by tracking exactly which DOM nodes need to be updated when your data changes.
