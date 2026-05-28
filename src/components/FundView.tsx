import { motion } from 'framer-motion';
import { Target, Zap, Lock, BarChart2 } from 'lucide-react';
import type { AppView } from '../types';
import {
  Label, Display, It, Body,
  Grid, TwoCol, Section, Step, FeeTable, PageFooter,
} from './UI';

interface Props { setView: (v: AppView) => void; }

const FIXED_FEES:   [string,string][] = [['₹1 Cr – ₹2 Cr','2.50%'],['₹2 Cr – ₹4 Cr','2.00%'],['₹4 Cr & above','1.75%']];
const HYBRID_FEES:  [string,string][] = [['₹1 Cr – ₹2 Cr','2.00% + 20%'],['₹2 Cr – ₹4 Cr','1.75% + 20%'],['₹4 Cr & above','1.50% + 20%']];

const STEPS = [
  ['01','Submit Inquiry',           'Initial contact via investor inquiry form.'],
  ['02','Eligibility Review',       'SEBI accreditation and net-worth verification.'],
  ['03','Documentation',            'PAN, Aadhaar, address proof, bank proof.'],
  ['04','KYC / AML',               'Identity and anti-money-laundering checks.'],
  ['05','Contribution Agreement',   'Execution of legal commitment documentation.'],
  ['06','Activation',               'Capital call, unit allotment, portal access.'],
];

// USP cards for Series I
const SERIES_USP = [
  { icon: <Target size={20}/>, color:'var(--teal)', bg:'var(--teal-bg)', title:'Concentrated Portfolio', body:'12–15 high-conviction positions for maximum alpha generation.' },
  { icon: <Zap size={20}/>,    color:'var(--blue)', bg:'var(--blue-bg)', title:'Flexible Allocation', body:'0–100% mandate. Cash, equity, debt, derivatives — deployed on conviction.' },
  { icon: <Lock size={20}/>,   color:'var(--teal)', bg:'var(--teal-bg)', title:'Absolute Return Focus', body:'Not benchmarked. Every decision targets absolute capital appreciation.' },
  { icon: <BarChart2 size={20}/>, color:'var(--blue)', bg:'var(--blue-bg)', title:'Regime-Aware', body:'Three-state market model drives allocation — Expansion, Consolidation, Correction.' },
];

const fade = (i=0) => ({ initial:{ opacity:0, y:20 }, whileInView:{ opacity:1, y:0 }, viewport:{ once:true }, transition:{ delay:i*0.1, duration:0.6 } });

