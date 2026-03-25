import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, History, Video, Globe, X, Play, ArrowLeft } from 'lucide-react';
import StoryArc from './StoryArc';
import PulseTimeline from './PulseTimeline';

const Dashboard = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [briefing, setBriefing] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('English');
  const [persona, setPersona] = useState('Investor');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setVideoUrl('');
    try {
      const resp = await fetch(`http://localhost:8000/api/brief/?query=${query}&lang=${language.toLowerCase()}&role=${persona.toLowerCase()}`);
      const data = await resp.json();
      setBriefing(data);

      const timelineResp = await fetch(`http://localhost:8000/api/timeline/?topic=${query}`);
      const timelineData = await timelineResp.json();
      setTimeline(timelineData.events || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  const handleGenerateVideo = async () => {
    if (!briefing) return;
    setVideoLoading(true);
    try {
      const resp = await fetch(`http://localhost:8000/api/generate-video/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query, summary: briefing.summary })
      });
      const data = await resp.json();
      if (data.video_url) {
        const fullVideoUrl = `http://localhost:8000${data.video_url}`;
        console.log("🎥 GENERATED VIDEO URL:", fullVideoUrl);
        setVideoUrl(fullVideoUrl);
        setShowVideoModal(true);
      }
    } catch (err) {
      console.error("Video generation error:", err);
    }
    setVideoLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Premium Header */}
      <header className="glass-card p-4 md:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black neon-text tracking-tighter italic">ET PULSE</h1>
            <span className="text-[10px] tracking-[0.3em] font-bold text-white/40 uppercase">AI-Native Intelligence System</span>
          </div>
          
          <div className="h-10 w-px bg-white/10 hidden md:block"></div>

          <div className="flex bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/5 shadow-inner">
            {['English', 'Hindi', 'Tamil', 'Telugu'].map(lang => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${language === lang ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(0,255,65,0.4)]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
           {/* Persona Picker */}
           <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Personalize My ET</span>
              <select 
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-neon-green outline-none focus:border-neon-green/50 transition-colors"
              >
                <option value="Investor">MUTUAL FUND INVESTOR</option>
                <option value="Founder">STARTUP FOUNDER</option>
                <option value="Student">STUDENT (EXPLAINER)</option>
                <option value="Analyst">MARKET ANALYST</option>
              </select>
           </div>

           <div className="h-10 w-px bg-white/10 hidden xl:block"></div>

           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Global Market Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.4)]"></div>
                <span className="text-sm font-bold text-white/90">TRADING OPEN</span>
              </div>
           </div>
           
           <div className="text-right hidden sm:block">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">System Time</span>
              <p className="text-sm font-mono text-neon-green">2026-03-23 15:24</p>
           </div>
        </div>
      </header>

      {/* Main Intelligent Workspace */}
      <div className="grid grid-cols-12 gap-8 flex-1 items-start">
        
        {/* Navigation & Trend Side (Left) */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-6">
            <div className="flex items-center gap-2 text-neon-green">
              <Search className="w-4 h-4" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">News Navigator</h2>
            </div>
            
            <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="text" 
                  className="input-glow w-full rounded-xl py-4 pl-12 pr-4 text-white font-medium"
                  placeholder="Ask about any topic..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-green transition-colors" />
              </div>
              
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="neon-button w-full py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : 'SYNTHESIZE'}
              </button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex flex-col gap-6">
            <div className="flex items-center gap-2 text-white/40">
              <TrendingUp className="w-4 h-4" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Trending Pulse</h2>
            </div>
            
            <div className="flex flex-col gap-1">
              {['Budget 2026', 'Adani Ports', 'Zomato IPO', 'Green Hydrogen'].map(item => (
                <button 
                  key={item} 
                  onClick={() => { setQuery(item); }}
                  className="sidebar-item rounded-lg group"
                >
                  <span className="flex-1 text-left font-medium opacity-70 group-hover:opacity-100">{item}</span>
                  <History className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Central Intelligence Core */}
        <main className="col-span-12 lg:col-span-6 min-h-[600px]">
          {loading ? (
            <div className="glass-card h-full rounded-3xl flex flex-col items-center justify-center gap-6 p-12">
              <div className="relative">
                <div className="w-24 h-24 border-b-2 border-neon-green rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="w-10 h-10 text-white/20 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-black neon-text animate-pulse italic">ANALYZING GLOBAL DATA</span>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.5em] mt-2">Connecting to Inference Router...</span>
              </div>
            </div>
          ) : briefing ? (
            <div className="glass-card h-full rounded-3xl p-8 md:p-10 flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
               <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-white/5 pb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-glow"></div>
                       <span className="text-[10px] font-black text-neon-green uppercase tracking-widest">Intelligence Report</span>
                    </div>
                    <h3 className="text-4xl font-black text-white italic tracking-tighter">
                      {query.toUpperCase()}
                    </h3>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest text-white/60">
                    STABILITY: <span className="text-neon-green">HIGH</span>
                  </div>
               </div>
               
               <article className="space-y-10">
                 <section className="relative">
                   <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-green to-transparent rounded-full opacity-50"></div>
                   <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                     <span className="w-1 h-1 bg-white/30 rounded-full"></span> Executive Summary
                   </h4>
                   <p className="text-lg leading-relaxed font-light text-white/90 first-letter:text-4xl first-letter:font-black first-letter:neon-text first-letter:mr-1 first-letter:float-left">
                     {briefing.summary}
                   </p>
                 </section>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <section className="glass-card bg-white/[0.02] p-6 rounded-2xl">
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Strategic Entities</h4>
                      <p className="text-sm leading-relaxed text-white/70 font-medium italic">
                        {briefing.key_players}
                      </p>
                    </section>
                    <section className="glass-card bg-white/[0.02] p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Market Sentiment</h4>
                      <div className="text-3xl font-black text-neon-green italic tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                        {briefing.sentiment}
                      </div>
                    </section>
                    <section className="glass-card bg-red-400/5 border border-red-500/20 p-6 rounded-2xl flex flex-col justify-center">
                       <h4 className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                         <History className="w-3 h-3" /> Contrarian View
                       </h4>
                       <p className="text-sm leading-relaxed text-white/60 font-medium italic">
                         {briefing.contrarian_view}
                       </p>
                     </section>
                 </div>

                 <section className="bg-neon-green/5 border border-neon-green/10 p-6 rounded-2xl">
                   <h4 className="text-[10px] font-black text-neon-green/50 uppercase tracking-[0.3em] mb-4">The Road Ahead & Predictions</h4>
                   <p className="text-sm leading-relaxed text-white/80 border-l border-neon-green/30 pl-4 py-1">
                     {briefing.next_steps}
                   </p>
                 </section>
               </article>
            </div>
          ) : (
            <div className="glass-card h-full rounded-3xl flex flex-col items-center justify-center text-white/10 border-dashed border-2">
              <Globe className="w-24 h-24 mb-6 opacity-5" />
              <div className="text-center">
                <p className="text-lg font-black tracking-widest uppercase mb-1">System Ready</p>
                <p className="text-xs font-medium tracking-tight opacity-50">INITIATE SEARCH TO BEGIN DATA SYNTHESIS</p>
              </div>
            </div>
          )}
        </main>

        {/* Studio & Visuals (Right) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
           <div className="glass-card p-6 rounded-2xl flex flex-col gap-6 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Story Arc</h2>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green"></div>
                </div>
              </div>
              <div className="h-[300px] relative">
                 <PulseTimeline events={timeline} />
              </div>
           </div>

           <div className="glass-card p-6 rounded-2xl flex flex-col gap-6">
              <div className="flex items-center gap-2 text-white/40 border-b border-white/5 pb-4">
                <Video className="w-4 h-4" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Video Studio</h2>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleGenerateVideo}
                  disabled={!briefing || videoLoading}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 border-2 transition-all duration-300 ${!briefing ? 'border-white/5 text-white/20' : 'border-neon-green text-neon-green hover:bg-neon-green hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]'}`}
                >
                  <Video className="w-4 h-4" /> 
                  <span className="text-xs font-black uppercase tracking-widest">
                    {videoLoading ? 'Mastering Video...' : 'Generate Short'}
                  </span>
                </button>
                
                {videoUrl && (
                  <button 
                    onClick={() => setShowVideoModal(true)}
                    className="w-full py-4 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neon-green transition-all shadow-xl"
                  >
                    <Play className="w-4 h-4 fill-current" /> Watch Preview
                  </button>
                )}
              </div>
              
              <p className="text-[10px] text-center text-white/20 font-medium">9:16 Vertical Format Optimized for Pulse Mobile</p>
           </div>
        </div>
      </div>

      {/* Premium Video Modal */}
      {showVideoModal && videoUrl && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in zoom-in duration-300">
           <div className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Internal Back Button */}
              <button 
                onClick={() => setShowVideoModal(false)}
                className="absolute top-6 left-6 z-[110] flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
              </button>

              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
              
              {/* Premium Top Overlay */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>

              <div className="absolute inset-x-0 bottom-0 p-8 pt-24 bg-gradient-to-t from-black via-black/90 to-transparent">
                 <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-[2px] bg-neon-green/40"></div>
                    <p className="text-[10px] text-neon-green font-black uppercase tracking-[0.4em]">Intelligence Report</p>
                 </div>
                 
                 <h4 className="text-3xl font-black text-white mb-6 italic tracking-tighter uppercase leading-none">
                    {query}
                 </h4>
                 
                 <div className="glass-card p-5 border-none bg-white/5 backdrop-blur-md rounded-2xl">
                    <p className="text-sm text-white/80 leading-relaxed font-medium line-clamp-4 italic border-l-2 border-neon-green/50 pl-4 py-1">
                      {briefing?.summary}
                    </p>
                 </div>

                 {/* Simulated Progress Bar */}
                 <div className="mt-8 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 15, ease: "linear" }}
                      className="h-full bg-neon-green shadow-[0_0_10px_#00ff41]"
                    />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
