import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '@enterprise-workspace/ui-toast';
import { catchError, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown API error occurred!';

      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred.
        errorMessage = `Network Error: ${error.error.message}`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        if (error.status === 401 || error.status === 403) {
           errorMessage = 'You are not authorized to perform this action.';
        } else if (error.error && error.error.message) {
           errorMessage = error.error.message;
        } else {
           errorMessage = `Server Error (${error.status}): ${error.message}`;
        }
      }

      // Show the error toast!
      toastService.show(errorMessage);

      // Re-throw the error so the local component can still catch it if it wants to
      return throwError(() => error);
    })
  );
};
