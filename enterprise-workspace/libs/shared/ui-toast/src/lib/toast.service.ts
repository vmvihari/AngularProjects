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