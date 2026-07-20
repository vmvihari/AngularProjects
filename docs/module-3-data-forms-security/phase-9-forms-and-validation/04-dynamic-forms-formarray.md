# Phase 9, Lesson 4: Dynamic Forms with FormArray

Sometimes you don't know exactly how many inputs a user will need. What if the user wants to attach an arbitrary number of "Tags" to the Issue they are creating? They might want 0 tags, or they might want 10 tags.

To handle dynamic lists of form controls, Angular provides the `FormArray` class!

## Your Task: Build a Dynamic Tags Array

### 1. Update the Data Models
Before we build the form, our global `Issue` type and `IssueStore` need to know that tags exist! (In a real enterprise app, you would also ensure your backend API is updated to support this).

Open `libs/issues/data-access/src/lib/issue.store.ts`.

Update the `Issue` interface to include an optional array of tags:
```typescript
export interface Issue {
  id: number;
  title: string;
  status: string;
  description?: string;
  tags?: string[]; // <-- Add this!
}
```

Next, update your `addIssue` method inside the `IssueStore` to accept the new tags array and send it to the server:
```typescript
    addIssue(title: string, description: string, tags: string[] = []) {
      // 1. Optimistic UI Update
      const tempId = Date.now(); 
      patchState(store, (state) => ({
        issues: [...state.issues, { id: tempId, title, description, status: 'Open', tags }]
      }));

      // 2. Background Sync
      http.post(`${environment.apiUrl}/issues`, { title, description, status: 'Open', tags }).subscribe();
    },
```

### 2. Update the Form Model
Open `libs/issues/feature-issue-create/src/lib/feature-issue-create/feature-issue-create.ts`.

Import `FormArray` from `@angular/forms`, and add it to your `issueForm`!

```typescript
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

// ... Inside your component:

  public issueForm = new FormGroup({
    // ... title and description
    
    // 1. Add a FormArray that holds strings (the tag names)
    tags: new FormArray<FormControl<string>>([])
    
  }, { validators: [titleCannotMatchDescriptionValidator] });

  // 2. Add a helper getter for easy access in the template
  get tags() {
    return this.issueForm.controls.tags;
  }

  // 3. Add a method to push new controls into the array dynamically!
  addTag() {
    this.tags.push(new FormControl<string>('', { nonNullable: true }));
  }

  // 4. Add a method to remove a control
  removeTag(index: number) {
    this.tags.removeAt(index);
  }
```

### 3. Render the FormArray
Open your template: `libs/issues/feature-issue-create/src/lib/feature-issue-create/feature-issue-create.html`.

To render a `FormArray`, you must bind a `formArrayName` directive to a container element. Inside, you iterate over the `controls` and bind `formControlName` using the index!

Add this right below your description textarea:

```html
    <!-- ... -->
    <div class="form-group">
      <label>Tags</label>
      <button type="button" (click)="addTag()">+ Add Tag</button>

      <!-- Bind the FormArray -->
      <div formArrayName="tags" style="margin-top: 10px;">
        
        <!-- Iterate over the controls array using @for -->
        @for (tagCtrl of tags.controls; track $index) {
          <div style="display: flex; gap: 5px; margin-bottom: 5px;">
            <!-- Use the $index as the formControlName! -->
            <input type="text" [formControlName]="$index" placeholder="E.g., frontend" />
            <button type="button" (click)="removeTag($index)" style="color: red;">X</button>
          </div>
        }

      </div>
    </div>
    <!-- ... -->
```

*(Note: We use `type="button"` on these buttons because otherwise they default to `type="submit"` and will submit your form prematurely!)*

### 4. Check Your Work
Go to `/issues/create` in your browser.
Click the "+ Add Tag" button multiple times. You will see dynamic text inputs appearing! 
Type inside them, and click the "X" to seamlessly remove them from the form model. 

Behind the scenes, your `FormGroup`'s value object now looks like this:
```json
{
  "title": "My Issue",
  "description": "It broke.",
  "tags": ["frontend", "urgent", "bug"]
}
```

In the final lesson, we will refactor all of this verbose `new FormGroup` and `new FormControl` syntax into something much cleaner!
