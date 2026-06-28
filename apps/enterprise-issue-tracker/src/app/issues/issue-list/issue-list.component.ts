import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Import the wrappers
import { IssueCardComponent } from '../issue-card/issue-card.component'; 
import { IssueEditComponent } from '../issue-edit/issue-edit.component';
// Import the services
import { IssueService } from '../issue.service'; 
// Import the directives
import { SkeletonLoaderDirective } from '../../shared/directives/skeleton-loader.directive';
// Import the pipes
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { ToastService } from '../../shared/service/toast.service';

@Component({
    selector: 'app-issue-list',
    imports: [
      IssueCardComponent, 
      IssueEditComponent,
      SkeletonLoaderDirective, 
      TimeAgoPipe], // Add to imports
    templateUrl: './issue-list.component.html',
    styleUrl: './issue-list.component.css'
})
export class IssueListComponent {
  
  issueService = inject(IssueService); // Inject the service to access the resource and methods
  router = inject(Router); // Inject the router service to navigate to the issue detail page
  announcer = inject(LiveAnnouncer);
  toastService = inject(ToastService);

  constructor() {
    effect(() => {
      const isLoading = this.issueService.issuesResource.isLoading();
      const issues = this.issueService.issuesResource.value();

      if (!isLoading && issues && issues.length > 0) {
        // This will silently read "Successfully loaded X issues" to a screen reader!
        // 'polite' means it waits for the user to finish their current screen reader sentence.
        this.announcer.announce(`Successfully loaded ${issues.length} issues`, 'polite');
      }
    });
  }

  viewDetails(id: number) {
    // Programmatic navigation to the issue detail page
    this.router.navigate(['/issues', id]); 
  }
}
