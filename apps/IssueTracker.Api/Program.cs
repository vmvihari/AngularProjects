using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// Add CORS to allow Angular to communicate with the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAngular");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// In-memory data store for issues
var issues = new List<Issue>
{
    new Issue(1, "Fix navigation bug", "The sidebar navigation is broken on mobile devices.", "Open", new[] { "bug", "ui" }),
    new Issue(2, "Implement login", "Need to add JWT authentication.", "In Progress", new[] { "feature", "auth" }),
    new Issue(3, "Update documentation", "Update the README with setup instructions.", "Done", new[] { "docs" })
};

// GET /api/issues
app.MapGet("/api/issues", () =>
{
    return Results.Ok(issues);
})
.WithName("GetIssues");

// POST /api/issues
app.MapPost("/api/issues", (CreateIssueDto newIssue) =>
{
    var issue = new Issue(
        issues.Any() ? issues.Max(i => i.Id) + 1 : 1,
        newIssue.Title,
        newIssue.Description ?? "",
        "Open",
        newIssue.Tags ?? System.Array.Empty<string>()
    );
    
    issues.Add(issue);
    return Results.Created($"/api/issues/{issue.Id}", issue);
})
.WithName("CreateIssue");

// PUT /api/issues/{id}
app.MapPut("/api/issues/{id}", (int id, UpdateIssueDto updatedIssue) =>
{
    var existingIssue = issues.FirstOrDefault(i => i.Id == id);
    if (existingIssue == null) return Results.NotFound();
    
    var index = issues.IndexOf(existingIssue);
    issues[index] = existingIssue with { 
        Title = updatedIssue.Title ?? existingIssue.Title,
        Description = updatedIssue.Description ?? existingIssue.Description,
        Status = updatedIssue.Status ?? existingIssue.Status
    };
    
    return Results.Ok(issues[index]);
})
.WithName("UpdateIssue");

// DELETE /api/issues/{id}
app.MapDelete("/api/issues/{id}", (int id) =>
{
    var issue = issues.FirstOrDefault(i => i.Id == id);
    if (issue == null) return Results.NotFound();
    
    issues.Remove(issue);
    return Results.NoContent();
})
.WithName("DeleteIssue");

app.Run();

record Issue(int Id, string Title, string Description, string Status, string[] Tags);
record CreateIssueDto(string Title, string? Description, string[]? Tags);
record UpdateIssueDto(string? Title, string? Description, string? Status);
