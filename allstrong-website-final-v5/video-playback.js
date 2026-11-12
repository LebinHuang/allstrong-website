/* Device-sized media, deferred downloads and a short playback buffer. */
(() => {
  'use strict';
  const players = new Set();
  const lightweight = () => {
    const connection = navigator.connection;
    return matchMedia('(max-width: 760px)').matches || connection?.saveData ||
      ['slow-2g', '2g', '3g'].includes(connection?.effectiveType);
  };
  function create(video, options = {}) {
    let loaded = false, wanted = false, pending = false;
    const allowed = () => wanted && !document.hidden && (options.shouldPlay?.() ?? true);
    function buffered() {
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= video.currentTime + .05 && video.buffered.end(i) > video.currentTime)
          return video.buffered.end(i) - video.currentTime;
      }
      return 0;
    }
    function load() {
      if (loaded) return;
      loaded = true;
      video.src = lightweight() ? video.dataset.mobileSrc : video.dataset.desktopSrc;
      video.preload = 'auto';
      video.load();
    }
    function refresh() {
      if (!allowed()) { video.pause(); return; }
      load();
      if (pending || !video.paused) return;
      const remaining = Number.isFinite(video.duration) ? Math.max(0, video.duration - video.currentTime) : 2;
      if (video.readyState < 2 || buffered() + .05 < Math.min(2, remaining)) return;
      pending = true;
      video.play().catch(error => {
        if (error.name !== 'AbortError' && allowed()) {
          wanted = false;
          options.onBlocked?.(error);
        }
      }).finally(() => {
        pending = false;
        if (!allowed()) video.pause();
        else if (video.paused) refresh();
      });
    }
    const player = {
      load, refresh, buffered,
      play() { wanted = true; refresh(); },
      pause() { wanted = false; video.pause(); },
      reset() { video.currentTime = 0; }
    };
    video.muted = true;
    for (const event of ['progress', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'])
      video.addEventListener(event, refresh);
    video.addEventListener('waiting', () => { if (allowed()) { video.pause(); refresh(); } });
    video.addEventListener('playing', () => options.onPlaying?.());
    video.addEventListener('ended', () => { wanted = false; options.onEnded?.(); });
    video.addEventListener('error', () => {
      loaded = false;
      wanted = false;
      options.onError?.();
    });
    players.add(player);
    return player;
  }
  document.addEventListener('visibilitychange', () => players.forEach(player => player.refresh()));
  window.AllstrongVideo = { create };
})();
