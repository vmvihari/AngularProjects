import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureIssueCreate } from './feature-issue-create';

describe('FeatureIssueCreate', () => {
  let component: FeatureIssueCreate;
  let fixture: ComponentFixture<FeatureIssueCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureIssueCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureIssueCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
