import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusHighlightDirective } from './status-highlight.directive';

@Component({
  standalone: true,
  imports: [StatusHighlightDirective],
  template: `<div [appStatusHighlight]="status()"></div>`
})
class TestHostComponent {
  status = signal('Open');
}

describe('StatusHighlightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let divElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    divElement = fixture.nativeElement.querySelector('div');
    fixture.detectChanges();
  });

  it('should apply red styling for Open status', () => {
    expect(divElement.style.display).toBe('block');
    expect(divElement.style.boxShadow).toContain('red');
  });

  it('should apply orange styling for In Progress status', () => {
    component.status.set('In Progress');
    fixture.detectChanges();
    
    expect(divElement.style.boxShadow).toContain('orange');
  });

  it('should apply green styling for Closed status', () => {
    component.status.set('Closed');
    fixture.detectChanges();
    
    expect(divElement.style.boxShadow).toContain('green');
  });
});
