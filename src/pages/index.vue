<template>
  <main>
    <p>{{ getText(50) }}</p>
    <div class="box" @click="setFullscreen()" />
    <p>{{ getText(50) }}</p>
    <you-tube-video />
    <p>{{ getText(100) }}</p>
  </main>
</template>

<script>
// https://fakerjsdocs.netlify.app/api/lorem.html#sentences-sentencecount-separator
import faker from '@withshepherd/faker';
import YouTubeVideo from '@/components/atoms/YouTube.vue';

export default {
  components: {
    YouTubeVideo
  },

  methods: {
    getText (count = 10) {
      return faker.lorem.paragraph(count);
    },

    setFullscreen () {
      window.scrollTo(0, 400);
    }
  }
};
</script>

<style lang="postcss" scoped>
.box {
  width: 100%;
  height: 100px;
  background: red;

  @media (orientation: landscape) {
    height: 400px;
  }
}
</style>>
