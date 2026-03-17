import { getToolUrl, isSponsoredTool, Revenue } from '../data/monetization';
import { SponsoredBadge } from './Ads';

export default function ToolCard({ tool }) {
  const affiliateUrl = getToolUrl(tool.name, tool.url);
  const isSponsored = isSponsoredTool(tool.name);

  return (
    <div className={`card p-5 group flex flex-col gap-4 relative ${isSponsored ? 'ring-2 ring-amber-300/50' : ''}`}>
      {isSponsored && <div className="absolute top-4 right-4"><SponsoredBadge /></div>}

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: tool.color + '18' }}>
          {tool.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
            {tool.featured && !isSponsored && <span className="badge bg-amber-50 text-amber-700 text-xs">⭐ Top</span>}
          </div>
          <span className="badge bg-gray-100 text-gray-500 text-xs">{tool.category}</span>
        </div>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{tool.description}</p>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="text-amber-400">★</span><span className="font-semibold text-gray-700">{tool.rating}</span></span>
        <span className="text-gray-200">·</span>
        <span>{tool.users}</span>
        <span className="text-gray-200">·</span>
        <span className={`font-semibold ${tool.free ? 'text-green-600' : 'text-orange-500'}`}>{tool.free ? '✓ Free' : '💳 Paid'}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tool.tags?.slice(0, 3).map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-500">#{tag}</span>
        ))}
      </div>

      <a href={affiliateUrl} target="_blank" rel="noopener noreferrer"
        onClick={() => Revenue.trackAffiliate(tool.name)}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5"
        style={{ background: tool.color+'12', color: (tool.color==='#000000'||tool.color==='#24292f') ? '#374151' : tool.color, border: `1.5px solid ${tool.color}25` }}>
        Visit {tool.name}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
