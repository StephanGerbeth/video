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
    const mask = await loadImage('http://192.168.178.53:8050' + t.url);
    const dimension = ipoint(mask.width, mask.height);

    const canvas = createCanvas(...dimension);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(mask, 0, 0, ...dimension);
    const { data } = ctx.getImageData(0, 0, ...dimension);

    this.origin = getMaskOrigin(data, dimension);
    this.cssVars = {
      ...this.origin.position.toCSSVars('position'),
      ...this.origin.dimension.toCSSVars('dimension'),
      ...this.origin.origin.toCSSVars('origin')
    };
    console.log(this.origin);
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

  console.log(min, max);
  console.log(ipoint(() => (dimension - ipoint(dimension.y, dimension.y)) / dimension / 2));

  return {
    position: ipoint(() => (min / dimension) - ((dimension - ipoint(dimension.y, dimension.y / 4)) / dimension / 2)),
    origin: ipoint(() => ((min + max) / 2) / dimension),
    dimension: ipoint(() => (max - min) / dimension),
    test: ipoint(() => ((min + max - dimension.y) / 2) / dimension.y)
  };
};
</script>

<style lang="postcss" scoped>
.zoom {
  display: block;
  height: 100vw;
  overflow: hidden;
  aspect-ratio: none;

  & >>> img {
    width: auto;
    height: 100%;
    transform: translate(calc(var(--position-x) * -100%), calc(var(--position-y) * -100%)) scale(2);
    transform-origin: calc(var(--origin-x) * 100%) calc(var(--origin-y) * 100%);
  }
}
</style>
