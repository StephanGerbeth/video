<template>
  <div :class="$style.youtube">
    youtube
  </div>
</template>

<script>
import Deferred from '@/classes/Deferred';
import { orientation, STATES } from '@/utils/device';

global.IntersectionObserver = global.IntersectionObserver || class { observe () { /* */ } unobserve () { /* */ }};

export default {
  data () {
    return {
      loaded: new Deferred()
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
          callback: () => this.loaded.resolve(global.YT)
        }
      ]
    };
  },

  created () {
    this.observer = new IntersectionObserver(([e]) => this.onIntersect(e), {});
  },

  mounted () {
    this.observer.observe(this.$el);
  },

  methods: {
    onIntersect (e) {
      if (e.isIntersecting) {
        this.observer.unobserve(this.$el);
        this.initYoutube();
      }
    },

    async initYoutube () {
      const YT = await this.loaded.promise;
      const player = new YT.Player(this.$el, {
        videoId: 'c2cxzy-Dar4',
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
          onReady: () => this.onPlayerReady(player)
          // 'onStateChange': onPlayerStateChange
        }
      });
    },

    onPlayerReady (player) {
      player.mute();
      player.playVideo();

      orientation.subscribe((e) => {
        if (e.orientation === STATES.LANDSCAPE) {
          player.unMute();
        } else {
          player.mute();
        }
      });
    }
  }
};
</script>

<style lang="postcss" module>
.youtube {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}
</style>
