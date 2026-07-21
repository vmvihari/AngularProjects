import { ComponentHarness } from '@angular/cdk/testing';

export class UiIssueCardHarness extends ComponentHarness {
  // Bind the harness to the specific host element of the component
  static hostSelector = 'lib-ui-issue-card';

  // Create locators that abstract away the CSS selectors
  private getTitleElement = this.locatorFor('h3');
  private getStatusElement = this.locatorFor('.status-badge');
  private getDeleteButton = this.locatorForOptional('button.btn-danger');

  // Expose clean, readable API methods for your tests
  async getTitleText(): Promise<string> {
    const el = await this.getTitleElement();
    return el.text();
  }

  async getStatusText(): Promise<string> {
    const el = await this.getStatusElement();
    return el.text();
  }

  async clickDelete(): Promise<void> {
    const btn = await this.getDeleteButton();
    if (!btn) throw new Error('Delete button not found!');
    return btn.click();
  }
}
