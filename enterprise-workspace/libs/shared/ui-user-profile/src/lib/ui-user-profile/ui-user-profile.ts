import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-user-profile',
  imports: [CommonModule],
  templateUrl: './ui-user-profile.html',
  styleUrl: './ui-user-profile.css',
})
export class UiUserProfile {
  @Input({ required: true }) user!: { name: string; role: string; email: string };
}
