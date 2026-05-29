import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Label, Display, It, Body, Btn, PageFooter } from './UI';
import type { AppView } from '../types';

interface Props { setView: (v: AppView) => void; }

// ─────────────────────────────────────────────
// Animated hero background: pulse waves + grid
// ─────────────────────────────────────────────
function HeroBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    let t = 0, raf: number;
    function resize() { if(cv){cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;} }
    resize();
    window.addEventListener('resize', resize);
    function draw() {
      const W = cv!.width, H = cv!.height;
      ctx.clearRect(0, 0, W, H);
      // Grid
      ctx.strokeStyle = 'rgba(11,110,106,0.07)';
      ctx.lineWidth = 1;
      const gs = 64;
      for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      // Radial pulse waves from bottom-right cluster
      const cx = W * 0.82, cy = H * 0.5;
      [0, 0.33, 0.66].forEach((off) => {
        const prog = ((t * 0.4 + off) % 1);
        const r = prog * Math.min(W, H) * 0.7;
        const alpha = (1 - prog) * 0.18;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(11,110,106,${alpha})`;
        ctx.lineWidth = 1.5; ctx.stroke();
      });
      // Floating dots
      for (let _fi = 0; _fi < 18; _fi++) { const i = _fi;
        const px = (Math.sin(t * 0.3 + i * 2.1) * 0.4 + 0.5) * W;
        const py = (Math.cos(t * 0.2 + i * 1.7) * 0.4 + 0.5) * H;
        ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(11,110,106,${0.12 + Math.sin(t + i) * 0.06})`; ctx.fill();
      }
      t += 0.008;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

// ─────────────────────────────────────────────
// Flow diagram: Research → Analysis → Allocation → Risk
// ─────────────────────────────────────────────
function FlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const steps = ['Research', 'Analysis', 'Allocation', 'Risk Mgmt'];
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'center', flexWrap: 'wrap' }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: i * 0.18, duration: 0.55 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(11,110,106,0.07)',
              border: `1.5px solid rgba(11,110,106,${0.25 + i * 0.15})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'DM Mono',monospace", fontSize: '0.55rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--teal)', textAlign: 'center',
            }}>
              <span style={{ padding: '0 8px', lineHeight: 1.4 }}>{s}</span>
            </div>
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ delay: i * 0.18 + 0.35, duration: 0.4 }}
              style={{ width: 40, height: 1.5, background: 'linear-gradient(90deg,var(--teal),rgba(11,110,106,0.3))', transformOrigin: 'left', flexShrink: 0, margin: '0 4px' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Regime Wheel animation
// ─────────────────────────────────────────────
function RegimeWheel() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const W = 180, H = 180, cx = W / 2, cy = H / 2;
    let t = 0, raf: number;
    const segments = [
      { label: 'Expansion', color: '#0B6E6A', a: 0 },
      { label: 'Consolidation', color: '#1840A8', a: (Math.PI * 2) / 3 },
      { label: 'Correction', color: '#888', a: (Math.PI * 4) / 3 },
    ];
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const rot = t * 0.4;
      segments.forEach((seg, i) => {
        const start = seg.a + rot, end = start + (Math.PI * 2) / 3 - 0.06;
        const active = i === Math.floor(((t * 0.15) % 3));
        const r = active ? 76 : 68;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, end);
        ctx.closePath();
        ctx.fillStyle = seg.color + (active ? 'cc' : '44');
        ctx.fill();
        if (active) {
          ctx.strokeStyle = seg.color; ctx.lineWidth = 2; ctx.stroke();
        }
      });
      // Center dot
      ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'var(--bg)'; ctx.fill();
      ctx.strokeStyle = 'rgba(11,110,106,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();
      // Label
      ctx.font = "500 9px 'DM Mono', monospace";
      ctx.fillStyle = 'var(--teal)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('REGIME', cx, cy);
      t += 0.02;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} width={180} height={180} style={{ display: 'block' }} />;
}

// ─────────────────────────────────────────────
// Portfolio node cluster
// ─────────────────────────────────────────────
function PortfolioNodes() {
  const ref = useRef<HTMLCanvasElement>(null);
  const wRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wRef, { once: false, margin: '-60px' });
  const phaseRef = useRef(0);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const W = 180, H = 180, cx = W / 2, cy = H / 2;
    let t = 0, raf: number;
    const N = 13;
    const nodes = Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      const r = i === 0 ? 0 : 62 + (i % 3) * 12;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, r: i === 0 ? 14 : 6 + (i % 2) * 2 };
    });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const phase = phaseRef.current;
      const visible = Math.min(N, Math.floor(phase * N * 1.2));
      // Edges
      for (let i = 1; i < visible; i++) {
        ctx.beginPath(); ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(nodes[i].x, nodes[i].y);
        ctx.strokeStyle = `rgba(11,110,106,${0.12 + Math.sin(t + i) * 0.04})`; ctx.lineWidth = 1; ctx.stroke();
      }
      // Nodes
      for (let ni = 0; ni < visible; ni++) {
        const n = nodes[ni];
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = ni === 0 ? 'rgba(11,110,106,0.85)' : `rgba(11,110,106,${0.15 + Math.sin(t * 0.8 + ni) * 0.07})`;
        ctx.fill();
        if (ni > 0) { ctx.strokeStyle = 'rgba(11,110,106,0.35)'; ctx.lineWidth = 1; ctx.stroke(); }
        if (ni === 0) {
          ctx.font = "600 8px 'DM Mono', monospace";
          ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('CORE', n.x, n.y);
        }
      }
      t += 0.015;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!inView) { phaseRef.current = 0; return; }
    let frame = 0;
    const id = setInterval(() => { phaseRef.current = Math.min(1, frame / 60); frame++; if (frame > 60) clearInterval(id); }, 16);
    return () => clearInterval(id);
  }, [inView]);
  return <div ref={wRef}><canvas ref={ref} width={180} height={180} style={{ display: 'block' }} /></div>;
}

// ─────────────────────────────────────────────
// Probability network
// ─────────────────────────────────────────────
function ProbNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const W = 180, H = 180;
    let t = 0, raf: number;
    const pts = Array.from({ length: 9 }, (_, i) => ({
      x: 20 + (i % 3) * 70, y: 20 + Math.floor(i / 3) * 70,
      phase: i * 0.7,
    }));
    function draw() {
      ctx.clearRect(0, 0, W, H);
      // Connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y;
          if (Math.hypot(dx, dy) < 100) {
            const pulse = (Math.sin(t + pts[i].phase) + 1) / 2;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(11,110,106,${0.08 + pulse * 0.14})`; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      pts.forEach((p, i) => {
        const pulse = (Math.sin(t * 1.2 + p.phase) + 1) / 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(11,110,106,${0.3 + pulse * 0.4})`; ctx.fill();
        // Probability label
        ctx.font = "500 7px 'DM Mono',monospace";
        ctx.fillStyle = `rgba(11,110,106,${0.5 + pulse * 0.3})`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(`${55 + i * 5}%`, p.x, p.y + 9);
      });
      t += 0.018;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} width={180} height={180} style={{ display: 'block' }} />;
}

// ─────────────────────────────────────────────
// Capital flow process timeline
// ─────────────────────────────────────────────
function ProcessFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });
  const steps = [
    { n: '01', title: 'Idea Generation', items: ['Proprietary quantitative screeners', 'Secondary research', 'Opportunity discovery'] },
    { n: '02', title: 'Fundamental Analysis', items: ['Business quality assessment', 'Promoter evaluation', 'Financial analysis'] },
    { n: '03', title: 'Valuation', items: ['DCF analysis', 'Relative valuation', 'Risk-reward assessment'] },
    { n: '04', title: 'Investment Decision', items: ['Position sizing', 'Portfolio integration', 'Long-term monitoring'] },
  ];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Connecting line */}
      <div style={{ position: 'absolute', top: 36, left: '12.5%', right: '12.5%', height: 1.5, background: 'linear-gradient(90deg, transparent, var(--teal), transparent)', opacity: 0.2 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          >
            {/* Step node */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--bg-card)',
                border: `2px solid rgba(11,110,106,${0.2 + i * 0.2})`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 1,
              }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--teal)', textTransform: 'uppercase' }}>{s.n}</div>
              </div>
            </div>
            {/* Card */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderTop: '2.5px solid var(--teal)', borderRadius: 14, padding: '1.4rem 1.2rem',
            }}>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: '1.15rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '1rem', lineHeight: 1.2 }}>{s.title}</div>
              {s.items.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--teal)', marginTop: 6, flexShrink: 0 }} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>{item}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Animated capital dot flowing along line */}
      <motion.div
        initial={{ left: '12.5%', opacity: 0 }}
        animate={inView ? { left: ['12.5%', '87.5%'], opacity: [0, 1, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 2.2, delay: 0.6, repeat: Infinity, repeatDelay: 3 }}
        style={{ position: 'absolute', top: 30, width: 12, height: 12, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 12px rgba(11,110,106,0.5)' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Portfolio node visual (large section)
// ─────────────────────────────────────────────
function LargePortfolioViz() {
  const ref = useRef<HTMLCanvasElement>(null);
  const wRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wRef, { once: false, margin: '-60px' });
  const progressRef = useRef(0);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const W = 420, H = 340, cx = W / 2, cy = H / 2;
    let t = 0, raf: number;
    const N = 14;
    const nodes = [{ x: cx, y: cy, r: 22, label: 'CORE' }];
    for (let i = 1; i < N; i++) {
      const angle = ((i - 1) / (N - 1)) * Math.PI * 2 - Math.PI / 2;
      const ring = i <= 7 ? 100 : 155;
      nodes.push({ x: cx + Math.cos(angle) * ring, y: cy + Math.sin(angle) * ring, r: 8 + (i % 3) * 3, label: '' });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const vis = Math.min(N, Math.floor(progressRef.current * N * 1.1));
      // Ring guides
      [100, 155].forEach(r => {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(11,110,106,0.07)'; ctx.lineWidth = 1; ctx.stroke();
      });
      // Edges
      for (let i = 1; i < vis; i++) {
        ctx.beginPath(); ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(nodes[i].x, nodes[i].y);
        ctx.strokeStyle = `rgba(11,110,106,${0.1 + Math.sin(t + i * 0.5) * 0.04})`; ctx.lineWidth = 1; ctx.stroke();
        if (i > 7) {
          ctx.beginPath(); ctx.moveTo(nodes[i - 7].x, nodes[i - 7].y); ctx.lineTo(nodes[i].x, nodes[i].y);
          ctx.strokeStyle = 'rgba(11,110,106,0.06)'; ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
      // Nodes
      nodes.slice(0, vis).forEach((n, i) => {
        const pulse = (Math.sin(t * 0.9 + i * 0.8) + 1) / 2;
        if (i === 0) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r + 10);
          g.addColorStop(0, 'rgba(11,110,106,0.15)'); g.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 10, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = 'var(--teal)'; ctx.fill();
          ctx.font = "600 7px 'DM Mono',monospace"; ctx.fillStyle = '#fff';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CORE', n.x, n.y);
        } else {
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + pulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(11,110,106,${0.08 + pulse * 0.06})`; ctx.fill();
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(11,110,106,${0.25 + pulse * 0.15})`;
          ctx.strokeStyle = 'rgba(11,110,106,0.4)'; ctx.lineWidth = 1;
          ctx.fill(); ctx.stroke();
        }
      });
      t += 0.012;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => {
    if (!inView) { progressRef.current = 0; return; }
    let f = 0;
    const id = setInterval(() => { progressRef.current = Math.min(1, f / 70); f++; if (f > 70) clearInterval(id); }, 16);
    return () => clearInterval(id);
  }, [inView]);
  return <div ref={wRef}><canvas ref={ref} width={420} height={340} style={{ display: 'block', maxWidth: '100%' }} /></div>;
}

// ─────────────────────────────────────────────
// Risk Allocation animated layers
// ─────────────────────────────────────────────
function RiskLayers() {
  const ref = useRef<HTMLCanvasElement>(null);
  const wRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wRef, { once: false, margin: '-60px' });
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const W = 360, H = 220;
    let t = 0, raf: number;
    const layers = [
      { label: 'Market Conditions', color: '#0B6E6A', y: 44 },
      { label: 'Risk Assessment',   color: '#1840A8', y: 110 },
      { label: 'Portfolio Adjust.', color: '#555',    y: 176 },
    ];
    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (!inView) { raf = requestAnimationFrame(draw); return; }
      layers.forEach((l, i) => {
        const barW = (0.4 + 0.25 * Math.sin(t * 0.6 + i * 1.1)) * (W - 120);
        const alpha = 0.7 + 0.15 * Math.sin(t * 0.8 + i);
        // Track
        ctx.beginPath(); ctx.roundRect(100, l.y - 10, W - 110, 22, 6);
        ctx.fillStyle = 'rgba(0,0,0,0.04)'; ctx.fill();
        // Bar
        ctx.beginPath(); ctx.roundRect(100, l.y - 10, barW, 22, 6);
        ctx.fillStyle = l.color + Math.round(alpha * 255).toString(16).padStart(2, '0'); ctx.fill();
        // Arrow connector
        if (i < layers.length - 1) {
          ctx.beginPath(); ctx.moveTo(W / 2, l.y + 14); ctx.lineTo(W / 2, layers[i + 1].y - 12);
          ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
        }
        // Label
        ctx.font = "400 9.5px 'DM Mono',monospace"; ctx.fillStyle = 'var(--ink-3)';
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(l.label, 92, l.y + 1);
      });
      t += 0.016;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [inView]);
  return <div ref={wRef}><canvas ref={ref} width={360} height={220} style={{ display: 'block', maxWidth: '100%' }} /></div>;
}

// ─────────────────────────────────────────────
// Pillar card (interactive, hover reveals)
// ─────────────────────────────────────────────
function PillarCard({ n, title, body, detail }: { n: string; title: string; body: string; detail: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hov ? 'rgba(11,110,106,0.35)' : 'var(--border)'}`,
        borderRadius: 18, padding: '2.2rem 2rem',
        transition: 'all 0.38s cubic-bezier(.22,.8,.4,1)',
        transform: hov ? 'translateY(-8px)' : 'none',
        boxShadow: hov ? '0 24px 70px rgba(11,110,106,0.1), 0 4px 16px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.03)',
        cursor: 'default', position: 'relative', overflow: 'hidden', minHeight: 220,
      }}
    >
      {/* Teal glow on hover */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11,110,106,0.12) 0%, transparent 70%)', opacity: hov ? 1 : 0, transition: 'opacity 0.38s', pointerEvents: 'none' }} />
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '1.2rem', opacity: 0.7 }}>Pillar {n}</div>
      <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: '1.35rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem' }}>{title}</div>
      <div style={{ fontSize: '0.83rem', color: 'var(--ink-3)', lineHeight: 1.75, transition: 'opacity 0.3s', opacity: hov ? 0 : 1 }}>{body}</div>
      {/* Reveal layer */}
      <div style={{ position: 'absolute', inset: 0, padding: '2.2rem 2rem', background: 'var(--bg-card)', opacity: hov ? 1 : 0, transition: 'opacity 0.35s', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '0.7rem', opacity: 0.7 }}>Approach</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.8 }}>{detail}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Alignment card
