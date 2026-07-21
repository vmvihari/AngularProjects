# Phase 13, Lesson 3: Change Detection & Zoneless Angular

Angular has historically relied on a library called `Zone.js` to know when to update the UI. `Zone.js` monkey-patches every single asynchronous API in the browser (`setTimeout`, `Promise`, `click` events, `XMLHttpRequest`). Whenever any of these trigger, Angular runs Change Detection on the *entire component tree* from top to bottom. 

This is incredibly inefficient for Enterprise applications.

## 1. ChangeDetectionStrategy.OnPush

By default, Angular components use `ChangeDetectionStrategy.Default`. In this mode, `Zone.js` blindly intercepts every mouse click, keyboard event, and network request in your browser. Whenever an event fires, `Zone.js` forces Angular to re-render the *entire component tree* from top to bottom, even if the data hasn't changed.

`OnPush` is a powerful optimization that tells Angular: *"Do not run change detection on me unless one of my `@Input()` properties changes, an event originates from my template, or one of my Signals updates!"*

### Why OnPush is Mandatory in Enterprise
In modern Enterprise Angular architecture, it is considered a universal best practice that **every single component in your entire application** should use `ChangeDetectionStrategy.OnPush`.

Historically (before Signals), developers struggled with `OnPush`. If they manually mutated an object (e.g. `user.name = 'Bob'`), Angular wouldn't know the data changed, and the UI wouldn't update. Developers had to rely on complicated RxJS streams or manually inject `ChangeDetectorRef` to force updates.

However, because we are using **Signals**, Angular always knows *exactly* when and where the data changes. Signals completely solve the old "OnPush struggle"!

> [!TIP]
> **Pro Tip: Automate it!**
> You never actually have to type `changeDetection: ChangeDetectionStrategy.OnPush` manually. You can configure Nx to generate all future components with `OnPush` automatically by running:
> ```bash
> npx nx generate @schematics/angular:component --changeDetection=OnPush
> ```
> Or by adding it to your `nx.json` generator defaults!

### The `OnPush` vs `Zoneless` Distinction
There is a very important distinction based on whether or not you still have **Zone.js** installed:

1. **If you use Signals, but still have Zone.js (Standard Setup):**
   You **DO** still need `ChangeDetectionStrategy.OnPush`. Even if your data is perfectly managed by Signals, `Zone.js` is still running globally. If your component is set to `Default`, `Zone.js` will force it to re-render on every click, ignoring how smart your Signals are. `OnPush` acts as the shield that tells `Zone.js` to back off.

2. **If you use Signals and go fully "Zoneless" (Bleeding Edge):**
   You **DO NOT** need `ChangeDetectionStrategy.OnPush` anymore! When you delete `Zone.js` entirely, Angular disables the global top-down change detection engine. The framework becomes natively reactive. Without `Zone.js` around to force unnecessary renders, `OnPush` becomes completely redundant because the entire application naturally behaves that way!

---

## 2. Zoneless Angular (Bleeding Edge)

Because our application is built 100% using Signals, Angular actually knows *exactly* when and where the data changes without needing `Zone.js` at all!

Angular 18+ introduced Zoneless Change Detection. This allows us to delete the `Zone.js` dependency entirely, making our bundle smaller and our app exponentially faster.

### Your Task: Enable Zoneless Mode
1. Open `apps/issue-tracker/src/app/app.config.ts`.
2. Import `provideZonelessChangeDetection` from `@angular/core`.
3. Add the Zoneless provider to the providers array!

```typescript
import { ApplicationConfig, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
// ... other imports ...

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // <-- NEW MAGIC!
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    // ... other providers ...
  ]
};
```

### Remove Zone.js from the Build
1. Open `apps/issue-tracker/project.json`.
2. Find the `polyfills` array under `targets > build > options` (if it does not exist, you can add `"polyfills": []`).
3. Delete `"zone.js"`.
4. Restart your Angular development server.

> [!TIP]
> **Modern Testing with Vitest**
> In older Angular setups using Karma/Jasmine, you had to be careful when removing `zone.js` because Karma fundamentally required it. However, because our Enterprise architecture uses **Vitest**, we are fully modernized and don't have to worry about Karma crashing!

Your app is now running completely without `Zone.js`! It is relying 100% on the granular reactivity of Signals to update the UI. You have achieved peak Angular performance!
