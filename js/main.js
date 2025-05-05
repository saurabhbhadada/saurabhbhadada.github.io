(() => {
    /* -------- Tab Switching & Starfield -------- */
    const tabbar = document.querySelector('.tabbar');
    const panels = document.querySelectorAll('.panel');

    tabbar.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      tabbar.querySelectorAll('.tab-btn')
        .forEach(b => b.classList.toggle('active', b === btn));
      const id = 'tab-' + btn.dataset.tab;
      panels.forEach(p => p.classList.toggle('active', p.id === id));
      const panel = document.getElementById(id);
      if (panel) panel.scrollTop = 0;
    });

    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext?.('2d');
    if (!ctx) return;

    let stars = [];
    function resize() {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      stars = Array.from({ length: 160 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1.5 + 0.5
      }));
    }
    resize();
    window.addEventListener('resize', resize);

    (function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      stars.forEach(s => {
        ctx.globalAlpha = s.z;
        ctx.fillRect(s.x, s.y, 2, 2);
        s.x -= 0.05 * s.z;
        s.y += 0.05 * s.z;
        if (s.x < 0 || s.y > canvas.height) {
          s.x = canvas.width;
          s.y = Math.random() * canvas.height;
        }
      });
      requestAnimationFrame(draw);
    })();

    /* -------- Experience Slide Navigation & Highlight -------- */
    const slides = document.querySelector('.exp-slides');
    const items = document.querySelectorAll('.exp-index li');

    items.forEach(li => {
      li.addEventListener('click', () => {
        const target = document.getElementById(li.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        const id = ent.target.id;
        const idx = document.querySelector(`.exp-index li[data-target="${id}"]`);
        if (idx) idx.classList.toggle('active', ent.isIntersecting);
      });
    }, { root: document.querySelector('.exp-slides'), threshold: 0.6 });

    document.querySelectorAll('.slide').forEach(s => observer.observe(s));
  })();

  // Store state per canvas
  function setupPixelArtCanvas(canvasId, initParticlesFunc, drawParticlesFunc) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0;
      initParticlesFunc(particles, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    (function drawLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawParticlesFunc(ctx, particles, canvas.width, canvas.height);
      requestAnimationFrame(drawLoop);
    })();
  }

  // —————— Animated Cosmic Patterns ——————
  const patterns = {
    // EXPERIENCE → drifting star cluster
    exp: {
      init(p, w, h) {
        p.length = 0;
        for (let i = 0; i < 120; i++) {
          p.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            alpha: Math.random() * 0.5 + 0.2
          });
        }
      },
      draw(ctx, p, w, h) {
        ctx.fillStyle = '#fff';
        for (let s of p) {
          ctx.globalAlpha = s.alpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
          s.x = (s.x + s.vx + w) % w;
          s.y = (s.y + s.vy + h) % h;
        }
      }
    },

    // PROJECTS → swirling galaxy arms
    proj: {
      init(p, w, h) {
        p.length = 0;
        const cx = w / 2, cy = h / 2;
        for (let i = 0; i < 200; i++) {
          p.push({
            cx, cy,
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * Math.min(w, h) * 0.4,
            speed: (Math.random() * 0.0005 + 0.0002) * (Math.random() < 0.5 ? 1 : -1),
            r: Math.random() * 1.5 + 0.5
          });
        }
      },
      draw(ctx, p, w, h) {
        ctx.fillStyle = '#fff';
        for (let star of p) {
          star.angle += star.speed;
          const x = star.cx + Math.cos(star.angle) * star.radius;
          const y = star.cy + Math.sin(star.angle) * star.radius;
          ctx.globalAlpha = 0.3 + Math.sin(star.angle * 2) * 0.2;
          ctx.beginPath();
          ctx.arc(x, y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },

    edu: {
        init(p, w, h) {
          p.length = 0;
          // nebula blobs
          for (let i = 0; i < 6; i++) {
            p.push({
              type: 'cloud',
              x: Math.random() * w,
              y: Math.random() * h,
              base: Math.random() * 150 + 100,
              phase: Math.random() * Math.PI * 2,
              speed: Math.random() * 0.002 + 0.001
            });
          }
          // background twinkling stars
          for (let i = 0; i < 80; i++) {
            p.push({
              type: 'star',
              x: Math.random() * w,
              y: Math.random() * h,
              r: Math.random() * 1.2 + 0.3,
              phase: Math.random() * Math.PI * 2,
              speed: Math.random() * 0.03 + 0.01
            });
          }
        },
        draw(ctx, p, w, h) {
          // clouds
          for (let obj of p) {
            if (obj.type === 'cloud') {
              obj.phase += obj.speed;
              const rad = obj.base + Math.sin(obj.phase) * 30;
              const alpha = 0.08 + Math.sin(obj.phase) * 0.02;
              const grad = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, rad);
              grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
              grad.addColorStop(1, 'rgba(255,255,255,0)');
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(obj.x, obj.y, rad, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          // stars
          ctx.fillStyle = '#fff';
          for (let obj of p) {
            if (obj.type === 'star') {
              obj.phase += obj.speed;
              const a = 0.2 + (Math.sin(obj.phase) + 1) * 0.15;
              ctx.globalAlpha = a;
              ctx.beginPath();
              ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      },
// ————— COFFEE → floating detailed mugs with proper width & details —————
// ————— COFFEE → floating detailed mugs + star cluster —————
coffee: {
    init(p, w, h) {
      p.length = 0;
      const N    = 30;
      const base = Math.min(w, h);

      // 1) mugs
      for (let i = 0; i < N; i++) {
        const size = (base * (Math.random() * 0.03 + 0.02)) * 0.5;
        p.push({
          type:  'mug',
          x:     Math.random() * w,
          y:     Math.random() * h,
          vx:    (Math.random() - 0.5) * 0.3,
          vy:    (Math.random() - 0.5) * 0.3,
          size,
          angle: Math.random() * Math.PI * 2,
          aVel:  (Math.random() - 0.5) * 0.002 + 0.001
        });
      }

      // 2) stars
      const starCount = 60;
      for (let i = 0; i < starCount; i++) {
        p.push({
          type:  'star',
          x:     Math.random() * w,
          y:     Math.random() * h,
          r:     Math.random() * 1.2 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.005
        });
      }
    },

    draw(ctx, p, w, h) {
      // a) draw star cluster
      ctx.fillStyle = '#fff';
      for (let s of p) {
        if (s.type !== 'star') continue;
        s.phase += s.speed;
        ctx.globalAlpha = (Math.sin(s.phase) + 1) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // b) draw mugs
      for (let m of p) {
        if (m.type !== 'mug') continue;

        // move & wrap
        m.x += m.vx; m.y += m.vy; m.angle += m.aVel;
        if (m.x < -m.size)        m.x = w + m.size;
        else if (m.x > w + m.size) m.x = -m.size;
        if (m.y < -m.size)        m.y = h + m.size;
        else if (m.y > h + m.size) m.y = -m.size;

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);

        const s   = m.size;
        const mw  = s * 0.8;   // wider body
        const mh  = s;         // full height
        const rim = mh * 0.08; // rim thickness
        const fh  = mh * 0.25; // coffee fill height
        const mm  = s * 0.04;  // inner margin

        // 1. body
        ctx.fillStyle = '#fff';
        ctx.fillRect(-mw/2, -mh/2, mw, mh);

        // 2. coffee fill
        ctx.fillStyle = '#3b2f2f';
        ctx.fillRect(-mw/2 + mm, -mh/2 + rim + mm, mw - 2*mm, fh);

        // 3. rim highlight
        ctx.fillStyle = '#eee';
        ctx.fillRect(-mw/2, -mh/2, mw, rim);

        // 4. base ellipse
        ctx.beginPath();
        ctx.ellipse(0, mh/2, mw/2 * 0.9, rim, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ddd';
        ctx.fill();

        // 5. handle (ring)
        const hrOut = mh * 0.35;
        const hrIn  = hrOut * 0.6;
        const hx    = mw/2 + hrOut * 0.3;
        ctx.beginPath();
        ctx.arc(hx, 0, hrOut, -Math.PI/2, Math.PI/2);
        ctx.arc(hx, 0, hrIn,  Math.PI/2, -Math.PI/2, true);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.restore();
      }
    }
  },




    // ABOUT → twinkling stars
    about: {
      init(p, w, h) {
        p.length = 0;
        for (let i = 0; i < 100; i++) {
          p.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.2 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.05 + 0.02
          });
        }
      },
      draw(ctx, p, w, h) {
        ctx.fillStyle = '#fff';
        for (let star of p) {
          star.phase += star.speed;
          const alpha = (Math.sin(star.phase) + 1) * 0.4;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  // —————— Initialize all canvases ——————
  window.addEventListener('DOMContentLoaded', () => {
    setupPixelArtCanvas('exp-bg',    patterns.exp.init,    patterns.exp.draw);
    setupPixelArtCanvas('proj-bg',   patterns.proj.init,   patterns.proj.draw);
    setupPixelArtCanvas('edu-bg',    patterns.edu.init,    patterns.edu.draw);
    setupPixelArtCanvas('coffee-bg', patterns.coffee.init, patterns.coffee.draw);
    setupPixelArtCanvas('about-bg',  patterns.about.init,  patterns.about.draw);
  });


