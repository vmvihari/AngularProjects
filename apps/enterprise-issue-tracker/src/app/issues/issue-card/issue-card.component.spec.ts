import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueCardComponent } from './issue-card.component';
import { Issue } from '../issue.model';

describe('IssueCardComponent', () => {
  let component: IssueCardComponent;
  let fixture: ComponentFixture<IssueCardComponent>;

  const mockIssue: Issue = {
    id: 1,
    title: 'Test Issue',
    description: 'Description',
    status: 'Open',
    tags: [],
    createdAt: new Date().toISOString()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueCardComponent);
    component = fixture.componentInstance;
  });

  it('should create successfully', () => {
    // IssueCardComponent purely uses Content Projection (<ng-content>).
    // It has no @Input() properties of its own, so we just verify it instantiates!
    expect(component).toBeTruthy();
  });
});
