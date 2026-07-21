import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStatusHighlight]',
  standalone: true
})
export class StatusHighlightDirective {
  // Inject the element this directive sits on
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  // Accept the status as an input signal
  appStatusHighlight = input.required<string>();

  constructor() {
    // Reactively update the styling whenever the status changes
    effect(() => {
      const status = this.appStatusHighlight();
      let color = 'gray';

      if (status === 'Open') color = 'red';
      if (status === 'Closed') color = 'green';

      // Custom Components are display: inline by default. Make it block!
      this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
      
      // Use a glowing box-shadow so it doesn't conflict with inner borders!
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', `0 0 10px ${color}`);
      this.renderer.setStyle(this.el.nativeElement, 'border-radius', '4px');
    });
  }
}