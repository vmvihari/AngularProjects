# Phase 15, Lesson 1: Internationalization (i18n)

In Enterprise applications, you often need to support multiple languages for a global audience. Angular provides an incredibly powerful built-in toolchain for this called `@angular/localize`.

Unlike third-party translation libraries (like `ngx-translate`) which download a massive JSON file and translate strings in the browser at runtime, Angular's native i18n is an **Ahead-of-Time (AOT)** compiler feature. 

When you build an Angular app for production, the compiler generates a completely separate, hardcoded version of your application for *each language* (e.g. `dist/en`, `dist/es`, `dist/fr`). This guarantees that your application loads insanely fast because there is zero runtime translation overhead!

## 1. Setting up `@angular/localize`

To use Angular's native translation system, we must first add the package to our workspace.

### Your Task: Install the package
Stop your development server, and run the Nx generator to install the localize package:
```bash
npx nx g @nx/angular:setup-i18n --project=issue-tracker
```
*(Press Enter to accept any defaults).*

## 2. Marking Text for Translation

Once installed, we don't use complicated services or pipes to translate our UI. We simply add the `i18n` attribute directly to our HTML tags!

### Your Task: Mark the Manage Dashboard
1. Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.html`.
2. Find the header `<h2>Manage Issues</h2>`.
3. Add the `i18n` attribute to it:
```html
<h2 i18n>Manage Issues</h2>
```

You can also provide contextual metadata to help the translator (e.g. `i18n="meaning|description@@customId"`).
```html
<p i18n="empty state|The message shown when there are no issues@@noIssuesMessage">No issues found. Everything is great!</p>
```

4. Find the paragraph `<p>No issues found. Everything is great!</p>` and add the `i18n` attribute as shown above.

## 3. Extracting the Translation File

Once you have marked your HTML, you need to extract those strings into an XML Localisation Interchange File Format (XLIFF or `.xlf`) file, which is the industry standard format that professional translators use.

### Your Task: Extract the strings
Run the built-in Angular CLI extraction tool:
```bash
npx nx extract-i18n issue-tracker
```

After this command runs, look inside your `apps/issue-tracker/src/locale/` directory. You will find a newly generated `messages.xlf` file containing your marked strings!

You would typically hand this file to a translation agency, and they would return a `messages.es.xlf` (Spanish), `messages.fr.xlf` (French), etc., which you then wire into your `angular.json` / `project.json` to build the translated apps!

> [!TIP]
> **Enterprise Scale Translating**
> In massive organizations, extraction happens automatically during CI/CD pipelines, and the `.xlf` files are automatically pushed to translation software platforms like Crowdin or Lokalise, where non-technical translators provide the localized text.
