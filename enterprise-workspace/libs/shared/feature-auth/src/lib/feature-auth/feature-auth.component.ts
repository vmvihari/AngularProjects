import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthStore, Role } from '@enterprise-workspace/shared-util-auth';

@Component({
  selector: 'lib-feature-auth',
  imports: [FormsModule],
  templateUrl: './feature-auth.component.html',
  styleUrl: './feature-auth.component.css',
})
export class FeatureAuthComponent {
  public authStore = inject(AuthStore);
  private router = inject(Router);

  // Default selection
  selectedRole: Role = 'Admin';

  onLogin() {
    // 1. Simulate a backend login by passing the selected role to our AuthStore
    this.authStore.login(`Demo ${this.selectedRole}`, this.selectedRole);
    
    // 2. Once logged in, instantly route the user to the Dashboard!
    this.router.navigate(['/dashboard']);
  }
}
