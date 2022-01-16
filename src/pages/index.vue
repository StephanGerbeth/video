<template>
  <main>
    <p>{{ getText(50) }}</p>
    <div class="box" @click="setFullscreen()" />
    <p>{{ getText(50) }}</p>

    <device-orientation-container>
      <youtube-player />
    </device-orientation-container>
    <p>{{ getText(100) }}</p>
  </main>
</template>

<script>
// https://fakerjsdocs.netlify.app/api/lorem.html#sentences-sentencecount-separator
import faker from '@withshepherd/faker';
import DeviceOrientationContainer from '@/components/atoms/DeviceOrientationContainer.vue';
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue';

export default {
  components: {
    DeviceOrientationContainer,
    YoutubePlayer
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
main > p {
  margin-right: env(safe-area-inset-right);
  margin-left: env(safe-area-inset-left);
}

.box {
  width: 100%;
  height: 100px;
  background: red;

  @media (orientation: landscape) {
    height: 400px;
  }
}
</style>>
