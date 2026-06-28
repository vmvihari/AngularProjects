import { FormControl } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';
import { uniqueTitleValidator } from './unique-title.validator';
import { IssueService } from '../issue.service';

describe('uniqueTitleValidator', () => {
  let issueServiceSpy: jasmine.SpyObj<IssueService>;
  let validator: any;

  beforeEach(() => {
    // Mock the rxResource.value() to return a specific array
    issueServiceSpy = jasmine.createSpyObj('IssueService', [], {
      issuesResource: {
        value: () => [{ title: 'Existing Bug' }, { title: 'Another bug' }]
      }
    });

    validator = uniqueTitleValidator(issueServiceSpy);
  });

  it('should return null if control is empty', fakeAsync(() => {
    const control = new FormControl('');
    let result: any = undefined;
    
    validator(control).subscribe((res: any) => result = res);
    tick(500);
    
    expect(result).toBeNull();
  }));

  it('should return null if title is unique', fakeAsync(() => {
    const control = new FormControl('New Unique Bug');
    let result: any = undefined;
    
    validator(control).subscribe((res: any) => result = res);
    tick(500); // Advance timer
    
    expect(result).toBeNull();
  }));

  it('should return validation error if title already exists', fakeAsync(() => {
    const control = new FormControl('existing bug'); // Case insensitive check
    let result: any = undefined;
    
    validator(control).subscribe((res: any) => result = res);
    tick(500); // Advance timer
    
    expect(result).toEqual({ titleTaken: true });
  }));
});
