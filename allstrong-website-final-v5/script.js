let current = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const countEl = document.getElementById("slideCount");
function goToSlide(n) {
  slides[current].classList.remove("active"); dots[current].classList.remove("active");
  current = (n + slides.length) % slides.length;
  slides[current].classList.add("active"); dots[current].classList.add("active");
  countEl.textContent = String(current+1).padStart(2,"0") + " / " + String(slides.length).padStart(2,"0");
}
setInterval(() => goToSlide(current + 1), 5500);
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* ============================================================
   CINEMATIC REEL — scene reveal + progress indicator
   ============================================================ */
(function () {
  const scenes = document.querySelectorAll('.reel-scene');
  if (!scenes.length) return;

  const progressFill    = document.querySelector('.reb-fill');
  const progressCurrent = document.querySelector('.reb-current');
  const progressTotal   = document.querySelector('.reb-total');
  const total = scenes.length;
  if (progressTotal) progressTotal.textContent = String(total).padStart(2, '0');

  let activeIdx = 1;

  const reelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        const idx = parseInt(entry.target.dataset.scene, 10);
        // Update progress to the most-recently-entered scene
        if (idx >= activeIdx) {
          activeIdx = idx;
          if (progressFill)    progressFill.style.transform    = `scaleX(${idx / total})`;
          if (progressCurrent) progressCurrent.textContent     = String(idx).padStart(2, '0');
        }
      }
    });
  }, { threshold: 0.35 });

  scenes.forEach(s => reelObserver.observe(s));

  // Also track which scene is closest to viewport center, so scrolling up/down updates the counter
  const centerObserver = new IntersectionObserver((entries) => {
    let best = null;
    let bestRatio = 0;
    entries.forEach(entry => {
      if (entry.intersectionRatio > bestRatio) {
        bestRatio = entry.intersectionRatio;
        best = entry.target;
      }
    });
    if (best) {
      const idx = parseInt(best.dataset.scene, 10);
      activeIdx = idx;
      if (progressFill)    progressFill.style.transform    = `scaleX(${idx / total})`;
      if (progressCurrent) progressCurrent.textContent     = String(idx).padStart(2, '0');
    }
  }, {
    threshold: [0.25, 0.5, 0.75],
    rootMargin: '-20% 0px -20% 0px'
  });

  scenes.forEach(s => centerObserver.observe(s));
})();

/* ============================================================
   PRODUCT CARD ANIMATIONS
   1. Magnetic Tilt  — card tilts toward cursor in 3D
   2. Particle Explosion — fire sparks burst from cursor
   ============================================================ */

(function () {

  /* ---- CONFIG ---- */
  const TILT_MAX      = 14;     // max tilt degrees
  const SCALE_HOVER   = 1.045;  // scale on hover
  const LERP_SPEED    = 0.10;   // smoothing (lower = floatier)

  // Spark colors: hot red/orange/gold palette matching brand
  const SPARK_COLORS  = [
    '#c0392b', '#e74c3c', '#ff6b35',
    '#f39c12', '#ffcc02', '#ff4757',
    '#ffffff'
  ];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(min, max) { return Math.random() * (max - min) + min; }

  /* ---- PARTICLE SYSTEM ---- */
  function burstParticles(canvas, x, y, count) {
    const ctx = canvas.getContext('2d');
    const W   = canvas.offsetWidth;
    const H   = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    let particles = [];

    for (let i = 0; i < count; i++) {
      const angle   = rand(0, Math.PI * 2);
      const speed   = rand(1.5, 6.5);
      const size    = rand(2, 5.5);
      const life    = rand(0.4, 0.9);
      const gravity = rand(0.08, 0.22);
      const color   = SPARK_COLORS[Math.floor(rand(0, SPARK_COLORS.length))];

      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(1, 3), // bias upward
        size,
        life,
        maxLife: life,
        color,
        gravity,
        trail: []
      });
    }

    let start = null;
    const DURATION = 800; // ms

    function draw(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = elapsed / DURATION;

      ctx.clearRect(0, 0, W, H);

      particles = particles.filter(p => p.life > 0);

      particles.forEach(p => {
        // Store trail point
        p.trail.push({ x: p.x, y: p.y, size: p.size * (p.life / p.maxLife) });
        if (p.trail.length > 5) p.trail.shift();

        // Draw trail
        p.trail.forEach((pt, i) => {
          const alpha = (i / p.trail.length) * (p.life / p.maxLife) * 0.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', '');
          // Use hex color with alpha via globalAlpha instead
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.fill();
        });

        // Draw main spark
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;

        // Glow effect
        ctx.shadowBlur   = 8;
        ctx.shadowColor  = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (alpha * 0.7 + 0.3), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Update physics
        p.vy   += p.gravity;
        p.x    += p.vx;
        p.y    += p.vy;
        p.vx   *= 0.97;
        p.life -= 0.018;
      });

      ctx.globalAlpha = 1;

      if (particles.length > 0 && elapsed < DURATION + 400) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    }

    requestAnimationFrame(draw);
  }

  /* ---- MAGNETIC TILT ---- */
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    const canvas = card.querySelector('.particle-canvas');

    let rafId        = null;
    let targetRX     = 0, targetRY = 0, targetScale = 1;
    let currentRX    = 0, currentRY = 0, currentScale = 1;
    let isHovered    = false;
    let lastBurst    = 0;       // throttle particle bursts
    let burstCount   = 0;       // limit total bursts per hover

    /* Mouse enter */
    card.addEventListener('mouseenter', (e) => {
      isHovered   = true;
      targetScale = SCALE_HOVER;
      burstCount  = 0;
      card.classList.add('is-tilting');
      startLoop();

      // Initial explosion on enter
      if (canvas) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        burstParticles(canvas, x, y, 28);
        lastBurst = Date.now();
        burstCount++;
      }
    });

    /* Mouse move — tilt + occasional small burst */
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      targetRY =  dx * TILT_MAX;
      targetRX = -dy * TILT_MAX;

      // Sheen position
      const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      card.style.setProperty('--mx', mx);
      card.style.setProperty('--my', my);

      // Small trailing sparks while moving (throttled, max 3 extra bursts)
      const now = Date.now();
      if (canvas && now - lastBurst > 280 && burstCount < 4) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        burstParticles(canvas, x, y, 12);
        lastBurst = now;
        burstCount++;
      }
    });

    /* Mouse leave */
    card.addEventListener('mouseleave', (e) => {
      isHovered   = false;
      targetRX    = 0;
      targetRY    = 0;
      targetScale = 1;
      card.classList.remove('is-tilting');

      // Small exit burst
      if (canvas) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        burstParticles(canvas, x, y, 14);
      }
    });

    /* Animation loop with lerp */
    function startLoop() {
      if (rafId) return;
      rafId = requestAnimationFrame(loop);
    }

    function loop() {
      currentRX    = lerp(currentRX,    targetRX,    LERP_SPEED);
      currentRY    = lerp(currentRY,    targetRY,    LERP_SPEED);
      currentScale = lerp(currentScale, targetScale, LERP_SPEED);

      card.style.transform =
        `perspective(900px) rotateX(${currentRX.toFixed(3)}deg) rotateY(${currentRY.toFixed(3)}deg) scale(${currentScale.toFixed(4)})`;

      const settled =
        Math.abs(currentRX    - targetRX)    < 0.01 &&
        Math.abs(currentRY    - targetRY)    < 0.01 &&
        Math.abs(currentScale - targetScale) < 0.001;

      if (!settled) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
        if (!isHovered) {
          card.style.transform = '';
        }
      }
    }
  });

})();
