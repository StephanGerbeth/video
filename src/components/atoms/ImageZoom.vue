/* eslint-disable complexity */
<template>
  <div>
    <speedkit-picture class="zoom" v-bind="picture" :style="cssVars" />
  </div>
</template>

<script>
import SpeedkitPicture from 'nuxt-speedkit/components/SpeedkitPicture';
import SourceList from 'nuxt-speedkit/components/SpeedkitPicture/classes/SourceList';
import { ipoint } from '@js-basics/vector';

export default {
  components: {
    SpeedkitPicture
  },

  props: {
    picture: {
      type: Object,
      required: true
    },

    mask: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      sources: null,
      origin: null,
      cssVars: {}
    };
  },

  async fetch () {
    const { createCanvas, loadImage } = await import('canvas');

    const t = this.$img.getImage(this.mask.sources[0].src);
    const mask = await loadImage('http://localhost:8050' + t.url);
    const dimension = ipoint(mask.width, mask.height);

    const canvas = createCanvas(...dimension);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(mask, 0, 0, ...dimension);
    const { data } = ctx.getImageData(0, 0, ...dimension);

    this.origin = getMaskOrigin(data, dimension);
    this.cssVars = {
      ...this.origin.scaleMax.toCSSVars('scale-max'),
      ...this.origin.origin.toCSSVars('origin'),
      ...this.origin.offset.toCSSVars('offset')
    };
  },

  computed: {
    sourceList () {
      return SourceList.create(this.mask.sources);
    }
  },

  mounted () {
    console.log(this.sources, this.test);
    // console.log(this.$img);
  }
};

const getMaskOrigin = (data, dimension) => {
  let min = ipoint(Infinity, Infinity);
  let max = ipoint(-Infinity, -Infinity);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      const current = ipoint(Math.floor((i / 4) % dimension.x), Math.floor(i / 4 / dimension.x));
      min = ipoint(() => (+min > +current && +current) || +min);
      max = ipoint(() => (+max < +current && +current) || +max);
    }
  }

  return {
    scaleMax: ipoint(() => dimension / (max - min)),
    origin: ipoint(() => ((min + max) / 2) / (dimension)),
    offset: ipoint(() => (((min + max) / 2) - (dimension / 2)) / dimension)
  };
};
</script>

<style lang="postcss" scoped>
.zoom {
  --scale-min: 1;
  --scale-max: min(var(--scale-max-x), var(--scale-max-y));
  --scale-current: var(--scale-max);
  --offset-scaled-x: calc(var(--offset-x) / (var(--scale-max) - 1) * (var(--scale-current) - 1) * -100%);
  --offset-scaled-y: calc(var(--offset-y) / (var(--scale-max) - 1) * (var(--scale-current) - 1) * -100%);
  --offset-norm-x: calc(var(--offset-x) * -100%);
  --offset-norm-y: calc(var(--offset-y) * -100%);

  position: relative;
  display: block;
  height: 100vw;
  overflow: hidden;

  @media (orientation: landscape) {
    --scale-current: var(--scale-min);

    height: 100vh;
  }

  & >>> img {
    position: absolute;
    top: -100%;
    right: -100%;
    bottom: -100%;
    left: -100%;
    width: auto;
    height: 100%;
    margin: auto;
    transition-duration: 1s;
    transition-property: transform;
    transform: translate(var(--offset-scaled-x), var(--offset-scaled-y)) scale(calc(var(--scale-current)));
    transform-origin: calc(var(--origin-x) * 100%) calc(var(--origin-y) * 100%);
    object-fit: unset;
  }
}
</style>
