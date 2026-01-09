/* =============================
       CONECTORES (canvas) - FUERTES
       ============================= */
    (function(){
      const canvas = document.getElementById('net');
      const ctx = canvas.getContext('2d', { alpha:true });

      let w=0,h=0,dpr=1;
      let pts=[];
const cfg = {
  density: 14000,   // más alto = menos puntos (menos “nido”)
  minPts: 42,
  maxPts: 70,

  linkDist: 220,    // distancia para que sí haya líneas
  maxLinks: 3,      // ✅ CLAVE: máximo de conexiones por punto

  drift: 0.08,
  lineW: 1.0,
  dotR: 1.4,
  baseAlpha: 0.22   // ✅ tenue (antes 0.58 era telaraña)
};


      function resize(){
        const r = canvas.getBoundingClientRect();
        dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        w = Math.floor(r.width);
        h = Math.floor(r.height);
        canvas.width = Math.floor(w*dpr);
        canvas.height = Math.floor(h*dpr);
        canvas.style.width = w+'px';
        canvas.style.height = h+'px';
        ctx.setTransform(dpr,0,0,dpr,0,0);

        const target = Math.max(cfg.minPts, Math.min(cfg.maxPts, Math.round((w*h)/cfg.density)));
        pts = new Array(target).fill(0).map(()=>({
          x: Math.random()*w,
          y: Math.random()*h,
          vx:(Math.random()*2-1)*cfg.drift,
          vy:(Math.random()*2-1)*cfg.drift
        }));
      }

      function draw(){
        ctx.clearRect(0,0,w,h);
        ctx.lineWidth = cfg.lineW;
        ctx.fillStyle = "rgba(255,255,255,0.90)";

        for(const p of pts){
          p.x += p.vx;
          p.y += p.vy;
          if(p.x<0||p.x>w) p.vx *= -1;
          if(p.y<0||p.y>h) p.vy *= -1;
        }

        for(let i=0;i<pts.length;i++){
          const a=pts[i];
          ctx.beginPath();
          ctx.arc(a.x,a.y,cfg.dotR,0,Math.PI*2);
          ctx.fill();

          for(let j=i+1;j<pts.length;j++){
            const b=pts[j];
            const dx=a.x-b.x, dy=a.y-b.y;
            const dist = Math.hypot(dx,dy);
           if (dist < cfg.linkDist) {
  // recorta líneas para que NO se vea telaraña
  if (Math.random() > cfg.linkChance) continue;

  const alpha = (1 - dist / cfg.linkDist) * cfg.baseAlpha;

  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

          }
        }
        requestAnimationFrame(draw);
      }

      window.addEventListener('resize', resize, { passive:true });
      resize();
      draw();
    })();
