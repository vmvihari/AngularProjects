import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiUserProfile } from './ui-user-profile';

describe('UiUserProfile', () => {
  let component: UiUserProfile;
  let fixture: ComponentFixture<UiUserProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiUserProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(UiUserProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
