import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Hardcoded to false to test the block
  const isLoggedIn = false;

  if (isLoggedIn) {
    return true;
  } else {
    alert('Access Denied: You must be logged in to create an issue.');
    // Blocks the navigation
    return false; 
  }
};
