/* bottom‑tab switcher + hero starfield */
(() => {
    /* TAB HANDLER */
    const tabbar = document.querySelector('.tabbar');
    const panels = document.querySelectorAll('.panel');

    tabbar.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;

      // highlight tab
      tabbar.querySelectorAll('.tab-btn')
            .forEach(b => b.classList.toggle('active', b === btn));

      // show panel
      const id = 'tab-' + btn.dataset.tab;
      panels.forEach(p => p.classList.toggle('active', p.id === id));

      // reset scroll of shown panel
      const panel = document.getElementById(id);
      if (panel) panel.scrollTop = 0;
    });

    /* STARFIELD */
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext?.('2d');
    if (!ctx) return;

    function resize(){
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      stars = Array.from({length:160}, () => ({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        z: Math.random()*1.5 + .5
      }));
    }
    let stars=[]; resize(); addEventListener('resize', resize);

    (function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#fff';
      stars.forEach(s=>{
        ctx.globalAlpha=s.z;
        ctx.fillRect(s.x,s.y,2,2);
        s.x-=.05*s.z; s.y+=.05*s.z;
        if(s.x<0||s.y>canvas.height){s.x=canvas.width;s.y=Math.random()*canvas.height;}
      });
      requestAnimationFrame(draw);
    })();
  })();
