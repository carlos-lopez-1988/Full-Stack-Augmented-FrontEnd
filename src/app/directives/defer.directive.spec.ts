import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DeferDirective } from './defer.directive';

describe('DeferDirective', () => {
  let originalIO: any;
  let lastInstance: any;

  beforeEach(() => {
    originalIO = (window as any).IntersectionObserver;

    // Mock IntersectionObserver
    (window as any).IntersectionObserver = class {
      callback: any;
      options: any;
      observed: any[] = [];
      constructor(cb: any, options?: any) {
        this.callback = cb;
        this.options = options;
        lastInstance = this;
      }
      observe(el: any) {
        this.observed.push(el);
      }
      unobserve() {}
      disconnect() {}
    } as any;
  });

  afterEach(() => {
    (window as any).IntersectionObserver = originalIO;
    lastInstance = undefined;
  });

  @Component({
    template: `
      <ng-container *appDefer>
        <div class="deferred">Deferred content</div>
      </ng-container>
    `,
    standalone: true,
    imports: [DeferDirective]
  })
  class TestHostComponent {}

  it('should not render content until intersection occurs', async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent, DeferDirective] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent as any);
    fixture.detectChanges();

    const elBefore = fixture.nativeElement.querySelector('.deferred');
    expect(elBefore).toBeNull();

    // simulate intersection
    lastInstance.callback([{ isIntersecting: true }]);
    fixture.detectChanges();

    const elAfter = fixture.nativeElement.querySelector('.deferred');
    expect(elAfter).not.toBeNull();
  });

  it('should render immediately when IntersectionObserver is not available', async () => {
    (window as any).IntersectionObserver = undefined;
    await TestBed.configureTestingModule({ imports: [TestHostComponent, DeferDirective] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent as any);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.deferred');
    expect(el).not.toBeNull();
  });
});
