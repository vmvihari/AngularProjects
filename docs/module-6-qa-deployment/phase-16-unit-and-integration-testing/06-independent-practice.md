# Module 6, Lesson 6: Independent Practice

Congratulations! You have learned the core enterprise testing patterns: Isolated Testing (Pipes & Directives), Signal Store Mocking (HttpTestingController), Component Harnesses (CDK), and Router Testing (RouterTestingHarness).

Before we wrap up the testing module, it's time to put your skills to the test. 

Your application currently has several libraries and components that only have default boilerplate tests (or no tests at all!). Your final mission for this phase is to bring the application up to 100% test coverage by writing unit tests for the remaining files.

Here is your checklist for independent practice:

## 1. Pure Isolated Testing (No TestBed)
These files contain pure JavaScript/TypeScript logic. They don't touch the DOM or require dependency injection containers, so they should be tested in pure isolation.

- [ ] **`unique-title.validator.ts`**: (If it exists) Create a `.spec.ts` file. Test that it correctly returns `null` for a valid title, and an error object for an invalid one.
- [ ] **`urgent-description.validator.ts`**: Test the validation logic.

## 2. Service Testing (with TestBed)
These files handle state and require `TestBed` configuration.

- [ ] **`ToastService`** (`toast.service.spec.ts`): Use standard `TestBed` testing to verify that calling `show()` updates the service's internal state or creates the dynamic component correctly.

## 3. Component Testing (with Harnesses or DOM queries)
These components render UI and interact with services or `@Input()` bindings. Use `TestBed` to compile them, and use either CSS selectors or Component Harnesses to interact with them.

- [ ] **`UiIssueCard`** (`ui-issue-card.spec.ts`): Test that it correctly receives bindings (or `input()` signals) and displays them. Test the `delete` output emitter.
- [ ] **`FeatureIssueCreate`** (`feature-issue-create.spec.ts`): Mock the `IssueStore` and test that submitting the form calls the `addIssue()` method.
- [ ] **`FeatureIssueDetail`** (`feature-issue-detail.spec.ts`): Mock the `ActivatedRoute` to provide a fake `:id` parameter, and verify it renders the correct issue.
- [ ] **`FeatureIssueEdit`** (`feature-issue-edit.spec.ts`): Mock the `IssueStore`'s `selectedIssue` signal and verify the form populates correctly.
- [ ] **`UiToast`** (`ui-toast.spec.ts`): Verify that the toast UI renders correctly with the provided inputs.
- [ ] **`UiSkeletonCard`** (`skeleton-card.component.spec.ts`): Verify the dummy HTML renders without crashing.

Once you have written tests for all of these files, run `npx nx run-many -t test`. If you see 100% SUCCESS with no boilerplate failures across the entire monorepo, you have truly mastered Angular Testing!
