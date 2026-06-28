import { ComponentHarness } from '@angular/cdk/testing';

export class IssueCardHarness extends ComponentHarness {
  // Bind the harness to the specific host element of the component
  static hostSelector = 'app-issue-card';

  // Create locators that abstract away the CSS selectors
  private getTitleElement = this.locatorFor('.issue-title');
  private getStatusElement = this.locatorFor('.issue-status');
  private getEditButton = this.locatorFor('.btn-edit');

  // Expose clean, readable API methods for your tests
  async getTitleText(): Promise<string> {
    const el = await this.getTitleElement();
    return el.text();
  }

  async clickEdit(): Promise<void> {
    const btn = await this.getEditButton();
    return btn.click();
  }
}