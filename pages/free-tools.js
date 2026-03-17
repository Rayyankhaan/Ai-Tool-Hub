import { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';

// ─── Password Generator ──────────────────────────────────────────────────────
function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  const generatePassword = () => {
    const sets = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };
    let chars = '';
    let required = '';
    Object.keys(sets).forEach((key) => {
      if (opts[key]) {
        chars += sets[key];
        required += sets[key][Math.floor(Math.random() * sets[key].length)];
      }
    });
    if (!chars) { setPassword('Select at least one option'); return; }
    let pass = required;
    for (let i = required.length; i < length; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pass.split('').sort(() => Math.random() - 0.5).join(''));
    const activeOpts = Object.values(opts).filter(Boolean).length;
    setStrength(Math.min(4, Math.floor((length / 8) + activeOpts - 1)));
    setCopied(false);
  };

  useEffect(() => { generatePassword(); }, []);

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

  return (
    <div>
      <div className="flex items-center gap-2 bg-gray-950 rounded-xl p-4 mb-4 font-mono text-green-400 text-sm break-all min-h-[52px]">
        <span className="flex-1">{password}</span>
        <button onClick={copy} className="ml-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors flex-shrink-0">
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>

      {password && password !== 'Select at least one option' && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">Strength:</span>
            <span className={`text-xs font-semibold ${strength >= 3 ? 'text-green-600' : strength >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
              {strengthLabels[strength]}
            </span>
          </div>
          <div className="flex gap-1 h-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex-1 rounded-full ${i <= strength ? strengthColors[strength] : 'bg-gray-200'} transition-colors`} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">Length</span>
          <span className="text-brand-600 font-bold">{length}</span>
        </div>
        <input
          type="range" min="8" max="64" value={length}
          onChange={(e) => setLength(+e.target.value)}
          className="w-full accent-brand-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {Object.keys(opts).map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={opts[opt]}
              onChange={(e) => setOpts((o) => ({ ...o, [opt]: e.target.checked }))}
              className="w-4 h-4 accent-brand-600 rounded"
            />
            <span className="text-sm text-gray-600 capitalize group-hover:text-gray-900">
              {opt === 'upper' ? 'Uppercase (A-Z)' : opt === 'lower' ? 'Lowercase (a-z)' : opt === 'numbers' ? 'Numbers (0-9)' : 'Symbols (!@#)'}
            </span>
          </label>
        ))}
      </div>

      <button onClick={generatePassword} className="btn-primary w-full justify-center">
        🔄 Generate New Password
      </button>
    </div>
  );
}

