import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should create and append a toast component to the DOM, then destroy it after 3s', fakeAsync(() => {
    // Assert initial state
    expect(document.body.querySelector('app-toast')).toBeNull();

    // Act
    service.show('Test Message');

    // Assert that the component was appended to the document body
    const toastElement = document.body.querySelector('app-toast');
    expect(toastElement).toBeTruthy();

    // Fast forward 3 seconds to trigger the setTimeout in the service
    tick(3000);

    // Assert that the component was removed from the DOM
    const removedElement = document.body.querySelector('app-toast');
    expect(removedElement).toBeNull();
  }));
});
