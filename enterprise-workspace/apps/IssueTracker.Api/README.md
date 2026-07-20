# IssueTracker.Api

This is a minimal ASP.NET Core Web API that serves as the backend for the Enterprise Issue Tracker Angular application.

## Prerequisites
- [.NET SDK](https://dotnet.microsoft.com/download) (v8.0 or higher recommended)

## Running the API
1. Navigate to this directory in your terminal:
   ```bash
   cd apps/IssueTracker.Api
   ```
2. Run the application:
   ```bash
   dotnet run
   ```

The API will start on `http://localhost:5000` with CORS configured to accept requests from the Angular application on `http://localhost:4200`.

## Endpoints
- `GET /api/issues` - Returns a list of mock issues.
