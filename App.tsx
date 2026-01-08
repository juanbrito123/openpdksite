
import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS, LANGUAGES, LanguageCode, RESOURCES } from './constants.tsx';
import { CpuIcon, LayersIcon, ExternalLinkIcon, ToolIcon, SunIcon, MoonIcon } from './components/Icons.tsx';
import { PDKOption, Tool, FlowStep } from './types.ts';

type Page = 'home' | 'pdk' | 'tools' | 'analog-flow' | 'digital-flow' | 'resources';

interface SearchResult {
  type: 'PDK' | 'Tool' | 'Resource';
  title: string;
  description: string;
  targetPage: Page;
  id?: string;
}

const App: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('pt');
  const [page, setPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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
        {/* Fix: Added <any> cast to ensure React.cloneElement accepts injected sizing props */}
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
    </div>
  );
};

const MobileNavItem: React.FC<{ active: boolean; icon: React.ReactNode; onClick: () => void }> = ({ active, icon, onClick }) => (
  <button onClick={onClick} className={`p-2.5 rounded-xl transition-all ${active ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 dark:text-zinc-600 active:scale-95'}`}>
    {/* Fix: Added <any> cast to ensure React.cloneElement accepts injected sizing props */}
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
