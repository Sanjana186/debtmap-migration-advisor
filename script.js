/* ============================================
   DebtMap — Orbital Animation & Scroll FX
   ============================================ */

(function () {
  'use strict';

  // ---- Orbital Canvas Animation ----
  const canvas = document.getElementById('orbital-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, cx, cy, dpr;
  let frame = 0;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2;
    cy = H / 2;
  }

  window.addEventListener('resize', resize);
  resize();

  // Orbital items - code fragments, dependency nodes, warning indicators
  const fragments = [
    { label: 'import openai', type: 'code', orbit: 0.72, speed: 0.0004, offset: 0 },
    { label: 'requests==2.28', type: 'dep', orbit: 0.78, speed: -0.0003, offset: 1.2 },
    { label: '⚠ deprecated', type: 'warn', orbit: 0.65, speed: 0.0005, offset: 2.5 },
    { label: 'urllib3<2.0', type: 'dep', orbit: 0.82, speed: 0.00035, offset: 3.8 },
    { label: 'model="davinci"', type: 'code', orbit: 0.6, speed: -0.00045, offset: 5.0 },
    { label: 'CVE-2024', type: 'warn', orbit: 0.88, speed: 0.00025, offset: 0.8 },
    { label: 'flask==1.x', type: 'dep', orbit: 0.7, speed: -0.0004, offset: 4.2 },
    { label: 'async def', type: 'code', orbit: 0.56, speed: 0.00055, offset: 1.8 },
  ];

  // Particles
  const PARTICLE_COUNT = 40;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      orbit: 0.3 + Math.random() * 0.65,
      speed: (Math.random() - 0.5) * 0.0006,
      size: 1 + Math.random() * 1.5,
      alpha: 0.1 + Math.random() * 0.3,
    });
  }

  // Scanning line
  let scanAngle = 0;

  // Colors
  const COL_ACCENT = { r: 88, g: 166, b: 255 };
  const COL_WARN = { r: 210, g: 153, b: 34 };
  const COL_RED = { r: 248, g: 81, b: 73 };
  const COL_GREEN = { r: 63, g: 185, b: 80 };

  function getTypeColor(type) {
    if (type === 'warn') return COL_WARN;
    if (type === 'dep') return COL_RED;
    return COL_ACCENT;
  }

  function draw() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    const minDim = Math.min(W, H);

    // Draw orbit rings (very subtle)
    const rings = [0.56, 0.65, 0.72, 0.78, 0.82, 0.88];
    rings.forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * minDim * 0.45, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(48, 54, 61, 0.25)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Scanning sweep (subtle)
    scanAngle += 0.003;
    const sweepGrad = ctx.createConicGradient(scanAngle, cx, cy);
    sweepGrad.addColorStop(0, 'rgba(88, 166, 255, 0.04)');
    sweepGrad.addColorStop(0.08, 'rgba(88, 166, 255, 0)');
    sweepGrad.addColorStop(1, 'rgba(88, 166, 255, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, minDim * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    // Draw particles
    particles.forEach(p => {
      p.angle += p.speed;
      const r = p.orbit * minDim * 0.45;
      const px = cx + Math.cos(p.angle) * r;
      const py = cy + Math.sin(p.angle) * r;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(88, 166, 255, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connections between nearby fragments
    for (let i = 0; i < fragments.length; i++) {
      for (let j = i + 1; j < fragments.length; j++) {
        const fi = fragments[i];
        const fj = fragments[j];
        const ri = fi.orbit * minDim * 0.45;
        const rj = fj.orbit * minDim * 0.45;
        const ai = fi.offset + frame * fi.speed;
        const aj = fj.offset + frame * fj.speed;
        const x1 = cx + Math.cos(ai) * ri;
        const y1 = cy + Math.sin(ai) * ri;
        const x2 = cx + Math.cos(aj) * rj;
        const y2 = cy + Math.sin(aj) * rj;
        const dist = Math.hypot(x2 - x1, y2 - y1);
        if (dist < minDim * 0.25) {
          const alpha = (1 - dist / (minDim * 0.25)) * 0.12;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(88, 166, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw orbital fragments
    fragments.forEach(f => {
      const angle = f.offset + frame * f.speed;
      const r = f.orbit * minDim * 0.45;
      const fx = cx + Math.cos(angle) * r;
      const fy = cy + Math.sin(angle) * r;
      const col = getTypeColor(f.type);

      // Glow
      const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, 20);
      glow.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0.2)`);
      glow.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
      ctx.beginPath();
      ctx.arc(fx, fy, 20, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Node dot
      ctx.beginPath();
      ctx.arc(fx, fy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${col.r}, ${col.g}, ${col.b})`;
      ctx.fill();

      // Label
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.7)`;
      ctx.textAlign = 'center';
      ctx.fillText(f.label, fx, fy - 10);
    });

    // Center glow
    const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.15);
    centerGlow.addColorStop(0, 'rgba(88, 166, 255, 0.04)');
    centerGlow.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, minDim * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = centerGlow;
    ctx.fill();

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  // ---- Scroll Reveal ----
  const revealTargets = [
    'hero-badge', 'hero-heading', 'hero-sub', 'hero-ctas', 'hero-trust',
    'hero-right',
    'steps-label', 'steps-title', 'steps-desc',
    'step-1', 'step-2', 'step-3',
    'features-label', 'features-title', 'features-desc',
    'feature-1', 'feature-2', 'feature-3', 'feature-4',
    'preview-label', 'preview-title', 'preview-desc',
    'preview-container', 'preview-meta',
    'cta-box',
  ];

  // Add fade-up class to all targets
  revealTargets.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('fade-up');
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const el = entry.target;
          const siblings = el.parentElement.querySelectorAll('.fade-up:not(.visible)');
          let delay = 0;
          siblings.forEach(s => {
            if (s === el || isInViewport(s)) {
              setTimeout(() => s.classList.add('visible'), delay);
              delay += 80;
            }
          });
          el.classList.add('visible');
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  revealTargets.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Nav background on scroll ----
  const nav = document.getElementById('main-nav');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          nav.style.borderBottomColor = 'rgba(48, 54, 61, 0.6)';
        } else {
          nav.style.borderBottomColor = 'rgba(33, 38, 45, 1)';
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // ---- Typing effect on viz-center-card ----
  const oldCode = document.querySelector('#viz-label-old code');
  const newCode = document.querySelector('#viz-label-new code');

  if (oldCode && newCode) {
    const oldText = oldCode.textContent;
    const newText = newCode.textContent;

    // Cycle animation: show old → transform → show new → pause → reset
    function runTransformCycle() {
      // Phase 1: type old code
      oldCode.textContent = '';
      newCode.textContent = '';
      oldCode.parentElement.style.opacity = '1';
      newCode.parentElement.style.opacity = '0.3';
      document.getElementById('viz-arrow').style.opacity = '0.3';

      let i = 0;
      const typeOld = setInterval(() => {
        if (i < oldText.length) {
          oldCode.textContent += oldText[i];
          i++;
        } else {
          clearInterval(typeOld);
          // Phase 2: pause then transform
          setTimeout(() => {
            document.getElementById('viz-arrow').style.opacity = '1';
            newCode.parentElement.style.opacity = '1';
            let j = 0;
            const typeNew = setInterval(() => {
              if (j < newText.length) {
                newCode.textContent += newText[j];
                j++;
              } else {
                clearInterval(typeNew);
                // Phase 3: hold then restart
                setTimeout(runTransformCycle, 5000);
              }
            }, 30);
          }, 1200);
        }
      }, 40);
    }

    // Start after initial load
    setTimeout(runTransformCycle, 1500);
  }
})();
