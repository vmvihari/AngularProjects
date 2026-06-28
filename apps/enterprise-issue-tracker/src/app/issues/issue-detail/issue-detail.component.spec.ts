import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueDetailComponent } from './issue-detail.component';
import { IssueService } from '../issue.service';

describe('IssueDetailComponent', () => {
  let component: IssueDetailComponent;
  let fixture: ComponentFixture<IssueDetailComponent>;
  let issueServiceSpy: jasmine.SpyObj<IssueService>;

  beforeEach(async () => {
    issueServiceSpy = jasmine.createSpyObj('IssueService', [], {
      issuesResource: {
        value: () => [{ id: 1, title: 'Bug 1', description: 'desc', status: 'Open', tags: [], createdAt: '' }]
      }
    });

    await TestBed.configureTestingModule({
      imports: [IssueDetailComponent],
      providers: [
        { provide: IssueService, useValue: issueServiceSpy }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueDetailComponent);
    component = fixture.componentInstance;
  });

  it('should correctly resolve the issue based on the input id', () => {
    // Mimic the router passing the :id parameter into the input()
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
    
    // Assert the computed() signal worked
    expect(component.issue()?.title).toBe('Bug 1');
  });
});
