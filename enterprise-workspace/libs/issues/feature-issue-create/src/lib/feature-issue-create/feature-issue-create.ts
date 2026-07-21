import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { IssueStore, uniqueTitleAsyncValidator, titleCannotMatchDescriptionValidator } from '@enterprise-workspace/data-access';
import { NgClass } from '@angular/common'; // We will use this for CSS later
import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { timer, map, Observable } from 'rxjs';
import { ToastService } from '@enterprise-workspace/ui-toast';
import { UiButton } from '@enterprise-workspace/ui-button';

@Component({
  selector: 'lib-feature-issue-create',
  imports: [ReactiveFormsModule, NgClass, UiButton],
  templateUrl: './feature-issue-create.html',
  styleUrl: './feature-issue-create.css',
})
export class FeatureIssueCreate {
  public issueStore = inject(IssueStore);
  private router = inject(Router);

  // Inject the NonNullableFormBuilder!
  private fb = inject(NonNullableFormBuilder);

  toastService = inject(ToastService);

  // 1. Build the form using fb.group!
  // The first item in the array is the initial value, the second is synchronous validators, the third is async validators!
  public issueForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)], [uniqueTitleAsyncValidator(this.issueStore)]],
    description: [''],
    tags: this.fb.array<string>([]) // Create the FormArray using fb.array
  }, { validators: [titleCannotMatchDescriptionValidator] });

  // 2. Add a helper getter for easy access in the template
  get tags() {
    return this.issueForm.controls.tags;
  }

  // 3. Add a method to push new controls into the array dynamically!
  addTag() {
    this.tags.push(this.fb.control(''));
  }

  // 4. Add a method to remove a control
  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  // 2. Define the submit action
  onSubmit() {
    if (this.issueForm.valid) {
      const { title, description } = this.issueForm.getRawValue();
      
      // Save it using our global store!
      this.issueStore.addIssue(title, description);

      // Programmatically spawn the toast!
      this.toastService.show('Issue successfully created!');
      
      // Navigate back to the Issue Manager!
      this.router.navigate(['/issues']); 
    }
  }
}
