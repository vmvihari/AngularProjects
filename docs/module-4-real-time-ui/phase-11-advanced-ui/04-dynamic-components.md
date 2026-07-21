# Phase 11, Lesson 4: Dynamic Component Loading

Usually, you declare your UI components explicitly in your HTML templates (`<lib-ui-issue-card></lib-ui-issue-card>`). But what if you need to spawn a component dynamically from your TypeScript code, like a Modal dialog or a Toast notification? 

In Enterprise applications, we use **Dynamic Component Loading**.

## Your Task: Build a Global Toast Service

We want to trigger a Toast notification that says "Issue Created!" when our form is successfully submitted. We do *not* want to hardcode a `<app-toast>` tag inside our Create feature's HTML. We want to trigger it entirely through TypeScript!

### 1. Generate the Shared Toast Library
Because the `ToastService` will need to programmatically instantiate the `ToastComponent`, they are incredibly tightly coupled. They belong in their own dedicated UI library.

Run the Nx generator to create the library:
```bash
npx nx g @nx/angular:library --directory=libs/shared/ui-toast
```
*(This automatically generates a default component in `libs/shared/ui-toast/src/lib/ui-toast/ui-toast.component.ts`. We'll use this as our toast!)*

### 2. Build the Visual Component
Let's build the visual UI for the toast. Open `libs/shared/ui-toast/src/lib/ui-toast/ui-toast.component.css` and add some floating CSS:
```css
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #333;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

Now, update the component class `libs/shared/ui-toast/src/lib/ui-toast/ui-toast.component.ts` to accept an `input` message:
```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-ui-toast',
  template: `<div class="toast-container">{{ message() }}</div>`,
  styleUrl: './ui-toast.component.css'
})
export class UiToastComponent {
  // The service will dynamically pass data into this input!
  message = input.required<string>();
}
```

### 3. Build the Dynamic Toast Service
Now for the magic. We will build an `@Injectable` service that uses Angular's `ApplicationRef` and `EnvironmentInjector` to programmatically instantiate the component and attach it to the DOM!

Create `libs/shared/ui-toast/src/lib/toast.service.ts`:

```typescript
import { Injectable, ApplicationRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { UiToast } from './ui-toast/ui-toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  show(message: string) {
    // 1. Create a dynamic component reference
    const componentRef = createComponent(UiToast, {
      environmentInjector: this.injector
    });

    // 2. Set the inputs! (Pass the message into the component)
    componentRef.setInput('message', message);

    // 3. Attach the component view to Angular's change detection tree
    this.appRef.attachView(componentRef.hostView);

    // 4. Append the actual HTML element to the browser DOM (the <body>)
    document.body.appendChild(componentRef.location.nativeElement);

    // 5. Destroy the component after 3 seconds to clean up memory
    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }, 3000);
  }
}
```
*Don't forget to explicitly export `ToastService` from `libs/shared/ui-toast/src/index.ts`!*

### 4. Use It In the UI!
Open `libs/issues/feature-create/src/lib/feature-create/feature-create.ts`. 

Inject your new `ToastService`. Inside the `onSubmit()` method, simply call it!

```typescript
  // Import from your new library!
  toastService = inject(ToastService);

  onSubmit() {
    if (this.issueForm.valid) {
      const { title, description } = this.issueForm.getRawValue();
      
      // Update our global store
      this.issueStore.addIssue(title, description);

      // Programmatically spawn the toast!
      this.toastService.show('Issue successfully created!');

      this.router.navigate(['/issues']);
    }
  }
```

Run your app, navigate to `/issues/new`, create an issue, and watch the toast elegantly slide in from the top right of the screen! You have successfully mastered Dynamic Component Loading.
