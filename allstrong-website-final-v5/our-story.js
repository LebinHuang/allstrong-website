/* Muted, continuous background playback without visible controls. */
(() => {
  const video = document.querySelector('.story-video');
  if (!video) return;
  video.muted = true;
  video.loop = true;
  const play = () => {
    if (document.hidden) return;
    const request = video.play();
    if (request) request.catch(() => {});
  };
  video.addEventListener('playing', () => video.classList.add('is-ready'));
  video.addEventListener('error', () => video.classList.remove('is-ready'));
  video.addEventListener('canplay', play);
  document.addEventListener('visibilitychange', play);
  play();
})();
