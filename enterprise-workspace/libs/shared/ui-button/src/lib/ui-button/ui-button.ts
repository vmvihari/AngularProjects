import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-ui-button',
  imports: [MatButtonModule],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
})
export class UiButton {
  color = input<'primary' | 'accent' | 'warn' | 'basic'>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  customClass = input<string>('');
  clicked = output<void>();
}
