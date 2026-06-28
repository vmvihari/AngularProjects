# Module 4: Component Harnesses & Defer Testing

Historically, testing DOM elements in Angular meant using `fixture.debugElement.query(By.css('.btn-save'))` to find a button and click it. 

This is incredibly brittle. If a designer changes the CSS class from `.btn-save` to `.btn-primary`, your test breaks, even though the logic still works perfectly!

**Component Harnesses** (provided by the Angular CDK) solve this. A Harness is an API for a component that allows tests to interact with it just like a real user would, without knowing anything about its internal HTML or CSS structure.

## 1. Creating a Component Harness

Let's build a Harness for our `IssueCardComponent`.

1. Create a new file: `src/app/issues/issue-card/issue-card.harness.ts`.
2. Implement the Harness:

```typescript
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
```

## 2. Using the Harness in a Test

Now we can test our `IssueListComponent` cleanly!

Open `src/app/issues/issue-list/issue-list.component.spec.ts` (you may need to create this file) and write:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { IssueListComponent } from './issue-list.component';
import { IssueCardHarness } from '../issue-card/issue-card.harness';
import { IssueService } from '../issue.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('IssueListComponent', () => {
  let fixture: ComponentFixture<IssueListComponent>;
  let harnessLoader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueListComponent],
      providers: [
        IssueService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IssueListComponent);
    // Initialize the Harness Loader!
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should find all issue cards on the screen', async () => {
    // We don't care about CSS, we just ask the loader to find the components!
    const cards = await harnessLoader.getAllHarnesses(IssueCardHarness);
    
    // Test logic here...
  });
});
```

## 3. Testing `@defer` Blocks
In Phase 8, we wrapped `<app-issue-edit>` in an `@defer` block. How do we test it?

Angular 17+ provides `TestBed.deferBlock(...)` to explicitly trigger defer states in tests!

```typescript
  it('should render the edit component when defer block is triggered', async () => {
    const deferBlock = (await fixture.getDeferBlocks())[0];
    
    // By default, the block is in the 'placeholder' state
    
    // Explicitly trigger the block to render the actual component!
    await deferBlock.render(DeferBlockState.Complete);
    
    // Now you can safely use your harnesses to interact with the fully loaded edit component!
  });
```
