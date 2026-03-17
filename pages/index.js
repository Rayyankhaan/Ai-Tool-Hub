import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import ToolCard from '../components/ToolCard';
import PricingSection from '../components/PricingSection';
import { aiTools } from '../data/aiTools';
import { testimonials, faqs, companies } from '../data/startup';
import { useAuth } from '../context/AuthContext';

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = '', duration = 2200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const step = end / (duration / 16);
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + step, end);
          setCount(Math.floor(cur));
          if (cur >= end) clearInterval(t);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── 3D Particle Canvas ───────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function init() {
      particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: Math.random() * 2 + .5,
        opacity: Math.random() * .5 + .2,
        color: Math.random() > .5 ? '124,58,237' : '99,102,241',
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // Grid
      ctx.strokeStyle = 'rgba(99,102,241,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) { ctx.strokeStyle = `rgba(124,58,237,${(.15 * (1 - d / 120)).toFixed(3)})`; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
        }
      }
      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`; ctx.fill();
      });
      // Glow orbs
      const t = Date.now() / 4000;
      [[W * .25, H * .35, 200, '124,58,237'], [W * .75, H * .6, 160, '99,102,241'], [W * .1, H * .8, 120, '6,182,212']].forEach(([ox, oy, or2, col]) => {
        const gx = ox + Math.sin(t) * 40, gy = oy + Math.cos(t * .7) * 25;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, or2);
        g.addColorStop(0, `rgba(${col},0.07)`); g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(gx, gy, or2, 0, Math.PI * 2); ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    resize(); init(); draw();
    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

// ─── Marquee Row ─────────────────────────────────────────────────────────────
function MarqueeRow({ tools, reverse = false }) {
  const doubled = [...tools, ...tools];
  return (
    <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)' }}>
      <div style={{ display: 'flex', gap: 16, width: 'max-content', animation: `marquee${reverse ? 'Rev' : ''} 35s linear infinite` }}>
        {doubled.map((t, i) => (
          <a key={i} href={t.url} target="_blank" rel="noopener noreferrer"
            style={{ background: '#1a1330', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none', transition: 'transform .3s,border-color .3s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: t.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.logo}</div>
            <div>
              <div style={{ color: '#f0ecff', fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{t.name}</div>
              <div style={{ color: '#8b7fa8', fontSize: 11 }}>{t.category}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ background: '#1a1330', border: `1px solid ${open ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 16, padding: '20px 24px', cursor: 'pointer', transition: 'all .3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0ecff' }}>{q}</span>
        <span style={{ color: '#a78bfa', fontSize: 20, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .3s' }}>+</span>
      </div>
      {open && <p style={{ color: '#8b7fa8', fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>{a}</p>}
    </div>
  );
}

export default function HomePage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [yearly, setYearly] = useState(false);
  const featuredTools = aiTools.filter(t => t.featured).slice(0, 12);
  const row1 = featuredTools.slice(0, 8);
  const row2 = featuredTools.slice(4, 12);

  const features = [
    { icon: '🎨', title: 'AI Prompt Maker', desc: '8 specialized builders — image, video, coding, audio & more. Generate perfect prompts in seconds.' },
    { icon: '🔍', title: 'Smart Directory', desc: 'Filter 75+ tools by category, price, and rating. Find what you need instantly.' },
    { icon: '💰', title: 'Find Free Alternatives', desc: 'We track pricing so you always know what\'s free vs paid. Save hundreds per month.' },
    { icon: '⚡', title: 'Always Updated', desc: 'New AI tools added every week. Be first to discover what\'s next before everyone else.' },
    { icon: '🛠️', title: 'Free Browser Tools', desc: '6 built-in utilities — word counter, JSON formatter, color picker, and more.' },
    { icon: '📚', title: 'Curated Tutorials', desc: 'Handpicked YouTube tutorials for every major AI tool so you learn fast and get results.' },
  ];

  const faqData = [
    { q: 'Is AIToolsHub really free?', a: 'Yes — the directory, free tools, and 5 prompts per day are completely free, forever. Upgrade to Pro for unlimited prompts and all 8 categories.' },
    { q: 'What makes the Prompt Maker different?', a: 'Most prompt tools are generic. Ours is purpose-built for each AI — different fields and logic for Midjourney vs Sora vs Cursor vs ElevenLabs.' },
    { q: 'How often are new tools added?', a: 'We add new AI tools every week and update pricing, ratings, and descriptions regularly so you always have accurate info.' },
    { q: 'Can I cancel my Pro subscription?', a: 'Absolutely. Cancel anytime from your dashboard. No questions asked, no extra fees. Your plan stays active until the end of the billing period.' },
  ];

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
          @keyframes marqueeRev { from{transform:translateX(-50%)} to{transform:translateX(0)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
          .anim-1{animation:fadeUp .9s .05s ease both}
          .anim-2{animation:fadeUp .9s .15s ease both}
          .anim-3{animation:fadeUp .9s .25s ease both}
          .anim-4{animation:fadeUp .9s .35s ease both}
          .feat-card{transition:transform .3s,border-color .3s}
          .feat-card:hover{transform:translateY(-6px)!important;border-color:rgba(124,58,237,0.35)!important}
          .tool-pill:hover{transform:translateY(-4px);border-color:rgba(124,58,237,0.4)!important}
        `}</style>
      </Head>

      <div style={{ background: '#0a0614', minHeight: '100vh', color: '#f0ecff', fontFamily: "'DM Sans', sans-serif" }}>

        {/* NAV */}
        <nav style={{ position: 'relative', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#f0ecff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            🤖 AIToolsHub
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[['AI Tools', '/ai-tools'], ['🧬 Models', '/ai-models'], ['Prompts', '/prompt-maker'], ['Free Tools', '/free-tools'], ['Blog', '/blog']].map(([label, href]) => (
              <Link key={href} href={href} style={{ color: '#8b7fa8', fontSize: 13, fontWeight: 500, textDecoration: 'none', padding: '8px 14px', borderRadius: 10, transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f0ecff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#8b7fa8'; e.currentTarget.style.background = 'transparent'; }}>
                {label}
              </Link>
            ))}
            {user
              ? <Link href="/dashboard" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: '8px 18px', borderRadius: 10 }}>Dashboard</Link>
              : <Link href="/login" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: '8px 18px', borderRadius: 10 }}>Get started free</Link>
            }
          </div>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', minHeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 60px', overflow: 'hidden' }}>
          <ParticleCanvas />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div className="anim-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd', borderRadius: 100, padding: '6px 18px', fontSize: 12, fontWeight: 500, letterSpacing: '.04em', marginBottom: 28 }}>
              ✦ 100+ AI Tools Curated Across 17 Categories
            </div>
            <h1 className="anim-2" style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(40px,8vw,80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-.03em', marginBottom: 24 }}>
              The AI Tools<br />
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Universe
              </span>
            </h1>
            <p className="anim-3" style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#8b7fa8', maxWidth: 520, lineHeight: 1.7, margin: '0 auto 40px', fontWeight: 300 }}>
              Discover, compare, and prompt the best AI tools for image, video, code, audio, and more — all in one place.
            </p>
            <div className="anim-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/ai-tools" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff', textDecoration: 'none', padding: '15px 36px', borderRadius: 14, fontSize: 15, fontWeight: 500, boxShadow: '0 0 40px rgba(99,102,241,0.4)', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 60px rgba(99,102,241,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(99,102,241,0.4)'; e.currentTarget.style.transform = 'none'; }}>
                Explore AI Tools
              </Link>
              <Link href="/prompt-maker" style={{ background: 'rgba(255,255,255,0.07)', color: '#f0ecff', textDecoration: 'none', padding: '15px 36px', borderRadius: 14, fontSize: 15, fontWeight: 500, border: '1px solid rgba(255,255,255,0.12)', transition: 'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                Try Prompt Maker →
              </Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '0 24px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {[['100+', 'AI Tools Listed'], ['50K+', 'Monthly Visitors'], ['17', 'Categories'], ['120K+', 'Prompts Generated']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center', padding: '16px 40px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 34, fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
              <div style={{ fontSize: 12, color: '#8b7fa8', marginTop: 4, letterSpacing: '.04em' }}>{l}</div>
            </div>
          ))}
        </section>

        {/* MARQUEE TOOLS */}
        <section style={{ padding: '60px 0', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MarqueeRow tools={row1} />
          <MarqueeRow tools={row2} reverse />
        </section>

        {/* FEATURES */}
        <section style={{ padding: '60px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: '.1em', color: '#8b7fa8', textTransform: 'uppercase', marginBottom: 12 }}>Why AIToolsHub</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.02em' }}>
              Everything to master<br />
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI tools</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} className="feat-card" style={{ background: '#1a1330', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 28, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(124,58,237,0.5),transparent)' }} />
                <div style={{ fontSize: 30, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#f0ecff' }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#8b7fa8', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED TOOLS GRID */}
        <section style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>Top AI Tools</h2>
            <Link href="/ai-tools" style={{ color: '#a78bfa', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>View all 75+ →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {aiTools.filter(t => t.featured).slice(0, 8).map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section style={{ background: '#0e0a1e', padding: '80px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <PricingSection />
        </section>

        {/* FAQ */}
        <section style={{ padding: '80px 40px', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: '.1em', color: '#f7f7f9', textTransform: 'uppercase', marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, letterSpacing: '-.02em' }}>Common questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqData.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section style={{ position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '80px 24px 100px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(124,58,237,0.12),transparent 70%)' }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 16 }}>
              Ready to explore the<br />
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                AI universe?
              </span>
            </h2>
            <p style={{ color: '#b4acc9', fontSize: 18, marginBottom: 40, fontWeight: 300 }}>
              Join thousands of builders discovering the best AI tools every day.
            </p>
            <Link href={user ? '/dashboard' : '/login'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff', textDecoration: 'none', padding: '16px 44px', borderRadius: 16, fontSize: 16, fontWeight: 600, boxShadow: '0 0 60px rgba(99,102,241,0.45)', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 80px rgba(99,102,241,0.65)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 60px rgba(99,102,241,0.45)'; e.currentTarget.style.transform = 'none'; }}>
              {user ? 'Go to Dashboard' : 'Get started — it\'s free'} ✦
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#f0ecff' }}>🤖 AIToolsHub</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['AI Tools', '/ai-tools'], ['Prompt Maker', '/prompt-maker'], ['Blog', '/blog'], ['Privacy', '/privacy'], ['Terms', '/terms']].map(([l, h]) => (
              <Link key={h} href={h} style={{ color: '#8b7fa8', fontSize: 13, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div style={{ color: '#8b7fa8', fontSize: 12 }}>© 2026 AIToolsHub</div>
        </footer>

      </div>
    </>
  );
}
