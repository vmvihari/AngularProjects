import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { By } from '@angular/platform-browser';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  it('should display the provided message input', () => {
    // Set the required input signal
    fixture.componentRef.setInput('message', 'Hello World!');
    fixture.detectChanges();
    
    // Assert the DOM renders it
    const div = fixture.debugElement.query(By.css('.toast-container')).nativeElement;
    expect(div.textContent).toContain('Hello World!');
  });
});
