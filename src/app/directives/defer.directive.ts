import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appDefer]'
})
export class DeferDirective implements OnDestroy {
  @Input('appDeferRootMargin') rootMargin: string = '0px';
  @Input('appDeferThreshold') threshold: number | number[] = 0;
  @Input('appDeferOnce') once: boolean = true;

  private hasView = false;
  private observer?: IntersectionObserver;

  constructor(private template: TemplateRef<any>, private vcr: ViewContainerRef) {
    // no-op
  }

  ngOnInit(): void {
    // If IntersectionObserver is not available (SSR or old browsers), render immediately
    if (typeof IntersectionObserver === 'undefined') {
      this.render();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.render();
          if (this.once && this.observer) {
            this.observer.disconnect();
            this.observer = undefined;
          }
          break;
        }
      }
    }, { root: null, rootMargin: this.rootMargin, threshold: this.threshold });

    // Create a placeholder element and observe it via the container's element
    try {
      const el = (this.vcr as any)._view && (this.vcr as any)._view.node ? (this.vcr as any)._view.node : null;
      // Fallback: observe the host element if we can access it
      if (this.vcr.element && this.vcr.element.nativeElement) {
        this.observer.observe(this.vcr.element.nativeElement as Element);
      } else if (el && el.nativeElement) {
        this.observer.observe(el.nativeElement as Element);
      } else {
        // As a safer fallback, render immediately
        this.render();
      }
    } catch {
      this.render();
    }
  }

  private render() {
    if (!this.hasView) {
      this.vcr.createEmbeddedView(this.template);
      this.hasView = true;
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}
