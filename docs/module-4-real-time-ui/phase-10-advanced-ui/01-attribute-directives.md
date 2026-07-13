# Module 1: Custom Attribute Directives

Attribute directives change the appearance or behavior of an existing DOM element. Angular provides built-in attribute directives like `ngClass` and `ngStyle`, but in enterprise applications, we often build custom ones to encapsulate complex logic.

## Your Task: Build a Status Highlight Directive

Right now, if we want to color-code our issues based on their status (e.g., Open = Red, In Progress = Yellow, Closed = Green), we would have to write messy `[ngClass]` logic in our template. Let's extract that into a reusable directive: `[appStatusHighlight]`.

### 1. Generate the Directive
Run the Angular CLI command to generate a directive:
```bash
ng generate directive shared/directives/status-highlight
```

### 2. Implement the Logic
Open `src/app/shared/directives/status-highlight.directive.ts`. 

In modern Angular (16+), we use `HostBinding` and `HostListener` to interact with the element the directive is attached to, or we can simply inject the `ElementRef` and `Renderer2`.

```typescript
import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStatusHighlight]'
})
export class StatusHighlightDirective {
  // Inject the element this directive sits on
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  // Accept the status as an input signal
  appStatusHighlight = input.required<string>();

  constructor() {
    // Reactively update the border color whenever the status changes
    effect(() => {
      const status = this.appStatusHighlight();
      let color = 'gray';

      if (status === 'Open') color = 'red';
      if (status === 'In Progress') color = 'orange';
      if (status === 'Closed') color = 'green';

      // Custom Components are display: inline by default. Make it block!
      this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
      
      // Use a glowing box-shadow instead of border-left so it doesn't conflict with inner borders!
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', `0 0 10px ${color}`);
      this.renderer.setStyle(this.el.nativeElement, 'border-radius', '4px');
    });
  }
}
```

### 3. Now open `src/app/issues/issue-card/issue-card.component.html` and **remove** the outer `<div class="issue-card-container">` wrapper. The component itself is now the container!
```html
<div class="content">
  <ng-content></ng-content>
</div>
<div class="actions">
  <ng-content select="[actions]"></ng-content>
</div>
```

### 4. Use It In the UI!
Open `src/app/issues/issue-list/issue-list.component.ts`. 
1. Import `StatusHighlightDirective` into the `imports: []` array.
2. In the template (`issue-list.component.html`), find your **existing** `@for` loop. 
*(Do NOT paste a second loop! Just add the `[appStatusHighlight]="issue.status"` attribute to your existing `<app-issue-card>` tag).*

```html
<!-- Inside your existing loop: -->
@for (issue of issueService.filteredIssues(); track issue.id) {
  <app-issue-card [appStatusHighlight]="issue.status">
    <!-- ... your existing projected content ... -->
  </app-issue-card>
}
```

Run your app. You should now see beautiful colored borders on every issue, completely powered by your custom reusable directive!

---

### Bonus: Directive Composition API (`hostDirectives`)

As your enterprise application grows, you will inevitably build multiple directives (e.g., `TooltipDirective`, `StatusHighlightDirective`, `RippleEffectDirective`). What if you want to build a highly reusable `PremiumIssueCardComponent` that *always* has a tooltip and a status highlight applied to it?

Historically, you had to manually type all those directives into the HTML template every time you used the component. With the **Directive Composition API** (introduced in Angular 15), you can compose directives directly in the TypeScript file!

This pattern allows us to achieve **Composition over Inheritance**.

Before we compose them, let's quickly build the `TooltipDirective` so we have something to compose!

### 1. Build the Tooltip Directive
Run `ng generate directive shared/directives/tooltip` and add this code:

```typescript
import { Directive, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
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
    
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative'); // Required for absolute positioning
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
```

### 2. Compose the Directives!

Instead of creating a brand new component, we can use the Directive Composition API to permanently attach these behaviors directly to our existing `IssueCardComponent`!

Open `src/app/issues/issue-card/issue-card.component.ts`:

```typescript
import { Component } from '@angular/core';
import { StatusHighlightDirective } from '../../shared/directives/status-highlight.directive';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
    selector: 'app-issue-card',
    imports: [],
    templateUrl: './issue-card.component.html',
    styleUrl: './issue-card.component.css',
    
    // 🔥 We apply the composition right here on the existing card!
    hostDirectives: [
      {
        directive: TooltipDirective,
        inputs: ['appTooltip: tooltipText'] // Exposes an optional tooltip input!
      },
      {
        directive: StatusHighlightDirective,
        inputs: ['appStatusHighlight: status'] // Automatically handles the border colors!
      }
    ]
})
export class IssueCardComponent { 
  // No need to define an input for 'status' or 'tooltipText', the hostDirectives handle it automatically!
}
```

Now, any developer using your component just writes:
```html
<app-issue-card [status]="issue.status" tooltipText="Click View for details.">
  <!-- content -->
</app-issue-card>
```
And it automatically receives the highlight colors and the tooltips, without the developer ever knowing those directives existed under the hood! This is exactly how massive UI libraries like Angular Material are architected.
