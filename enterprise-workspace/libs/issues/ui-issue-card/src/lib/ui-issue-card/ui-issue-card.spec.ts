import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiIssueCard } from './ui-issue-card';

describe('UiIssueCard', () => {
  let component: UiIssueCard;
  let fixture: ComponentFixture<UiIssueCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiIssueCard],
    }).compileComponents();

    fixture = TestBed.createComponent(UiIssueCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
