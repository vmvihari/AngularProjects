import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  logError(error: any): void {
    // Simulate sending the error to Datadog or Sentry
    console.error('[DATADOG] Error reported:', error);
  }
}
