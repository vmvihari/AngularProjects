import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusHighlightDirective } from './status-highlight.directive';
import { describe, it, expect, beforeEach } from 'vitest';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply red shadow for Open status', () => {
    const divElement: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(divElement.style.boxShadow).toContain('red');
  });

  it('should apply green shadow for Closed status', () => {
    fixture.componentInstance.status.set('Closed');
    fixture.detectChanges(); // Trigger change detection to apply new signal value
    
    const divElement: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(divElement.style.boxShadow).toContain('green');
  });
});
