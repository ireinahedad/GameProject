import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WindowRefService {
  // Directly use the global `window` object.
  public get window(): Window {
    return window;
  }

  public get document(): Document {
    return this.window.document;
  }

  public get localStorage(): Storage {
    return this.window.localStorage;
  }

  public get sessionStorage(): Storage {
    return this.window.sessionStorage;
  }
}
