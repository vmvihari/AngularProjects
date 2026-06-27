import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = 'my-secret-jwt-token-123';

  // The request object is immutable! We must clone it to modify it.
  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // Pass the cloned request to the next handler in the chain
  return next(modifiedReq);
};