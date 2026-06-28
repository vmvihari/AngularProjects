import { Component } from '@angular/core';

// Import Directives
import { StatusHighlightDirective } from '../../shared/directives/status-highlight.directive';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
    selector: 'app-issue-card',
    imports: [],
    templateUrl: './issue-card.component.html',
    styleUrl: './issue-card.component.css',
    // Add the directives here
    hostDirectives: [
        {
            directive: StatusHighlightDirective,
            inputs: ['appStatusHighlight: status']
        }, 
        {
            directive: TooltipDirective,
            inputs: ['appTooltip: tooltipText']
        }] 
})
export class IssueCardComponent { }
