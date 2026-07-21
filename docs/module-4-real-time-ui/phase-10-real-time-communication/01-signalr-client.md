# Phase 10, Lesson 1: The SignalR Client

As a .NET Developer, you are likely already familiar with SignalR on the backend. In Angular, connecting to a SignalR hub is incredibly straightforward thanks to the `@microsoft/signalr` npm package.

In this lesson, we will set up the foundational client to communicate with our ASP.NET Core backend.

## 1. Installation

First, we need to install the official SignalR JavaScript client. Run this in your terminal:

```bash
npm install @microsoft/signalr --legacy-peer-deps
```

## 2. Creating the SignalR Service

While we *could* put SignalR logic directly inside our components or stores, in an Enterprise application it is best practice to abstract third-party libraries behind an Angular Service. This makes our code easier to test and allows us to swap out the underlying technology (e.g., WebSockets vs Server-Sent Events) in the future without breaking the app.

Generate a new service in our `data-access` library:
```bash
npx nx g @nx/angular:service signalr --project=data-access
```

### The Service Implementation

Open `libs/issues/data-access/src/lib/signalr.service.ts` and set up the `HubConnectionBuilder`.

```typescript
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { environment } from '../../../../../apps/issue-tracker/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;

  public buildConnection(): void {
    if (this.hubConnection) return;

    this.hubConnection = new HubConnectionBuilder()
      // Connect to the /issues-hub endpoint on our .NET API
      .withUrl(`${environment.apiUrl.replace('/api', '')}/issues-hub`)
      .configureLogging(LogLevel.Information)
      .build();
  }

  public get connection(): HubConnection | null {
    return this.hubConnection;
  }
}
```

Notice how we configure the URL. If our API is running at `https://localhost:5001/api`, our SignalR hub is typically mapped to the root, like `https://localhost:5001/issues-hub`.

## 3. Starting the Connection

We've built the connection, but we haven't actually started it yet! 

```typescript
  public async startConnection(): Promise<void> {
    if (!this.hubConnection) {
      this.buildConnection();
    }

    try {
      if (this.hubConnection?.state === 'Disconnected') {
        await this.hubConnection.start();
        console.log('🔌 SignalR Connected!');
      }
    } catch (err) {
      console.error('Error while starting connection:', err);
    }
  }
```

In the next lesson, we will discuss **Connection Management**, including how to pass our JWT Token securely to the backend, how to handle automatic reconnects, and when to start/stop the connection based on the user's authentication state!
