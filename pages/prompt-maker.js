import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { canUseCategory, getRemainingPrompts, canSavePrompt, Revenue } from '../data/monetization';
import { UpgradePrompt, PromptAd } from '../components/Ads';

const promptCategories = [
  { id:'image',label:'Image Prompt',icon:'🎨',color:'#7c3aed',bg:'from-purple-600 to-pink-600',desc:'Midjourney, DALL-E, Flux',locked:false,fields:[{key:'subject',label:'Subject / Main Idea',placeholder:'A futuristic city at sunset',type:'text',required:true},{key:'style',label:'Art Style',type:'select',options:['Photorealistic','Digital Art','Oil Painting','Watercolor','Anime / Manga','Cinematic','3D Render','Pencil Sketch','Cyberpunk','Studio Ghibli']},{key:'mood',label:'Mood',type:'select',options:['Epic','Serene','Mysterious','Dramatic','Cheerful','Dark','Ethereal','Romantic','Futuristic']},{key:'lighting',label:'Lighting',type:'select',options:['Golden hour','Neon lights','Studio lighting','Dramatic shadows','Moonlight','Sunrise','God rays','Bioluminescent']},{key:'quality',label:'Quality Tags',type:'multicheck',options:['8K ultra HD','Highly detailed','Masterpiece','Award winning','Sharp focus','Intricate details']},{key:'negative',label:'Negative Prompt',placeholder:'blurry, text, watermark',type:'text'}]},
  { id:'chatbot',label:'ChatGPT / Claude',icon:'💬',color:'#10a37f',bg:'from-emerald-600 to-teal-600',desc:'ChatGPT, Claude, Gemini',locked:false,fields:[{key:'role',label:'AI Role',placeholder:'You are an expert marketing consultant...',type:'text',required:true},{key:'task',label:'Task',placeholder:'Help me write a product launch campaign',type:'text',required:true},{key:'context',label:'Context',placeholder:'My product is a SaaS tool for small teams...',type:'textarea'},{key:'tone',label:'Tone',type:'select',options:['Professional','Casual','Academic','Persuasive','Humorous','Direct']},{key:'format',label:'Output Format',type:'select',options:['Bullet points','Numbered list','Detailed essay','Table','Step-by-step','Short summary','JSON','Markdown']},{key:'constraint',label:'What to Avoid',placeholder:'Avoid jargon, no competitor mentions',type:'text'}]},
  { id:'writing',label:'Writing / Content',icon:'✍️',color:'#d97706',bg:'from-amber-600 to-orange-600',desc:'Jasper, Copy.ai, Writesonic',locked:false,fields:[{key:'contentType',label:'Content Type',type:'select',options:['Blog post','Social media post','Email newsletter','Product description','Ad copy','YouTube script','LinkedIn post','Landing page copy'],required:true},{key:'topic',label:'Topic',placeholder:'10 tips to improve productivity with AI',type:'text',required:true},{key:'audience',label:'Target Audience',placeholder:'Startup founders, 25-40, tech-savvy',type:'text'},{key:'writingTone',label:'Tone',type:'select',options:['Informative','Persuasive','Conversational','Professional','Witty','Inspiring']},{key:'wordCount',label:'Word Count',type:'select',options:['~100 words','~300 words','~500 words','~800 words','~1200 words','~2000 words']},{key:'seo',label:'SEO Keywords',placeholder:'AI tools, best AI tools 2026',type:'text'}]},
  { id:'video',label:'Video Prompt',icon:'🎬',color:'#dc2626',bg:'from-red-600 to-orange-600',desc:'Sora, Runway, Kling, Luma',locked:true,fields:[{key:'scene',label:'Scene Description',placeholder:'A drone flying over misty mountains at dawn',type:'text',required:true},{key:'cameraMotion',label:'Camera Movement',type:'select',options:['Static shot','Slow zoom in','Pan left','Dolly forward','Orbit shot','Drone aerial','Tracking shot','Time lapse']},{key:'duration',label:'Duration',type:'select',options:['5 seconds','10 seconds','15 seconds','30 seconds cinematic']},{key:'videoStyle',label:'Style',type:'select',options:['Photorealistic 4K','Cinematic film','Anime','3D animated','Documentary','Sci-fi']},{key:'sound',label:'Audio Cue',placeholder:'Epic orchestral music, birds chirping',type:'text'}]},
  { id:'coding',label:'Coding Prompt',icon:'👨‍💻',color:'#1d4ed8',bg:'from-blue-700 to-indigo-700',desc:'Cursor, Copilot, Bolt.new, v0',locked:true,fields:[{key:'task',label:'What to Build',placeholder:'A React dashboard with sales charts',type:'text',required:true},{key:'language',label:'Stack',type:'select',options:['JavaScript / React','TypeScript / Next.js','Python / FastAPI','Node.js / Express','Vue.js','Flutter','Swift iOS','Go','Rust']},{key:'features',label:'Key Features',placeholder:'Auth, dark mode, responsive, real-time',type:'textarea'},{key:'styling',label:'Styling',type:'select',options:['Tailwind CSS','CSS Modules','Material UI','Shadcn/ui','Bootstrap']},{key:'database',label:'Backend',type:'select',options:['None','Supabase','Firebase','PostgreSQL + Prisma','MongoDB','REST API']},{key:'codeStyle',label:'Code Style',type:'select',options:['Clean production-ready','With comments','With unit tests','Minimal']}]},
  { id:'audio',label:'Voice / Music',icon:'🎵',color:'#ec4899',bg:'from-pink-600 to-rose-600',desc:'ElevenLabs, Suno, Udio',locked:true,fields:[{key:'audioType',label:'Audio Type',type:'select',options:['Voice narration / TTS','Full song with lyrics','Instrumental background','Sound effect','Podcast intro','Ad jingle'],required:true},{key:'genre',label:'Genre',type:'select',options:['Pop','Hip-hop','EDM / Electronic','Lo-fi chill','Classical','Jazz','Rock','Ambient','Cinematic / Epic']},{key:'voiceType',label:'Voice Type',type:'select',options:['Deep male narrator','Warm female narrator','Young energetic','British accent','Calm & soothing']},{key:'mood2',label:'Mood',type:'select',options:['Happy & uplifting','Melancholic','Epic & powerful','Relaxing','Mysterious','Motivational']},{key:'lyrics',label:'Lyrics / Script',placeholder:'Paste your lyrics or script here...',type:'textarea'}]},
  { id:'business',label:'Business / Marketing',icon:'📊',color:'#0891b2',bg:'from-cyan-600 to-blue-600',desc:'HubSpot AI, Jasper, Copy.ai',locked:true,fields:[{key:'bizTask',label:'Business Task',type:'select',options:['Marketing strategy','Sales email sequence','Social media strategy','Business plan','Competitor analysis','Customer persona','SWOT analysis','Pitch deck content'],required:true},{key:'industry',label:'Industry',placeholder:'SaaS, E-commerce, Healthcare',type:'text'},{key:'company',label:'Company / Product',placeholder:'Our app helps freelancers track invoices',type:'text'},{key:'goal',label:'Goal',type:'select',options:['Increase sales','Generate leads','Build brand awareness','Launch product','Reduce churn']},{key:'kpi',label:'Success Metrics',placeholder:'1000 signups, 20% conversion',type:'text'}]},
  { id:'app',label:'App / Product',icon:'📱',color:'#059669',bg:'from-emerald-600 to-green-600',desc:'Bolt.new, v0, Framer, Lovable',locked:true,fields:[{key:'appIdea',label:'App Idea / Name',placeholder:'A habit tracker app called StreakAI',type:'text',required:true},{key:'appType',label:'App Type',type:'select',options:['Web App','Mobile App','Chrome Extension','SaaS Platform','Landing Page','E-commerce Store','Dashboard']},{key:'targetUser',label:'Target User',placeholder:'Busy professionals who want to build habits',type:'text'},{key:'coreFeatures',label:'Core Features',placeholder:'1. Daily habit check-in\n2. Streak tracking\n3. AI motivation messages',type:'textarea'},{key:'design',label:'Design Style',type:'select',options:['Clean & minimal','Dark mode','Colorful & playful','Corporate','Glass morphism']},{key:'techStack',label:'Tech Stack',type:'select',options:['Next.js + Tailwind','React + Firebase','Vue + Supabase','Flutter','React Native','No code preferred']}]},
];

