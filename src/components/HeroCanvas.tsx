import { useEffect, useRef, useState } from 'react';

const NODES = [
  { l: 'MACRO',     x: 240, y: 90,  c: '#0ff0c8', r: 34 },
  { l: 'RESEARCH',  x: 390, y: 175, c: '#4d8aff', r: 28 },
  { l: 'QUANT',     x: 395, y: 305, c: '#a78bfa', r: 26 },
  { l: 'PORTFOLIO', x: 240, y: 395, c: '#f9fafb', r: 38 },
  { l: 'HEDGING',   x: 82,  y: 305, c: '#a78bfa', r: 26 },
  { l: 'REGIME',    x: 82,  y: 175, c: '#4d8aff', r: 28 },
];
const EDGES = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3],[1,3],[2,3],[4,3],[0,2],[5,2]];

interface HoveredNode { idx: number; x: number; y: number }

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const hovRef = useRef<HoveredNode | null>(null);
  const [tooltip, setTooltip] = useState<HoveredNode | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const W = 480, H = 480, cx = 240, cy = 240;
    let t = 0, raf: number;

    // Particle field
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      sz: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      c: Math.random() > 0.5 ? '#0ff0c8' : '#4d8aff',
    }));

    // Orbiting dots
    const orbs = Array.from({ length: 32 }, (_, i) => ({
      a: (i / 32) * Math.PI * 2,
      orb: 170 + Math.random() * 40,
      spd: 0.003 + Math.random() * 0.004,
      sz: 1 + Math.random() * 2,
      c: ['#0ff0c8', '#4d8aff', '#a78bfa'][Math.floor(Math.random() * 3)],
    }));

    function frame() {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      // Dark background
      ctx.fillStyle = 'rgba(8,12,20,0.92)';
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.025)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Radial glow center
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      grd.addColorStop(0, 'rgba(11,110,106,0.12)');
      grd.addColorStop(0.5, 'rgba(24,64,168,0.07)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);

      // Rings
      [170, 130, 90, 50].forEach((r, i) => {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.04 - i * 0.008})`;
        ctx.lineWidth = 1; ctx.stroke();
      });

      // Orbiting dots
      orbs.forEach(o => {
        o.a += o.spd;
        const x = cx + Math.cos(o.a) * o.orb;
        const y = cy + Math.sin(o.a) * o.orb;
        ctx.beginPath(); ctx.arc(x, y, o.sz, 0, Math.PI * 2);
        ctx.fillStyle = o.c + '40'; ctx.fill();
      });

      // Floating particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = p.c + Math.floor(p.alpha * 255).toString(16).padStart(2,'0');
        ctx.fill();
      });

      // Animated node positions
      const np = NODES.map((n, i) => ({
        x: n.x + Math.sin(t * 0.5 + i * 1.1) * 6,
        y: n.y + Math.cos(t * 0.4 + i * 0.9) * 6,
      }));

      const hov = hovRef.current;

      // Edges with glow pulse
      EDGES.forEach(([a, b]) => {
        const ax = np[a].x, ay = np[a].y, bx = np[b].x, by = np[b].y;
        const isHovEdge = hov && (hov.idx === a || hov.idx === b);
        
        // Edge glow
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = isHovEdge ? 'rgba(15,240,200,0.25)' : 'rgba(255,255,255,0.07)';
        ctx.lineWidth = isHovEdge ? 1.5 : 0.8; ctx.stroke();

        // Pulse dot
        const s = (Math.sin(t * 1.2 + a + b * 0.5) + 1) / 2;
        const px = ax + (bx - ax) * s, py = ay + (by - ay) * s;
        ctx.beginPath(); ctx.arc(px, py, isHovEdge ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isHovEdge ? '#0ff0c8cc' : NODES[a].c + '88'; ctx.fill();
      });

      // Nodes
      NODES.forEach((n, i) => {
        const x = np[i].x, y = np[i].y;
        const isHov = hov?.idx === i;
        const pulse = (Math.sin(t * 1.5 + i) + 1) / 2;

        // Outer glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, n.r + 24);
        glow.addColorStop(0, n.c + (isHov ? '30' : '18'));
        glow.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(x, y, n.r + 24, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();

        // Pulsing ring
        const pr = n.r + 10 + pulse * 6;
        ctx.beginPath(); ctx.arc(x, y, pr, 0, Math.PI * 2);
        ctx.strokeStyle = n.c + Math.floor(pulse * 40 + 10).toString(16).padStart(2, '0');
        ctx.lineWidth = 0.8; ctx.stroke();

        // Node fill
        const ng = ctx.createRadialGradient(x - n.r * 0.25, y - n.r * 0.25, 0, x, y, n.r);
        ng.addColorStop(0, 'rgba(30,38,52,0.98)');
        ng.addColorStop(1, 'rgba(12,16,26,0.98)');
        ctx.beginPath(); ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = ng; ctx.fill();

        // Node border
        ctx.strokeStyle = isHov ? n.c + 'cc' : n.c + '55';
        ctx.lineWidth = isHov ? 1.5 : 1; ctx.stroke();

        // Label
        ctx.font = `600 ${n.r > 32 ? 9.5 : 8.5}px 'DM Mono', monospace`;
        ctx.fillStyle = isHov ? n.c : n.c + 'cc';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.l, x, y);
      });

      raf = requestAnimationFrame(frame);
    }
    frame();

    // Mouse interaction
    function onMove(e: MouseEvent) {
      if (!cv) return;
      const rect = cv.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      const t2 = Date.now() / 1000 * 0.012 * 60; // approximate t
      let found: HoveredNode | null = null;
      NODES.forEach((n, i) => {
        const nx = n.x + Math.sin(t2 * 0.5 + i * 1.1) * 6;
        const ny = n.y + Math.cos(t2 * 0.4 + i * 0.9) * 6;
        if (Math.hypot(mx - nx, my - ny) < n.r + 10) {
          found = { idx: i, x: e.clientX - rect.left, y: e.clientY - rect.top };
        }
      });
      hovRef.current = found;
      setTooltip(found);
      if (cv) cv.style.cursor = found ? 'crosshair' : 'default';
    }
    function onLeave() { hovRef.current = null; setTooltip(null); }
    cv.addEventListener('mousemove', onMove);
    cv.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener('mousemove', onMove);
      cv.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const TOOLTIPS = ['Macro regime & cycle analysis','Fundamental research depth','Quantitative decision systems','Concentrated portfolio construction','Dynamic hedging & risk controls','Market regime classification'];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas ref={ref} width={480} height={480} style={{ display: 'block', maxWidth: '100%', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }} />
      {tooltip && (
        <div style={{ position: 'absolute', left: tooltip.x + 14, top: tooltip.y - 14, background: 'rgba(8,12,20,0.95)', border: '1px solid rgba(15,240,200,0.3)', borderRadius: 8, padding: '6px 12px', fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: '#0ff0c8', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10, backdropFilter: 'blur(8px)' }}>
          {TOOLTIPS[tooltip.idx]}
        </div>
      )}
    </div>
  );
}
