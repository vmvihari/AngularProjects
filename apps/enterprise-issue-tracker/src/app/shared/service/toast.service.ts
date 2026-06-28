import { ApplicationRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';

import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  constructor() { }

  show(message: string) {
    // Create a dynamic component reference
    const componentRef = createComponent(ToastComponent, {
      environmentInjector: this.injector
    });

    // Set the inputs! (Pass the message into the component)
    componentRef.setInput('message', message);

    // Attach the component view to Angular's change detection tree
    this.appRef.attachView(componentRef.hostView);

    // Append the actual HTML element to the browser DOM (the <body>)
    document.body.appendChild(componentRef.location.nativeElement);

    // Destroy the component after 3 seconds
    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }, 3000);
  }
}
