<template>
  <device-orientation-container>
    <div>
      <figure class="wrapper">
        <speedkit-final-picture
          class="box"
          :title="portrait.title"
          :alt="portrait.alt"
          :sources="portrait.sources"
        />
      </figure>
      <speedkit-final-picture v-bind="landscape" :critical="false" :load="load" />
    </div>
  </device-orientation-container>
</template>

<script>
import SpeedkitPicture from 'nuxt-speedkit/components/SpeedkitPicture';
import SpeedkitFinalPicture from '@/components/atoms/SpeedkitFinalPicture';
import DeviceOrientationContainer from '@/components/atoms/DeviceOrientationContainer.vue';

export default {
  components: {
    SpeedkitFinalPicture,
    DeviceOrientationContainer
  },

  props: {
    portrait: {
      type: Object,
      default: () => null
    },
    landscape: {
      type: Object,
      default: () => null
    }
  },

  data () {
    return {
      component: SpeedkitPicture,
      load: false
    };
  },

  mounted () {
    setTimeout(() => {
      this.load = true;
    }, 5000);
  }
};
</script>

<style lang="postcss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.box {
  width: 50vw;
  height: 50vw;
  background: red;
  transition-duration: 350ms;
  transition-property: width;

  @media (orientation: landscape) {
    width: 100%;
    height: 100vh;
  }
}
</style>
