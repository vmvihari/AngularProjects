import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { IssueStore, uniqueTitleAsyncValidator, titleCannotMatchDescriptionValidator } from '@enterprise-workspace/data-access';
import { NgClass } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { timer, map, Observable } from 'rxjs';
import { ToastService } from '@enterprise-workspace/ui-toast';


@Component({
  selector: 'lib-feature-issue-edit',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './feature-issue-edit.html',
  styleUrl: './feature-issue-edit.css',
})
export class FeatureIssueEdit implements OnInit {
  public issueStore = inject(IssueStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(NonNullableFormBuilder);
  toastService = inject(ToastService);

  public issueId!: number;

  public issueForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)], [uniqueTitleAsyncValidator(this.issueStore, () => this.issueId)]],
    description: [''],
    tags: this.fb.array<string>([]) 
  }, { validators: [titleCannotMatchDescriptionValidator] });

  get tags() {
    return this.issueForm.controls.tags;
  }

  addTag(value = '') {
    this.tags.push(this.fb.control(value));
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.issueId = parseInt(idParam, 10);
      
      // Fetch the issue data for that ID
      const issue = this.issueStore.getIssueById(this.issueId);
      
      if (issue) {
        // Pre-fill the FormArray first if there are tags
        if (issue.tags) {
          issue.tags.forEach(tag => this.addTag(tag));
        }

        // Use patchValue to dynamically pre-fill the form!
        this.issueForm.patchValue({
          title: issue.title,
          description: issue.description || ''
        });
      }
    }
  }

  onSubmit() {
    if (this.issueForm.valid) {
      const { title, description, tags } = this.issueForm.getRawValue();
      
      this.issueStore.updateIssue(this.issueId, { title, description, tags });

      // Programmatically spawn the toast!
      this.toastService.show('Issue successfully updated!');
      
      this.router.navigate(['/issues']); 
    }
  }
}
