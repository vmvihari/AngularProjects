# Module 5: Component Communication

Now let's tackle Component Communication: passing data between components. 

In Angular, the overarching rule is that **data flows down** to children via `Inputs`, and **events flow up** to parents via `Outputs`.

## Inputs (Data Flowing Down)
Inputs are exactly like settable public properties on a C# class. They allow a parent component to pass data down into a child component. 

Modern Angular (v17+) provides a new `input()` function for this. When you use `input()`, Angular returns a read-only **Signal** containing the data.

## Outputs (Events Flowing Up)
Outputs are exactly like C# events (or delegates). They allow a child component to notify its parent when something happens (like a button click or form submission).

We use the modern `output()` function and call its `.emit()` method to broadcast the event and its associated payload up to the parent component.

Your Task: Let's refactor our IssueListComponent so it no longer hardcodes its own data. Instead, it will accept the issues from the parent and emit an event when an issue is resolved.

## Connecting Parent and Child

Now we need to connect the parent (AppComponent) to the child (IssueListComponent).

1. In Angular, you pass data into a child component's Input using square brackets `[ ]` (Property Binding).
2. You listen to a child component's Output event using parentheses `( )` (Event Binding).
3. When the event emits, the data passed along with it is accessed in the template using a special `$event` variable.

Your Task: Update src/app/app.component.ts to hold the mock data, bind it to <app-issue-list>, and create a method to handle the resolution event.