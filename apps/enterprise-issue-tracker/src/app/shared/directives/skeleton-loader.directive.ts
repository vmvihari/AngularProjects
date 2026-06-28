import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { SkeletonCardComponent } from '../components/skeleton-card/skeleton-card.component';

@Directive({
  selector: '[appSkeletonLoader]'
})
export class SkeletonLoaderDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  
  constructor() { }

  // When this input changes, Angular calls this setter
  @Input() set appSkeletonLoader(isLoading: boolean) {
    // Clear whatever is currently rendered
    this.viewContainer.clear(); 

    if (isLoading) {
      // Dynamically instantiate our Skeleton Component!
      this.viewContainer.createComponent(SkeletonCardComponent);
    } else {
      // If NOT loading, render the actual template the directive is attached to!
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
