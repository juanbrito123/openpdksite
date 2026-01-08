import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS, LANGUAGES, LanguageCode, RESOURCES } from './constants.tsx';
import { CpuIcon, LayersIcon, ExternalLinkIcon, ToolIcon, SunIcon, MoonIcon } from './components/Icons.tsx';
import { PDKOption, Tool, FlowStep } from './types.ts';
import { GoogleGenAI } from "@google/genai";

type Page = 'home' | 'pdk' | 'tools' | 'analog-flow' | 'digital-flow' | 'resources';

interface SearchResult {
  type: 'PDK' | 'Tool' | 'Resource';
  title: string;
  description: string;
  targetPage: Page;
  id?: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatWidget: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...messages, userMessage].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "You are an expert AI Assistant for the OpenSource IC Hub. Your expertise lies in semiconductor design, OpenPDKs (IHP SG13G2, SkyWater SKY130), and EDA tools (Xschem, Magic, OpenROAD, Ngspice). Be concise, technical, and helpful. Format your responses with clear spacing.",
          temperature: 0.2,
        }
      });

      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            const updated = [...prev];
            updated[updated.length - 1] = { ...last, text: fullText };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, tive um problema ao processar sua solicitação. Verifique sua conexão.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[320px] md:w-[380px] h-[480px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-[100] animate-in overflow-hidden transition-colors">
      <div className="p-3 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">OpenIC Assistant</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded transition-colors text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <CpuIcon size={32} className="text-emerald-500 mb-3 opacity-50" />
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium leading-relaxed">Olá! Como posso ajudar com seu projeto de CI ou dúvidas sobre o ecossistema OpenSource?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-[13px] leading-relaxed ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-zinc-900 p-3 rounded-xl">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-black">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white"
            placeholder="Pergunte sobre IHP, SKY130 ou Ferramentas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('pt');
  const [page, setPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const getSearchResults = (): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    t.pdkSection.options.forEach((pdk: any) => {
      if (pdk.name.toLowerCase().includes(query)) {
        results.push({ type: 'PDK', title: pdk.name, description: pdk.techSummary, targetPage: 'pdk', id: pdk.id });
      }
    });
    t.toolsSection.tools.forEach((tool: Tool) => {
      if (tool.name.toLowerCase().includes(query)) {
        results.push({ type: 'Tool', title: tool.name, description: tool.description, targetPage: 'tools', id: tool.id });
      }
    });
    return results.slice(0, 8);
  };

  const searchResults = getSearchResults();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    setPage(result.targetPage);
    setSearchQuery('');
    setIsSearchFocused(false);
    if (result.id) {
      setTimeout(() => {
        const el = document.getElementById(result.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  };

  const NavItem: React.FC<{ target: Page; icon: React.ReactNode; label: string }> = ({ target, icon, label }) => (
    <button
      onClick={() => setPage(target)}
      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
        page === target 
          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' 
          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100'
      }`}
    >
      <span className={`shrink-0 ${page === target ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-zinc-600'}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 16, width: 16, height: 16 })}
      </span>
      <span className="text-left truncate">{label}</span>
    </button>
  );

  const ThemeToggle = () => (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="p-1 rounded bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all border border-slate-200 dark:border-zinc-800"
      aria-label="Toggle Mode"
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );

  const renderContent = () => {
    switch (page) {
      case 'home': return <LandingPage t={t} setPage={setPage} isDarkMode={isDarkMode} />;
      case 'pdk': return <PDKPage t={t} />;
      case 'tools': return <ToolsPage t={t} />;
      case 'analog-flow': return <FlowPage t={t} type="analog" />;
      case 'digital-flow': return <FlowPage t={t} type="digital" />;
      case 'resources': return <ResourcesPage t={t} />;
      default: return <LandingPage t={t} setPage={setPage} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white dark:bg-black transition-colors duration-400`}>
      {/* Top Language Bar - Even more minimal */}
      <div className="w-full bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900 py-1 px-6 z-[60] sticky top-0 md:relative">
        <div className="max-w-7xl mx-auto flex justify-end gap-5">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`text-[10px] font-bold tracking-tight uppercase transition-colors hover:text-emerald-500 ${
                lang === l.code ? 'text-emerald-600 dark:text-emerald-400 underline decoration-2 underline-offset-4' : 'text-slate-400 dark:text-zinc-500'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar Desktop - Ultra Dense */}
        <aside className="hidden md:flex flex-col w-60 h-[calc(100vh-32px)] sticky top-0 bg-white dark:bg-black border-r border-slate-200 dark:border-zinc-900 z-50 transition-colors overflow-hidden">
          <div className="px-4 py-3.5 border-b border-slate-100 dark:border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="brazil-gradient p-0.5 rounded text-white">
                <CpuIcon />
              </div>
              <span className="font-bold text-sm text-emerald-900 dark:text-emerald-500 tracking-tight">OpenIC <span className="text-emerald-500">Hub</span></span>
            </div>
            <ThemeToggle />
          </div>
          
          <div className="px-3 pt-3 pb-1.5" ref={searchRef}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                className="block w-full pl-8 pr-2 py-1.5 border border-slate-200 dark:border-zinc-800 rounded text-[11px] placeholder-slate-400 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-zinc-100 focus:outline-none"
                placeholder="Busca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>
          </div>

          <nav className="flex-1 px-2.5 py-2 space-y-0.5 overflow-hidden">
            <div className="text-[9px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest px-2.5 mb-1 mt-1">Geral</div>
            <NavItem target="home" icon={<LayersIcon />} label={t.nav.home} />
            <NavItem target="pdk" icon={<CpuIcon />} label={t.nav.pdk} />
            <NavItem target="tools" icon={<ToolIcon />} label={t.nav.tools} />
            
            <div className="text-[9px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest px-2.5 mb-1 mt-3">Design Flows</div>
            <NavItem target="analog-flow" icon={<LayersIcon />} label={t.nav.analogFlow} />
            <NavItem target="digital-flow" icon={<ToolIcon />} label={t.nav.digitalFlow} />
            
            <div className="text-[9px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest px-2.5 mb-1 mt-3">Comunidade</div>
            <NavItem target="resources" icon={<ExternalLinkIcon />} label={t.nav.resources} />
          </nav>

          <div className="p-2.5 border-t border-slate-100 dark:border-zinc-900">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full flex items-center gap-2 px-2.5 py-2 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-md"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              AI Assistant
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-black border-b border-slate-200 dark:border-zinc-900 p-3 flex items-center justify-between sticky top-[28px] z-50">
          <div className="flex items-center gap-2">
            <div className="brazil-gradient p-0.5 rounded text-white"><CpuIcon /></div>
            <span className="font-bold text-emerald-900 dark:text-emerald-500 text-sm">OpenIC Hub</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden technical-grid transition-colors duration-400">
          <div className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto relative z-10">
            <div className="animate-in">
              {renderContent()}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 py-6 px-8 bg-white dark:bg-black border-t border-slate-100 dark:border-zinc-900 transition-colors">
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-600 font-bold uppercase tracking-widest">
              <p>&copy; {new Date().getFullYear()} OpenSource IC Hub</p>
            </div>
          </footer>

          {/* Mobile Bottom Nav */}
          <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-slate-200 dark:border-zinc-900 px-2 py-1.5 flex justify-around items-center z-50 transition-colors">
             <MobileNavItem active={page === 'home'} icon={<LayersIcon />} onClick={() => setPage('home')} />
             <MobileNavItem active={page === 'analog-flow'} icon={<CpuIcon />} onClick={() => setPage('analog-flow')} />
             <MobileNavItem active={page === 'digital-flow'} icon={<ToolIcon />} onClick={() => setPage('digital-flow')} />
             <MobileNavItem active={page === 'resources'} icon={<ExternalLinkIcon />} onClick={() => setPage('resources')} />
          </nav>
        </main>
      </div>

      {/* Floating Chat Trigger for Mobile */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="md:hidden fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[90] active:scale-90 transition-all"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>

      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

const MobileNavItem: React.FC<{ active: boolean; icon: React.ReactNode; onClick: () => void }> = ({ active, icon, onClick }) => (
  <button onClick={onClick} className={`p-2.5 rounded-xl transition-all ${active ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 dark:text-zinc-600 active:scale-95'}`}>
    {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
  </button>
);

const LandingPage: React.FC<{ t: any; setPage: (p: Page) => void, isDarkMode: boolean }> = ({ t, setPage, isDarkMode }) => (
  <div className="space-y-8">
    <div className="bg-white dark:bg-zinc-900/30 p-8 md:p-12 rounded-[2rem] border border-slate-100 dark:border-zinc-900 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-64 h-64 ${isDarkMode ? 'bg-emerald-500/5' : 'bg-emerald-50'} rounded-bl-full -z-0 opacity-40 blur-3xl`} />
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">{t.hero.title}</h1>
        <p className="text-base text-slate-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-2xl font-medium">{t.hero.description}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setPage('digital-flow')} className="px-6 py-3 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 active:scale-95">{t.hero.cta}</button>
          <button onClick={() => setPage('pdk')} className="px-6 py-3 bg-white dark:bg-black text-slate-700 dark:text-zinc-300 text-sm font-bold rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 active:scale-95">Explore Tech Specs</button>
        </div>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-zinc-900/30 p-6 rounded-2xl border border-slate-100 dark:border-zinc-900 flex flex-col">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mb-4 border-b border-slate-50 dark:border-zinc-800 pb-2">{t.intro.title}</h3>
        <ul className="space-y-3.5 flex-1">
          {t.intro.bullets.map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-zinc-300 text-[13px] font-semibold">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />{b}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-emerald-900 dark:bg-emerald-950 p-8 rounded-2xl shadow-xl flex flex-col justify-center text-white relative overflow-hidden">
        <h3 className="text-xl font-black mb-3 tracking-tight">Prototipagem Ágil</h3>
        <p className="text-emerald-100/70 text-xs mb-6 font-medium leading-relaxed">Reduza o tempo de design com fluxos automatizados e PDKs abertos.</p>
        <button onClick={() => setPage('analog-flow')} className="self-start bg-emerald-800/40 dark:bg-emerald-900/40 hover:bg-emerald-700 px-4 py-2 rounded-lg border border-emerald-700 text-emerald-400 text-xs font-bold active:scale-95">Ver Fluxos →</button>
      </div>
    </div>
  </div>
);

const PDKPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-6">
    <div className="px-1">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.pdkSection.title}</h2>
      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">{t.pdkSection.description}</p>
    </div>
    <div className="grid gap-4">
      {t.pdkSection.options.map((pdk: any) => (
        <div key={pdk.id} id={pdk.id} className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-900 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{pdk.name}</h3>
            <span className="text-[9px] mono font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800">Process Node</span>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 text-sm mb-5 font-medium leading-relaxed">{pdk.techSummary}</p>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {pdk.useCases.map((uc: string, i: number) => (
              <span key={i} className="text-[9px] font-bold text-slate-400 bg-slate-50 dark:bg-zinc-900 px-2 py-0.5 rounded uppercase">{uc}</span>
            ))}
          </div>
          <div className="flex gap-4">
            <a href={pdk.docsLink} target="_blank" className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 hover:underline">Documentação <ExternalLinkIcon /></a>
            <a href={pdk.mpwLink} target="_blank" className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-600 hover:underline">Tapeout <ExternalLinkIcon /></a>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ToolsPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-6">
    <div className="px-1">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.toolsSection.title}</h2>
      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">{t.toolsSection.description}</p>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      {t.toolsSection.tools.map((tool: Tool) => (
        <div key={tool.id} id={tool.id} className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-900 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="font-black text-lg text-slate-900 dark:text-white tracking-tight">{tool.name}</div>
            <span className="text-[9px] font-black bg-slate-50 dark:bg-zinc-900 text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">{tool.category}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-6 flex-1 font-medium">{tool.description}</p>
          <a href={tool.website} target="_blank" className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 hover:underline">Site Oficial <ExternalLinkIcon /></a>
        </div>
      ))}
    </div>
  </div>
);

const FlowPage: React.FC<{ t: any, type: 'analog' | 'digital' }> = ({ t, type }) => {
  const content = type === 'analog' ? t.analogFlow : t.digitalFlow;
  return (
    <div className="space-y-6">
      <div className="px-1 mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{content.title}</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">{content.description}</p>
      </div>
      <div className="space-y-4 relative">
        <div className="absolute top-0 left-6 h-full w-0.5 bg-slate-100 dark:bg-zinc-900 hidden md:block" />
        {content.steps.map((step: any) => (
          <div key={step.id} className="flex flex-col md:flex-row gap-6 relative group">
            <div className="h-12 w-12 shrink-0 bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-zinc-800 rounded-xl flex items-center justify-center font-black text-lg text-slate-200 dark:text-zinc-700 z-10 group-hover:text-emerald-500 transition-all">{step.id}</div>
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-900 flex-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight">{step.label}</h4>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">{step.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResourcesPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-6">
    <div className="px-1">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.resourcesSection.title}</h2>
      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">{t.resourcesSection.description}</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {RESOURCES.map((link, idx) => (
        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex flex-col p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-900 hover:border-emerald-200 transition-all group">
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors mb-2 tracking-tight">{link.title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium mb-4">{link.description}</p>
          <span className="mt-auto text-[9px] font-black text-emerald-500 uppercase tracking-widest">{link.type}</span>
        </a>
      ))}
    </div>
  </div>
);

export default App;