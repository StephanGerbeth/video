<script>
import LazyHydrate from 'vue-lazy-hydration';
import SpeedkitPicture from 'nuxt-speedkit/components/SpeedkitPicture';

export default {
  inheritAttrs: false,

  props: {
    load: {
      type: Boolean,
      default: false
    }
  },

  render (h) {
    const component = h(SpeedkitPicture, { props: { ...this.$attrs, critical: this.isCritical } });
    if (!this.isCritical) {
      return h(LazyHydrate, { props: { never: true } }, [
        h('noscript', {}, [
          component
        ])
      ]);
    }
    return component;
  }
};
</script>
