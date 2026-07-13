# Module 6: Independent Practice

Congratulations! You have learned the core enterprise testing patterns: Isolated Testing (Pipes & Directives), Service Mocking (HttpClient), Component Harnesses (CDK), and Router Testing (RouterTestingHarness).

Before we wrap up the testing module, it's time to put your skills to the test. 

Your application currently has several components, services, and validators that only have default boilerplate tests (or no tests at all!). Your final mission for this phase is to bring the application up to 100% test coverage by writing unit tests for the remaining files.

Here is your checklist for independent practice:

## 1. Pure Isolated Testing (No TestBed)
These files contain pure JavaScript/TypeScript logic. They don't touch the DOM or require dependency injection containers, so they should be tested in pure isolation (using the `new` keyword or just calling the function).

- [ ] **`unique-title.validator.ts`**: Create a `unique-title.validator.spec.ts` file. Test that it correctly returns `null` for a valid title, and an error object for an invalid one.
- [ ] **`urgent-description.validator.ts`**: Create a `urgent-description.validator.spec.ts` file. Test the validation logic.

## 2. Service Testing (with TestBed & HttpTestingController)
These files handle state or make HTTP calls, and thus require `TestBed` configuration.

- [ ] **`ToastService`** (`toast.service.spec.ts`): Use standard `TestBed` testing to verify that calling `showToast()` updates the service's internal signal state correctly.

## 3. Component Testing (with Harnesses or DOM queries)
These components render UI and interact with services or `@Input()` bindings. Use `TestBed` to compile them, and use either CSS selectors or Component Harnesses to interact with them.

- [ ] **`IssueCardComponent`** (`issue-card.component.spec.ts`): Test that it correctly receives `@Input()` bindings (or `input()` signals) and displays them.
- [ ] **`IssueCreateComponent`** (`issue-create.component.spec.ts`): Mock the `IssueService` and test that submitting the form calls the `addIssue()` method.
- [ ] **`IssueDetailComponent`** (`issue-detail.component.spec.ts`): Mock the `ActivatedRoute` to provide a fake `:id` parameter, and verify it renders the correct issue.
- [ ] **`IssueEditComponent`** (`issue-edit.component.spec.ts`): Mock the `IssueService`'s `selectedIssue` signal and verify the form populates correctly.
- [ ] **`ToastComponent`** (`toast.component.spec.ts`): Verify that the toast UI renders correctly when the `ToastService` state changes.
- [ ] **`SkeletonCardComponent`** (`skeleton-card.component.spec.ts`): Verify the dummy HTML renders without crashing.

Once you have written tests for all of these files, run `npm run test -- --watch=false`. If you see 100% SUCCESS with no boilerplate failures, you have truly mastered Angular Testing!

When you are finished, move on to **Module 7**, where we look at the future of Angular Testing with Vitest.
