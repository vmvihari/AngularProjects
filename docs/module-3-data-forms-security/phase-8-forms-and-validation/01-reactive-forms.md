# Module 1: Reactive Forms

Welcome to Phase 5: Forms & Validation!
We are going to use Angular's **Reactive Forms**, which is the industry standard for building robust, scalable forms in enterprise Angular applications.

In Reactive Forms, you build the form model (the structure and validation rules) directly in your TypeScript component using `FormGroup` and `FormControl`. You then bind this model to your HTML template using directives like `[formGroup]` and `formControlName`. 

Let's replace that placeholder and build a robust, reactive form! We will bind our HTML inputs to our form model and add a validation rule to ensure the user provides a title.

## Your Task: Build the Form

### 1. Update your Service
First, open `src/app/issues/issue.service.ts` and ensure you have an `addIssue` method so we can save the new data:

```typescript
  addIssue(title: string, description: string) {
    this.issuesResource.value.update(issues => [
      ...(issues ?? []),
      { id: Date.now(), title, status: 'Open' }
    ]);
  }
```

### 2. Build the Create Issue Component
Open your placeholder `src/app/issues/issue-create/issue-create.component.ts` and replace it entirely with the following code. Notice how we import `ReactiveFormsModule`, define our form using `FormGroup` and `FormControl`, and use `Validators.required` to enforce our validation schema:

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2>Create New Issue</h2>
    <form [formGroup]="issueForm" (ngSubmit)="onSubmit()" style="display: flex; flex-direction: column; width: 300px; gap: 10px;">
      
      <label>Title</label>
      <input formControlName="title" />
      <!-- Only show the error if the field is invalid AND the user has interacted with it -->
      @if (issueForm.controls.title.touched && issueForm.controls.title.invalid) {
        <span style="color: red; font-size: 12px;">Title is required</span>
      }

      <label>Description</label>
      <textarea formControlName="description"></textarea>

      <!-- Disable the button entirely if any validation rules fail -->
      <button type="submit" [disabled]="issueForm.invalid">Create Issue</button>
    </form>
  `
})
export class IssueCreateComponent {
  issueService = inject(IssueService);
  router = inject(Router);

  // 1. Create the form model with validation rules
  issueForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true })
  });

  // 2. Define the submit action
  onSubmit() {
    if (this.issueForm.valid) {
      const { title, description } = this.issueForm.getRawValue();
      this.issueService.addIssue(title, description);
      this.router.navigate(['/issues']); // Navigate back to the list on success
    }
  }
}
```

Save these files and try it out! If you click "Create Issue" with a blank title, or click into the title box and click away, you should see the required error pop up.
