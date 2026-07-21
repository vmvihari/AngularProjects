# Module 6, Lesson 3: Signal Store Testing & Mocking

When testing an NgRx Signal Store (like our `IssueStore`), we face a unique challenge. Our store makes real HTTP network requests to our `.NET API` to fetch and mutate issues.

If we let our tests make actual network requests, our tests would be slow, unreliable, and prone to failing if the backend goes down. This completely breaks the concept of isolated unit testing!

We must use Angular's `TestBed` to configure a mock environment, and `HttpTestingController` to intercept and fake the network requests so our Store *thinks* it is talking to a real API!

## Your Task: Test the `IssueStore`

1. Create `libs/issues/data-access/src/lib/issue.store.spec.ts`.
2. Write the following test suite:

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { IssueStore } from './issue.store';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('IssueStore', () => {
  let store: any; // Using any for simplicity in retrieving the injected store
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // 1. Configure the Testing Module
    TestBed.configureTestingModule({
      providers: [
        IssueStore,
        provideHttpClient(), // Provide the real HttpClient
        provideHttpClientTesting() // BUT override it with the testing backend!
      ]
    });

    // 2. Inject the store and the mock controller
    store = TestBed.inject(IssueStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // 3. Ensure no rogue HTTP requests are left hanging after each test
    httpMock.verify();
  });

  it('should be created and start with empty issues', () => {
    expect(store).toBeTruthy();
    expect(store.issues()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  it('should successfully load issues via GET', () => {
    // 1. Arrange: The mock data the server *would* return
    const mockIssues = [
      { id: 1, title: 'Test Issue 1', description: 'Desc', status: 'Open', tags: [], createdAt: new Date() }
    ];

    // 2. Act: Trigger the rxMethod!
    store.loadIssues();

    // 3. Assert: Intercept the GET request that the store just tried to make
    const req = httpMock.expectOne('/api/issues');
    expect(req.request.method).toBe('GET');

    // 4. Resolve the request by sending back our mock data
    req.flush(mockIssues);

    // 5. Assert: Verify our Signal state was updated correctly!
    expect(store.issues().length).toBe(1);
    expect(store.issues()[0].title).toBe('Test Issue 1');
  });

  it('should handle API errors gracefully during load', () => {
    // Trigger load
    store.loadIssues();
    
    const req = httpMock.expectOne('/api/issues');
    
    // Simulate a 500 Server Error!
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
    
    // The store should not crash, it should handle the error and ideally set issues to empty
    expect(store.issues()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });
});
```

### Key Takeaways:
- `TestBed` allows us to configure Angular's Dependency Injection system specifically for testing.
- `provideHttpClientTesting()` intercepts all network requests so they never hit the real internet.
- `httpMock.expectOne()` verifies the URL and grabs a reference to the pending request.
- `req.flush()` simulates the server successfully responding with data (or an error code!).

Run your tests using `npx nx test issues-data-access`!
