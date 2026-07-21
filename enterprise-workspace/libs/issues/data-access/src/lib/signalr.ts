import { inject, Injectable } from '@angular/core';
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
            // Connect to the /issues-hub endpoint on our .NET API
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

    public get connection(): HubConnection | null {
        return this.hubConnection;
    }

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

    public async stopConnection(): Promise<void> {
        if (this.hubConnection && this.hubConnection.state === 'Connected') {
            await this.hubConnection.stop();
            console.log('🔌 SignalR Disconnected!');
        }
    }
}
