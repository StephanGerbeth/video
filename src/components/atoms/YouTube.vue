<template>
  <div :style="cssVars">
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
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

export default {
  data () {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 16,
      height: 9
    };
  },

  computed: {
    cssVars () {
      return {
        '--top': this.top,
        '--bottom': this.bottom,
        '--left': this.left,
        '--right': this.right,
        '--width': this.width,
        '--height': this.height,
        '--offset-top': this.offsetTop
      };
    }
  },

  mounted () {
    console.log('TEST', window.innerHeight, window.innerWidth, window.outerHeight, window.outerWidth);
    fromEvent(window, 'resize')
      .pipe(
        startWith(0),
        map(() => window.orientation),
        distinctUntilChanged((prev, curr) => prev === curr)
      )
      .subscribe((e) => {
        console.log('HIT');
        if (window.matchMedia('(orientation: landscape)').matches) {
          const rect = this.$el.getBoundingClientRect();
          this.width = document.documentElement.scrollWidth;
          this.height = document.documentElement.scrollHeight;
          this.top = rect.top + window.scrollY;
          this.bottom = this.height - (this.top + rect.height);
          this.left = rect.left + window.scrollX;
          this.right = this.width - (this.left + rect.width);
          this.offsetTop = ((window.innerHeight - rect.height) / 2) - rect.top;
          // this.offsetTop = this.top;
          console.log(this.top);
        } else {
          this.width = 16;
          this.height = 9;
          this.top = null;
          this.bottom = null;
          this.left = null;
          this.right = null;
          this.offsetTop = null;
        }
      // console.log(this.x, this.yTop + rect.height, this.height);
      });

    // fromEvent(window, 'orientationchange').subscribe(() => {
    //   console.log('O');
    //   // const windowInnerWidth = window.innerWidth;
    //   const windowInnerHeight = window.innerHeight;
    //   // console.log(windowInnerWidth, windowInnerHeight);
    //   const rect = this.$el.getBoundingClientRect();
    //   const topVideo = (windowInnerHeight - rect.height) / 2;
    //   console.log(window.scrollY, rect.top, rect.height);
    //   this.offsetTop = topVideo - rect.top;
    //   // console.log(rect);
    // });
  }
};
</script>

<style lang="postcss" scoped>
div {
  --top: 0;
  --bottom: 0;
  --left: 0;
  --right: 0;
  --width: 16;
  --height: 9;
  --offset-top: 0;

  width: 100%;
  margin: 0;

  & iframe {
    position: sticky;
    top: 0;
    bottom: 0;
    display: block;
    width: 100%;
    aspect-ratio: 16/9;
    transition-duration: 350ms;
    transition-property: transform;
  }

  @media (orientation: landscape) {
    /* position: relative;
    aspect-ratio: calc(var(--width) / var(--height));
    margin: calc(var(--top) * -1px) calc(var(--right) * -1px) calc(var(--bottom) * -1px) calc(var(--left) * -1px);
    background-color: black; */

    & iframe {
      height: 100vh;
      aspect-ratio: none;
      transform: translateY(calc(var(--offset-top) * 1px));
    }
  }
}
</style>>
