import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderDirective } from './skeleton-loader.directive';
import { UiSkeleton } from './ui-skeleton/ui-skeleton';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
  standalone: true,
  imports: [SkeletonLoaderDirective],
  template: `
    <div id="wrapper">
      @if(true) {
        <div *appSkeletonLoader="isLoading()" id="actual-content">Real Content</div>
      }
    </div>
  `
})
class TestHostComponent {
  isLoading = signal(true);
}

describe('SkeletonLoaderDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render 3 skeleton components when loading is true', () => {
    const wrapper = fixture.nativeElement.querySelector('#wrapper');
    // The directive should render 3 ui-skeleton components
    const skeletons = wrapper.querySelectorAll('lib-ui-skeleton');
    expect(skeletons.length).toBe(3);
    
    // The actual content should NOT be rendered
    const actualContent = wrapper.querySelector('#actual-content');
    expect(actualContent).toBeNull();
  });

  it('should render actual content when loading is false', () => {
    fixture.componentInstance.isLoading.set(false);
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('#wrapper');
    
    // Skeletons should be removed
    const skeletons = wrapper.querySelectorAll('lib-ui-skeleton');
    expect(skeletons.length).toBe(0);
    
    // Actual content should be rendered
    const actualContent = wrapper.querySelector('#actual-content');
    expect(actualContent).toBeTruthy();
    expect(actualContent.textContent).toBe('Real Content');
  });
});
