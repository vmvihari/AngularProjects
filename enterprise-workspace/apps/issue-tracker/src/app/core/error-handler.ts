import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from '@enterprise-workspace/ui-toast';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toastService = inject(ToastService);

  handleError(error: any): void {
    // 1. Log the full error to the console for developers
    console.error('GLOBAL ERROR HANDLER CAUGHT AN ERROR:', error);

    // 2. Extract a user-friendly message
    const message = error.message ? error.message : 'An unexpected error occurred!';

    // 3. Show a Toast notification to the user!
    this.toastService.show(message);
  }
}
