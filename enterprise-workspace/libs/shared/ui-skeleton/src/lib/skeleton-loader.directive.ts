import { Directive, TemplateRef, ViewContainerRef, inject, effect, input } from '@angular/core';
// Import your generated component!
import { UiSkeleton } from './ui-skeleton/ui-skeleton';

@Directive({
  selector: '[appSkeletonLoader]',
  standalone: true
})
export class SkeletonLoaderDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  // Accept a boolean signal indicating if we are loading
  appSkeletonLoader = input.required<boolean>();

  constructor() {
    // Whenever the loading state changes, this effect runs!
    effect(() => {
      // Always clear the container first
      this.viewContainer.clear(); 

      if (this.appSkeletonLoader()) {
        // Dynamically instantiate our Skeleton Component 3 times!
        this.viewContainer.createComponent(UiSkeleton);
        this.viewContainer.createComponent(UiSkeleton);
        this.viewContainer.createComponent(UiSkeleton);
      } else {
        // If NOT loading, render the actual template the directive is attached to!
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}