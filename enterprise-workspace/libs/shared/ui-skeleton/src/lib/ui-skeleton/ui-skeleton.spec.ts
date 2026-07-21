import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSkeleton } from './ui-skeleton';

describe('UiSkeleton', () => {
  let component: UiSkeleton;
  let fixture: ComponentFixture<UiSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
