# Phase 9, Lesson 3: Async Validators

Synchronous validators run instantly on the client-side. But what if validation requires checking the database? For example, what if we need to verify that an Issue Title hasn't already been used by someone else?

In Angular, we can use **Async Validators**. These are functions that return an Observable or a Promise, allowing the validation to run asynchronously (e.g., waiting for an HTTP response) without blocking the UI!

While an Async Validator is running, the form control enters a `PENDING` state!

## Your Task: Build an Async Validator

### 1. Create the Async Validator
Open `libs/issues/feature-issue-create/src/lib/feature-issue-create/feature-issue-create.ts`.

Because async validators often need services (like `HttpClient` or `IssueStore`), we typically write them as functions that take the injected dependency and return an `AsyncValidatorFn`. 

For this lesson, we will simulate a 1-second network delay using RxJS `timer` instead of hitting the backend.

```typescript
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { timer, map, Observable } from 'rxjs';

// Our Custom Async Validator
export const uniqueTitleAsyncValidator = (issueStore: any): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // 1. Simulate a 1-second network call
    return timer(1000).pipe(
      map(() => {
        // 2. Actually check the IssueStore database to see if the title exists!
        const issues = issueStore.issues();
        const exists = issues.some((issue: any) => issue.title.toLowerCase() === control.value.toLowerCase());
        
        if (exists) {
          return { titleTaken: true };
        }
        return null;
      })
    );
  };
};
```

### 2. Attach the Async Validator
Async Validators are passed as the **third** argument in a `FormControl` configuration (or in the `asyncValidators` array inside the options object).

Update your `title` control configuration in your `issueForm`:

```typescript
  // 1. Create the STRICT form model!
  public issueForm = new FormGroup({
    title: new FormControl<string>('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(5)],
      asyncValidators: [uniqueTitleAsyncValidator(this.issueStore)] // <-- Pass the Store in!
    }),
    description: new FormControl<string>('', { 
      nonNullable: true 
    })
  }, { validators: [titleCannotMatchDescriptionValidator] });
```

### 3. Display the PENDING and ERROR states
Open your template: `libs/issues/feature-issue-create/src/lib/feature-issue-create/feature-issue-create.html`.

Let's add some UI feedback so the user knows the validation is running asynchronously!

```html
      <!-- Validation Error Rendering -->
      <!-- ... -->
      
      <!-- Async Validator Error -->
      @if (issueForm.controls.title.touched && issueForm.controls.title.errors?.['titleTaken']) {
        <span class="error-msg" style="color: red;">This title is already taken in the database!</span>
      }
      
      <!-- Async PENDING State -->
      @if (issueForm.controls.title.pending) {
        <span style="color: blue;">Checking database...</span>
      }
```

### 4. Check Your Work!
1. Go to `/issues/create` in your browser.
2. Slowly type a title that you know already exists in your app (e.g., "Login page is broken").
3. After every keystroke, you will see the blue "Checking database..." message flash for exactly 1 second while the async validator runs!
4. Once you type the exact phrase, the validation will check the real `IssueStore`, fail validation, and display the red error!
