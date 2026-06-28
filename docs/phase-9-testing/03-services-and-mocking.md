# Module 3: Service Testing & Mocking

When testing Services, we can no longer rely on pure isolated testing (using the `new` keyword) because Services often depend on `HttpClient` to make network requests. 

If we let our tests make actual network requests to our `.NET API`, our tests would be slow, unreliable, and prone to failing if the backend goes down.

We must use Angular's `TestBed` to configure a mock environment, and `HttpTestingController` to intercept and fake the network requests!

## Your Task: Test the `IssueService`

1. Open `src/app/issues/issue.service.spec.ts`.
2. Replace the boilerplate with the following test suite:

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { IssueService } from './issue.service';

describe('IssueService', () => {
  let service: IssueService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // 1. Configure the Testing Module
    TestBed.configureTestingModule({
      providers: [
        IssueService,
        provideHttpClient(), // Provide the real HttpClient
        provideHttpClientTesting() // BUT override it with the testing backend!
      ]
    });

    // 2. Inject the service and the mock controller
    service = TestBed.inject(IssueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // 3. Ensure no rogue HTTP requests are left hanging after each test
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully add an issue via POST', () => {
    // 1. Arrange: The mock data the server *would* return
    const mockIssue = { id: 99, title: 'Test', description: 'Test Desc', status: 'Open', tags: [], createdAt: new Date() };

    // 2. Act: Call our service method
    service.addIssue('Test', 'Test Desc', []);

    // 3. Assert: Intercept the POST request that the service just tried to make
    const req = httpMock.expectOne('http://localhost:5000/api/issues');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Test', description: 'Test Desc', tags: [] });

    // 4. Resolve the request by sending back our mock data
    req.flush(mockIssue);

    // 5. Assert: Verify our Signal state was updated correctly!
    const currentIssues = service.issuesResource.value();
    expect(currentIssues?.length).toBe(1);
    expect(currentIssues?.[0].title).toBe('Test');
  });
});
```

### Key Takeaways:
- `TestBed` allows us to configure Angular's Dependency Injection system specifically for testing.
- `provideHttpClientTesting()` intercepts all network requests so they never hit the real internet.
- `httpMock.expectOne()` verifies the URL and grabs a reference to the pending request.
- `req.flush()` simulates the server successfully responding with data.

Run your tests using `npm run test`!
