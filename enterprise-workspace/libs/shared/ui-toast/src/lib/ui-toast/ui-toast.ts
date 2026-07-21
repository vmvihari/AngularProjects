import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-ui-toast',
  imports: [],
  templateUrl: './ui-toast.html',
  styleUrl: './ui-toast.css',
  
  // Enterprise Pattern: Add ARIA attributes directly to the host element!
  host: {
    'role': 'alert',
    'aria-live': 'assertive' // 'assertive' means interrupt the screen reader immediately
  }
})
export class UiToast {
  // The service will dynamically pass data into this input!
  message = input.required<string>();
}
