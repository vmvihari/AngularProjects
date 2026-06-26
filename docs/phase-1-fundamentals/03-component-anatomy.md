# Module 3: The Anatomy of an Angular Component

Just like a .NET solution generates configuration files such as `.csproj` or `appsettings.json`, the Angular CLI generates several configuration files (like `angular.json` and `tsconfig.json`) to handle the build system and TypeScript configuration. We can safely ignore these for now.

The primary area you need to focus on is the `src/app` directory. This is where all of your actual application code will live.

Inside that folder, you will find `app.component.ts`, which is the root component of your application.

## Comparing an Angular Component to a C# Class

If you open `app.component.ts` in your editor, you can look at the anatomy of an Angular component and see how it compares to a standard C# class. Let's take a look at the code!

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'enterprise-issue-tracker';
}
```

In Angular, every component requires three main parts:
1. A **TypeScript class** for your logic.
2. An **HTML template** for the UI.
3. A **CSS selector** to define how it is used as an HTML tag.

You link these together using the `@Component` decorator, which functions very much like a C# `[Attribute]`.

Inside that `@Component` decorator, you will see an `imports` array. Modern Angular components are "standalone", meaning they manage their own dependencies instead of relying on a global module. Just like you use `using` statements in C#, you import other components or tools directly into this array to use them in your template.

Your Task: Let's clear out the default Angular boilerplate. We need to create the root shell for our Enterprise Issue Tracker, which will consist of a sidebar for navigation and a main content area.