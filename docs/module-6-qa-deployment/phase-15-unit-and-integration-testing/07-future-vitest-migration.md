# Module 7: The Future - Migrating to Vitest

For the last decade, Angular projects have defaulted to **Karma** (a test runner that spins up a real Chrome browser instance) and **Jasmine** (the testing framework syntax). 

While this works, booting up an actual browser for every test run is *extremely* slow. Enterprise applications with 5,000 tests could take 10 minutes to run in CI/CD pipelines.

Modern Enterprise Angular is rapidly shifting to **Vitest** (or Jest). These run completely in Node.js using a simulated DOM (`jsdom`), meaning your tests execute in milliseconds rather than minutes.

*(Note: As of Angular 18, the Angular CLI has a built-in experimental builder for Jest, and a community builder for Vitest. Since we are focusing on architecture, we will simply learn the concepts rather than forcing a heavy migration on this exact codebase right now).*

## 1. The Vitest Syntax

The best part about moving to Vitest or Jest is that you don't actually have to learn a new syntax! They explicitly designed their APIs to be 99% identical to Jasmine.

Your `describe`, `it`, and `expect` blocks remain exactly the same.

The only difference is that instead of relying on global magic variables, you explicitly import them:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
```

And instead of `jasmine.createSpy('mySpy')`, you use Vitest's built-in mocking library:
```typescript
const mySpy = vi.fn();
```

## 2. The Migration Process (Conceptual)

If you wanted to migrate an existing Angular application like this one to Vitest, you would follow these general steps:

1. **Install the Vite/Vitest Builders:**
   You would install a community plugin like `@analogjs/vite-plugin-angular` or use the Angular CLI's experimental Jest builder.

2. **Rip out Karma:**
   You would uninstall `karma`, `karma-jasmine`, and all related plugins from your `package.json`. You would also delete `karma.conf.js` (if it exists) and remove `"zone.js"` from your `angular.json` test polyfills (Vitest does not require Zone.js browser polyfills).

3. **Update Architect Targets:**
   You would change the `"test"` architect target in your `angular.json` to point to the new Vitest builder instead of `@angular-devkit/build-angular:karma`.

4. **Refactor Existing Tests:**
   This is the hardest part. You would have to open every single existing `.spec.ts` file, add the explicit imports from `vitest`, and manually replace every instance of `jasmine.createSpy()` with `vi.fn()`.

Once that heavy lifting is done, your CI/CD pipelines will thank you as your test execution time drops by over 80%!
