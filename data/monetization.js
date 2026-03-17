// ─── YOUR AFFILIATE LINKS ────────────────────────────────────────────────────
// Replace these with your actual affiliate URLs once you sign up
// Sign up at: jasper.ai/affiliate, elevenlabs.io/affiliates, etc.

export const affiliateLinks = {
  // Chatbots — sign up at: platform.openai.com/affiliates
  'ChatGPT':         { url: 'https://openai.com/chatgpt', commission: '$10–20/referral', program: 'OpenAI Affiliate' },
  'Claude':          { url: 'https://claude.ai', commission: 'N/A', program: 'Direct' },
  'Perplexity AI':   { url: 'https://perplexity.ai/?via=YOUR_ID', commission: '$5/referral', program: 'Perplexity Affiliate' },
  'Jasper AI':       { url: 'https://jasper.ai?fpr=YOUR_ID', commission: '25% recurring', program: 'Jasper Affiliate' },
  'Copy.ai':         { url: 'https://www.copy.ai/?via=YOUR_ID', commission: '45% recurring', program: 'Copy.ai Affiliate' },
  'Writesonic':      { url: 'https://writesonic.com?via=YOUR_ID', commission: '30% recurring', program: 'Writesonic Affiliate' },

  // Image tools
  'Midjourney':      { url: 'https://midjourney.com', commission: 'N/A', program: 'No program yet' },
  'Leonardo AI':     { url: 'https://app.leonardo.ai/?via=YOUR_ID', commission: '20% recurring', program: 'Leonardo Affiliate' },
  'Adobe Firefly':   { url: 'https://adobe.com?sdid=YOUR_ID', commission: '85% first month', program: 'Adobe Affiliate' },
  'Canva AI':        { url: 'https://canva.com?via=YOUR_ID', commission: '$36/Pro signup', program: 'Canva Affiliate' },

  // Video
  'Runway AI':       { url: 'https://runwayml.com?via=YOUR_ID', commission: '20% recurring', program: 'Runway Affiliate' },
  'Synthesia':       { url: 'https://synthesia.io?via=YOUR_ID', commission: '25% first year', program: 'Synthesia Partner' },
  'HeyGen':          { url: 'https://heygen.com?via=YOUR_ID', commission: '20% recurring', program: 'HeyGen Affiliate' },

  // Coding
  'GitHub Copilot':  { url: 'https://github.com/features/copilot', commission: 'N/A', program: 'No public program' },
  'Cursor':          { url: 'https://cursor.sh', commission: 'N/A', program: 'No program yet' },
  'Tabnine':         { url: 'https://tabnine.com?via=YOUR_ID', commission: '20%', program: 'Tabnine Affiliate' },

  // Audio
  'ElevenLabs':      { url: 'https://elevenlabs.io?via=YOUR_ID', commission: '22% recurring', program: 'ElevenLabs Affiliate' },
  'Suno AI':         { url: 'https://suno.ai', commission: 'N/A', program: 'No program yet' },
  'Descript':        { url: 'https://descript.com?via=YOUR_ID', commission: '15% recurring', program: 'Descript Affiliate' },

  // Productivity
  'Notion AI':       { url: 'https://notion.so?via=YOUR_ID', commission: '$20/referral', program: 'Notion Affiliate' },
  'Grammarly':       { url: 'https://grammarly.com?via=YOUR_ID', commission: '$0.20 free / $20 premium', program: 'Grammarly Affiliate' },

  // SEO
  'Surfer SEO':      { url: 'https://surferseo.com?via=YOUR_ID', commission: '25% recurring', program: 'Surfer Affiliate' },
  'Semrush':         { url: 'https://semrush.com?via=YOUR_ID', commission: '$200/sale', program: 'Semrush BeRush' },
};

// ─── Get affiliate URL (falls back to direct URL) ─────────────────────────────
export function getToolUrl(toolName, directUrl) {
  const aff = affiliateLinks[toolName];
  if (aff && !aff.url.includes('YOUR_ID')) return aff.url;
  return directUrl;
}

// ─── SPONSORED TOOLS (paying customers get featured placement) ───────────────
// Edit this list when someone pays for a sponsored slot
// Price: $99–$299/month per sponsored slot

export const sponsoredTools = [
  // Example — remove and add real paying sponsors:
  // { id: 'jasper-ai', badge: 'Sponsored', priority: 1 },
];

export const isSponsoredTool = (toolName) =>
  sponsoredTools.some(s =>
    s.id === toolName.toLowerCase().replace(/\s+/g, '-')
  );

// ─── AD SLOT CONFIGURATION ───────────────────────────────────────────────────
// Replace with your real AdSense publisher ID: ca-pub-XXXXXXXXXXXXXXXX
// Apply at: adsense.google.com

