import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipDirective } from './tooltip.directive';

// Create a Fake "Host" Component that uses our Directive
@Component({
  standalone: true,
  imports: [TooltipDirective],
  template: `<div appTooltip="Test Tooltip!">Hover me</div>`
})
class TestHostComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    // Compile the Host Component
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should create the host component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the tooltip on mouseenter', () => {
    // Arrange: Find the div in the compiled DOM
    const divElement: HTMLElement = fixture.nativeElement.querySelector('div');
    
    // Act: Dispatch a mouseenter event
    divElement.dispatchEvent(new Event('mouseenter'));
    
    // Assert: Check if the tooltip span was appended!
    const tooltipSpan: HTMLElement | null = fixture.nativeElement.querySelector('span');
    expect(tooltipSpan).toBeTruthy();
    expect(tooltipSpan?.textContent).toContain('Test Tooltip!');
    expect(tooltipSpan?.style.position).toBe('absolute');
  });

  it('should remove the tooltip on mouseleave', () => {
    const divElement: HTMLElement = fixture.nativeElement.querySelector('div');
    
    // Act: Enter and then Leave
    divElement.dispatchEvent(new Event('mouseenter'));
    divElement.dispatchEvent(new Event('mouseleave'));
    
    // Assert: The span should be gone!
    const tooltipSpan: HTMLElement | null = fixture.nativeElement.querySelector('span');
    expect(tooltipSpan).toBeNull();
  });
});
