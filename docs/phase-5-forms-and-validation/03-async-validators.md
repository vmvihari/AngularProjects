# Module 3: Asynchronous Validators

In enterprise applications, you often need to validate a field against a backend server—for example, checking if an issue title already exists in the database.

Because server requests take time, these validations are **asynchronous**. Angular handles this natively by allowing validators to return an RxJS `Observable` or a `Promise`.

## Your Task: Build an Async Title Validator

Let's imagine we want to ensure no two issues have the exact same title.

### 1. Create the Async Validator
Create a new file `src/app/issues/validators/unique-title.validator.ts`. 

Async validators often need access to a service (like an HTTP client) to check the backend. We can wrap our validator in a function that takes the service as an argument and returns the `AsyncValidatorFn`.

```typescript
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { IssueService } from '../issue.service';

export function uniqueTitleValidator(issueService: IssueService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Return early if empty
    if (!control.value) {
      return of(null);
    }

    // We use a timer to debounce (wait 500ms before checking) 
    // to avoid spamming the server while the user is typing!
    return timer(500).pipe(
      switchMap(() => {
        // Simulating a backend check using our local issues list
        const issues = issueService.issuesResource.value() || [];
        const isTaken = issues.some(i => i.title.toLowerCase() === control.value.toLowerCase());
        
        return isTaken ? of({ titleTaken: true }) : of(null);
      }),
      catchError(() => of(null)) // On API error, assume valid to not block the user
    );
  };
}
```

### 2. Apply the Async Validator
Open `src/app/issues/issue-create/issue-create.component.ts`. 
When defining a `FormControl`, the third argument (or property in the options object) is an array of async validators.

```typescript
import { uniqueTitleValidator } from '../validators/unique-title.validator';

// ... inside the component ...
  
  issueForm = new FormGroup({
    title: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required],
      asyncValidators: [uniqueTitleValidator(this.issueService)] // <-- Add it here!
    }),
    // ...
  });
```

### 3. Display the Error
In your template, you can now display a message specifically for `titleTaken`. We can also utilize the `pending` state to show a loading indicator!

```html
      @if (issueForm.controls.title.hasError('titleTaken')) {
        <span style="color: red; font-size: 12px;">This title is already taken!</span>
      }
      
      <!-- Show a loading indicator while checking! -->
      @if (issueForm.controls.title.pending) {
        <span style="color: gray; font-size: 12px;">Checking title availability...</span>
      }
```
