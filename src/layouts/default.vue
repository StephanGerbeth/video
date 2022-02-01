<template>
  <div class="fullscreen-stage-in-landscape-mode">
    <nuxt />
  </div>
</template>

<script>

export default {

};

</script>

<style lang="postcss">
body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  & body {
    position: sticky;
    top: 0;
  }

  &::after {
    display: block;
    width: 100%;
    height: 100px;
    content: "";
  }
}

html[data-prevent-scrolling="true"] {
  & body {
    overflow: hidden;
  }
}

</style>

