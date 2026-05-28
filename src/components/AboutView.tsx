import { motion } from 'framer-motion';
import { Label, Display, It, Body, Section, PageFooter } from './UI';

const fade = (i=0) => ({ initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{delay:i*0.1,duration:0.6} });

const VALUES = [
  { n:'01', title:'Conviction Over Consensus', body:'We do not manage to a benchmark. Every allocation reflects genuine, research-backed conviction — not relative positioning or index hugging.' },
  { n:'02', title:'Probabilistic Discipline', body:'Markets are not predictable, but they are measurable. We assign probabilities, size positions to expected value, and review frameworks constantly.' },
  { n:'03', title:'Absolute Return Orientation', body:'The only benchmark that matters to us is capital preservation and real appreciation. We target absolute returns across market cycles.' },
  { n:'04', title:'Institutional Rigour', body:'We apply the same frameworks used by global institutional investors — macro regime analysis, systematic risk budgets, and disciplined exit rules.' },
];

export default function AboutView() {
  return (
    <div>
      <Section style={{ paddingTop:120 }}>

        {/* Heading */}
        <motion.div {...fade()}>
          <Label>About Super Capital</Label>
          <Display size="xl" style={{ marginBottom:'1.4rem' }}>
            Built for<br /><It>India's serious</It><br />investors.
          </Display>
          <Body style={{ maxWidth:560, marginBottom:'4rem' }}>
            Super Capital is an institutional alternative investment platform designed to deliver concentrated, research-driven alpha for India's most discerning capital allocators.
          </Body>
        </motion.div>

        {/* Mission block */}
        <motion.div {...fade(1)}>
          <div style={s.missionWrap}>
            <div style={s.missionBg}/>
            <div style={s.missionInner}>
              <div style={s.missionLeft}>
                <Label>Our Mission</Label>
                <div style={s.missionH}>To be the most rigorously disciplined equity manager in India — where every rupee is deployed with conviction and every decision is governed by process.</div>
              </div>
              <div style={s.missionRight}>
                <div style={s.missionStat}>
                  <div style={s.mStatVal}>Cat. III</div>
                  <div style={s.mStatLbl}>SEBI AIF Registration</div>
                </div>
                <div style={s.missionStat}>
                  <div style={s.mStatVal}>2024</div>
                  <div style={s.mStatLbl}>Established</div>
                </div>
                <div style={s.missionStat}>
                  <div style={s.mStatVal}>India</div>
                  <div style={s.mStatLbl}>Primary Mandate</div>
                </div>
                <div style={s.missionStat}>
                  <div style={s.mStatVal}>₹1Cr+</div>
                  <div style={s.mStatLbl}>Minimum Commitment</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What we do */}
        <div style={{ marginTop:'5rem' }}>
          <motion.div {...fade(2)}>
            <Label>What We Do</Label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4vw', alignItems:'start' }}>
              <div>
                <Display size="md" style={{ marginBottom:'1rem' }}>
                  Quantamental<br /><It>investing.</It>
                </Display>
                <Body style={{ marginBottom:'1.5rem' }}>
                  We coined the term quantamental to describe our approach: the art of fundamental security analysis, powered by the rigour of quantitative decision systems.
                </Body>
                <Body>
                  Our team builds probabilistic models on every investment idea, overlays macro regime intelligence, and deploys capital only when the reward-to-risk profile exceeds our threshold. This is not passive indexing. This is not speculative trading. This is disciplined, institutional-grade portfolio management — built for India.
                </Body>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { phase:'Research', desc:'Deep fundamental analysis of business quality, competitive moat, and financial strength.' },
                  { phase:'Modelling', desc:'Probabilistic frameworks assign conviction scores and position sizing weights.' },
                  { phase:'Regime Mapping', desc:'Three-state macro model determines net portfolio exposure and asset mix.' },
                  { phase:'Execution', desc:'Disciplined entry and exit rules eliminate emotion from capital allocation.' },
                ].map((item,i) => (
                  <motion.div key={item.phase} {...fade(i*0.5)}>
                    <div style={{ display:'flex', gap:'1.2rem', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'1.3rem 1.4rem' }}>
                      <div style={{ fontFamily:"'DM Mono',monospace",fontSize:'0.62rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--teal)',minWidth:64,paddingTop:2 }}>{String(i+1).padStart(2,'0')}</div>
                      <div>
                        <div style={{ fontSize:'0.92rem',fontWeight:500,marginBottom:'0.3rem' }}>{item.phase}</div>
                        <div style={{ fontSize:'0.78rem',color:'var(--ink-3)',lineHeight:1.65 }}>{item.desc}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div style={{ marginTop:'5rem' }}>
          <motion.div {...fade(3)}>
            <Label>Our Values</Label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
              {VALUES.map((v,i) => (
                <motion.div key={v.n} {...fade(i*0.5)}>
                  <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:'2rem 1.8rem', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute',top:'1.2rem',right:'1.4rem',fontFamily:"'Cormorant Garamond','Instrument Serif',serif",fontSize:'4rem',fontWeight:600,color:'rgba(0,0,0,0.04)',lineHeight:1,pointerEvents:'none' }}>{v.n}</div>
                    <div style={{ fontSize:'1.05rem',fontWeight:500,marginBottom:'0.7rem',color:'var(--ink)' }}>{v.title}</div>
                    <div style={{ fontSize:'0.85rem',color:'var(--ink-3)',lineHeight:1.75 }}>{v.body}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Regulatory */}
        <div style={{ marginTop:'4rem' }}>
          <motion.div {...fade(4)}>
            <div style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,padding:'2rem 2.2rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'2rem',flexWrap:'wrap' }}>
              <div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:'0.5rem' }}>Regulatory Status</div>
                <div style={{ fontSize:'1rem',fontWeight:500,color:'var(--ink)' }}>SEBI Registered Category III Alternative Investment Fund</div>
                <div style={{ fontSize:'0.82rem',color:'var(--ink-3)',marginTop:'0.3rem' }}>Governed by SEBI AIF Regulations, 2012. For eligible investors only.</div>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond','Instrument Serif',serif",fontSize:'2.2rem',fontWeight:600,color:'var(--teal)',letterSpacing:'-0.02em',whiteSpace:'nowrap' }}>Cat. III AIF</div>
            </div>
          </motion.div>
        </div>

      </Section>
      <PageFooter disc="© 2024 Super Fund Managers LLP. SEBI Registered Category III AIF. For eligible investors only." />
    </div>
  );
}

const s:Record<string,React.CSSProperties>={
  missionWrap:{borderRadius:24,background:'var(--bg-dark)',padding:'56px 5vw',position:'relative',overflow:'hidden',color:'#fff'},
  missionBg:{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(ellipse at 30% 60%,rgba(11,110,106,0.15) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(24,64,168,0.1) 0%,transparent 60%)'},
  missionInner:{position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:'6vw',alignItems:'center'},
  missionLeft:{},
  missionH:{fontFamily:"'Cormorant Garamond','Instrument Serif',serif",fontSize:'clamp(1.6rem,2.5vw,2.4rem)',fontWeight:600,lineHeight:1.25,color:'#fff',letterSpacing:'-0.02em'},
  missionRight:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,background:'rgba(255,255,255,0.06)',borderRadius:14,overflow:'hidden'},
  missionStat:{background:'rgba(255,255,255,0.03)',padding:'1.4rem 1.2rem',textAlign:'center'},
  mStatVal:{fontFamily:"'Cormorant Garamond','Instrument Serif',serif",fontSize:'2rem',fontWeight:600,color:'#fff',lineHeight:1,marginBottom:4},
  mStatLbl:{fontFamily:"'DM Mono',monospace",fontSize:'0.55rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)'},
};
