import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { timer, map, Observable } from 'rxjs';

export const uniqueTitleAsyncValidator = (issueStore: any, getCurrentIdFn?: () => number): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(1000).pipe(
      map(() => {
        const issues = issueStore.issues();
        const currentId = getCurrentIdFn ? getCurrentIdFn() : null;
        
        // Check if ANY other issue has this title (ignoring the current issue ID if provided)
        const exists = issues.some((issue: any) => 
          issue.id !== currentId && 
          issue.title.toLowerCase() === control.value.toLowerCase()
        );
        
        if (exists) {
          return { titleTaken: true };
        }
        return null;
      })
    );
  };
};

export const titleCannotMatchDescriptionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const title = control.get('title')?.value;
  const description = control.get('description')?.value;

  if (title && description && title === description) {
    return { titleMatchesDescription: true };
  }
  
  return null;
};
