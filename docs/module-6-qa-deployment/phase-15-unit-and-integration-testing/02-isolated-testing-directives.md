# Module 2: Testing Directives (Host Components)

In Module 1, we used "Isolated Testing" (testing a class directly with the `new` keyword) to test our `TimeAgoPipe`. 

However, testing modern Angular Directives presents a unique architectural challenge. 

Because our Directives are built using the modern `inject()` function (e.g., `inject(ElementRef)`) instead of constructor injection, we cannot easily instantiate them directly with `new Directive()`. Furthermore, our Directives use modern Angular Signals like `input.required()`. You **cannot** assign values directly to an `input()` signal in a pure isolated unit test like you could with the old `@Input()` decorator. 

To test modern Directives, the official Angular best practice is to use a **Host Component**. We create a fake, temporary component just for the test, attach our Directive to it, and use `TestBed` to compile it. This allows Angular to handle the `inject()` context and Signal bindings automatically!

## Your Task: Test `TooltipDirective`

Our Tooltip Directive listens for `mouseenter` and uses `Renderer2` to dynamically create a tooltip span. Let's test it using a Host Component!

1. Open `src/app/shared/directives/tooltip.directive.spec.ts`.
2. Delete the boilerplate and write this Host Component test:

```typescript
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip.directive';

// 1. Create a Fake "Host" Component that uses our Directive
@Component({
  standalone: true,
  imports: [TooltipDirective],
  template: `<div appTooltip="Test Tooltip!">Hover me</div>`
})
class TestHostComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    // 2. Compile the Host Component
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
```

### Run the test!
Run `npm run test` again. You will see that `TooltipDirective` now passes!

### Your Mini-Challenge
Use this exact same Host Component approach to fix the tests for `SkeletonLoaderDirective` and `StatusHighlightDirective`! 

*(Hint: For StatusHighlightDirective, your Host Component template could look like: `<div [appStatusHighlight]="'Open'"></div>`)*

By testing these three directives using Host Components, you will eliminate 3 more failing tests from the terminal.

In **Module 3**, we will look at testing Services where we mock the `HttpClient`.