export default function FundView({ setView: _ }: Props) {
  return (
    <div>
      <Section style={{ paddingTop: 120 }}>

        {/* Page heading */}
        <motion.div {...fade()}>
          <Label>Our Fund</Label>
          <Display size="xl" style={{ marginBottom: '1.4rem' }}>
            Super <It>Performance</It><br />Series I
          </Display>
          <Body style={{ maxWidth: 540, marginBottom: '4rem' }}>
            A Category III Alternative Investment Fund deploying concentrated, research-led strategies across India's capital markets with dynamic risk overlays.
          </Body>
        </motion.div>

        {/* ── USP Cards (replace stats) ── */}
        <motion.div {...fade(1)}>
          <Label>Fund Highlights</Label>
          <Grid cols={4} gap={14}>
            {SERIES_USP.map((u, i) => (
              <motion.div key={u.title} {...fade(i * 0.5)}>
                <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:'1.6rem 1.4rem' }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:u.bg,color:u.color,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1.1rem' }}>{u.icon}</div>
                  <div style={{ fontSize:'0.95rem',fontWeight:500,color:'var(--ink)',marginBottom:'0.45rem' }}>{u.title}</div>
                  <div style={{ fontSize:'0.78rem',color:'var(--ink-3)',lineHeight:1.65 }}>{u.body}</div>
                </div>
              </motion.div>
            ))}
          </Grid>
        </motion.div>

        {/* ── Fee Structure (hurdle, HWM, etc. all here) ── */}
        <div style={{ marginTop: '5rem' }}>
          <motion.div {...fade(2)}>
            <Label>Fee Structure</Label>
            <Display size="md" style={{ marginBottom:'0.8rem' }}>Transparent.<br /><It>Aligned.</It></Display>
            <Body style={{ maxWidth:480, marginBottom:'2rem' }}>Two fee models to suit different investor preferences. All performance fees are subject to a 12% hurdle rate and high-water mark protection.</Body>
            <TwoCol ratio="1fr 1fr" gap="14px">
              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
                <div style={{ padding:'1.4rem 1.5rem', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:'0.4rem' }}>Option A</div>
                  <div style={{ fontSize:'1rem',fontWeight:500,marginBottom:'0.3rem' }}>Fixed Fee</div>
                  <div style={{ fontSize:'0.8rem',color:'var(--ink-3)' }}>Management fee only — no performance component.</div>
                </div>
                <FeeTable rows={FIXED_FEES} />
              </div>
              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
                <div style={{ padding:'1.4rem 1.5rem', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:'0.4rem' }}>Option B</div>
                  <div style={{ fontSize:'1rem',fontWeight:500,marginBottom:'0.3rem' }}>Hybrid Fee</div>
                  <div style={{ fontSize:'0.8rem',color:'var(--ink-3)' }}>Lower management fee + 20% performance above 12% hurdle.</div>
                </div>
                <FeeTable rows={HYBRID_FEES} />
              </div>
            </TwoCol>

            {/* Hurdle, HWM, Exit Load, Expense Cap — strictly in fee section */}
            <div style={{ marginTop:16, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:'var(--border)', borderRadius:14, overflow:'hidden' }}>
              {[['12%','Hurdle Rate'],['HWM','High-Water Mark'],['2%','Exit Load'],['0.25%','Expense Cap']].map(([v,l],i) => (
                <div key={i} style={{ background:'var(--bg-card)', padding:'1.4rem 1.2rem', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond','Instrument Serif',serif",fontSize:'1.8rem',fontWeight:600,color:'var(--teal)',lineHeight:1,marginBottom:4 }}>{v}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:'0.58rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--ink-3)' }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Strategy Details (separate section) ── */}
        <div style={{ marginTop: '5rem' }}>
          <motion.div {...fade(3)}>
            <Label>Strategy Details</Label>
            <TwoCol ratio="1fr 1fr" gap="14px">
              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderTop:'3px solid var(--teal)', borderRadius:16, padding:'1.8rem 1.6rem' }}>
                <div style={{ fontSize:'1rem',fontWeight:500,color:'var(--teal)',marginBottom:'1.2rem' }}>Portfolio Construction</div>
                {[['Positions','12–15 concentrated holdings'],['Allocation','0–100% flexible mandate'],['Single Stock Cap','Maximum 10% of portfolio'],['Gross Exposure','Up to 2× gross'],['Mandate','India focused — all asset classes']].map(([k,v]) => (
                  <div key={k} style={{ display:'flex',justifyContent:'space-between',padding:'0.65rem 0',borderBottom:'1px solid var(--border)' }}>
                    <span style={{ fontSize:'0.8rem',color:'var(--ink-3)' }}>{k}</span>
                    <span style={{ fontSize:'0.8rem',color:'var(--ink)',fontWeight:400 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderTop:'3px solid var(--blue)', borderRadius:16, padding:'1.8rem 1.6rem' }}>
                <div style={{ fontSize:'1rem',fontWeight:500,color:'var(--blue)',marginBottom:'1.2rem' }}>Fund Terms</div>
                {[['Minimum Commitment','₹1 Crore'],['Investor Eligibility','SEBI Accredited'],['Fund Type','Category III AIF'],['Domicile','India'],['Target Close','Rolling']].map(([k,v]) => (
                  <div key={k} style={{ display:'flex',justifyContent:'space-between',padding:'0.65rem 0',borderBottom:'1px solid var(--border)' }}>
                    <span style={{ fontSize:'0.8rem',color:'var(--ink-3)' }}>{k}</span>
                    <span style={{ fontSize:'0.8rem',color:'var(--ink)',fontWeight:400 }}>{v}</span>
                  </div>
                ))}
              </div>
            </TwoCol>
          </motion.div>
        </div>

        {/* ── Onboarding ── */}
        <div style={{ marginTop: '5rem' }}>
          <motion.div {...fade(4)}>
            <Label>Onboarding</Label>
            <TwoCol ratio="1fr 1.2fr" gap="6vw">
              <div>
                <Display size="md" style={{ marginBottom: '1rem' }}>
                  Six steps to<br /><It>activation.</It>
                </Display>
                <Body>Most investors complete onboarding within 5–7 business days. ₹1 Crore minimum commitment. SEBI eligibility required.</Body>
              </div>
              <div style={{ borderTop:'1px solid var(--border)' }}>
                {STEPS.map(([n, t, d]) => <Step key={n} num={n} title={t} desc={d} />)}
              </div>
            </TwoCol>
          </motion.div>
        </div>

      </Section>

      <PageFooter disc="Fees are indicative. Refer to the PPM for final terms. SEBI Cat. III AIF. Capital at risk." />
    </div>
  );
}
