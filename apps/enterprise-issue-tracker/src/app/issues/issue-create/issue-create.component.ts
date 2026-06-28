import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray, NonNullableFormBuilder } from '@angular/forms';

import { IssueService } from '../issue.service';
import { urgentDescriptionValidator } from '../validators/urgent-description.validator';
import { uniqueTitleValidator } from '../validators/unique-title.validator';
import { ToastService } from '../../shared/service/toast.service';

@Component({
  selector: 'app-issue-create',
  imports: [ReactiveFormsModule],
  templateUrl: './issue-create.component.html',
  styleUrl: './issue-create.component.css'
})
export class IssueCreateComponent {
  issueService = inject(IssueService);
  router = inject(Router);
  // Inject the NonNullableFormBuilder to ensure our form values can never be null
  fb = inject(NonNullableFormBuilder);
  toastService = inject(ToastService);

  // Create the form model with validation rules
  issueForm = this.fb.group({
    // Form value is an array: [defaultValue, syncValidators, asyncValidators]
    title: ['', [Validators.required], [uniqueTitleValidator(this.issueService)]],
    description: [''],
    tags: this.fb.array([this.fb.control('')])
  }, { validators: [urgentDescriptionValidator] });

  // Define the submit action
  onSubmit() {
    if (this.issueForm.valid) {
      const { title, description, tags } = this.issueForm.getRawValue();
      this.issueService.addIssue(title, description, tags);

      // Programmatically spawn the toast!
      this.toastService.show('Issue successfully created!');

      // Navigate back to the list on success
      this.router.navigate(['/issues']);
    }
  }

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
}
