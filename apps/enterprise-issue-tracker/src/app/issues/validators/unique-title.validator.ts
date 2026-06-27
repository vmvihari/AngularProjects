import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, Observable, of, switchMap, timer } from 'rxjs';

import { IssueService } from '../issue.service';

export function uniqueTitleValidator(issueService: IssueService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        // Return early if empty or unchanged title
        if (!control.value) {
            return of(null);
        }

        // We use a timer to debounce (wait 500ms before checking) 
        // to avoid spamming the server while the user is typing!
        return timer(500).pipe(
            switchMap(() => {
                // Simulate a server check for existing titles
                const issues = issueService.issuesResource.value() ?? [];
                const isTaken = issues.some(i => i.title.toLowerCase() === control.value.toLowerCase());

                return isTaken ? of({ titleTaken: true }) : of(null);
            }),
            // On API error, assume valid to not block the user
            catchError(() => of(null))
        )
    }
}