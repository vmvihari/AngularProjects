import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  
  // Enterprise Pattern: Add ARIA attributes directly to the host element!
  host: {
    'role': 'alert',
    'aria-live': 'assertive' // 'assertive' means interrupt the screen reader immediately
  }
})
export class ToastComponent {
  message = input.required<string>();
}
