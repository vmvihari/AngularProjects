import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureIssueDetail } from './feature-issue-detail';

describe('FeatureIssueDetail', () => {
  let component: FeatureIssueDetail;
  let fixture: ComponentFixture<FeatureIssueDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureIssueDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureIssueDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
