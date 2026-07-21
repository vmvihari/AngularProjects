import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { IssueStore } from './issue.store';
import { SignalRService } from '@enterprise-workspace/data-access';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../apps/issue-tracker/src/environments/environment';

describe('IssueStore', () => {
  let store: any; // Using any for simplicity
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // 1. Configure the Testing Module
    TestBed.configureTestingModule({
      providers: [
        IssueStore,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: SignalRService,
          useValue: { connection: null } // Mock SignalR
        }
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

  it('should be created and start with empty issues (after initial load fails)', () => {
    // The store automatically calls loadIssues onInit!
    const req = httpMock.expectOne(`${environment.apiUrl}/issues`);
    req.flush([]);

    expect(store).toBeTruthy();
    expect(store.issues()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  it('should successfully load issues via GET', () => {
    // Initial load onInit
    httpMock.expectOne(`${environment.apiUrl}/issues`).flush([]);

    const mockIssues = [
      { id: 1, title: 'Test Issue 1', description: 'Desc', status: 'Open', tags: [], createdAt: new Date().toISOString() }
    ];

    // Trigger load again manually to test it
    store.loadIssues();

    const req = httpMock.expectOne(`${environment.apiUrl}/issues`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIssues);

    expect(store.issues().length).toBe(1);
    expect(store.issues()[0].title).toBe('Test Issue 1');
  });

  it('should successfully add an issue via POST', () => {
    // Initial load
    httpMock.expectOne(`${environment.apiUrl}/issues`).flush([]);

    // Act
    store.addIssue('Test', 'Test Desc', []);

    // Intercept POST request
    const req = httpMock.expectOne(`${environment.apiUrl}/issues`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('Test');
    req.flush({});

    // Verify optimistic update
    expect(store.issues().length).toBe(1);
    expect(store.issues()[0].title).toBe('Test');
  });
});
