# Module 5: FormBuilder Service

As forms get larger and more complex, writing `new FormGroup(...)`, `new FormControl(...)`, and `new FormArray(...)` over and over becomes incredibly verbose and hard to read.

Angular provides the `FormBuilder` (often injected as `fb`) as a syntactic sugar service to drastically reduce the boilerplate.

## Your Task: Refactor with FormBuilder

### 1. Refactor the Component
Open `src/app/issues/issue-create/issue-create.component.ts`. Inject `NonNullableFormBuilder` (which is a safer, strictly typed version of `FormBuilder`) and refactor your form initialization.

```typescript
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormArray } from '@angular/forms';
// ... other imports

export class IssueCreateComponent {
  issueService = inject(IssueService);
  // Inject the NonNullableFormBuilder to ensure our form values can never be null
  fb = inject(NonNullableFormBuilder); 

  // Look how much cleaner this is!
  issueForm = this.fb.group({
    // Form value is an array: [defaultValue, syncValidators, asyncValidators]
    title: ['', [Validators.required], [uniqueTitleValidator(this.issueService)]],
    description: [''],
    tags: this.fb.array([
      this.fb.control('')
    ])
  }, { validators: [urgentDescriptionValidator] });

  // Helper getter
  get tags() {
    return this.issueForm.get('tags') as FormArray;
  }

  addTag() {
    this.tags.push(this.fb.control(''));
  }
}
```

Notice how we replaced `new FormGroup`, `new FormControl`, and `new FormArray` entirely. This makes enterprise-scale forms significantly easier to maintain and read.

---

**Congratulations!** You have officially mastered Enterprise Forms and Validation in Angular. You now know how to build reactive models, apply cross-field validation, asynchronously validate against a server, build dynamic arrays, and clean it all up with `FormBuilder`.
