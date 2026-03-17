// ─── Pricing Plans ────────────────────────────────────────────────────────────
export const plans = [
  {
    id: 'free',
    name: 'Starter',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for exploring AI tools',
    badge: null,
    features: [
      '10 AI prompts per day',
      'Access to 75+ AI tools directory',
      '3 free online utilities',
      'Basic prompt templates',
      'Community support',
    ],
    limits: { prompts: 10, tools: true, utilities: 3, history: 7 },
    cta: 'Start Free',
    color: '#6366f1',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 9, yearly: 7 },
    description: 'For power users & creators',
    badge: '🔥 Most Popular',
    features: [
      'Unlimited AI prompts',
      'All 8 prompt categories',
      'All free utilities unlocked',
      'Save & organize prompts',
      'Prompt history (30 days)',
      'Priority email support',
      'Early access to new tools',
    ],
    limits: { prompts: -1, tools: true, utilities: 6, history: 30 },
    cta: 'Go Pro',
    color: '#8b5cf6',
  },
  {
    id: 'enterprise',
    name: 'Team',
    price: { monthly: 29, yearly: 24 },
    description: 'For teams & agencies',
    badge: '🏢 Best Value',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared prompt library',
      'Admin dashboard',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
    limits: { prompts: -1, tools: true, utilities: 6, history: 365 },
    cta: 'Start Team Trial',
    color: '#f59e0b',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Content Creator',
    company: 'FreelanceHub',
    avatar: 'SC',
    color: '#6366f1',
    rating: 5,
    text: 'AIToolsHub saved me hours every week. The prompt maker is insane — I went from struggling with Midjourney to generating stunning visuals in minutes.',
  },
  {
    name: 'Marcus Rivera',
    role: 'Full-Stack Developer',
    company: 'Acme Corp',
    avatar: 'MR',
    color: '#10b981',
    rating: 5,
    text: 'The coding prompt generator for Cursor AI is a game changer. I describe what I want and get production-ready prompts. My productivity doubled.',
  },
  {
    name: 'Priya Patel',
    role: 'Marketing Director',
    company: 'GrowthScale',
    avatar: 'PP',
    color: '#f59e0b',
    rating: 5,
    text: 'We use AIToolsHub for our entire marketing team. The business prompt maker alone is worth 10x the price. Highly recommend the Team plan.',
  },
  {
    name: 'Alex Thompson',
    role: 'YouTuber & Creator',
    company: '500K Subs',
    avatar: 'AT',
    color: '#ef4444',
    rating: 5,
    text: 'The video prompt generator is perfect for Runway AI. My thumbnails and video scripts have never been better. AIToolsHub is my daily driver.',
  },
  {
    name: 'Lena Müller',
    role: 'UX Designer',
    company: 'DesignStudio',
    avatar: 'LM',
    color: '#8b5cf6',
    rating: 5,
    text: 'Finally a place that lists ALL the AI design tools with real descriptions. The image prompt maker is my secret weapon for client pitches.',
  },
  {
    name: 'James Kim',
    role: 'Startup Founder',
    company: 'Launchpad AI',
    avatar: 'JK',
    color: '#0891b2',
    rating: 5,
    text: 'We built our entire AI strategy around tools we discovered on AIToolsHub. The directory is better than anything else out there. 10/10.',
  },
];

// ─── Company Logos (ticker) ───────────────────────────────────────────────────
export const companies = [
  { name: 'Notion', logo: '📓' },
  { name: 'Figma', logo: '🎪' },
  { name: 'Stripe', logo: '💳' },
  { name: 'Vercel', logo: '▲' },
  { name: 'OpenAI', logo: '⚙️' },
  { name: 'Anthropic', logo: '🔮' },
  { name: 'GitHub', logo: '👾' },
  { name: 'Shopify', logo: '🛍️' },
  { name: 'HubSpot', logo: '🔶' },
  { name: 'Canva', logo: '🎯' },
  { name: 'Slack', logo: '💬' },
  { name: 'Zoom', logo: '📹' },
];

// ─── Dashboard usage stats ─────────────────────────────────────────────────────
export const getUsageStats = (user) => {
  const plan = user?.plan || 'free';
  const promptsUsed = user?.promptsUsed || 0;
  const limit = plan === 'free' ? 10 : -1;

  return {
    plan,
    promptsUsed,
    promptsLimit: limit,
    promptsPercent: limit === -1 ? 100 : Math.min(100, (promptsUsed / limit) * 100),
    savedPrompts: (user?.savedPrompts || []).length,
    toolsViewed: user?.toolsViewed || 0,
    joinDate: user?.createdAt,
    streak: user?.streak || 1,
  };
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    q: 'What is AIToolsHub?',
    a: 'AIToolsHub is the most comprehensive directory of AI tools online, combined with an AI Prompt Maker, free utilities, and tutorials — all in one place.',
  },
  {
    q: 'Can I use it for free?',
    a: 'Yes! The Starter plan is completely free — access 75+ AI tools, use 10 prompts per day, and try 3 free utilities. No credit card required.',
  },
  {
    q: 'What does the Prompt Maker do?',
    a: 'The Prompt Maker generates perfectly formatted prompts for 8 categories of AI tools: image, video, chatbot, coding, writing, audio, business, and app building.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel anytime with no questions asked. You keep access until the end of your billing period.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes — 7-day money-back guarantee on all paid plans. No questions asked.',
  },
  {
    q: 'Is there a Team/Enterprise plan?',
    a: 'Yes! The Team plan supports up to 10 members with a shared prompt library, admin dashboard, and API access. Contact us for larger teams.',
  },
];
