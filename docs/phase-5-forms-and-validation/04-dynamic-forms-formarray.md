# Module 4: Dynamic Forms with FormArray

Sometimes you don't know exactly how many inputs a user will need. What if we want to allow users to add multiple "Tags" to an issue? You can't hardcode 10 tag inputs.

This is where `FormArray` comes in. It manages an array of `FormControl`, `FormGroup`, or even other `FormArray` instances.

## Your Task: Add Dynamic Tags

### 1. Update the Form Model
Open `src/app/issues/issue-create/issue-create.component.ts`. Add a `FormArray` to your `FormGroup`:

```typescript
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

// ...
  issueForm = new FormGroup({
    // ... other controls
    tags: new FormArray([
      new FormControl('', { nonNullable: true }) // Start with one empty tag input
    ])
  });

  // Helper getter for cleaner template code
  get tags() {
    return this.issueForm.get('tags') as FormArray;
  }

  // Method to add a new empty control to the array
  addTag() {
    this.tags.push(new FormControl('', { nonNullable: true }));
  }
  
  // Method to remove a control
  removeTag(index: number) {
    this.tags.removeAt(index);
  }
```

### 2. Bind the FormArray in the Template
To bind a `FormArray` to the DOM, you must use the `formArrayName` directive, and then loop over its `.controls`. 

```html
      <div formArrayName="tags">
        <label>Tags</label>
        
        @for (tagControl of tags.controls; track $index) {
          <div style="display: flex; gap: 5px; margin-bottom: 5px;">
            <!-- Bind to the index of the array! -->
            <input [formControlName]="$index" placeholder="Enter a tag" />
            <button type="button" (click)="removeTag($index)">X</button>
          </div>
        }
        
        <button type="button" (click)="addTag()">+ Add Tag</button>
      </div>
```

When you call `this.issueForm.getRawValue()`, you will now automatically get a beautiful payload object with a `tags` array:
`{ title: '...', description: '...', tags: ['bug', 'ui'] }`.
