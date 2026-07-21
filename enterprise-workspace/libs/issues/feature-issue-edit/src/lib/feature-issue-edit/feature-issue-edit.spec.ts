import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureIssueEdit } from './feature-issue-edit';

describe('FeatureIssueEdit', () => {
  let component: FeatureIssueEdit;
  let fixture: ComponentFixture<FeatureIssueEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureIssueEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureIssueEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
