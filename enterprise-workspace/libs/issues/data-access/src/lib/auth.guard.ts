import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Fake authentication state!
  const isLoggedIn = true; 

  if (isLoggedIn) {
    return true; // Let them through!
  }

  // Unauthorized! Redirect them to the Dashboard
  console.warn('Unauthorized access! Redirecting...');
  return router.createUrlTree(['/dashboard']);
};