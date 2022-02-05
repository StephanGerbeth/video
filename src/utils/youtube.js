import Deferred from '@/classes/Deferred';

const scriptDeferred = new Deferred();

export const getHeadScriptDeclaration = () => {
  return {
    hid: 'youtube',
    src: 'https://www.youtube.com/player_api',
    async: true,
    charset: 'utf-8',
    callback: () => scriptDeferred.resolve(global.YT)
  };
};

export const getYoutubePlayer = async (node, videoId) => {
  const YT = await scriptDeferred.promise;

  return new Promise((resolve) => {
    const player = new YT.Player(node, {
      videoId,
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
        onReady: () => resolve(player)
      }
    });
  });
};
