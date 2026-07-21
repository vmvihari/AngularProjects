# Module 6, Lesson 5: Routing & Navigation Testing

In Enterprise applications, testing that a button click correctly navigates the user to a new URL is essential. Historically, testing the Angular Router required massive, complicated `RouterTestingModule` setups and brittle `Location` checks.

Angular v15+ introduced a beautiful new utility: **`RouterTestingHarness`**.

## Your Task: Test the Navigation

Let's test that clicking "View" on an Issue Card correctly routes the user to the `IssueDetailComponent`.

Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.spec.ts` and **append** the following test suite to the very bottom of the file. 

*(Note: We are creating a completely separate `describe` block because Routing tests require a fundamentally different `TestBed` setup and initialization process than our standard Component Harness tests!)*

```typescript
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter, Router } from '@angular/router';
// ... other imports ...

// A dummy component to act as our target route
import { Component } from '@angular/core';
@Component({ template: 'Dummy Detail Component', standalone: true })
class DummyDetailComponent {}

describe('FeatureManage Routing', () => {
  let harness: RouterTestingHarness;
  let component: FeatureManage;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        IssueStore,
        provideHttpClient(),
        provideHttpClientTesting(),
        // Setup the router with our starting point and our expected destination!
        provideRouter([
          { path: 'issues', component: FeatureManage },
          { path: 'issues/:id', component: DummyDetailComponent }
        ])
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);

    // The RouterTestingHarness magically boots up the router and navigates to our initial route!
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/issues', FeatureManage);
    
    // Flush the initial HTTP request triggered by IssueStore!
    httpMock.expectOne('/api/issues').flush([]);
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  it('should navigate to /issues/1 when viewIssue is called', async () => {
    // 1. Act: Trigger the navigation method
    component.viewIssue(1);

    // 2. Wait for the router promise to resolve
    await harness.fixture.whenStable();

    // 3. Assert: Verify the router's internal URL changed correctly!
    const currentUrl = TestBed.inject(Router).url;
    expect(currentUrl).toBe('/issues/1');
  });
});
```

### Key Takeaways:
- We don't need to load the real `FeatureIssueDetail` (which might have massive dependencies). We just map the route to a `DummyDetailComponent`!
- `RouterTestingHarness.create()` handles all the complex async initialization of the Router tree.
- `harness.navigateByUrl()` cleanly instantiates our component inside the router outlet.

Congratulations! You have learned the core skills of Enterprise Testing. Your application is well on its way to being fully covered and architecturally bulletproof.

When you are ready, move on to **Lesson 6: Independent Practice**, where you will put all these skills to the test!
