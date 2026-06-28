# Module 4: Dynamic Component Loading

Usually, you declare your UI components explicitly in your HTML templates (`<app-issue-card></app-issue-card>`). But what if you need to spawn a component dynamically from your TypeScript code, like a Modal dialog or a Toast notification? 

In Enterprise applications, we use **Dynamic Component Loading**.

## Your Task: Build a Global Toast Service

We want to trigger a Toast notification that says "Issue Created!" when our form is successfully submitted. We do *not* want to hardcode `<app-toast>` inside `issue-create.component.html`. We want to trigger it entirely through TypeScript!

### 1. Generate the Toast Component
This is just a standard component that will hold the visual UI of the toast.
```bash
ng generate component shared/components/toast
```

Add some basic CSS to `toast.component.css` to make it float at the top of the screen:
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

Update `toast.component.ts` to accept an `input` message:
```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `<div class="toast-container">{{ message() }}</div>`,
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  message = input.required<string>();
}
```

### 2. Build the Toast Service
Now, the magic. We will build an `@Injectable` service that uses Angular's `ApplicationRef` and `EnvironmentInjector` to programmatically instantiate the `ToastComponent` and attach it to the DOM!

```typescript
import { Injectable, ApplicationRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { ToastComponent } from './toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  show(message: string) {
    // 1. Create a dynamic component reference
    const componentRef = createComponent(ToastComponent, {
      environmentInjector: this.injector
    });

    // 2. Set the inputs! (Pass the message into the component)
    componentRef.setInput('message', message);

    // 3. Attach the component view to Angular's change detection tree
    this.appRef.attachView(componentRef.hostView);

    // 4. Append the actual HTML element to the browser DOM (the <body>)
    document.body.appendChild(componentRef.location.nativeElement);

    // 5. Destroy the component after 3 seconds
    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }, 3000);
  }
}
```

### 3. Use It In the UI!
Open `src/app/issues/issue-create/issue-create.component.ts`. 

Inject your new `ToastService`. Inside the `onSubmit()` method, simply call it!

```typescript
  toastService = inject(ToastService);

  onSubmit() {
    if (this.issueForm.valid) {
      const { title, description } = this.issueForm.getRawValue();
      this.issueService.addIssue(title, description);

      // Programmatically spawn the toast!
      this.toastService.show('Issue successfully created!');

      this.router.navigate(['/issues']);
    }
  }
```

Run your app, create an issue, and watch the toast elegantly slide in from the top right of the screen! You have successfully mastered Dynamic Component Loading.
