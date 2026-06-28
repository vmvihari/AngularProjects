import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderDirective } from './skeleton-loader.directive';

@Component({
  standalone: true,
  imports: [SkeletonLoaderDirective],
  template: `
    <div *appSkeletonLoader="isLoading()">
      <span class="actual-content">Actual Content</span>
    </div>
  `
})
class TestHostComponent {
  isLoading = signal(true);
}

describe('SkeletonLoaderDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the skeleton component when loading is true', () => {
    const domElement = fixture.nativeElement as HTMLElement;
    
    // The actual content should NOT be in the DOM
    expect(domElement.querySelector('.actual-content')).toBeNull();
    
    // The skeleton card component SHOULD be in the DOM
    expect(domElement.querySelector('app-skeleton-card')).toBeTruthy();
  });

  it('should render the actual template when loading is false', () => {
    component.isLoading.set(false);
    fixture.detectChanges();
    
    const domElement = fixture.nativeElement as HTMLElement;
    
    // The skeleton card component should NOT be in the DOM
    expect(domElement.querySelector('app-skeleton-card')).toBeNull();
    
    // The actual content SHOULD be in the DOM
    expect(domElement.querySelector('.actual-content')).toBeTruthy();
  });
});
