# Phase 11, Lesson 1: Custom Attribute Directives

Attribute directives change the appearance or behavior of an existing DOM element. Angular provides built-in attribute directives like `ngClass` and `ngStyle`, but in enterprise applications, we often build custom ones to encapsulate complex logic.

## Your Task: Build a Status Highlight Directive

Right now, if we want to color-code our issues based on their status (e.g., Open = Red, Closed = Green), we would have to write messy `[ngClass]` logic in our template. Let's extract that into a reusable directive: `[appStatusHighlight]`.

### 1. Generate the Shared Library
Since this is an Enterprise Nx Workspace, we don't just throw directives randomly into an app folder. We want to create a dedicated, reusable library for UI directives that any app in our monorepo can consume!

Run the Nx command to generate a new standalone library:
```bash
npx nx g @nx/angular:library --directory=libs/shared/ui-directives
```

### 2. Implement the Highlight Directive
Inside your new library, create `libs/shared/ui-directives/src/lib/status-highlight.directive.ts`. 

In modern Angular, we can use `effect()` alongside `Renderer2` to reactively update the DOM based on a signal input:

```typescript
import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStatusHighlight]',
  standalone: true
})
export class StatusHighlightDirective {
  // Inject the element this directive sits on
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  // Accept the status as an input signal
  appStatusHighlight = input.required<string>();

  constructor() {
    // Reactively update the styling whenever the status changes
    effect(() => {
      const status = this.appStatusHighlight();
      let color = 'gray';

      if (status === 'Open') color = 'red';
      if (status === 'Closed') color = 'green';

      // Custom Components are display: inline by default. Make it block!
      this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
      
      // Use a glowing box-shadow so it doesn't conflict with inner borders!
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', `0 0 10px ${color}`);
      this.renderer.setStyle(this.el.nativeElement, 'border-radius', '4px');
    });
  }
}
```
*Important Angular Gotcha: Because we will use this directive in a `hostDirectives` array later, the Angular compiler requires strict static analysis. You must explicitly export it by name in `libs/shared/ui-directives/src/index.ts` instead of using `export *`!*

```typescript
// in libs/shared/ui-directives/src/index.ts
export { StatusHighlightDirective } from './lib/status-highlight.directive';
```

---

### Bonus: Directive Composition API (`hostDirectives`)

As your enterprise application grows, you will inevitably build multiple directives (e.g., `TooltipDirective`, `StatusHighlightDirective`). What if you want our existing `UiIssueCard` component to *always* have a tooltip and a status highlight applied to it automatically?

Historically, you had to manually type all those directives into the HTML template every time you used the component. With the **Directive Composition API**, you can compose directives directly in the TypeScript file!

This pattern allows us to achieve **Composition over Inheritance**.

Before we compose them, let's quickly build a simple `TooltipDirective` in our `ui-directives` library!

### 1. Build the Tooltip Directive
Create `libs/shared/ui-directives/src/lib/tooltip.directive.ts` and add this code:

```typescript
import { Directive, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  
  appTooltip = input.required<string>();
  private tooltipElement: HTMLElement | null = null;

  @HostListener('mouseenter') onMouseEnter() {
    this.tooltipElement = this.renderer.createElement('span');
    const text = this.renderer.createText(this.appTooltip());
    
    this.renderer.appendChild(this.tooltipElement, text);
    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);

    // Basic tooltip styling
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', 'black');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '4px 8px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'top', '-30px');
    
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
```
*Don't forget to add this to your `index.ts` explicit exports as well!*
```typescript
export { TooltipDirective } from './lib/tooltip.directive';
```

### 2. Compose the Directives into the Issue Card!

Instead of applying these directives in our HTML templates, we will use `hostDirectives` to permanently attach these behaviors directly to our existing `UiIssueCard` component!

Open `libs/issues/ui-issue-card/src/lib/ui-issue-card/ui-issue-card.ts`:

```typescript
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { UiCard } from '@enterprise-workspace/ui-card';
import { AuthStore } from '@enterprise-workspace/shared-util-auth';
// 🔥 Import the new directives!
import { StatusHighlightDirective, TooltipDirective } from '@enterprise-workspace/shared-ui-directives';

@Component({
  selector: 'lib-ui-issue-card',
  imports: [UiCard],
  templateUrl: './ui-issue-card.html',
  styleUrl: './ui-issue-card.css',
  
  // 🔥 Apply the composition right here!
  hostDirectives: [
    {
      directive: TooltipDirective,
      inputs: ['appTooltip'] // Exposes the tooltip input to consumers
    },
    {
      directive: StatusHighlightDirective,
      inputs: ['appStatusHighlight'] // Exposes the highlight input to consumers
    }
  ]
})
export class UiIssueCard {
  public authStore = inject(AuthStore);
  
  @Input({ required: true }) issue!: any;
  @Output() resolve = new EventEmitter<number>();
  @Output() view = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  // ... rest of your code ...
}
```

### 3. Use It In the UI!
Finally, we need to pass the data into these new composed inputs. Open your Dashboard view (`feature-manage.html`) and update the `lib-ui-issue-card` element inside your `@for` loop to bind the new inputs:

```html
<lib-ui-issue-card 
  [issue]="issue" 
  [appStatusHighlight]="issue.status" 
  appTooltip="Click View for details."
  (resolve)="resolveIssue($event)" 
  (view)="viewIssue(issue.id)" 
  (edit)="editIssue(issue.id)">
</lib-ui-issue-card>
```

Run your app! You should now see beautiful colored borders and tooltips on every issue card, seamlessly composed together using modern Angular patterns!
