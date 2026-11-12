/* Start the background film only as the story section approaches the viewport. */
(() => {
  const video = document.querySelector('.story-video');
  if (!video) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  const player = AllstrongVideo.create(video, {
    shouldPlay: () => visible && !reduced.matches,
    onPlaying: () => video.classList.add('is-ready'),
    onError: () => video.classList.remove('is-ready')
  });
  const sync = () => { if (visible && !reduced.matches) player.play(); else player.pause(); };
  if ('IntersectionObserver' in window) {
    const preload = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && !reduced.matches) { player.load(); preload.unobserve(entry.target); }
    }), { rootMargin: '350px 0px' });
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    }, { threshold: .15 });
    const section = document.getElementById('our-story');
    preload.observe(section);
    observer.observe(section);
  } else { visible = true; sync(); }
  reduced.addEventListener('change', () => { sync(); if (reduced.matches) video.classList.remove('is-ready'); });
})();
