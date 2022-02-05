<template>
  <div class="container">
    <div class="expander" :class="{expanded}" :style="cssVars">
      <slot />
    </div>
  </div>
</template>

<script>
import { fromEvent, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ipoint } from '@js-basics/vector';
import { orientation, STATES } from '@/utils/device';

global.IntersectionObserver = global.IntersectionObserver || class { observe () { /* */ } unobserve () { /* */ }};

export default {
  data () {
    return {
      aspectRatio: ipoint(),
      offset: ipoint(),
      min: ipoint(),
      max: ipoint(),
      expanded: false
    };
  },

  computed: {
    cssVars () {
      return {
        ...this.aspectRatio.toCSSVars('aspect-ratio'),
        ...this.offset.toCSSVars('offset'),
        ...this.min.toCSSVars('min'),
        ...this.max.toCSSVars('max')
      };
    }
  },

  created () {
    this.observer = new IntersectionObserver(([e]) => this.onIntersect(e), {});
  },

  mounted () {
    this.observer.observe(this.$el);

    orientation.subscribe((e) => {
      if (e.orientation === STATES.LANDSCAPE) {
        if (this.intersects) {
          this.expandOverlay(e);
        }
      } else {
        this.collapseOverlay();
      }
    });
  },

  methods: {
    onIntersect (e) {
      this.intersects = e.isIntersecting;
    },

    async expandOverlay (e) {
      const rect = this.$el.getBoundingClientRect();
      const elPos = ipoint(rect.left, rect.top);
      const elDim = ipoint(rect.width, rect.height);

      this.aspectRatio = ipoint(e.page);
      this.offset = ipoint(() => ((e.window.inner - elDim) / 2) - elPos);
      this.min = ipoint(() => elPos + e.scroll);
      this.max = ipoint(() => this.aspectRatio - (this.min + elDim));

      await firstValueFrom(fromEvent(this.$el, 'transitionend')
        .pipe(filter(e => this.$el.querySelector('.expander > :first-child') === e.target))
      );

      this.expanded = true;
    },

    collapseOverlay () {
      if (this.expanded) {
        this.aspectRatio = ipoint();
        this.offset = ipoint();
        this.min = ipoint();
        this.max = ipoint();

        this.expanded = false;

        this.$el.scrollIntoView();
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.container {
  position: relative;

  & .expander {
    width: 100%;
    height: 100%;

    & > :first-child {
      position: sticky;
      top: 0;
      bottom: 0;
      display: block;
      width: calc(100% + env(safe-area-inset-right) + env(safe-area-inset-left));
      height: 100%;
      margin-right: calc(env(safe-area-inset-right) * -1);
      margin-left: calc(env(safe-area-inset-left) * -1);
      background-color: black;
      transition-duration: 200ms;
      transition-property: transform;
    }
  }

  @media (orientation: landscape) {
    & .expander {
      & > :first-child {
        height: 100vh;
        transform: translateY(calc(var(--offset-y) * 1px));
      }

      &.expanded {
        /* will be needed when body is sticky - start */

        position: fixed;
        top: 0;
        width: calc(100% - env(safe-area-inset-right) - env(safe-area-inset-left));
        height: auto;

        /* will be needed when body is sticky - end */

        aspect-ratio: calc(var(--aspect-ratio-x) / var(--aspect-ratio-y));
        margin-top: calc(var(--min-y) * -1px);
        margin-bottom: calc(var(--max-y) * -1px);

        & > :first-child {
          transition-property: none;
          transform: none;
        }
      }
    }
  }
}
</style>
