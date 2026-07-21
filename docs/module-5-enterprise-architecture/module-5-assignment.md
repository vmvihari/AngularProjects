# Module 5 Assignment: Enterprise Readiness

You've learned how to optimize performance with Deferrable Views, handle global application errors, and support international audiences through Angular's AOT localization. It's time to put these enterprise skills to the test.

## Your Mission

Your mission is to apply these architectural concepts to the **User Profile** and **Settings** features of the application.

### Task 1: Deferrable Views
The User Profile component is heavy, containing avatars and complex graphs (hypothetically). We shouldn't load it until the user actually navigates to it or hovers over the button.
1. Open your main layout where the Settings or User Profile is rendered.
2. Wrap the `<lib-ui-user-profile>` component in an `@defer` block.
3. Configure it to load `on hover` of a trigger element, with an `@placeholder` and `@loading` state.

### Task 2: Global Error Reporting Simulation
You implemented a global error handler in Phase 14. Let's make it more robust.
1. Create a `MonitoringService` (`monitoring.service.ts`) that simulates sending errors to a platform like Sentry or Datadog.
2. It should have a `logError(error: any)` method that `console.error`s the error with a prefix like `[DATADOG] Error reported:`.
3. Update your `ErrorHandler` to inject and use this `MonitoringService`.

### Task 3: i18n Localization
Your company is expanding to Spanish-speaking countries!
1. Open the `feature-settings.html` template.
2. Mark all the headings and labels (e.g., "Dark Mode", "Theme Preferences") with `i18n` attributes.
3. Run `npx nx extract-i18n issue-tracker` to update your `messages.xlf` file.
4. Verify that the newly marked strings appear in the generated `.xlf` file.

## Acceptance Criteria
- [ ] Profile component uses `@defer (on hover)` with a placeholder.
- [ ] Throwing a manual error (`throw new Error('test')`) results in a `[DATADOG]` prefixed log in the console.
- [ ] `messages.xlf` contains the translation units for the Settings page strings.
