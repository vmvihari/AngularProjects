# Phase 10, Lesson 2: Connection Management

Real-time connections can be fragile. Users go offline, switch networks, or put their devices to sleep. Furthermore, since our hub is secure, we cannot simply connect to it anonymously—we must pass our JWT authentication token.

## 1. Automatic Reconnects & Authentication

Let's update our `SignalRService` to handle authentication and automatic reconnects.

Open `libs/issues/data-access/src/lib/signalr.service.ts`:

```typescript
import { Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { environment } from '../../../../../apps/issue-tracker/src/environments/environment';
import { AuthStore } from '@enterprise-workspace/shared-util-auth';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  
  // Inject our AuthStore to grab the JWT token
  private authStore = inject(AuthStore);

  public buildConnection(): void {
    if (this.hubConnection) return;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/issues-hub`, {
        // Pass the Bearer token to the .NET Backend during the initial handshake!
        accessTokenFactory: () => this.authStore.token() || ''
      })
      // Automatically attempt to reconnect if the network drops (0s, 2s, 10s, 30s)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Hook into lifecycle events
    this.hubConnection.onreconnecting((error) => {
      console.warn('⚠️ SignalR connection lost. Reconnecting...', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('✅ SignalR reconnected. Connection ID:', connectionId);
    });

    this.hubConnection.onclose((error) => {
      console.error('❌ SignalR connection permanently closed.', error);
    });
  }

  // ... (startConnection remains the same)

  public async stopConnection(): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      await this.hubConnection.stop();
      console.log('🔌 SignalR Disconnected!');
    }
  }
}
```

## 2. Tying Connection to Authentication State

We only want to open a WebSocket connection when a user is actually logged in. If they log out, we need to sever the connection to prevent memory leaks and unauthorized access attempts.

Since we are using the **NgRx SignalStore** for our `AuthStore`, we can use an `effect()` to automatically react to changes in the authentication state!

Open `libs/shared/util-auth/src/lib/auth.store.ts` (or wherever your `AuthStore` is located) or simply manage it at the root `app.component.ts`. The root component is often the cleanest place to manage global lifecycle bindings.

Open `apps/issue-tracker/src/app/app.component.ts`:

```typescript
import { Component, inject, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '@enterprise-workspace/shared-util-auth';
import { SignalRService } from '@enterprise-workspace/data-access';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  private authStore = inject(AuthStore);
  private signalRService = inject(SignalRService);

  constructor() {
    // This effect runs automatically whenever isAuthenticated changes!
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        this.signalRService.startConnection();
      } else {
        this.signalRService.stopConnection();
      }
    });
  }
}
```

With just a few lines of code, our SignalR connection is now entirely reactive. When the user logs in, the connection boots up securely with their JWT token. When they log out, the WebSocket shuts down cleanly.

In the next lesson, we will learn how to **Sync State** by listening to events broadcasted from the server and instantly updating our UI!
