# Module 6, Lesson 4: Component Harnesses & Defer Testing

Historically, testing DOM elements in Angular meant using `fixture.debugElement.query(By.css('.btn-save'))` to find a button and click it. 

This is incredibly brittle. If a designer changes the CSS class from `.btn-save` to `.btn-primary`, your test breaks, even though the logic still works perfectly!

**Component Harnesses** (provided by the Angular CDK) solve this. A Harness is an API for a component that allows tests to interact with it just like a real user would, without knowing anything about its internal HTML or CSS structure.

## 1. Creating a Component Harness

Let's build a Harness for our `UiIssueCard`.

1. Create a new file: `libs/issues/ui-issue-card/src/lib/ui-issue-card/ui-issue-card.harness.ts`.
2. Implement the Harness:

```typescript
import { ComponentHarness } from '@angular/cdk/testing';

export class UiIssueCardHarness extends ComponentHarness {
  // Bind the harness to the specific host element of the component
  static hostSelector = 'lib-ui-issue-card';

  // Create locators that abstract away the CSS selectors
  private getTitleElement = this.locatorFor('h3');
  private getStatusElement = this.locatorFor('.status-badge');
  private getDeleteButton = this.locatorForOptional('button.btn-danger'); // Optional because it might be hidden!

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
```

## 2. Using the Harness in a Test

Now we can test our `FeatureManage` component cleanly!

Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.spec.ts` (you need to create it) and write:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FeatureManage } from './feature-manage';
import { UiIssueCardHarness } from '@enterprise-workspace/ui-issue-card/testing'; // You would typically export this!
import { IssueStore } from '@enterprise-workspace/issues-data-access';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FeatureManage Component', () => {
  let fixture: ComponentFixture<FeatureManage>;
  let harnessLoader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureManage],
      providers: [
        IssueStore, // Provide the store!
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureManage);
    // Initialize the Harness Loader!
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should find all issue cards on the screen', async () => {
    // We don't care about CSS, we just ask the loader to find the components!
    // NOTE: This will fail currently because of @defer blocks! See below!
    // const cards = await harnessLoader.getAllHarnesses(UiIssueCardHarness);
  });
});
```

## 3. Testing `@defer` Blocks
Because we wrapped `<lib-ui-issue-card>` in an `@defer (on viewport)` block, the component doesn't actually exist in the DOM when the test starts!

Angular 17+ provides `TestBed.deferBlock(...)` (or `fixture.getDeferBlocks()`) to explicitly trigger defer states in tests!

```typescript
import { DeferBlockState } from '@angular/core/testing';

// ... inside your test ...
  it('should render the cards when defer block is triggered', async () => {
    const deferBlocks = await fixture.getDeferBlocks();
    
    // Explicitly trigger all defer blocks to render!
    for (const block of deferBlocks) {
        await block.render(DeferBlockState.Complete);
    }
    
    // Now you can safely use your harnesses!
    // const cards = await harnessLoader.getAllHarnesses(UiIssueCardHarness);
  });
```