function FieldRenderer({ field, value, onChange }) {
  if (field.type==='text') return <input type="text" placeholder={field.placeholder} value={value||''} onChange={e=>onChange(field.key,e.target.value)} className="input-field" />;
  if (field.type==='textarea') return <textarea placeholder={field.placeholder} value={value||''} onChange={e=>onChange(field.key,e.target.value)} rows={3} className="input-field resize-none" />;
  if (field.type==='select') return (<select value={value||''} onChange={e=>onChange(field.key,e.target.value)} className="input-field"><option value="">— Select —</option>{field.options.map(o=><option key={o} value={o}>{o}</option>)}</select>);
  if (field.type==='multicheck') { const sel=value?value.split(', ').filter(Boolean):[]; const toggle=opt=>{const n=sel.includes(opt)?sel.filter(s=>s!==opt):[...sel,opt];onChange(field.key,n.join(', '));}; return (<div className="flex flex-wrap gap-2">{field.options.map(opt=>(<button key={opt} type="button" onClick={()=>toggle(opt)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${sel.includes(opt)?'bg-indigo-600 border-indigo-600 text-white':'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'}`}>{opt}</button>))}</div>); }
  return null;
}

function buildPrompt(cat, v) {
  switch(cat.id) {
    case 'image': { const p=[]; if(v.subject)p.push(v.subject); if(v.style)p.push(v.style+' style'); if(v.mood)p.push(v.mood+' mood'); if(v.lighting)p.push(v.lighting+' lighting'); if(v.quality)p.push(v.quality); let r=p.join(', '); if(v.negative)r+='\n\nNegative prompt: '+v.negative; return r; }
    case 'video': return [v.scene,v.cameraMotion&&'Camera: '+v.cameraMotion,v.videoStyle&&'Style: '+v.videoStyle,v.duration&&'Duration: '+v.duration,v.sound&&'Audio: '+v.sound].filter(Boolean).join('. ');
    case 'chatbot': return [(v.role&&v.role+'.\n\n'),(v.task&&'Task: '+v.task+'\n\n'),(v.context&&'Context: '+v.context+'\n\n'),(v.tone&&'Tone: '+v.tone+'. '),(v.format&&'Format: '+v.format+'. '),(v.constraint&&'\nAvoid: '+v.constraint)].filter(Boolean).join('').trim();
    case 'writing': return [(v.contentType&&'Write a '+v.contentType),(v.topic&&' about: "'+v.topic+'"\n\n'),(v.audience&&'Audience: '+v.audience+'\n'),(v.writingTone&&'Tone: '+v.writingTone+'\n'),(v.wordCount&&'Length: '+v.wordCount+'\n'),(v.seo&&'SEO keywords: '+v.seo)].filter(Boolean).join('').trim();
    case 'coding': return [v.task&&'Build: '+v.task+'\n',v.language&&'Stack: '+v.language+'\n',v.styling&&'Styling: '+v.styling+'\n',v.database&&'Backend: '+v.database+'\n',v.features&&'\nFeatures:\n'+v.features+'\n',v.codeStyle&&'Style: '+v.codeStyle].filter(Boolean).join('').trim();
    case 'audio': return [v.audioType&&'Create: '+v.audioType+'\n',v.genre&&'Genre: '+v.genre+'\n',v.voiceType&&'Voice: '+v.voiceType+'\n',v.mood2&&'Mood: '+v.mood2+'\n',v.lyrics&&'\nScript:\n'+v.lyrics].filter(Boolean).join('').trim();
    case 'business': return [v.bizTask&&'Task: '+v.bizTask+'\n',v.company&&'Company: '+v.company+'\n',v.industry&&'Industry: '+v.industry+'\n',v.goal&&'Goal: '+v.goal+'\n',v.kpi&&'KPIs: '+v.kpi].filter(Boolean).join('').trim();
    case 'app': return [v.appIdea&&'App: '+v.appIdea+'\n',v.appType&&'Type: '+v.appType+'\n',v.targetUser&&'User: '+v.targetUser+'\n',v.design&&'Design: '+v.design+'\n',v.techStack&&'Stack: '+v.techStack+'\n',v.coreFeatures&&'\nFeatures:\n'+v.coreFeatures].filter(Boolean).join('').trim();
    default: return '';
  }
}

export default function PromptMakerPage() {
  const { user, updateUser } = useAuth();
  const [activeCat, setActiveCat] = useState('image');
  const [values, setValues] = useState({});
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const cat = promptCategories.find(c => c.id === activeCat);
  const isLocked = !canUseCategory(user, activeCat);
  const remaining = getRemainingPrompts(user);
  const isPro = user?.plan === 'pro' || user?.plan === 'team';
  const outOfPrompts = !isPro && remaining === 0;

  const setValue = (k, v) => { setValues(p=>({...p,[k]:v})); setGenerated(''); };

  const generate = () => {
    if (isLocked || outOfPrompts) { setShowUpgrade(true); return; }
    const prompt = buildPrompt(cat, values);
    if (!prompt.trim()) { alert('Please fill in the required fields.'); return; }
    setGenerated(prompt); setSaved(false);
    Revenue.trackPromptUsed(user, updateUser);
    setHistory(h=>[{id:Date.now(),category:cat.label,icon:cat.icon,prompt,createdAt:new Date().toLocaleTimeString()},...h].slice(0,15));
  };

  const copy = () => { navigator.clipboard.writeText(generated); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const savePrompt = () => {
    if (!canSavePrompt(user)) { setShowUpgrade(true); return; }
    const entry = {id:Date.now(),category:cat.label,icon:cat.icon,prompt:generated,createdAt:new Date().toLocaleString()};
    updateUser({ savedPrompts:[entry,...(user.savedPrompts||[])] }); setSaved(true);
  };

  return (
    <Layout title="AI Prompt Maker" description="Generate perfect prompts for any AI tool">
      <div className="relative py-14 overflow-hidden" style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-purple-200 mb-4">✨ AI Prompt Generator</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">AI Prompt Maker</h1>
          <p className="text-purple-200 text-lg max-w-xl mx-auto mb-5">Perfect prompts for <strong className="text-white">any AI tool</strong> — image, video, code, audio & more.</p>
          {!isPro && (
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm text-white">
              {remaining > 0 ? <><span className="font-bold text-green-300">{remaining}</span> free prompts remaining today — <a href="/#pricing" className="text-yellow-300 underline font-bold ml-1">Unlimited with Pro →</a></> : <><span className="font-bold text-red-300">0 left today</span> — <a href="/#pricing" className="underline text-yellow-300 font-bold ml-1">Upgrade to Pro →</a></>}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider">Choose Prompt Type</h2>
            {!isPro && <a href="/#pricing" className="text-xs text-indigo-600 font-bold hover:underline">🔒 Unlock all 8 for $9/mo →</a>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {promptCategories.map(c => {
              const locked = !canUseCategory(user, c.id);
              return (
                <button key={c.id} onClick={()=>{setActiveCat(c.id);setValues({});setGenerated('');setShowUpgrade(false);}}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 relative ${activeCat===c.id?'border-transparent text-white shadow-lg scale-105':'border-gray-200 bg-white text-gray-600 hover:border-gray-300'} ${locked?'opacity-70':''}`}
                  style={activeCat===c.id?{background:`linear-gradient(135deg,${c.color},${c.color}99)`}:{}}>
                  {locked && <div className="absolute top-1.5 right-1.5 text-xs">🔒</div>}
                  <span className="text-2xl">{c.icon}</span>
                  <span className="text-xs font-bold text-center leading-tight">{c.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className={`rounded-2xl p-5 text-white bg-gradient-to-r ${cat.bg}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div><h2 className="font-black text-xl">{cat.label}</h2><p className="text-white/70 text-sm">{cat.desc}</p></div>
                {isLocked && <div className="ml-auto bg-white/20 rounded-xl px-3 py-1.5 text-xs font-bold">🔒 Pro Only</div>}
              </div>
            </div>

            {(isLocked || showUpgrade) ? (
              <UpgradePrompt message={outOfPrompts ? "You've used all 5 free prompts today" : `${cat.label} is a Pro-only feature`} />
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
                {cat.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{field.label}{field.required&&<span className="text-red-500 ml-1">*</span>}</label>
                    <FieldRenderer field={field} value={values[field.key]} onChange={setValue} />
                  </div>
                ))}
                <div className="flex gap-3 pt-3">
                  <button onClick={generate} disabled={outOfPrompts}
                    className={`flex-1 py-4 rounded-2xl font-black text-white text-base transition-all hover:-translate-y-0.5 bg-gradient-to-r ${cat.bg} disabled:opacity-50 disabled:cursor-not-allowed`}>
                    ✨ Generate {!isPro && remaining!==Infinity && `(${remaining} left)`}
                  </button>
                  <button onClick={()=>{setValues({});setGenerated('');}} className="px-5 py-4 rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 text-sm font-semibold">Clear</button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-gray-900">Output</h3>
                {generated && (
                  <div className="flex gap-2">
                    <button onClick={copy} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${copied?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{copied?'✅ Copied!':'📋 Copy'}</button>
                    <button onClick={canSavePrompt(user)?savePrompt:()=>setShowUpgrade(true)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${saved?'bg-purple-100 text-purple-700':canSavePrompt(user)?'bg-indigo-50 text-indigo-600':'bg-gray-100 text-gray-400'}`}>{saved?'✅ Saved':canSavePrompt(user)?'🔖 Save':'🔒 Save'}</button>
                  </div>
                )}
              </div>
              {generated ? (
                <div className="bg-gray-950 rounded-2xl p-4 font-mono text-sm text-green-300 leading-relaxed whitespace-pre-wrap break-words min-h-[150px] max-h-[360px] overflow-y-auto">{generated}</div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200 min-h-[150px] flex flex-col items-center justify-center gap-3">
                  <div className="text-4xl">{cat.icon}</div>
                  <p className="text-gray-400 text-sm">Fill fields → <strong className="text-gray-600">Generate</strong></p>
                </div>
              )}
              {generated && <div className="mt-2 text-xs text-gray-400 text-center">{generated.length} characters</div>}
              {generated && <PromptAd />}
            </div>

            {!isPro && (
              <div className="rounded-2xl p-5 text-white" style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)'}}>
                <div className="font-black text-base mb-1">🚀 Pro — $9/month</div>
                <ul className="text-indigo-200 text-xs space-y-1 mb-4">
                  <li>✓ Unlimited prompts daily</li>
                  <li>✓ All 8 categories unlocked</li>
                  <li>✓ Save & export prompts</li>
                  <li>✓ No ads</li>
                </ul>
                <a href="/#pricing" className="block w-full py-2.5 bg-white text-indigo-700 font-black text-sm rounded-xl text-center hover:bg-indigo-50 transition-all">Upgrade Now →</a>
              </div>
            )}

            {history.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                <h4 className="font-black text-gray-800 mb-3 text-sm">🕐 Session History</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.map(item => (
                    <div key={item.id} onClick={()=>setGenerated(item.prompt)} className="p-3 bg-gray-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-colors">
                      <div className="flex items-center gap-2 mb-1"><span>{item.icon}</span><span className="text-xs font-bold text-gray-600">{item.category}</span><span className="text-xs text-gray-400 ml-auto">{item.createdAt}</span></div>
                      <p className="text-xs text-gray-500 line-clamp-1 font-mono">{item.prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
