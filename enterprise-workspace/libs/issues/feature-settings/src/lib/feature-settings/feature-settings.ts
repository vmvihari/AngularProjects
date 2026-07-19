import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiUserProfile } from '@enterprise-workspace/ui-user-profile';
import { UserService } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-settings',
  imports: [CommonModule, UiUserProfile],
  templateUrl: './feature-settings.html',
  styleUrl: './feature-settings.css',
})
export class FeatureSettings {
  private userService = inject(UserService);

  get user() {
    return this.userService.getCurrentUser();
  }
}
