# 🤖 AIToolsHub

A modern, full-featured AI tools directory website built with Next.js 14, React, and Tailwind CSS.

---

## 🚀 Features

- **75+ AI Tools Listed** — ChatGPT, Claude, Midjourney, Sora, Cursor, ElevenLabs, and every major AI tool
- **Advanced Search & Filtering** — Search by name, description, or tag; filter by 17+ categories
- **6 Working Free Tools** — Password Generator, QR Code Generator, Word Counter, Image Compressor, URL Shortener, Color Picker
- **Blog Section** — AI news, comparisons, and guides
- **Tutorials Page** — Step-by-step AI tool guides
- **Fully Responsive** — Mobile, tablet, and desktop
- **Modern Design** — Gradient hero, soft shadows, hover animations

---

## 📁 Project Structure

```
aitoolshub/
├── components/
│   ├── Layout.js         # Page wrapper with head/meta
│   ├── Navbar.js         # Responsive navigation
│   ├── Footer.js         # Footer with newsletter
│   └── ToolCard.js       # Reusable AI tool card
├── data/
│   └── aiTools.js        # All 75+ AI tools + blog posts
├── pages/
│   ├── _app.js           # App entry point
│   ├── index.js          # Homepage
│   ├── ai-tools.js       # AI Tools directory
│   ├── free-tools.js     # Free browser utilities
│   ├── blog.js           # Blog listing
│   └── tutorials.js      # Tutorial guides
├── styles/
│   └── globals.css       # Global styles + Tailwind
├── public/               # Static assets
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm start
```

---

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"New Project"** → Import your GitHub repo
4. Vercel auto-detects Next.js — click **"Deploy"**
5. Your site is live in ~60 seconds! 🎉

### Environment Variables (Optional)
No environment variables required for the base setup.

---

## 🛠️ Customization

### Add more AI tools
Edit `data/aiTools.js` and add entries to the `aiTools` array:

```js
{ 
  id: 76, 
  name: "New AI Tool", 
  category: "Chatbot", 
  description: "Description here",
  url: "https://example.com",
  logo: "🤖",
  color: "#4f46e5",
  featured: false,
  rating: 4.5,
  users: "1M+",
  free: true,
  tags: ["chatbot", "ai"]
}
```

### Change color scheme
Edit `tailwind.config.js` — update the `brand` color palette.

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured tools, free tools, blog |
| `/ai-tools` | Full AI tools directory with search & filter |
| `/free-tools` | 6 working browser utilities |
| `/blog` | Blog articles |
| `/tutorials` | Step-by-step AI guides |

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14
- **UI**: React 18
- **Styling**: Tailwind CSS 3
- **Icons**: Custom emoji-based
- **Fonts**: Sora (Google Fonts)
- **QR API**: QR Server (free)
- **URL API**: TinyURL (free)

---

Built by Rayyan Khan 
