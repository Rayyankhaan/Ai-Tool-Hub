import { useState } from 'react';
import Layout from '../components/Layout';

const tutorials = [
  {
    emoji: '🚀',
    title: 'Getting Started with ChatGPT',
    level: 'Beginner',
    duration: '18 min',
    desc: 'Learn the basics of prompting ChatGPT for productivity, writing, and coding tasks.',
    tags: ['ChatGPT', 'Basics'],
    youtubeId: 'JTxsNm9IdYU',
    channel: 'Dave Nick',
  },
  {
    emoji: '🎨',
    title: 'Mastering Midjourney Prompts',
    level: 'Intermediate',
    duration: '5 min',
    desc: 'Write better prompts in Midjourney to generate stunning AI art consistently.',
    tags: ['Midjourney', 'Art'],
    youtubeId: 'hZv1KGDHW7c',
    channel: 'future pedia',
  },
  {
    emoji: '👨‍💻',
    title: 'Build Apps Faster with Cursor AI',
    level: 'Intermediate',
    duration: '25 min',
    desc: 'Use Cursor AI editor to build full-stack apps 10x faster with AI assistance.',
    tags: ['Cursor', 'Coding'],
    youtubeId: 'Qcxq4iXLZbY',
    channel: 'Build Great Products',
  },
  {
    emoji: '🎙️',
    title: 'Voice Cloning with ElevenLabs',
    level: 'Beginner',
    duration: '12 min',
    desc: 'Create realistic AI voices and clone your own voice with ElevenLabs in minutes.',
    tags: ['ElevenLabs', 'Audio'],
    youtubeId: '2prWUSejDcM',
    channel: 'The Bhavya Shah',
  },
  {
    emoji: '📝',
    title: 'AI Content Strategy with Claude',
    level: 'Intermediate',
    duration: '18 min',
    desc: 'Use Claude to build a full content calendar and write SEO articles at scale.',
    tags: ['Claude', 'Writing'],
    youtubeId: 'eorc3jLBqIA',
    channel: 'Zubair Trabzada',
  },
  {
    emoji: '🤖',
    title: 'Build an AI Agent with AutoGPT',
    level: 'Advanced',
    duration: '35 min',
    desc: 'Set up and run AutoGPT to automate complex multi-step tasks autonomously.',
    tags: ['AutoGPT', 'Agents'],
    youtubeId: 'bJ2LLsssnzQ',
    channel: 'Auto GPT',
  },
  {
    emoji: '🎬',
    title: 'Text to Video with Runway AI',
    level: 'Beginner',
    duration: '14 min',
    desc: 'Create cinematic AI videos from text prompts using Runway Gen-3 Alpha.',
    tags: ['Runway', 'Video'],
    youtubeId: 'cZVg4cUpD04',
    channel: 'Howfinity',
  },
  {
    emoji: '📊',
    title: 'AI-Powered SEO with Surfer',
    level: 'Intermediate',
    duration: '22 min',
    desc: 'Optimize your blog posts for search engines using Surfer SEO + AI writing.',
    tags: ['Surfer SEO', 'SEO'],
    youtubeId: 'bGUsrXJEFFE',
    channel: 'Dave Swift',
  },
  {
    emoji: '🔮',
    title: 'Calling the Claude API',
    level: 'Advanced',
    duration: '30 min',
    desc: 'Integrate Claude into your app using the Anthropic API — with live code examples.',
    tags: ['API', 'Developer'],
    youtubeId: 'Ejr0VUucg3U',
    channel: 'Leonardo Grigorio',
  },
];


const levelColors = {
  Beginner: 'bg-green-100 text-green-700 border border-green-200',
  Intermediate: 'bg-blue-100 text-blue-700 border border-blue-200',
  Advanced: 'bg-purple-100 text-purple-700 border border-purple-200',
};
const levelIcons = { Beginner: '🟢', Intermediate: '🔵', Advanced: '🟣' };

function VideoModal({ tutorial, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-gray-950 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <h3 className="text-white font-bold text-lg">{tutorial.title}</h3>
            <p className="text-gray-400 text-sm">by {tutorial.channel} · ⏱ {tutorial.duration}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${tutorial.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={tutorial.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="px-5 py-4 flex items-center justify-between bg-gray-950 border-t border-gray-800">
          <div className="flex gap-2">
            {tutorial.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-lg">#{tag}</span>
            ))}
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${tutorial.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            ▶ Open in YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TutorialsPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? tutorials : tutorials.filter((t) => t.level === filter);

  return (
    <Layout title="Tutorials" description="Step-by-step AI tutorials with YouTube videos">
      {selected && <VideoModal tutorial={selected} onClose={() => setSelected(null)} />}

      <div className="bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-5">
            📺 <span>YouTube Video Tutorials</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">AI Video Tutorials</h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Curated YouTube tutorials for every major AI tool — beginner to advanced, all in one place.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === lvl
                  ? 'bg-brand-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
              }`}
            >
              {lvl !== 'All' ? levelIcons[lvl] + ' ' : ''}{lvl}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, i) => (
            <div key={i} className="card overflow-hidden group cursor-pointer" onClick={() => setSelected(t)}>
              <div className="relative overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${t.youtubeId}/maxresdefault.jpg`}
                  alt={t.title}
                  className="w-full object-cover h-44 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = `https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg`; }}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                    <span className="text-white text-2xl ml-1">▶</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-2 py-0.5 rounded">{t.duration}</div>
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">▶ YouTube</div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge text-xs px-2.5 py-1 ${levelColors[t.level]}`}>{levelIcons[t.level]} {t.level}</span>
                  <span className="text-gray-400 text-xs truncate ml-2">📺 {t.channel}</span>
                </div>
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">{t.emoji}</span>
                  <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug">{t.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{t.desc}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {t.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-lg">#{tag}</span>
                  ))}
                </div>
                <button className="w-full py-2.5 rounded-xl bg-red-50 border-2 border-red-100 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 flex items-center justify-center gap-2">
                  ▶ Watch Tutorial
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-gradient-to-r from-brand-50 to-purple-50 rounded-2xl p-8 text-center border border-brand-100">
          <div className="text-4xl mb-3">📺</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Want More AI Tutorials?</h3>
          <p className="text-gray-500 mb-5">Subscribe to our newsletter for weekly curated YouTube tutorials on the latest AI tools.</p>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
            Browse More on YouTube →
          </a>
        </div>
      </div>
    </Layout>
  );
}
