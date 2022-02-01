<template>
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
</template>

<script>
import Deferred from '@/classes/Deferred';
import { orientation, fullscreen, STATES } from '@/utils/device';

global.IntersectionObserver = global.IntersectionObserver || class { observe () { /* */ } unobserve () { /* */ }};
const loaded = new Deferred();

export default {
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
        {
          hid: 'youtube',
          src: 'https://www.youtube.com/player_api',
          async: true,
          charset: 'utf-8',
          callback: () => loaded.resolve(global.YT)
        }
      ]
    };
  },

  created () {
    this.observer = new IntersectionObserver(([e]) => this.onIntersect(e), {});
  },

  mounted () {
    this.observer.observe(this.$el);

    fullscreen.subscribe((e) => {
      this.fullscreen = e.fullscreen;
    });
  },

  methods: {
    onIntersect (e) {
      if (e.isIntersecting) {
        this.observer.unobserve(this.$el);
        this.initYoutube();
      }
    },

    async initYoutube () {
      const YT = await loaded.promise;
      this.player = new YT.Player(this.$el.querySelector(':first-child'), {
        videoId: 'TP0T6MGJL9c',
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          enablejsapi: true,
          rel: false,
          fs: false,
          origin: window.location.host,
          playsinline: true,
          modestbranding: true,
          showinfo: false,
          iv_load_policy: 3
        },
        events: {
          onReady: () => this.onPlayerReady(this.player)
        }
      });
    },

    onPlayerReady (player) {
      player.mute();
      player.playVideo();

      orientation.subscribe((e) => {
        this.landscape = e.orientation === STATES.LANDSCAPE;
        if (e.orientation === STATES.LANDSCAPE) {
          if (!this.muted) {
            player.unMute();
          }
        } else {
          player.mute();
        }
      });
    },

    onUnmute () {
      this.muted = false;
      this.player.unMute();
    }
  }
};
</script>

<style lang="postcss" scoped>
.youtube {
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
</style>

<style lang="postcss" module>
.player {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
