import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IssueCreateComponent } from './issue-create.component';
import { IssueService } from '../issue.service';
import { ToastService } from '../../shared/service/toast.service';
import { Router } from '@angular/router';

describe('IssueCreateComponent', () => {
  let component: IssueCreateComponent;
  let fixture: ComponentFixture<IssueCreateComponent>;
  
  let issueServiceSpy: jasmine.SpyObj<IssueService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    issueServiceSpy = jasmine.createSpyObj('IssueService', ['addIssue']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Unique title validator uses issueService.issuesResource, so we must mock it too
    Object.defineProperty(issueServiceSpy, 'issuesResource', {
      value: { value: () => [] }
    });

    await TestBed.configureTestingModule({
      imports: [IssueCreateComponent],
      providers: [
        { provide: IssueService, useValue: issueServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should submit the form and navigate away', fakeAsync(() => {
    // Fill out the reactive form
    component.issueForm.patchValue({
      title: 'New Bug',
      description: 'Bug description',
    });
    
    // The unique title validator is async and debounces for 500ms!
    // We must tick the clock forward so the form status changes from PENDING to VALID.
    tick(500);
    
    // Valid forms should submit successfully
    component.onSubmit();
    
    expect(issueServiceSpy.addIssue).toHaveBeenCalledWith('New Bug', 'Bug description', ['']);
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Issue successfully created!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/issues']);
  }));
});
