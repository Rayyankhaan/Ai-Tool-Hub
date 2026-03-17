import { useState } from 'react';
import Layout from '../components/Layout';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: 'phatanrayyankhan9@gmail.com',
      href: 'mailto:phatanrayyankhan9@gmail.com',
      desc: 'We reply within 24 hours',
      color: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      icon: '💬',
      label: 'General Support',
      value: 'phatanrayyankhan9@gmail.com',
      href: 'mailto:phatanrayyankhan9@gmail.com',
      desc: 'Questions about AI tools',
      color: 'bg-purple-50 border-purple-100',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      icon: '🤝',
      label: 'Partnerships',
      value: 'phatanrayyankhan9@gmail.com',
      href: 'mailto:phatanrayyankhan9@gmail.com',
      desc: 'Submit your AI tool for listing',
      color: 'bg-green-50 border-green-100',
      iconBg: 'bg-green-100 text-green-600',
    },
  ];

  const subjects = [
    'General Question',
    'Submit an AI Tool',
    'Report Incorrect Info',
    'Partnership / Sponsorship',
    'Bug Report',
    'Other',
  ];

  return (
    <Layout title="Contact" description="Contact AIToolsHub — phatanrayyankhan9@gmail.com">
      <div className="bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 py-14 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-cyan-200 text-lg max-w-xl mx-auto">
            Have a question, want to submit an AI tool, or partner with us? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Get in Touch</h2>
            {contactInfo.map(({ icon, label, value, href, desc, color, iconBg }) => (
              <a
                key={label}
                href={href}
                className={`block border rounded-2xl p-5 ${color} hover:shadow-md transition-shadow group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${iconBg}`}>
                    {icon}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{label}</div>
                    <div className="text-brand-600 text-sm font-medium group-hover:underline break-all">{value}</div>
                    <div className="text-gray-500 text-xs mt-1">{desc}</div>
                  </div>
                </div>
              </a>
            ))}

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mt-6">
              <h3 className="font-bold text-gray-800 mb-2 text-sm">⏰ Response Time</h3>
              <p className="text-gray-500 text-sm">We typically respond within <strong className="text-gray-700">24–48 hours</strong> on business days.</p>
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
              <h3 className="font-bold text-gray-800 mb-2 text-sm">🚀 Submit Your AI Tool</h3>
              <p className="text-gray-500 text-sm mb-3">Want to list your AI tool on AIToolsHub? Send us the details!</p>
              <a href="mailto:phatanrayyankhan9@gmail.com?subject=Submit My AI Tool" className="text-brand-600 text-sm font-semibold hover:underline">
                Submit via email →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-2">Thanks for reaching out. We'll reply to</p>
                  <p className="text-brand-600 font-semibold mb-6">{form.email || 'your email'}</p>
                  <p className="text-gray-400 text-sm">Usually within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-6 btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Rayyan Khan"
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject *</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select a subject...</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        required
                        className="input-field resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-gray-400 text-xs">
                        Or email directly:{' '}
                        <a href="mailto:phatanrayyankhan9@gmail.com" className="text-brand-600 hover:underline font-medium">
                          phatanrayyankhan9@gmail.com
                        </a>
                      </p>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary px-8 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          '📧 Send Message'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
