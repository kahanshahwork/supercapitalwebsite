import { motion } from 'framer-motion';
import {
  Label, Display, It, Body, Card, Grid, TwoCol, Section, PageFooter,
} from './UI';
import RegimeWheel from './RegimeWheel';

const REGIME_ITEMS = [
  { dot: 'var(--teal)',    title: 'Expansion',    body: 'Full equity deployment. High conviction, growth-oriented positioning.' },
  { dot: '#B8860B',        title: 'Consolidation', body: 'Selective allocation. Partial hedges, increased selectivity.' },
  { dot: 'var(--blue)',    title: 'Correction',   body: 'Defensive posture. Elevated cash, derivatives hedging.' },
];

const TOP_DOWN = ['Economic cycle mapping','Sector rotation signals','Liquidity & credit conditions','Global capital flow monitoring'];
const BOT_UP   = ['Business quality & moat assessment','Return on Equity (RoE) trajectory','Balance sheet & capital efficiency','Management quality & alignment'];

const CONSTRAINTS = [
  { val: '10%',   lbl: 'Single stock cap',      c: 'var(--teal)' },
  { val: '2×',    lbl: 'Max gross exposure',     c: 'var(--blue)' },
  { val: '12–15', lbl: 'Max positions',          c: 'var(--ink)' },
  { val: 'India', lbl: 'Primary mandate',        c: 'var(--ink)' },
];

const fade = (i=0) => ({ initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{delay:i*0.1,duration:0.6} });

export default function StrategyView() {
  return (
    <div>
      <Section style={{ paddingTop: 120 }}>

        {/* Page heading */}
        <motion.div {...fade()}>
          <Label>Strategy — Super Performance Series I</Label>
          <Display size="xl" style={{ marginBottom:'1.4rem' }}>
            Concentrated.<br /><It>Conviction-driven.</It>
          </Display>
          <Body style={{ maxWidth: 540, marginBottom:'4rem' }}>
            12–15 high-conviction positions. Dual top-down and bottom-up research. Dynamic regime-aware allocation with disciplined risk controls.
          </Body>
        </motion.div>

        {/* ── Market Regime ── */}
        <div style={{ marginBottom:'4rem' }}>
          <motion.div {...fade(1)}>
            <Label>Market Regime Assessment</Label>
            <TwoCol ratio="1fr 1fr" gap="6vw" style={{ alignItems:'center' }}>
              <div>
                <Display size="md" style={{ marginBottom:'1rem' }}>
                  Three-state<br /><It>market model.</It>
                </Display>
                <Body style={{ marginBottom:'1.5rem' }}>
                  Portfolio construction adapts dynamically — no fixed allocations across market cycles.
                </Body>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {REGIME_ITEMS.map(r => (
                    <Card key={r.title} style={{ padding:'1.2rem', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:r.dot, marginTop:6, flexShrink:0 }} />
                      <div>
                        <div style={{ fontSize:'0.9rem', fontWeight:500, marginBottom:2 }}>{r.title}</div>
                        <div style={{ fontSize:'0.78rem', color:'var(--ink-3)' }}>{r.body}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
                <RegimeWheel />
              </div>
            </TwoCol>
          </motion.div>
        </div>

        {/* ── Dual Research ── */}
        <div style={{ marginBottom:'4rem' }}>
          <motion.div {...fade(2)}>
            <Label>Dual Research Framework</Label>
            <TwoCol ratio="1fr 1fr" gap="14px">
              <ResearchCol title="Top-Down Analysis" color="var(--teal)" items={TOP_DOWN} />
              <ResearchCol title="Bottom-Up Analysis" color="var(--blue)" items={BOT_UP} />
            </TwoCol>
          </motion.div>
        </div>

        {/* ── Portfolio Constraints ── */}
        <div style={{ marginBottom:'2rem' }}>
          <motion.div {...fade(3)}>
            <Label>Portfolio Constraints</Label>
            <Grid cols={4} gap={14}>
              {CONSTRAINTS.map((c, i) => (
                <motion.div key={c.lbl} {...fade(i * 0.5)}>
                  <Card style={{ textAlign:'center', padding:'2rem 1rem' }}>
                    <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:'2rem', color:c.c, lineHeight:1, marginBottom:6 }}>{c.val}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--ink-3)', lineHeight:1.5 }}>{c.lbl}</div>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          </motion.div>
        </div>

      </Section>

      <PageFooter disc="Strategy descriptions are informational only. Not a guarantee of returns. SEBI Cat. III AIF." />
    </div>
  );
}

/* ── research column sub-component ── */
function ResearchCol({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div style={{ background:'var(--bg-card)', border:`1px solid var(--border)`, borderTop:`3px solid ${color}`, borderRadius:16, padding:'1.8rem 1.6rem' }}>
      <div style={{ fontSize:'1rem', fontWeight:500, color, marginBottom:'1.2rem' }}>{title}</div>
      <div style={{ borderTop:'1px solid var(--border)' }}>
        {items.map(item => (
          <div key={item} style={{ display:'flex', gap:'1rem', padding:'0.7rem 0', borderBottom:'1px solid var(--border)' }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.62rem', color:'var(--ink-3)', minWidth:16 }}>—</span>
            <span style={{ fontSize:'0.85rem', color:'var(--ink-2)' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
