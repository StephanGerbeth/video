<template>
  <device-orientation-container>
    <div class="youtube">
      <div :class="$style.player">
        youtube
      </div>
      <transition name="fade-info">
        <section v-if="!fullscreen && landscape" class="fullscreen-info">
          scroll down to go to fullscreen
        </section>
      </transition>
      <transition name="fade-info">
        <section v-if="muted && fullscreen && landscape" class="muted-info" @click="onUnmute">
          unmute
        </section>
      </transition>
    </div>
  </device-orientation-container>
</template>

<script>
import Deferred from '@/classes/Deferred';
import { orientation, fullscreen, STATES } from '@/utils/device';
import { getHeadScriptDeclaration, getYoutubePlayer } from '@/utils/youtube';
import DeviceOrientationContainer from '@/components/atoms/DeviceOrientationContainer.vue';

global.IntersectionObserver = global.IntersectionObserver || class { observe () { /* */ } unobserve () { /* */ }};
const loaded = new Deferred();

export default {
  components: {
    DeviceOrientationContainer
  },

  props: {
    videoId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      fullscreen: false,
      landscape: false,
      muted: true,
      player: null
    };
  },

  head () {
    return {
      script: [
        getHeadScriptDeclaration(loaded)
      ]
    };
  },

  created () {
    this.observer = new IntersectionObserver(([e]) => this.onIntersect(e), {});
  },

  async mounted () {
    this.player = await getYoutubePlayer(this.$el.querySelector('.youtube :first-child'));
    this.player.loadVideoById(this.videoId);
    this.observer.observe(this.$el);

    fullscreen.subscribe((e) => {
      this.fullscreen = e.fullscreen;
    });

    orientation.subscribe((e) => {
      this.landscape = e.orientation === STATES.LANDSCAPE;
      if (e.orientation === STATES.LANDSCAPE) {
        if (!this.muted) {
          this.player.unMute();
        }
      } else {
        this.player.mute();
      }
    });
  },

  methods: {
    onIntersect (e) {
      if (e.isIntersecting) {
        this.player.mute();
        this.player.playVideo();
      } else {
        this.player.pauseVideo();
      }
    },

    onUnmute () {
      this.muted = false;
      this.player.unMute();
    }
  }
};
</script>

<style lang="postcss" scoped>
.container {
  aspect-ratio: 16/9;

  & .youtube {
    & .fullscreen-info,
    & .muted-info {
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100vh;
      aspect-ratio: none;
      color: white;
      opacity: 100%;
      backdrop-filter: blur(2px);
    }

    & .fade-info-enter-active,
    & .fade-info-leave-active {
      transition-duration: 150ms;
      transition-property: opacity;
    }

    & .fade-info-enter,
    & .fade-info-leave-to {
      opacity: 0%;
    }
  }
}
</style>

<style lang="postcss" module>
.player {
  display: block;
  width: calc(100% - env(safe-area-inset-right) - env(safe-area-inset-left));
  height: 100%;
  margin-right: env(safe-area-inset-right);
  margin-left: env(safe-area-inset-left);
}
</style>
