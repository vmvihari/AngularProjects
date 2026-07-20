# Phase 9, Lesson 2: Cross-Field Validation

Angular's built-in validators (`Validators.required`, `Validators.minLength`) are great for single fields, but what happens when a rule depends on *multiple* fields?

For example: What if we have a business rule stating that the Issue's **Description** cannot be the exact same text as the **Title**?

Because our `FormGroup` encapsulates all the individual `FormControl`s, we can attach a Custom Validator directly to the `FormGroup` itself to check multiple fields at once!

## Your Task: Build a Cross-Field Validator

### 1. Create the Custom Validator
Open `libs/issues/feature-issue-create/src/lib/feature-issue-create/feature-issue-create.ts`.

Let's write a pure function that takes an `AbstractControl` (which will be our `FormGroup` in this case), reads the children controls, and returns an error object if the rule fails. Place this function *outside* of your component class (or export it from a separate `validators.ts` file if you prefer!).

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Our custom Cross-Field Validator
export const titleCannotMatchDescriptionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // Grab the child controls
  const title = control.get('title')?.value;
  const description = control.get('description')?.value;

  // If they are strictly identical (and not empty), return an error!
  if (title && description && title === description) {
    return { titleMatchesDescription: true };
  }
  
  // Return null if validation passes
  return null;
};
```

### 2. Attach the Validator to the FormGroup
Now, attach this validator to your `issueForm` instantiation inside the `FeatureIssueCreate` class!

```typescript
  // 1. Create the STRICT form model!
  public issueForm = new FormGroup({
    title: new FormControl<string>('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(5)] 
    }),
    description: new FormControl<string>('', { 
      nonNullable: true 
    })
  }, { validators: [titleCannotMatchDescriptionValidator] }); // <-- Attach it here!
```

### 3. Display the Error in the Template
Open your template: `libs/issues/feature-issue-create/src/lib/feature-issue-create/feature-issue-create.html`.

Since the error is attached to the entire `FormGroup` (and not a specific input), we check for the error on `issueForm` itself! Add this right above the submit button:

```html
    <!-- ... -->
    
    <!-- Cross-Field Error Rendering -->
    @if (issueForm.errors?.['titleMatchesDescription']) {
      <div class="error-msg" style="color: red; margin-bottom: 10px;">
        <strong>Error:</strong> The description cannot be identical to the title!
      </div>
    }

    <button type="submit" class="submit-btn" [disabled]="issueForm.invalid">
      Create Issue
    </button>
  </form>
</div>
```

### 4. Check Your Work!
Go to `/issues/create` in your browser.
Type "Server is down" in the Title.
Type "Server is down" in the Description.

The moment they match, your custom cross-field error will pop up, and the submit button will be disabled because the parent `FormGroup` is instantly marked as `INVALID`!
