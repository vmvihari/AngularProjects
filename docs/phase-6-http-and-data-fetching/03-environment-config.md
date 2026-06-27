# Module 3: Environment Configurations

Hardcoding `http://localhost:5000/api/issues` directly into a service is a bad practice. When deploying to production, your API URL will change (e.g. `https://api.enterprise.com`).

Angular provides Environment variables to handle this swapping automatically during the build process.

## Your Task: Configure Environments

### 1. Generate Environment Files
If you don't already have them, you can generate them using the Angular CLI:
```bash
ng generate environments
```
This creates `src/environments/environment.ts` (for production) and `src/environments/environment.development.ts` (for local dev).

### 2. Define the API URL
Open `src/environments/environment.development.ts` and add your local API URL:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

### 3. Consume the Environment Variable
Now, return to your `src/app/issues/issue.service.ts` and update it to use the environment file:

```typescript
import { environment } from '../../environments/environment';
// ...

export class IssueService {
  private http = inject(HttpClient);
  // Angular will automatically use the correct URL based on your build target!
  private readonly apiUrl = `${environment.apiUrl}/issues`;
  // ...
}
```

### 4. Check Your Work!
To prove this is working, open `environment.development.ts` and change the port to `5001`. Save the file.
Look at your Angular app—the network request will fail and the issues will disappear! 
Change it back to `5000` and save. The issues will reappear! This proves your service is successfully reading from the environment configuration.