// ─────────────────────────────────────────────
function AlignCard({ n, title, body }: { n: string; title: string; body: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 18, padding: '2rem 1.8rem',
        transition: 'all 0.3s cubic-bezier(.22,.8,.4,1)',
        transform: hov ? 'translateY(-5px)' : 'none',
        boxShadow: hov ? '0 16px 44px rgba(0,0,0,0.07)' : 'none',
      }}
    >
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '1.4rem', opacity: 0.65 }}>{n.padStart(2, '0')}</div>
      <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: '1.2rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.25, marginBottom: '0.8rem' }}>{title}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--ink-3)', lineHeight: 1.75 }}>{body}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Strategic Advantage card
// ─────────────────────────────────────────────
function AdvantageCard({ title, body, visual, delay }: { title: string; body: string; visual: React.ReactNode; delay: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.65 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 22, overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(.22,.8,.4,1)',
        transform: hov ? 'translateY(-6px)' : 'none',
        boxShadow: hov ? '0 28px 80px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {/* Visual zone */}
      <div style={{ height: 200, background: 'rgba(11,110,106,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>
        {visual}
      </div>
      {/* Text */}
      <div style={{ padding: '1.8rem 1.8rem' }}>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: '1.3rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.75rem' }}>{title}</div>
        <div style={{ fontSize: '0.83rem', color: 'var(--ink-3)', lineHeight: 1.75 }}>{body}</div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Philosophy flow (right side animation)
// ─────────────────────────────────────────────
function PhilosophyFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const items = ['Market Regime', 'Research', 'Decision', 'Capital Allocation'];
  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, i) => (
        <React.Fragment key={item}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderLeft: `3px solid rgba(11,110,106,${0.3 + i * 0.2})`,
              borderRadius: 12, padding: '1rem 1.4rem',
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `rgba(11,110,106,${0.08 + i * 0.08})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono',monospace", fontSize: '0.55rem', color: 'var(--teal)', flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 400, color: 'var(--ink)' }}>{item}</div>
          </motion.div>
          {i < items.length - 1 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: i * 0.2 + 0.3, duration: 0.3 }}
              style={{ width: 1.5, height: 28, background: 'linear-gradient(to bottom, var(--teal), transparent)', marginLeft: 56, opacity: 0.4, transformOrigin: 'top' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Section divider with animated line
// ─────────────────────────────────────────────
function SectionDivider() {
  return (
    <div style={{ padding: '0 5vw', margin: '20px 0' }}>
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }} style={{ height: 1, background: 'var(--border)', transformOrigin: 'left' }} />
    </div>
  );
}

const wv = (i = 0) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.1, duration: 0.65 } });

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function FundView({ setView }: Props) {
  return (
    <div>

      {/* ═══════════════════════════════════════
          SECTION 1 · HERO
      ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', paddingTop: 140, paddingBottom: 100, padding: '140px 5vw 100px', overflow: 'hidden', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <HeroBg />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 880 }}>
          <motion.div {...wv(0)}>
            <Label>Super Performance Series I</Label>
          </motion.div>
          <motion.div {...wv(0.5)}>
            <Display size="xl" style={{ marginBottom: '2rem', lineHeight: 1.0 }}>
              The Super Performance<br />Series I <It>Framework</It>
            </Display>
          </motion.div>
          <motion.div {...wv(1)}>
            <Body style={{ maxWidth: 620, fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '3rem' }}>
              An institutionally disciplined investment approach that integrates fundamental research, quantitative intelligence, and adaptive portfolio management to identify high-conviction opportunities across market cycles.
            </Body>
          </motion.div>
          <motion.div {...wv(1.5)} style={{ marginBottom: '5rem' }}>
            <FlowDiagram />
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════
          SECTION 2 · PHILOSOPHY
      ══════════════════════════════════════════ */}
      <section style={{ padding: '100px 5vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '8vw', alignItems: 'center' }}>
          <motion.div {...wv(0)}>
            <Label>Investment Philosophy</Label>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              "We believe exceptional returns are generated through disciplined research, intelligent capital allocation, and the ability to adapt across{' '}
              <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>market cycles.</em>"
            </div>
          </motion.div>
          <motion.div {...wv(0.3)}>
            <PhilosophyFlow />
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════
          SECTION 3 · THREE STRATEGIC ADVANTAGES
      ══════════════════════════════════════════ */}
      <section style={{ padding: '100px 5vw' }}>
        <motion.div {...wv(0)} style={{ marginBottom: '3.5rem' }}>
          <Label>Three Strategic Advantages</Label>
          <Display size="lg" style={{ maxWidth: 520 }}>
            What sets our approach <It>apart.</It>
          </Display>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <AdvantageCard
            delay={0}
            title="Dynamic Market Regime Investing"
            body="Capital allocation adapts to changing market environments through proprietary regime assessment and tactical positioning across expansion, consolidation, and correction cycles."
            visual={<RegimeWheel />}
          />
          <AdvantageCard
            delay={0.12}
            title="Concentrated High-Conviction Portfolio"
            body="A focused portfolio of approximately 12–15 carefully selected opportunities backed by deep research and disciplined position sizing for maximum alpha potential."
            visual={<PortfolioNodes />}
          />
          <AdvantageCard
            delay={0.24}
            title="Quantitative Intelligence, Human Judgment"
            body="Probabilistic models and proprietary analytics support investment decisions while maintaining a fundamentally research-driven, actively managed approach."
            visual={<ProbNetwork />}
          />
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════
          SECTION 4 · FOUR PILLARS
      ══════════════════════════════════════════ */}
      <section style={{ padding: '100px 5vw' }}>
        <motion.div {...wv(0)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6vw', alignItems: 'end', marginBottom: '3.5rem' }}>
          <div>
            <Label>The Quantamental Edge</Label>
            <Display size="lg">Four pillars of our<br /><It>investment discipline.</It></Display>
          </div>
          <Body style={{ maxWidth: 400 }}>
            Each pillar works in concert — no single system drives decisions. The intersection of all four is where conviction is formed.
          </Body>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { n: '1', title: 'Market Regime Intelligence', body: 'Assessing macro, liquidity, valuation, and market structure to understand prevailing conditions.', detail: 'Three-state regime model — Expansion, Consolidation, Correction — drives net portfolio exposure and asset class allocation in real time.' },
            { n: '2', title: 'Quantitative Analytics', body: 'Leveraging proprietary screeners, probabilistic models, and data-driven insights for decision support.', detail: 'Proprietary quantitative screens identify opportunity sets. Probability-weighted models validate sizing and conviction scores across every position.' },
            { n: '3', title: 'Fundamental Research', body: 'Evaluating business quality, growth potential, management capability, and financial strength.', detail: 'Deep bottom-up research on competitive moats, RoE trajectories, balance sheet quality, and promoter track records underpins every holding.' },
            { n: '4', title: 'Dynamic Capital Allocation', body: 'Rotating capital towards opportunities with superior risk-reward while managing downside exposure.', detail: 'Flexible 0–100% mandate across equity, debt, cash, and derivatives. Capital is deployed only when reward-to-risk thresholds are met.' },
          ].map((p, i) => (
            <motion.div key={p.n} {...wv(i * 0.12)}>
              <PillarCard {...p} />
            </motion.div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════
          SECTION 5 · RESEARCH PROCESS
      ══════════════════════════════════════════ */}
      <section style={{ padding: '100px 5vw' }}>
        <motion.div {...wv(0)} style={{ marginBottom: '4rem' }}>
          <Label>Research Process</Label>
          <Display size="lg" style={{ maxWidth: 520 }}>From idea to <It>conviction.</It></Display>
        </motion.div>
        <ProcessFlow />
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════
          SECTION 6 · PORTFOLIO CONSTRUCTION
      ══════════════════════════════════════════ */}
      <section style={{ padding: '100px 5vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8vw', alignItems: 'center' }}>
          <motion.div {...wv(0)}>
            <Label>Portfolio Construction</Label>
            <Display size="lg" style={{ marginBottom: '1.4rem' }}>
              Focused.<br />Disciplined.<br /><It>Adaptive.</It>
            </Display>
            <Body style={{ marginBottom: '2.5rem' }}>
              The portfolio typically consists of 12–15 high-conviction positions with disciplined exposure management and active monitoring across full market cycles.
            </Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Concentrated Investing', 'Maximum alpha through focus, not diversification'],
                ['10% Single-Stock Cap', 'Disciplined position sizing protects downside'],
                ['Long-Term Ownership', 'Holding horizon aligned with business value creation'],
                ['Dynamic Rotation', 'Active reallocation as conviction evolves'],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', marginTop: 7, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--ink)' }}>{title}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--ink-3)' }}> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...wv(0.3)} style={{ display: 'flex', justifyContent: 'center' }}>
            <LargePortfolioViz />
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════
          SECTION 7 · RISK & CAPITAL ALLOCATION
      ══════════════════════════════════════════ */}
      <section style={{ padding: '100px 5vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8vw', alignItems: 'center' }}>
          <motion.div {...wv(0)} style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
              <RiskLayers />
              {/* Dimension labels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 20 }}>
                {[['Tactical Hedging', 'Systematic downside protection'], ['Cash Flexibility', '0–100% allocation range'], ['Regime Adaptation', 'Macro-driven exposure shifts'], ['Exposure Mgmt', 'Dynamic gross / net control']].map(([t, d]) => (
                  <div key={t} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.9rem 1rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink)', marginBottom: 3 }}>{t}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-3)', lineHeight: 1.5 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div {...wv(0.3)}>
            <Label>Risk & Capital Allocation</Label>
            <Display size="lg" style={{ marginBottom: '1.4rem' }}>
              Intelligent risk.<br /><It>Adaptive capital.</It>
            </Display>
            <Body style={{ marginBottom: '2rem' }}>
              Risk management is not a constraint on returns — it is the foundation of them. Every allocation decision integrates a rigorous assessment of downside risk, regime probability, and portfolio-level exposure.
            </Body>
            <Body>
              The framework is dynamic. As market conditions evolve, capital is reallocated — hedges are adjusted, cash is deployed or preserved, and gross exposure shifts to reflect the prevailing risk-reward environment.
            </Body>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════
          SECTION 8 · LONG-TERM ALIGNMENT
      ══════════════════════════════════════════ */}
      <section style={{ padding: '100px 5vw' }}>
        <motion.div {...wv(0)} style={{ marginBottom: '3.5rem' }}>
          <Label>Built Around Long-Term Alignment</Label>
          <Display size="lg" style={{ maxWidth: 520 }}>
            Structured for enduring <It>partnership.</It>
          </Display>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { n: '1', title: 'Investor Alignment', body: 'Structured around long-term wealth creation with aligned incentives that reward sustainable outperformance, not short-term results.' },
            { n: '2', title: 'Active Stewardship', body: 'Continuous research, portfolio monitoring, and proactive management across full market cycles and changing environments.' },
            { n: '3', title: 'Flexible Participation', body: 'Designed around sophisticated investor needs while maintaining institutional standards, governance, and operational rigour.' },
            { n: '4', title: 'Long-Term Partnership', body: 'Focused on building enduring capital relationships with investors who share our conviction in disciplined, research-led investing.' },
          ].map((c, i) => (
            <motion.div key={c.n} {...wv(i * 0.1)}>
              <AlignCard {...c} />
            </motion.div>
          ))}
        </div>
        <motion.div {...wv(0.5)} style={{ display: 'flex', gap: '1rem', marginTop: '3.5rem', justifyContent: 'center' }}>
          <Btn onClick={() => setView('contact')}>Investor Inquiry</Btn>
          <Btn variant="outline" onClick={() => setView('strategy')}>View Strategy</Btn>
        </motion.div>
      </section>

      <PageFooter disc="Super Performance Series I is a Category III Alternative Investment Fund. SEBI Registered. For eligible investors only. Past performance is not indicative of future results. Capital at risk." />
    </div>
  );
}
