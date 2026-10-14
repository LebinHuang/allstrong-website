/* Load the background near the viewport; respect motion and data preferences. */
(() => {
  const section = document.querySelector('.story');
  if (!section) return;
  const video = section.querySelector('.story-video');
  const toggle = section.querySelector('.story-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let inView = false;
  let loaded = false;
  let userPaused = false;
  let userOptedIn = false;
  let failed = false;
  let playbackRequest = 0;

  const automatic = () => !motion.matches && !(connection && connection.saveData);
  const shouldPlay = () => !failed && inView && !document.hidden && !userPaused && (automatic() || userOptedIn);

  function updateButton() {
    const paused = video.paused;
    toggle.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    toggle.title = paused ? 'Play background video' : 'Pause background video';
  }

  function load() {
    if (loaded || failed) return;
    loaded = true;
    video.muted = true;
    video.src = video.dataset.src;
    video.load();
  }

  function sync() {
    const request = ++playbackRequest;
    if (shouldPlay()) {
      load();
      const promise = video.play();
      if (promise) promise.then(() => {
        // A visibility or preference change can happen before play resolves.
        if (request !== playbackRequest && !shouldPlay()) video.pause();
      }).catch(() => {
        // Keep the poster visible when the browser declines automatic playback.
        updateButton();
      });
    } else {
      video.pause();
    }
    updateButton();
  }

  video.addEventListener('playing', () => video.classList.add('is-ready'));
  video.addEventListener('play', updateButton);
  video.addEventListener('pause', updateButton);
  video.addEventListener('error', () => {
    failed = true;
    video.classList.remove('is-ready');
    toggle.hidden = true;
  });
  toggle.hidden = false;
  updateButton();
  toggle.addEventListener('click', () => {
    if (!video.paused) {
      userPaused = true;
    } else {
      userPaused = false;
      userOptedIn = true;
    }
    sync();
  });

  if ('IntersectionObserver' in window) {
    const preloadObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && automatic()) {
        load();
        preloadObserver.disconnect();
      }
    }, { rootMargin: '250px 0px' });
    preloadObserver.observe(section);
    const visibilityObserver = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      sync();
    }, { threshold: 0 });
    visibilityObserver.observe(section);
  } else {
    inView = true;
    sync();
  }
  document.addEventListener('visibilitychange', sync);
  if (motion.addEventListener) motion.addEventListener('change', sync);
  if (connection && connection.addEventListener) connection.addEventListener('change', sync);
})();
