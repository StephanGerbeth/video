import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, startWith, shareReplay } from 'rxjs/operators';
import { getOrientation } from 'o9n';
import { ipoint } from '@js-basics/vector';

export const STATES = {
  PORTRAIT: Symbol.for('device.orientation:portrait'),
  LANDSCAPE: Symbol.for('device.orientation:landscape')
};

// https://dmitripavlutin.com/screen-window-page-sizes/
export const resize = fromEvent([global.window].filter(Boolean), 'resize')
  .pipe(
    startWith(null),
    map(() => {
      const sizes = {
        screen: { outer: ipoint(global.screen.width, global.screen.height), inner: ipoint(global.screen.availWidth, global.screen.availHeight) },
        window: { outer: ipoint(global.outerWidth, global.outerHeight), inner: ipoint(global.innerWidth, global.innerHeight) },
        page: ipoint(global.document.documentElement.scrollWidth, global.document.documentElement.scrollHeight),
        viewport: ipoint(global.document.documentElement.clientWidth, global.document.documentElement.clientHeight),
        scroll: ipoint(global.scrollX, global.scrollY)
      };
      return {
        ...sizes,
        orientation: STATES[getOrientation().type.replace(/-[a-z]+/, '').toUpperCase()],
        fullscreen: (sizes.viewport.y < sizes.window.inner.y) && !(sizes.window.outer.y === sizes.window.inner.y && sizes.window.inner.y === sizes.viewport.y)
      };
    }),
    shareReplay(1)
  );

export const orientation = resize
  .pipe(
    distinctUntilChanged((prev, curr) => prev.orientation === curr.orientation),
    shareReplay(1)
  );

export const fullscreen = resize
  .pipe(
    distinctUntilChanged((prev, curr) => prev.fullscreen === curr.fullscreen),
    shareReplay(1)
  );

