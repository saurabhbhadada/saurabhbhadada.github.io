(() => {
    /* -------- Tab Switching & Starfield -------- */
    const tabbar = document.querySelector('.tabbar');
    const panels = document.querySelectorAll('.panel');

    tabbar.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      tabbar.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
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
