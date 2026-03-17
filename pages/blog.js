import Layout from '../components/Layout';
import { blogPosts } from '../data/aiTools';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <Layout title="Blog" description="Latest AI news, guides, and tutorials">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-900 via-rose-800 to-pink-900 py-14 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-5">
            📰 <span>AI News & Guides</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">The AIToolsHub Blog</h1>
          <p className="text-orange-200 text-lg max-w-2xl mx-auto">
            Stay updated with AI trends, tool reviews, tutorials, and comparisons.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Featured Post */}
        <div className="mb-12">
          <Link href="#" className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div
                className="h-48 md:h-auto flex items-center justify-center text-8xl"
                style={{ background: `linear-gradient(135deg, ${blogPosts[0].color}30, ${blogPosts[0].color}10)` }}
              >
                {blogPosts[0].emoji}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge bg-brand-50 text-brand-700 px-3 py-1">✨ Featured</span>
                  <span className="badge bg-gray-100 text-gray-600">{blogPosts[0].category}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-gray-500 mb-5 leading-relaxed">{blogPosts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{blogPosts[0].date}</span>
                  <span>·</span>
                  <span>{blogPosts[0].readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* All Posts Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} href="#" className="group card overflow-hidden cursor-pointer">
              <div
                className="h-40 flex items-center justify-center text-6xl"
                style={{ background: `linear-gradient(135deg, ${post.color}20, ${post.color}05)` }}
              >
                {post.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge bg-gray-100 text-gray-600">{post.category}</span>
                  <span className="text-gray-400 text-xs">{post.readTime}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <div className="flex gap-1">
                    {(post.tags || []).slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
