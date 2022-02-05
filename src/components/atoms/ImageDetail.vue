<template>
  <device-orientation-container>
    <div>
      <figure class="wrapper">
        <div class="box" />
      </figure>
    </div>
  </device-orientation-container>
</template>

<script>
import DeviceOrientationContainer from '@/components/atoms/DeviceOrientationContainer.vue';

export default {
  components: {
    DeviceOrientationContainer
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
