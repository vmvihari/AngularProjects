import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueEditComponent } from './issue-edit.component';
import { IssueService } from '../issue.service';
import { ToastService } from '../../shared/service/toast.service';
import { signal } from '@angular/core';

describe('IssueEditComponent', () => {
  let component: IssueEditComponent;
  let fixture: ComponentFixture<IssueEditComponent>;
  
  let issueServiceSpy: any;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    // We mock the signals directly so we can inspect if they were updated
    const mockSelectedIssue = signal<any>({ id: 1, title: 'Bug' });
    const mockDraftTitle = signal('Updated Bug');
    
    issueServiceSpy = {
      selectedIssue: mockSelectedIssue,
      draftTitle: mockDraftTitle,
      updateIssueTitle: jasmine.createSpy('updateIssueTitle')
    };

    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [IssueEditComponent],
      providers: [
        { provide: IssueService, useValue: issueServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should save the edit and clear the selected issue', () => {
    // Act
    component.onSaveEdit();
    
    // Assert
    expect(issueServiceSpy.updateIssueTitle).toHaveBeenCalledWith(1, 'Updated Bug');
    expect(issueServiceSpy.selectedIssue()).toBeNull(); // Should have cleared the selection
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Issue successfully updated!');
  });
});
