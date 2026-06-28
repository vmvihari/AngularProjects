import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IssueService } from './issue.service';

describe('IssueService', () => {
  let service: IssueService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Configure the Testing Module
    TestBed.configureTestingModule({
      providers: [
        IssueService,
        provideHttpClient(), // Provide the real HttpClient
        provideHttpClientTesting() // BUT override it with the testing backend!
      ]
    });

    // Inject the service and the mock controller
    service = TestBed.inject(IssueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure no rogue HTTP requests are left hanging after each test
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully add an issue via POST', () => {
    // Arrange: The mock data the server *would* return
    const mockIssue = { id: 99, title: 'Test', description: 'Test Desc', status: 'Open', tags: [], createdAt: new Date() };

    // Act: Call our service method
    service.addIssue('Test', 'Test Desc', []);

    // Assert: Intercept the POST request that the service just tried to make
    const req = httpMock.expectOne('http://localhost:5000/api/issues');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Test', description: 'Test Desc', tags: [] });

    // Resolve the request by sending back our mock data
    req.flush(mockIssue);

    // Assert: Verify our Signal state was updated correctly!
    const currentIssues = service.issuesResource.value();
    expect(currentIssues?.length).toBe(1);
    expect(currentIssues?.[0].title).toBe('Test');
  });
});