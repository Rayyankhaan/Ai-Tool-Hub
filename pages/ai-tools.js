import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import ToolCard from '../components/ToolCard';
import { aiTools, categories } from '../data/aiTools';
import { BannerAd, InFeedAd } from '../components/Ads';

const sortOptions = [
  { value: 'featured', label: '⭐ Featured first' },
  { value: 'rating', label: '📊 Highest rated' },
  { value: 'name', label: '🔤 A → Z' },
  { value: 'free', label: '💚 Free first' },
];

export default function AIToolsPage() {
  const [search, setSearch]   = useState('');
  const [cat, setCat]         = useState('All');
  const [sort, setSort]       = useState('featured');
  const [freeOnly, setFree]   = useState(false);
  const [page, setPage]       = useState(1);
  const PER_PAGE = 24;

  const filtered = useMemo(() => {
    let t = [...aiTools];
    if (search.trim()) {
      const q = search.toLowerCase();
      t = t.filter(x => x.name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q) || x.category.toLowerCase().includes(q) || x.tags?.some(tag => tag.includes(q)));
    }
    if (cat !== 'All') t = t.filter(x => x.category === cat);
    if (freeOnly) t = t.filter(x => x.free);
    if (sort === 'featured') t.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
    else if (sort === 'rating') t.sort((a, b) => b.rating - a.rating);
    else if (sort === 'name') t.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'free') t.sort((a, b) => (b.free ? 1 : 0) - (a.free ? 1 : 0));
    return t;
  }, [search, cat, sort, freeOnly]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageTools = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const reset = () => { setSearch(''); setCat('All'); setFree(false); setSort('featured'); setPage(1); };

  return (
    <Layout title="AI Tools Directory — 278+ Tools" description="Browse 278+ AI tools across 33 categories">
      <div style={{ background: '#0a0614', minHeight: '100vh', color: '#f0ecff' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#0f0c29,#1a1040)', padding: '60px 24px 48px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 500, marginBottom: 20 }}>
            🤖 {aiTools.length}+ AI Tools Across {categories.length - 1} Categories
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px,6vw,56px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-.02em' }}>
            The Complete <span style={{ background: 'linear-gradient(135deg,#a78bfa,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI Tools Directory</span>
          </h1>
          <p style={{ color: '#8b7fa8', fontSize: 18, maxWidth: 500, margin: '0 auto 32px', fontWeight: 300 }}>
            Every AI tool worth knowing — chatbots, image generators, video AI, deep learning models, and more.
          </p>
          {/* Search */}
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <input type="text" placeholder="Search 278+ AI tools — try 'image', 'free', 'coding', 'transformer'…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '16px 20px 16px 52px', borderRadius: 16, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#f0ecff', fontSize: 15, outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 20 }}>🔍</span>
          </div>
        </div>

        <BannerAd />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px 80px', display: 'flex', gap: 24 }}>

          {/* Sidebar filters */}
          <aside style={{ width: 220, flexShrink: 0, paddingTop: 24 }}>
            <div style={{ background: '#1a1330', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, position: 'sticky', top: 20 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: '#a78bfa', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 16 }}>Filters</div>

              {/* Free toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20, padding: '10px 14px', background: freeOnly ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', borderRadius: 10, border: `1px solid ${freeOnly ? 'rgba(34,197,94,0.3)' : 'transparent'}` }}>
                <input type="checkbox" checked={freeOnly} onChange={e => { setFree(e.target.checked); setPage(1); }} style={{ accentColor: '#22c55e', width: 16, height: 16 }} />
                <span style={{ fontSize: 13, color: freeOnly ? '#4ade80' : '#8b7fa8', fontWeight: 600 }}>Free tools only</span>
              </label>

              {/* Sort */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#8b7fa8', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Sort by</div>
                {sortOptions.map(o => (
                  <button key={o.value} onClick={() => { setSort(o.value); setPage(1); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', background: sort === o.value ? 'rgba(124,58,237,0.2)' : 'transparent', color: sort === o.value ? '#c4b5fd' : '#8b7fa8', fontSize: 13, cursor: 'pointer', marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>
                    {o.label}
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div>
                <div style={{ fontSize: 11, color: '#8b7fa8', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Category</div>
                <div style={{ maxHeight: 480, overflowY: 'auto' }}>
                  {categories.map(c => {
                    const count = c === 'All' ? aiTools.length : aiTools.filter(t => t.category === c).length;
                    return (
                      <button key={c} onClick={() => { setCat(c); setPage(1); }}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 8, border: 'none', background: cat === c ? 'rgba(124,58,237,0.2)' : 'transparent', color: cat === c ? '#c4b5fd' : '#8b7fa8', fontSize: 12, cursor: 'pointer', marginBottom: 1, fontFamily: "'DM Sans', sans-serif" }}>
                        <span>{c}</span>
                        <span style={{ fontSize: 10, opacity: .6 }}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {(search || cat !== 'All' || freeOnly) && (
                <button onClick={reset} style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  Clear filters
                </button>
              )}
            </div>
          </aside>

          {/* Main grid */}
          <main style={{ flex: 1, paddingTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ color: '#8b7fa8', fontSize: 14 }}>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>{filtered.length}</span> tools found
                {cat !== 'All' && <span> in <span style={{ color: '#c4b5fd' }}>{cat}</span></span>}
                {search && <span> for "<span style={{ color: '#c4b5fd' }}>{search}</span>"</span>}
              </div>
              <div style={{ color: '#8b7fa8', fontSize: 13 }}>Page {page} of {totalPages}</div>
            </div>

            {pageTools.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: '#8b7fa8' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, color: '#f0ecff', marginBottom: 8 }}>No tools found</h3>
                <p style={{ fontSize: 14 }}>Try a different search or category</p>
                <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Reset filters</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                  {pageTools.map((tool, i) => (
                    <>
                      <ToolCard key={tool.id} tool={tool} />
                      {i === 11 && <div key="ad" style={{ gridColumn: '1/-1' }}><InFeedAd /></div>}
                    </>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40, flexWrap: 'wrap' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ecff', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? .4 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                      ← Prev
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          style={{ padding: '10px 16px', borderRadius: 12, background: page === p ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.06)', border: `1px solid ${page === p ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.1)'}`, color: page === p ? '#fff' : '#f0ecff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: page === p ? 700 : 400 }}>
                          {p}
                        </button>
                      );
                    })}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ecff', cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? .4 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
