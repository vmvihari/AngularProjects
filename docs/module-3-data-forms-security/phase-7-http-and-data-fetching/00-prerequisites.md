# Phase 7: The ASP.NET Core API

To fully understand how Angular interacts with a backend, we can't just use hypothetical URLs. We need a real backend! 

We have prepared a minimalist **ASP.NET Core Web API** for you to run locally. This API holds an in-memory database of Issues and has CORS enabled so your Angular app on `http://localhost:4200` can securely talk to it.

## Your Task: Run the API

1. Open a **new, separate terminal** in your IDE.
2. Navigate to the API folder:
   ```bash
   cd enterprise-workspace/apps/IssueTracker.Api
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
4. Verify it's running by opening your browser to: `http://localhost:5000/api/issues`. 

Keep this terminal running in the background for the rest of Phase 7. Now, let's connect your Angular app to it!
