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
   BENTO SHOWROOM — custom cursor + per-card perspective tilt
   ============================================================ */
(function () {
  const section = document.querySelector('.section-bento');
  const cursor  = document.querySelector('.bento-cursor');
  const cards   = document.querySelectorAll('.bento-card');
  if (!section || !cursor) return;

  const isDesktop = () => window.matchMedia('(min-width: 901px)').matches;

  // --- Custom cursor follow loop (lerp for smoothness) ---
  let tx = -100, ty = -100;
  let cx = -100, cy = -100;
  let targetScale = 0.4;
  let curScale = 0.4;
  let targetOpacity = 0;
  let curOpacity = 0;
  let rafId = null;

  const HALF = 39; // half of cursor 78px

  function loop() {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    curScale += (targetScale - curScale) * 0.22;
    curOpacity += (targetOpacity - curOpacity) * 0.22;
    cursor.style.transform = `translate3d(${cx - HALF}px, ${cy - HALF}px, 0) scale(${curScale.toFixed(3)})`;
    cursor.style.opacity = curOpacity.toFixed(3);
    const settled =
      Math.abs(tx - cx) < 0.2 &&
      Math.abs(ty - cy) < 0.2 &&
      Math.abs(targetScale - curScale) < 0.002 &&
      Math.abs(targetOpacity - curOpacity) < 0.005;
    if (settled && targetOpacity === 0) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(loop);
  }
  function kick() { if (!rafId) rafId = requestAnimationFrame(loop); }

  section.addEventListener('mouseenter', () => {
    if (!isDesktop()) return;
    section.classList.add('is-cursor-active');
    targetOpacity = 1;
    targetScale = 1;
    kick();
  });
  section.addEventListener('mouseleave', () => {
    section.classList.remove('is-cursor-active');
    targetOpacity = 0;
    targetScale = 0.4;
    kick();
  });
  section.addEventListener('mousemove', (e) => {
    if (!isDesktop()) return;
    tx = e.clientX; ty = e.clientY;
    if (cx === -100 && cy === -100) { cx = tx; cy = ty; }
    kick();
  });
  section.addEventListener('mousedown', () => { targetScale = 0.82; kick(); });
  section.addEventListener('mouseup',   () => { targetScale = 1;    kick(); });

  // --- Per-card perspective tilt ---
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      card.classList.add('is-tilting');
    });
    card.addEventListener('mousemove', (e) => {
      if (!isDesktop()) return;
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) / rect.width;
      const dy = (e.clientY - (rect.top  + rect.height / 2)) / rect.height;
      card.style.transform =
        `translateY(-6px) rotateX(${(-dy * 6).toFixed(2)}deg) rotateY(${(dx * 6).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-tilting');
      card.style.transform = '';
    });
  });
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
