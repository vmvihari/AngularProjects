import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiIssueFilters } from './ui-issue-filters';

describe('UiIssueFilters', () => {
  let component: UiIssueFilters;
  let fixture: ComponentFixture<UiIssueFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiIssueFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(UiIssueFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
