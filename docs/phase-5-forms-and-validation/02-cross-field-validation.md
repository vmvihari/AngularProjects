# Module 2: Cross-Field Validation

Sometimes a validation rule depends on the values of multiple fields. For example, what if we want to make the `description` field required **only** if the `title` contains the word "urgent"?

Because this rule depends on two different fields (`title` and `description`), we cannot attach the validator to a single `FormControl`. Instead, we attach a custom validator function to the parent `FormGroup`.

## Your Task: Add a Cross-Field Validator

### 1. Create the Custom Validator
In an enterprise architecture, custom validators should be extracted into their own files for reusability and testability. 

> [!NOTE]
> Interestingly, there is no native `ng generate validator` command in the standard Angular CLI! Because modern custom validators are just plain TypeScript functions rather than decorated classes, developers typically just create the file manually.

Manually create a new file at `src/app/issues/validators/urgent-description.validator.ts`. 

This function will receive the `AbstractControl` (which is our `FormGroup`), read the title and description, and return an error object if the validation fails.

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const urgentDescriptionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const title = control.get('title')?.value || '';
  const description = control.get('description')?.value || '';

  // If the title contains "urgent" (case-insensitive) but description is empty
  if (title.toLowerCase().includes('urgent') && description.trim() === '') {
    return { urgentRequiresDescription: true };
  }

  return null; // Valid!
};
```

### 2. Apply the Validator to the FormGroup
Open `src/app/issues/issue-create/issue-create.component.ts`. Import your new validator at the top of the file, and then update your `issueForm` initialization to include it at the group level:

```typescript
import { urgentDescriptionValidator } from '../validators/urgent-description.validator';

// ... inside your component class ...

  issueForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true })
  }, { validators: [urgentDescriptionValidator] }); // <-- Add the validator here
```

### 3. Display the Error in the Template
Finally, update your HTML template to display a warning message if the `urgentRequiresDescription` error is present on the `FormGroup`:

```html
      <!-- Group-level validation error -->
      @if (issueForm.errors?.['urgentRequiresDescription'] && issueForm.touched) {
        <span style="color: red; font-size: 12px;">Urgent issues must include a description!</span>
      }
```

Try it out! Type "Urgent bug!" into the title. The form will instantly become invalid, the submit button will disable, and the new error will appear until you provide a description.
