<template>
  <div :class="{expanded}" :style="cssVars">
    <iframe
      width="640"
      src="https://www.youtube.com/embed/c2cxzy-Dar4"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

<script>
import { fromEvent, firstValueFrom } from 'rxjs';
import { distinctUntilChanged, map, startWith, filter, shareReplay } from 'rxjs/operators';

export default {
  data () {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      aspectRatio: 16 / 9,
      expanded: false
    };
  },

  computed: {
    cssVars () {
      return {
        '--top': this.top,
        '--bottom': this.bottom,
        '--left': this.left,
        '--right': this.right,
        '--aspect-ratio': this.aspectRatio,
        '--offset-top': this.offsetTop
      };
    }
  },

  mounted () {
    const resize = fromEvent(window, 'resize').pipe(startWith(0), shareReplay(1));
    resize.pipe(map(() => window.orientation), distinctUntilChanged((prev, curr) => prev === curr))
      .subscribe((e) => {
        if (window.matchMedia('(orientation: landscape)').matches) {
          this.expandOverlay();
        } else {
          this.collapseOverlay();
        }
      });

    resize.pipe(map(() => document.documentElement.clientHeight < window.innerHeight), distinctUntilChanged((prev, curr) => prev === curr))
      .subscribe((fullscreen) => {
        console.log(fullscreen);
      });
  },

  methods: {
    async expandOverlay () {
      const rect = this.$el.getBoundingClientRect();
      const { scrollWidth: width, scrollHeight: height } = document.documentElement;

      this.top = rect.top + window.scrollY;
      this.bottom = height - (this.top + rect.height);
      this.left = rect.left + window.scrollX;
      this.right = width - (this.left + rect.width);
      this.offsetTop = ((window.innerHeight - rect.height) / 2) - rect.top;
      this.aspectRatio = width / height;

      await firstValueFrom(fromEvent(this.$el, 'transitionend')
        .pipe(filter(e => this.$el.querySelector(':first-child') === e.target))
      );
      this.expanded = true;
    },

    collapseOverlay () {
      this.top = null;
      this.bottom = null;
      this.left = null;
      this.right = null;
      this.offsetTop = null;
      this.aspectRatio = 16 / 9;
      this.expanded = false;
    }
  }
};
</script>

<style lang="postcss" scoped>
div {
  --top: 0;
  --bottom: 0;
  --left: 0;
  --right: 0;
  --offset-top: 0;
  --aspect-ratio: calc(16 / 9);

  width: 100%;

  & iframe {
    position: sticky;
    top: 0;
    bottom: 0;
    display: block;
    width: 100%;
    aspect-ratio: 16/9;
    transition-duration: 250ms;
    transition-property: transform;
  }

  @media (orientation: landscape) {
    background-color: black;

    & iframe {
      height: 100vh;
      aspect-ratio: none;
      transform: translateY(calc(var(--offset-top) * 1px));
    }

    &.expanded {
      aspect-ratio: var(--aspect-ratio);
      margin: calc(var(--top) * -1px) calc(var(--right) * -1px) calc(var(--bottom) * -1px) calc(var(--left) * -1px);

      & iframe {
        transition-property: none;
        transform: none;
      }
    }
  }
}
</style>>
