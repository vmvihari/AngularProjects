import { ComponentFixture, TestBed, DeferBlockState } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IssueListComponent } from './issue-list.component';
import { IssueCardHarness } from '../issue-card/issue-card.harness';
import { IssueService } from '../issue.service';
import { Issue } from '../issue.model';

describe('IssueListComponent', () => {
  let fixture: ComponentFixture<IssueListComponent>;
  let harnessLoader: HarnessLoader;
  let httpMock: HttpTestingController;

  const mockIssues: Issue[] = [
    { id: 1, title: 'Bug 1', description: 'desc 1', status: 'Open', tags: [], createdAt: new Date().toISOString() },
    { id: 2, title: 'Feature 2', description: 'desc 2', status: 'In Progress', tags: [], createdAt: new Date().toISOString() }
  ];

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
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Trigger initial data bindings (this causes IssueService to make its GET request)
    fixture.detectChanges();

    // Intercept and flush the initial GET request so the component is fully loaded for all tests
    const req = httpMock.expectOne('http://localhost:5000/api/issues');
    req.flush(mockIssues);
    
    // Trigger change detection again to render the issues
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load issues and render issue cards via harness', async () => {
    // Ask the HarnessLoader to find all IssueCard components on the screen!
    const cards = await harnessLoader.getAllHarnesses(IssueCardHarness);
    
    // Assert that it rendered exactly 2 cards
    expect(cards.length).toBe(2);
    
    // Assert that the harnesses expose the correct internal data cleanly!
    expect(await cards[0].getTitleText()).toContain('Bug 1');
    expect(await cards[1].getTitleText()).toContain('Feature 2');
  });

  it('should render the edit component when defer block is triggered', async () => {
    // Get all defer blocks in the template (we only have one)
    const deferBlock = (await fixture.getDeferBlocks())[0];
    
    // Assert that the actual component is not rendered yet
    expect(fixture.nativeElement.querySelector('app-issue-edit')).toBeNull();
    
    // Explicitly trigger the block to render the actual component!
    await deferBlock.render(DeferBlockState.Complete);
    
    // Assert that the app-issue-edit component is now in the DOM
    expect(fixture.nativeElement.querySelector('app-issue-edit')).toBeTruthy();
  });
});

// A dummy component to act as our target route
import { Component } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter, Router } from '@angular/router';

@Component({ template: 'Dummy Detail Component' })
class DummyDetailComponent {}

describe('IssueListComponent Routing', () => {
  let routerHarness: RouterTestingHarness;
  let component: IssueListComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        IssueService,
        provideHttpClient(),
        provideHttpClientTesting(),
        // Setup the router with our starting point and our expected destination!
        provideRouter([
          { path: 'issues', component: IssueListComponent },
          { path: 'issues/:id', component: DummyDetailComponent }
        ])
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);

    // The RouterTestingHarness magically boots up the router and navigates to our initial route!
    routerHarness = await RouterTestingHarness.create();
    component = await routerHarness.navigateByUrl('/issues', IssueListComponent);
    
    // Flush the initial HTTP request triggered by IssueService, otherwise whenStable() hangs forever!
    httpMock.expectOne('http://localhost:5000/api/issues').flush([]);
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  it('should navigate to /issues/1 when viewDetails is called', async () => {
    // 1. Act: Trigger the navigation method
    component.viewDetails(1);

    // 2. Wait for the router promise to resolve
    await routerHarness.fixture.whenStable();

    // 3. Assert: Verify the router's internal URL changed correctly!
    const currentUrl = TestBed.inject(Router).url;
    expect(currentUrl).toBe('/issues/1');
  });
});