// ─── QR Code Generator ───────────────────────────────────────────────────────
function QRCodeGenerator() {
  const [text, setText] = useState('https://aitoolshub.com');
  const [qrUrl, setQrUrl] = useState('');
  const [size, setSize] = useState(200);

  const generate = () => {
    if (!text.trim()) return;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=4f46e5&bgcolor=ffffff&format=png`;
    setQrUrl(url);
  };

  useEffect(() => { generate(); }, []);

  const download = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter URL, text, email, phone..."
        rows={3}
        className="input-field mb-4 resize-none"
      />

      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-gray-600">Size:</span>
        {[150, 200, 300].map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${size === s ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s}px
          </button>
        ))}
      </div>

      <button onClick={generate} className="btn-primary w-full justify-center mb-6">
        📱 Generate QR Code
      </button>

      {qrUrl && (
        <div className="text-center">
          <div className="inline-block p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm mb-4">
            <img src={qrUrl} alt="QR Code" className="rounded-lg" style={{ width: size, height: size }} />
          </div>
          <div>
            <button onClick={download} className="btn-secondary text-sm py-2">
              ⬇️ Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Word Counter ────────────────────────────────────────────────────────────
function WordCounter() {
  const [text, setText] = useState('');

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    sentences: text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0,
    paragraphs: text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0,
    readTime: text.trim() ? Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200)) : 0,
    lines: text ? text.split('\n').length : 0,
  };

  const statItems = [
    { label: 'Words', value: stats.words, color: 'text-brand-600' },
    { label: 'Characters', value: stats.chars, color: 'text-purple-600' },
    { label: 'No Spaces', value: stats.charsNoSpace, color: 'text-green-600' },
    { label: 'Sentences', value: stats.sentences, color: 'text-orange-600' },
    { label: 'Paragraphs', value: stats.paragraphs, color: 'text-red-600' },
    { label: 'Lines', value: stats.lines, color: 'text-teal-600' },
    { label: 'Read Time', value: `${stats.readTime}m`, color: 'text-pink-600' },
  ];

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here to count words, characters, sentences..."
        rows={8}
        className="input-field mb-5 resize-none font-mono text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {statItems.map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
      {text && (
        <button onClick={() => setText('')} className="btn-secondary w-full justify-center text-sm py-2">
          🗑️ Clear Text
        </button>
      )}
    </div>
  );
}

// ─── Image Compressor ────────────────────────────────────────────────────────
function ImageCompressor() {
  const [original, setOriginal] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [quality, setQuality] = useState(80);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setOriginal({ src: ev.target.result, size: file.size, name: file.name });
      setCompressed(null);
    };
    reader.readAsDataURL(file);
  };

  const compress = () => {
    if (!original) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      const byteString = atob(dataUrl.split(',')[1]);
      const size = byteString.length;
      setCompressed({ src: dataUrl, size, name: original.name });
      setProcessing(false);
    };
    img.src = original.src;
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <canvas ref={canvasRef} className="hidden" />
      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-5 hover:border-brand-400 transition-colors cursor-pointer"
        onClick={() => document.getElementById('img-upload').click()}
      >
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-600 font-medium">Click or drag image here</p>
        <p className="text-gray-400 text-sm">Supports JPG, PNG, WebP</p>
        <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {original && (
        <>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 font-medium">Quality: <span className="text-brand-600 font-bold">{quality}%</span></span>
              <span className="text-gray-400">{quality < 50 ? 'Low' : quality < 80 ? 'Medium' : 'High'}</span>
            </div>
            <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-brand-600" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-center">
            <div className="bg-red-50 rounded-xl p-3">
              <div className="text-lg font-bold text-red-600">{formatSize(original.size)}</div>
              <div className="text-xs text-gray-500">Original Size</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-lg font-bold text-green-600">
                {compressed ? formatSize(compressed.size) : '—'}
              </div>
              <div className="text-xs text-gray-500">
                {compressed ? `${Math.round((1 - compressed.size / original.size) * 100)}% smaller` : 'Compressed'}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={compress} disabled={processing} className="btn-primary flex-1 justify-center">
              {processing ? '⏳ Processing...' : '🗜️ Compress Image'}
            </button>
            {compressed && (
              <a href={compressed.src} download={`compressed_${compressed.name}`} className="btn-secondary px-4 py-3 text-sm">
                ⬇️ Save
              </a>
            )}
          </div>

          {original && (
            <div className="mt-4">
              <img src={compressed ? compressed.src : original.src} alt="Preview" className="w-full rounded-xl border border-gray-200 max-h-48 object-contain" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── URL Shortener ───────────────────────────────────────────────────────────
function URLShortener() {
  const [url, setUrl] = useState('');
  const [shortened, setShortened] = useState('');
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shorten = async () => {
    if (!url.trim()) return;
    let targetUrl = url;
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(targetUrl)}`);
      const short = await res.text();
      if (short.startsWith('http')) {
        setShortened(short);
        setHistory((h) => [{ original: targetUrl, short, date: new Date().toLocaleTimeString() }, ...h].slice(0, 5));
      } else {
        setError('Could not shorten. Please check the URL.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && shorten()}
          placeholder="https://example.com/very-long-url..."
          className="input-field flex-1"
        />
        <button onClick={shorten} disabled={loading} className="btn-primary px-5">
          {loading ? '⏳' : '✂️'}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm mb-4">{error}</div>}

      {shortened && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center justify-between gap-3">
          <a href={shortened} target="_blank" rel="noopener noreferrer" className="text-green-700 font-semibold text-sm hover:underline truncate">
            {shortened}
          </a>
          <button onClick={() => copy(shortened)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex-shrink-0">
            {copied ? '✅' : '📋 Copy'}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Recent:</h4>
          <div className="space-y-2">
            {history.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-xs">
                <div className="text-gray-400 truncate mb-1">{item.original}</div>
                <div className="flex items-center justify-between">
                  <a href={item.short} target="_blank" rel="noopener noreferrer" className="text-brand-600 font-semibold hover:underline">{item.short}</a>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{item.date}</span>
                    <button onClick={() => copy(item.short)} className="text-gray-500 hover:text-brand-600 transition-colors">📋</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color Picker ────────────────────────────────────────────────────────────
function ColorPicker() {
  const [color, setColor] = useState('#4f46e5');
  const [copied, setCopied] = useState('');

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const hexToHsl = (hex) => {
    let { r, g, b } = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const { r, g, b } = hexToRgb(color);
  const { h, s, l } = hexToHsl(color);

  const copyVal = (val, label) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const formats = [
    { label: 'HEX', value: color },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, 1)` },
  ];

  const swatches = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#4f46e5', '#7c3aed', '#a855f7', '#ec4899', '#000000', '#ffffff'];

  return (
    <div>
      <div className="flex gap-4 items-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl shadow-lg border-4 border-white" style={{ backgroundColor: color }} />
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-2xl" />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Click to change color</p>
          <p className="font-mono font-bold text-xl text-gray-800">{color.toUpperCase()}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {formats.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
            <span className="text-xs font-bold text-gray-400 w-12">{label}</span>
            <span className="font-mono text-sm text-gray-700 flex-1">{value}</span>
            <button
              onClick={() => copyVal(value, label)}
              className="text-xs text-brand-600 hover:text-brand-800 font-medium"
            >
              {copied === label ? '✅' : '📋'}
            </button>
          </div>
        ))}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-3">Quick Swatches</p>
        <div className="flex flex-wrap gap-2">
          {swatches.map((s) => (
            <button
              key={s}
              onClick={() => setColor(s)}
              className={`w-8 h-8 rounded-lg shadow-sm transition-transform hover:scale-110 border-2 ${color === s ? 'border-gray-900 scale-110' : 'border-white'}`}
              style={{ backgroundColor: s }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
const tools = [
  { id: 'password', emoji: '🔐', name: 'Password Generator', desc: 'Generate secure, random passwords', color: '#4f46e5', component: PasswordGenerator },
  { id: 'qrcode', emoji: '📱', name: 'QR Code Generator', desc: 'Create QR codes for any URL or text', color: '#059669', component: QRCodeGenerator },
  { id: 'wordcounter', emoji: '📝', name: 'Word Counter', desc: 'Count words, characters, and more', color: '#d97706', component: WordCounter },
  { id: 'imgcompress', emoji: '🖼️', name: 'Image Compressor', desc: 'Compress images without quality loss', color: '#dc2626', component: ImageCompressor },
  { id: 'urlshortener', emoji: '🔗', name: 'URL Shortener', desc: 'Shorten long URLs instantly', color: '#7c3aed', component: URLShortener },
  { id: 'colorpicker', emoji: '🎨', name: 'Color Picker', desc: 'Pick colors and get HEX, RGB, HSL', color: '#db2777', component: ColorPicker },
];

export default function FreeToolsPage() {
  const [activeTool, setActiveTool] = useState('password');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && tools.find((t) => t.id === hash)) setActiveTool(hash);
    }
  }, []);

  const currentTool = tools.find((t) => t.id === activeTool);
  const ToolComponent = currentTool?.component;

  return (
    <Layout title="Free Online Tools" description="Free browser-based tools: password generator, QR code, word counter, image compressor, URL shortener">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 py-14 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-5">
            🆓 <span>100% Free • No Signup • Works in Browser</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Free Online Tools</h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Handy browser-based utilities for developers, designers, and everyone else.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sticky top-20">
              {tools.map(({ id, emoji, name, color }) => (
                <button
                  key={id}
                  id={id}
                  onClick={() => setActiveTool(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 mb-1 ${
                    activeTool === id
                      ? 'bg-brand-50 text-brand-700 border border-brand-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="font-medium text-sm">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tool Area */}
          <div className="lg:col-span-3">
            {currentTool && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: currentTool.color + '15' }}
                  >
                    {currentTool.emoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{currentTool.name}</h2>
                    <p className="text-gray-500 text-sm">{currentTool.desc}</p>
                  </div>
                </div>
                <ToolComponent />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
