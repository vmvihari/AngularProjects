import { FormControl, FormGroup } from '@angular/forms';
import { urgentDescriptionValidator } from './urgent-description.validator';

describe('urgentDescriptionValidator', () => {
  it('should return null if title does not contain urgent', () => {
    const formGroup = new FormGroup({
      title: new FormControl('Normal Bug'),
      description: new FormControl('')
    });
    
    expect(urgentDescriptionValidator(formGroup)).toBeNull();
  });

  it('should return error if title contains urgent but description is empty', () => {
    const formGroup = new FormGroup({
      title: new FormControl('URGENT Bug'),
      description: new FormControl('   ') // also test whitespace trimming
    });
    
    expect(urgentDescriptionValidator(formGroup)).toEqual({ urgentRequiresDescription: true });
  });

  it('should return null if title contains urgent and description is provided', () => {
    const formGroup = new FormGroup({
      title: new FormControl('URGENT Bug'),
      description: new FormControl('This is bad')
    });
    
    expect(urgentDescriptionValidator(formGroup)).toBeNull();
  });
});
