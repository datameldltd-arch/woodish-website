/* Woodish hero: golden sawdust drifts up out of the dark and settles into the logo.
 * Scrolling blows the logo apart again. Moving the pointer pushes the dust around. */
(function () {
  const GOLD = [246, 189, 31], CREAM = [246, 239, 228], AMBER = [255, 214, 90];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function init(canvas, src, copyEl) {
    const ctx = canvas.getContext('2d');
    const mobile = matchMedia('(max-width: 760px)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MAX = mobile ? 2200 : 5200, STEP = mobile ? 4 : 3;
    const logo = new Image();
    let pts = [], amb = [], samples = [], w = 0, h = 0, dpr = 1, cx = 0, cy = 0, scale = 1;
    let t0 = 0, visible = true, progress = 0, ready = false;
    const mouse = { x: -999, y: -999 };

    function sample() {
      const c = document.createElement('canvas');
      c.width = logo.naturalWidth; c.height = logo.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(logo, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      samples = [];
      for (let y = 0; y < c.height; y += STEP) for (let x = 0; x < c.width; x += STEP) {
        const i = (y * c.width + x) * 4;
        if (d[i + 3] > 140) samples.push([x - c.width / 2, y - c.height / 2, d[i], d[i + 1], d[i + 2]]);
      }
      for (let i = samples.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [samples[i], samples[j]] = [samples[j], samples[i]]; }
      samples = samples.slice(0, MAX);
    }

    function layout() {
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const top = 78, bottom = (copyEl ? copyEl.offsetTop : h * 0.62) - 16;
      const free = Math.max(110, bottom - top);
      cx = w / 2; cy = top + free / 2;
      scale = Math.min((w * (mobile ? 0.84 : 0.52)) / logo.naturalWidth, (free * 0.98) / logo.naturalHeight);
      build();
    }

    function build() {
      pts = samples.map(([sx, sy, r, g, b]) => {
        const gold = r > 200 && g > 150 && b < 150 && r - b > 70; // keep the gold "ish" gold, the rest cream
        return {
          x: Math.random() * w, y: h + 20 + Math.random() * h * 0.5,
          vx: 0, vy: 0, tx: cx + sx * scale, ty: cy + sy * scale,
          col: gold ? GOLD : (Math.random() < 0.18 ? AMBER : CREAM),
          s: (mobile ? 1.35 : 1.6) * (0.7 + Math.random() * 0.7),
          delay: Math.random() * 1.6 + (sy + logo.naturalHeight / 2) / logo.naturalHeight * 0.7,
          ph: Math.random() * 6.28, a: 0.6 + Math.random() * 0.4
        };
      });
      amb = Array.from({ length: mobile ? 36 : 80 }, () => ({
        x: Math.random() * w, y: Math.random() * h, s: 0.6 + Math.random() * 1.6,
        v: 0.12 + Math.random() * 0.35, ph: Math.random() * 6.28, a: 0.15 + Math.random() * 0.35
      }));
    }

    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      // ambient dust keeps floating up
      for (const a of amb) {
        a.y -= a.v; a.x += Math.sin(t * 0.6 + a.ph) * 0.25;
        if (a.y < -10) { a.y = h + 10; a.x = Math.random() * w; }
        ctx.fillStyle = `rgba(255,208,112,${a.a * (0.6 + 0.4 * Math.sin(t + a.ph))})`;
        ctx.fillRect(a.x, a.y, a.s, a.s);
      }
      const out = clamp(progress * 1.7, 0, 1), fade = 1 - clamp(out * 1.15, 0, 1);
      if (fade <= 0) return;
      const R = 110, R2 = R * R;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (t < p.delay) continue;
        let tx = p.tx + Math.sin(t * 1.3 + p.ph) * 0.9, ty = p.ty + Math.cos(t * 1.1 + p.ph) * 0.9;
        if (out > 0) { // scroll scatters the mark upward and outward
          tx += Math.sin(p.ph * 3) * out * 260;
          ty += -out * (160 + Math.cos(p.ph) * 120);
        }
        let ax = (tx - p.x) * 0.05, ay = (ty - p.y) * 0.05;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 1) { const f = (1 - d2 / R2) * 5, d = Math.sqrt(d2); ax += dx / d * f; ay += dy / d * f; }
        p.vx = (p.vx + ax) * 0.84; p.vy = (p.vy + ay) * 0.84;
        p.x += p.vx; p.y += p.vy;
        const c = p.col;
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${p.a * fade})`;
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      // crisp logo fades in under the dust once it has settled
      const la = clamp((t - 3) / 1.8, 0, 1) * 0.55 * fade;
      if (la > 0.01) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = la;
        ctx.drawImage(logo, cx - logo.naturalWidth * scale / 2, cy - logo.naturalHeight * scale / 2, logo.naturalWidth * scale, logo.naturalHeight * scale);
        ctx.globalAlpha = 1;
      }
    }

    function staticDraw() {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(logo, cx - logo.naturalWidth * scale / 2, cy - logo.naturalHeight * scale / 2, logo.naturalWidth * scale, logo.naturalHeight * scale);
    }

    logo.onload = () => {
      sample(); layout(); ready = true;
      if (reduce) return staticDraw();
      t0 = performance.now(); requestAnimationFrame(frame);
    };
    logo.src = src;
    addEventListener('resize', () => { if (ready) { layout(); if (reduce) staticDraw(); } });
    const host = canvas.parentElement;
    host.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    host.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    return { setProgress(v) { progress = v; } };
  }

  window.LogoFX = { init };
})();
