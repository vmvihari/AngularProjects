import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore, Role } from '@enterprise-workspace/shared-util-auth';

// 1. The Basic Auth Guard
// Redirects anyone without a token to the login page.
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true; 
  }

  return router.parseUrl('/login'); // Intercepted!
};

// 2. The Advanced Role Guard Factory
// This is a function that RETURNS a guard based on the roles you provide!
export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    // Call our powerful store method!
    if (authStore.hasAnyRole(allowedRoles)) {
      return true;
    }
    
    // They are logged in, but their role is rejected!
    console.warn(`Access Denied! Requires one of: ${allowedRoles.join(', ')}`);
    return router.parseUrl('/dashboard'); 
  };
};