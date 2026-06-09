import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Some test runners / webpack configurations may not provide require.context.
// Guard the call to avoid runtime errors when it's unavailable.
try {
  if (typeof require === 'function' && typeof (require as any).context === 'function') {
    const context = (require as any).context('./', true, /\.spec\.ts$/);
    context.keys().map(context);
  }
} catch (e) {
  // fall back: do nothing. Tests may be loaded by the test runner configuration.
  // This prevents "__webpack_require__(...).context is not a function" errors.
}
