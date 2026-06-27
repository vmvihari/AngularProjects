import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const urgentDescriptionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const title = control.get('title')?.value || '';
    const description = control.get('description')?.value || '';

    // If the title contains "urgent" (case-insensitive) but description is empty
    if (title.toLowerCase().includes('urgent') && description.trim() === '') {
        return { urgentRequiresDescription: true };
    }

    return null; // No validation errors
}