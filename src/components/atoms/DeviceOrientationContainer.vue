<template>
  <div :class="{expanded}" :style="cssVars">
    <slot />
    <transition name="fade-info">
      <section v-if="showInfo" class="fullscreen-info">
        scroll down to go to fullscreen
      </section>
    </transition>
  </div>
</template>

<script>
import { fromEvent, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ipoint } from '@js-basics/vector';
import { orientation, fullscreen, STATES } from '@/utils/device';

export default {
  data () {
    return {
      aspectRatio: ipoint(16, 9),
      offset: ipoint(),
      min: ipoint(),
      max: ipoint(),
      expanded: false,
      showInfo: false
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

  mounted () {
    orientation.subscribe((e) => {
      if (e.orientation === STATES.LANDSCAPE) {
        this.expandOverlay(e);
      } else {
        this.collapseOverlay();
      }
    });

    fullscreen.subscribe((e) => {
      this.showInfo = !e.fullscreen && this.expanded;
    });
  },

  methods: {
    async expandOverlay (e) {
      const rect = this.$el.getBoundingClientRect();
      const elPos = ipoint(rect.left, rect.top);
      const elDim = ipoint(rect.width, rect.height);

      this.aspectRatio = ipoint(e.page);
      this.offset = ipoint(() => ((e.window.inner - elDim) / 2) - elPos);
      this.min = ipoint(() => elPos + e.scroll);
      this.max = ipoint(() => this.aspectRatio - (this.min + elDim));

      await firstValueFrom(fromEvent(this.$el, 'transitionend')
        .pipe(filter(e => this.$el.querySelector(':first-child') === e.target))
      );

      this.expanded = true;
    },

    collapseOverlay () {
      this.aspectRatio = ipoint(16, 9);
      this.offset = ipoint();
      this.min = ipoint();
      this.max = ipoint();

      this.expanded = false;
    }
  }
};
</script>

<style lang="postcss" scoped>
div {
  --aspect-ratio-x: 16;
  --aspect-ratio-y: 9;
  --offset-x: 0;
  --offset-y: 0;
  --min-x: 0;
  --min-y: 0;
  --max-x: 0;
  --max-y: 0;

  padding-right: env(safe-area-inset-right);
  padding-left: env(safe-area-inset-left);

  & :first-child {
    position: sticky;
    top: 0;
    bottom: 0;
    display: block;
    width: 100%;
    aspect-ratio: 16/9;
    transition-duration: 250ms;
    transition-property: transform;
  }

  & .fullscreen-info {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    aspect-ratio: none;
    color: white;
    opacity: 100%;
    backdrop-filter: blur(2px);
  }

  & .fade-info-enter-active,
  & .fade-info-leave-active {
    transition-duration: 350ms;
    transition-property: opacity;
  }

  & .fade-info-enter,
  & .fade-info-leave-to {
    opacity: 0%;
  }

  @media (orientation: landscape) {
    background-color: black;

    & :first-child {
      height: 100vh;
      aspect-ratio: none;
      transform: translateY(calc(var(--offset-y) * 1px));
    }

    &.expanded {
      aspect-ratio: calc(var(--aspect-ratio-x) / var(--aspect-ratio-y));
      margin:
        calc(var(--min-y) * -1px)
        calc(var(--max-x) * -1px)
        calc(var(--max-y) * -1px)
        calc(var(--min-x) * -1px);

      & :first-child {
        transition-property: none;
        transform: none;
      }
    }
  }
}
</style>>
