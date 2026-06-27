# Module 2: Feature Organization (Vertical Slices)

In enterprise Angular applications, the best practice is to organize your files by feature area, rather than by file type.

If you are familiar with Vertical Slice Architecture in .NET, it is the exact same concept. Instead of having a global `Services` folder and a global `Components` folder, you group everything related to a specific domain together. Angular's style guide explicitly recommends avoiding directories named `services` or `components`.

For example, all files related to issues should live in an `issues` directory.

## Your Task: Organize by Feature

Let's organize our project to match these production standards before we move on.

1. Create a new folder at `src/app/issues`.
2. Move your `issue-list` folder, `issue-card` folder, and `issue.service.ts` file into this new directory.
3. Update the broken import paths in your `app.component.ts`.