export const adConfig = {
  publisherId: 'ca-pub-YOUR_PUBLISHER_ID', // ← Replace this
  slots: {
    banner_top:    'YOUR_AD_SLOT_1', // 728×90 leaderboard
    in_feed:       'YOUR_AD_SLOT_2', // 300×250 rectangle (between tool cards)
    sidebar:       'YOUR_AD_SLOT_3', // 300×600 half-page
    prompt_bottom: 'YOUR_AD_SLOT_4', // 728×90 below prompt output
  },
  // Set to false to hide ads for Pro users
  showForPro: false,
  enabled: false, // ← Set to true once you have AdSense approval
};

// ─── FREEMIUM GATES ───────────────────────────────────────────────────────────
export const planLimits = {
  free: {
    promptsPerDay: 5,
    promptCategories: ['image', 'chatbot', 'writing'], // 3 of 8
    canSavePrompts: false,
    canExportPrompts: false,
    canViewAffiliatePage: true,
    showAds: true,
    promptHistory: 0,
    savedTools: 3,
    label: 'Free',
    price: 0,
  },
  pro: {
    promptsPerDay: -1, // unlimited
    promptCategories: ['image', 'video', 'chatbot', 'coding', 'writing', 'audio', 'business', 'app'],
    canSavePrompts: true,
    canExportPrompts: true,
    canViewAffiliatePage: true,
    showAds: false,
    promptHistory: 30,
    savedTools: -1,
    label: 'Pro',
    price: 9,
  },
  team: {
    promptsPerDay: -1,
    promptCategories: ['image', 'video', 'chatbot', 'coding', 'writing', 'audio', 'business', 'app'],
    canSavePrompts: true,
    canExportPrompts: true,
    showAds: false,
    promptHistory: 365,
    savedTools: -1,
    label: 'Team',
    price: 29,
  },
};

export const lockedCategories = ['video', 'coding', 'audio', 'business', 'app'];

export function getUserPlan(user) {
  if (!user) return planLimits.free;
  return planLimits[user.plan] || planLimits.free;
}

export function canUseCategory(user, categoryId) {
  const limits = getUserPlan(user);
  return limits.promptCategories.includes(categoryId);
}

export function canSavePrompt(user) {
  return getUserPlan(user).canSavePrompts;
}

export function getRemainingPrompts(user) {
  const limits = getUserPlan(user);
  if (limits.promptsPerDay === -1) return Infinity;
  const used = user?.promptsUsedToday || 0;
  return Math.max(0, limits.promptsPerDay - used);
}

// ─── REVENUE TRACKING (localStorage — replace with real analytics later) ───────
export const Revenue = {
  trackAffiliate: (toolName) => {
    try {
      const clicks = JSON.parse(localStorage.getItem('aff_clicks') || '{}');
      clicks[toolName] = (clicks[toolName] || 0) + 1;
      localStorage.setItem('aff_clicks', JSON.stringify(clicks));
    } catch {}
  },
  trackPromptUsed: (user, updateUser) => {
    if (!user) return;
    const today = new Date().toDateString();
    const lastDate = user.promptsDate;
    const used = lastDate === today ? (user.promptsUsedToday || 0) : 0;
    updateUser({ promptsUsedToday: used + 1, promptsDate: today });
  },
  getAffiliateStats: () => {
    try {
      return JSON.parse(localStorage.getItem('aff_clicks') || '{}');
    } catch { return {}; }
  },
};

// ─── AFFILIATE PROGRAMS TO JOIN ───────────────────────────────────────────────
// Priority order based on commission rate + volume potential
export const affiliatePrograms = [
  { rank: 1, name: 'Copy.ai',    commission: '45% recurring', url: 'https://www.copy.ai/affiliates',          note: 'Best recurring rate' },
  { rank: 2, name: 'Jasper AI',  commission: '25% recurring', url: 'https://www.jasper.ai/affiliate-program', note: 'High ticket ($49–$125/mo)' },
  { rank: 3, name: 'Semrush',    commission: '$200/sale',      url: 'https://www.semrush.com/company/berush',  note: 'Highest per-sale payout' },
  { rank: 4, name: 'ElevenLabs', commission: '22% recurring', url: 'https://elevenlabs.io/affiliates',        note: 'Growing fast' },
  { rank: 5, name: 'Adobe',      commission: '85% first mo',  url: 'https://www.adobe.com/affiliates',        note: 'High conversion' },
  { rank: 6, name: 'Writesonic', commission: '30% recurring', url: 'https://writesonic.com/affiliate-program',note: 'Easy approval' },
  { rank: 7, name: 'Canva',      commission: '$36/Pro signup', url: 'https://www.canva.com/affiliates',       note: 'Very high volume' },
  { rank: 8, name: 'Runway',     commission: '20% recurring', url: 'https://runwayml.com/affiliates',         note: 'Video AI growing' },
  { rank: 9, name: 'Grammarly',  commission: '$20 premium',   url: 'https://www.grammarly.com/affiliates',   note: 'Massive user base' },
  { rank: 10,name: 'Notion',     commission: '$20/referral',  url: 'https://www.notion.so/affiliates',       note: 'Easy to promote' },
];
