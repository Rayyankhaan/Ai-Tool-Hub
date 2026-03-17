import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { aiModels, modelTypes, modelMakers } from '../data/aiModels';

const typeColors = {
  'LLM': '#6366f1', 'Reasoning LLM': '#7c3aed', 'SLM': '#8b5cf6',
  'Image Diffusion': '#ec4899', 'Image Generation': '#f43f5e', 'Image Control': '#f97316',
  'Video Diffusion': '#ef4444', 'Speech Recognition': '#10b981', 'Music Generation': '#14b8a6',
  'TTS': '#06b6d4', 'Audio Generation': '#0891b2', 'Vision-Language': '#3b82f6',
  'Code LLM': '#1d4ed8', 'Science AI': '#059669', 'Vision AI': '#0d9488',
  'Embedding': '#64748b', 'Agent Framework': '#a855f7', 'Prompting': '#d946ef',
  'Genomics AI': '#15803d',
};

function ModelCard({ model }) {
  const [expanded, setExpanded] = useState(false);
  const typeColor = typeColors[model.type] || '#6366f1';

  return (
    <div onClick={() => setExpanded(!expanded)}
      style={{ background: '#1a1330', border: `1px solid ${expanded ? typeColor+'55' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all .3s' }}
      onMouseEnter={e => { if (!expanded) e.currentTarget.style.borderColor = typeColor+'33'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { if (!expanded) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: typeColor+'22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{model.logo}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0ecff' }}>{model.name}</span>
            {model.open && <span style={{ background: '#10b98122', color: '#10b981', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6 }}>OPEN</span>}
            {model.free && <span style={{ background: '#6366f122', color: '#a5b4fc', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6 }}>FREE</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ background: typeColor+'22', color: typeColor, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>{model.type}</span>
            <span style={{ color: '#8b7fa8', fontSize: 11 }}>{model.maker}</span>
            {model.released && <span style={{ color: '#8b7fa8', fontSize: 11 }}>· {model.released}</span>}
          </div>
        </div>
        <div style={{ color: '#8b7fa8', fontSize: 14, flexShrink: 0 }}>{expanded ? '▲' : '▼'}</div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        {model.params && model.params !== 'N/A' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '4px 10px', fontSize: 11 }}>
            <span style={{ color: '#8b7fa8' }}>Params: </span><span style={{ color: '#c4b5fd', fontWeight: 600 }}>{model.params}</span>
          </div>
        )}
        {model.context && model.context !== 'N/A' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '4px 10px', fontSize: 11 }}>
            <span style={{ color: '#8b7fa8' }}>Context: </span><span style={{ color: '#c4b5fd', fontWeight: 600 }}>{model.context}</span>
          </div>
        )}
        {model.modalities?.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '4px 10px', fontSize: 11 }}>
            <span style={{ color: '#8b7fa8' }}>Input: </span>
            <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{model.modalities.slice(0,3).join(', ')}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p style={{ color: '#8b7fa8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{model.description}</p>

      {/* Expanded details */}
      {expanded && (
        <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
          {model.strengths?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#8b7fa8', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>Key Strengths</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {model.strengths.map(s => (
                  <span key={s} style={{ background: typeColor+'15', color: typeColor, fontSize: 11, padding: '4px 10px', borderRadius: 8 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {model.playgroundUrl && (
              <a href={model.playgroundUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ background: typeColor, color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 10, textDecoration: 'none' }}>
                Try it →
              </a>
            )}
            {model.apiUrl && (
              <a href={model.apiUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#f0ecff', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
                API Docs
              </a>
            )}
            {model.huggingface && (
              <a href={model.huggingface} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ background: '#f59e0b22', color: '#f59e0b', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 10, textDecoration: 'none', border: '1px solid #f59e0b33' }}>
                🤗 HuggingFace
              </a>
            )}
            {model.paper && (
              <a href={model.paper} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ background: 'rgba(255,255,255,0.05)', color: '#8b7fa8', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>
                📄 Paper
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIModelsPage() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activeMaker, setActiveMaker] = useState('All');
  const [showOpen, setShowOpen] = useState(false);

  const filtered = useMemo(() => {
    return aiModels.filter(m => {
      const q = search.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.maker.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.tags?.some(t => t.includes(q));
      const matchType = activeType === 'All' || m.type === activeType;
      const matchMaker = activeMaker === 'All' || m.maker === activeMaker || (activeMaker === 'Other' && !['OpenAI','Anthropic','Google DeepMind','Meta AI','Mistral AI','DeepSeek AI','Alibaba','Microsoft','Stability AI','Black Forest Labs','xAI','Cohere','Hugging Face','BigCode','Arc Institute'].includes(m.maker));
      const matchOpen = !showOpen || m.open;
      return matchSearch && matchType && matchMaker && matchOpen;
    });
  }, [search, activeType, activeMaker, showOpen]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(m => { if (!g[m.type]) g[m.type] = []; g[m.type].push(m); });
    return g;
  }, [filtered]);

  const stats = useMemo(() => ({
    total: aiModels.length,
    open: aiModels.filter(m => m.open).length,
    types: [...new Set(aiModels.map(m => m.type))].length,
    makers: [...new Set(aiModels.map(m => m.maker))].length,
  }), []);

  return (
    <Layout title="AI Models & Foundation Models" description="Complete database of every major AI model — LLMs, diffusion models, transformers, and more">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        .filter-pill { cursor: pointer; transition: all .2s; }
        .filter-pill:hover { opacity: .85; }
      `}</style>

      <div style={{ background: '#0a0614', minHeight: '100vh', color: '#f0ecff', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#0f0c29,#1a0f3a)', padding: '60px 40px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd', borderRadius: 100, padding: '5px 16px', fontSize: 12, marginBottom: 20 }}>
            🧬 Complete Foundation Model Database
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px,6vw,56px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 12 }}>
            AI Models &{' '}
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Foundation Models
            </span>
          </h1>
          <p style={{ color: '#8b7fa8', fontSize: 16, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Every major model — LLMs, image diffusion, video generation, audio, and science AI. Click any card to see details, papers, and links.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '4px', maxWidth: 500, margin: '0 auto 32px', border: '1px solid rgba(255,255,255,0.07)' }}>
            {[[stats.total, 'Models'], [stats.open, 'Open Source'], [stats.types, 'Types'], [stats.makers, 'Makers']].map(([n, l]) => (
              <div key={l} style={{ flex: 1, textAlign: 'center', padding: '12px 16px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, background: 'linear-gradient(135deg,#a78bfa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
                <div style={{ color: '#8b7fa8', fontSize: 11 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models, makers, capabilities..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '13px 18px', color: '#f0ecff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: '#8b7fa8', fontSize: 12, fontWeight: 700, marginRight: 4 }}>TYPE</span>
            {modelTypes.slice(0, 12).map(t => (
              <button key={t} className="filter-pill" onClick={() => setActiveType(t)}
                style={{ background: activeType === t ? (typeColors[t] || '#6366f1') : 'rgba(255,255,255,0.05)', color: activeType === t ? '#fff' : '#8b7fa8', border: `1px solid ${activeType === t ? 'transparent' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '5px 13px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {t}
              </button>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginLeft: 8 }}>
              <input type="checkbox" checked={showOpen} onChange={e => setShowOpen(e.target.checked)} />
              <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>Open source only</span>
            </label>
          </div>
        </div>

        {/* Results */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px' }}>
          {Object.keys(grouped).length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#8b7fa8' }}>No models found. Try a different search.</div>
          ) : (
            Object.entries(grouped).map(([type, models]) => (
              <div key={type} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ height: 2, width: 24, background: typeColors[type] || '#6366f1', borderRadius: 2 }} />
                  <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#f0ecff' }}>{type}</h2>
                  <span style={{ background: 'rgba(255,255,255,0.05)', color: '#8b7fa8', fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{models.length}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                  {models.map(m => <ModelCard key={m.id} model={m} />)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
