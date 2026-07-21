import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../auth.store'; // Import the store!

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inject the store dynamically!
  const authStore = inject(AuthStore);

  // 2. Read the current token from the signal
  const token = authStore.token();

  // 3. If a token exists, clone and attach it. Otherwise, send the original request.
  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(modifiedReq);
  }

  // No token? Proceed without modifying headers.
  return next(req);
};