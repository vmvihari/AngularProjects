using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// Configure CORS to allow Angular to communicate with this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // <-- Required for SignalR WebSockets
        });
});

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp"); // Enable the CORS policy!

app.MapHub<IssuesHub>("/issues-hub"); // <-- Map the SignalR Hub

// In-Memory Database matching the Angular IssueStore exactly!
var issues = new List<Issue>
{
    new Issue(1, "Fix login validation", "Open", "2026-07-20T10:00:00Z"),
    new Issue(2, "Update routing module", "Closed", "2026-07-19T14:30:00Z"),
    new Issue(3, "Build issue list component", "Open", "2026-07-15T09:15:00Z")
};

app.MapGet("/api/issues", async () =>
{
    // <-- Artificial delay to show off the skeleton loader!
    await Task.Delay(1500);
    return Results.Ok(issues);
})
.WithName("GetIssues");

app.MapPut("/api/issues/{id}", async (int id, IssueUpdateDto update, IHubContext<IssuesHub> hubContext) =>
{
    var issueIndex = issues.FindIndex(i => i.Id == id);
    if (issueIndex == -1) return Results.NotFound();
    
    var existingIssue = issues[issueIndex];
    
    // We update only the properties that were provided in the request
    var updatedIssue = existingIssue with { 
        Title = update.Title ?? existingIssue.Title, 
        Status = update.Status ?? existingIssue.Status 
    };
    
    issues[issueIndex] = updatedIssue;
    
    // Broadcast the updated issue to all connected SignalR clients!
    await hubContext.Clients.All.SendAsync("IssueUpdated", updatedIssue);
    
    return Results.Ok(updatedIssue);
})
.WithName("UpdateIssue");

app.MapDelete("/api/issues/{id}", async (int id, IHubContext<IssuesHub> hubContext) =>
{
    var issueIndex = issues.FindIndex(i => i.Id == id);
    if (issueIndex == -1) return Results.NotFound();
    
    issues.RemoveAt(issueIndex);
    
    // Broadcast the deleted issue ID to all connected SignalR clients!
    await hubContext.Clients.All.SendAsync("IssueDeleted", id);
    
    return Results.NoContent();
})
.WithName("DeleteIssue");

app.Run();

// Models
public record Issue(int Id, string Title, string Status, string CreatedAt);
public record IssueUpdateDto(string? Title, string? Status);

// SignalR Hub
public class IssuesHub : Hub { }
