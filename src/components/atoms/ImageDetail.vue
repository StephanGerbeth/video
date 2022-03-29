<template>
  <device-orientation-container>
    <div class="test-container">
      <figure class="wrapper">
        <speedkit-picture
          class="box"
          :title="portrait.title"
          :alt="portrait.alt"
          :sources="portrait.sources"
        />
      </figure>
      <speedkit-picture class="car" v-bind="landscape" :hydrate="hydrate" :critical="false" @load="onLoad" />
    </div>
  </device-orientation-container>
</template>

<script>
import SpeedkitPicture from 'nuxt-speedkit/components/SpeedkitPicture';
import DeviceOrientationContainer from '@/components/atoms/DeviceOrientationContainer.vue';

export default {
  components: {
    SpeedkitPicture,
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
      hydrate: false
    };
  },

  mounted () {
    setTimeout(() => {
      this.hydrate = true;
    }, 5000);
  },

  methods: {
    onLoad (e) {
      console.log('HUHUUHU', e);
    }
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
    width: auto;
    height: 100vh;
  }
}

.car {
  display: none;

  @media (orientation: landscape) {
    position: absolute;
    top: 0;
    display: block;
    opacity: 50%;
    transform: scale(2.2);
    transform-origin: 8.7% 89%;
  }
}

.test-container {
  overflow: hidden;
}
</style>
