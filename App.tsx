import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS, LANGUAGES, LanguageCode, RESOURCES } from './constants.tsx';
import { CpuIcon, LayersIcon, ExternalLinkIcon, ToolIcon, SunIcon, MoonIcon } from './components/Icons.tsx';
import { PDKOption, Tool, FlowStep } from './types.ts';

type Page = 'home' | 'pdk' | 'tools' | 'flow' | 'resources';

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
      return localStorage.getItem('darkMode') === 'true';
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
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const getSearchResults = (): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    t.pdkSection.options.forEach(pdk => {
      if (pdk.name.toLowerCase().includes(query) || pdk.description.toLowerCase().includes(query)) {
        results.push({ type: 'PDK', title: pdk.name, description: pdk.description, targetPage: 'pdk', id: pdk.id });
      }
    });

    t.toolsSection.tools.forEach(tool => {
      if (tool.name.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query)) {
        results.push({ type: 'Tool', title: tool.name, description: tool.description, targetPage: 'tools', id: tool.id });
      }
    });

    RESOURCES.forEach(res => {
      if (res.title.toLowerCase().includes(query) || res.description.toLowerCase().includes(query)) {
        results.push({ type: 'Resource', title: res.title, description: res.description, targetPage: 'resources' });
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
        page === target 
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
      }`}
    >
      <span className={page === target ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500'}>{icon}</span>
      {label}
    </button>
  );

  const ThemeToggle = () => (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );

  const renderContent = () => {
    switch (page) {
      case 'home': return <LandingPage t={t} setPage={setPage} isDarkMode={isDarkMode} />;
      case 'pdk': return <PDKPage t={t} />;
      case 'tools': return <ToolsPage t={t} />;
      case 'flow': return <FlowPage t={t} />;
      case 'resources': return <ResourcesPage t={t} />;
      default: return <LandingPage t={t} setPage={setPage} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-[#f4f5f7] dark:bg-slate-950 transition-colors duration-300`}>
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="brazil-gradient p-1.5 rounded-lg text-white shadow-sm">
              <CpuIcon />
            </div>
            <span className="font-bold text-lg text-emerald-900 dark:text-emerald-400 tracking-tight">OpenIC <span className="text-emerald-500 underline decoration-2 underline-offset-4">Hub</span></span>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="px-4 pt-6 pb-2" ref={searchRef}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-all"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
          </div>
          {isSearchFocused && searchQuery && (
            <div className="absolute mt-2 w-full left-0 px-4 z-[100]">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-[400px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <button key={i} onClick={() => handleResultClick(res)} className="w-full text-left p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-b border-slate-50 dark:border-slate-700 last:border-0 flex gap-3 group">
                      <div className="mt-1 h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0">
                        {res.type === 'PDK' ? <CpuIcon /> : res.type === 'Tool' ? <ToolIcon /> : <ExternalLinkIcon />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{res.title}</span>
                          <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 px-1.5 rounded">{res.type}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{res.description}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500 italic">No results found</div>
                )}
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 mb-2">Projects & Workspace</div>
          <NavItem target="home" icon={<LayersIcon />} label={t.nav.home} />
          <NavItem target="pdk" icon={<CpuIcon />} label={t.nav.pdk} />
          <NavItem target="tools" icon={<ToolIcon />} label={t.nav.tools} />
          <NavItem target="flow" icon={<LayersIcon />} label={t.nav.flow} />
          <NavItem target="resources" icon={<ExternalLinkIcon />} label={t.nav.resources} />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${lang === l.code ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 p-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <div className="brazil-gradient p-1 rounded-md text-white"><CpuIcon /></div>
          <span className="font-bold text-emerald-900 dark:text-emerald-400">OpenIC Hub</span>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <div className="flex gap-1">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} className={`px-2 py-1 text-[10px] font-bold rounded ${lang === l.code ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden technical-grid transition-colors duration-300">
        <div className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-8 px-1">
            <span className="hover:text-emerald-600 dark:hover:text-emerald-500 cursor-pointer" onClick={() => setPage('home')}>Root</span>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-bold capitalize bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">{page === 'home' ? 'Overview' : page}</span>
          </div>
          <div className="animate-in">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-10 px-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide uppercase">
            <p>&copy; {new Date().getFullYear()} OpenSource IC Brazil. {t.footer.rights}</p>
            <div className="flex gap-8">
              <a href="https://github.com/IHP-GmbH/IHP-Open-PDK" target="_blank" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">GitHub Repository</a>
              <a href="https://www.ufrgs.br/cadmicro/ciaberto/" target="_blank" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">CI Aberto Initiative</a>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex justify-around items-center z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-colors">
           <MobileNavItem active={page === 'home'} icon={<LayersIcon />} onClick={() => setPage('home')} />
           <MobileNavItem active={page === 'pdk'} icon={<CpuIcon />} onClick={() => setPage('pdk')} />
           <MobileNavItem active={page === 'tools'} icon={<ToolIcon />} onClick={() => setPage('tools')} />
           <MobileNavItem active={page === 'flow'} icon={<LayersIcon />} onClick={() => setPage('flow')} />
           <MobileNavItem active={page === 'resources'} icon={<ExternalLinkIcon />} onClick={() => setPage('resources')} />
        </nav>
      </main>
    </div>
  );
};

const MobileNavItem: React.FC<{ active: boolean; icon: React.ReactNode; onClick: () => void }> = ({ active, icon, onClick }) => (
  <button onClick={onClick} className={`p-3 rounded-2xl transition-all ${active ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 active:scale-95'}`}>{icon}</button>
);

const LandingPage: React.FC<{ t: any; setPage: (p: Page) => void, isDarkMode: boolean }> = ({ t, setPage, isDarkMode }) => (
  <div className="space-y-10">
    <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
      <div className={`absolute top-0 right-0 w-80 h-80 ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'} rounded-bl-full -z-0 opacity-40 blur-3xl`} />
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 leading-[1.1] mb-8 tracking-tight">{t.hero.title}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl font-medium">{t.hero.description}</p>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setPage('flow')} className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 dark:shadow-emerald-900/20 active:scale-95">{t.hero.cta}</button>
          <button onClick={() => setPage('pdk')} className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">Explore Tech Specs</button>
        </div>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Ecosystem Architecture</h3>
        <ul className="space-y-5 flex-1">
          {t.intro.bullets.map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-4 text-slate-700 dark:text-slate-300 text-[15px] font-semibold">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/20" />{b}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-emerald-900 dark:bg-emerald-950 p-10 rounded-3xl shadow-2xl flex flex-col justify-center text-white relative overflow-hidden group transition-colors">
        <div className="absolute inset-0 organic-pattern opacity-10 group-hover:opacity-20 transition-opacity" />
        <h3 className="text-2xl font-black mb-4 relative z-10 tracking-tight">{t.pdkSection.title}</h3>
        <p className="text-emerald-100/70 text-sm mb-8 relative z-10 font-medium leading-relaxed">{t.pdkSection.description}</p>
        <button onClick={() => setPage('pdk')} className="self-start bg-emerald-800/50 dark:bg-emerald-900/40 hover:bg-emerald-700 dark:hover:bg-emerald-800 px-6 py-3 rounded-xl border border-emerald-700 dark:border-emerald-800 text-amber-400 font-bold text-sm transition-all relative z-10 active:scale-95">Access Documentation →</button>
      </div>
    </div>
  </div>
);

const PDKPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between px-2">
      <div className="max-w-xl">
        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.pdkSection.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Standard process design kits for research and industrial prototyping.</p>
      </div>
    </div>
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto transition-colors">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest w-1/4">Process Technology</th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Technical Specifications</th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest w-48 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {t.pdkSection.options.map((pdk: PDKOption) => (
            <tr key={pdk.id} id={pdk.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors">
              <td className="px-8 py-8 align-top">
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-lg mb-2">{pdk.name}</div>
                <div className="text-[10px] mono font-bold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded inline-block border border-emerald-100 dark:border-emerald-800">REV: 02.2025</div>
              </td>
              <td className="px-8 py-8 align-top">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">{pdk.techSummary}</p>
                <div className="flex flex-wrap gap-2">
                  {pdk.useCases.map((uc, i) => (
                    <span key={i} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700">{uc}</span>
                  ))}
                </div>
              </td>
              <td className="px-8 py-8 align-top text-right space-y-3">
                <a href={pdk.docsLink} target="_blank" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 w-full justify-center shadow-sm">Docs <ExternalLinkIcon /></a>
                <a href={pdk.mpwLink} target="_blank" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-lg border border-amber-200 dark:border-amber-800 w-full justify-center shadow-sm">MPW <ExternalLinkIcon /></a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ToolsPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-10">
    <div className="px-2">
      <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.toolsSection.title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl font-medium">{t.toolsSection.description}</p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {t.toolsSection.tools.map((tool: Tool) => (
        <div key={tool.id} id={tool.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="font-black text-xl text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight">{tool.name}</div>
            <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full uppercase border border-slate-200 dark:border-slate-700">{tool.category}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-1 font-medium">{tool.description}</p>
          <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 mb-8 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">{tool.installTip}</div>
          <a href={tool.website} target="_blank" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">{t.toolsSection.visitSite} <ExternalLinkIcon /></a>
        </div>
      ))}
    </div>
  </div>
);

const FlowPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-10">
    <div className="px-2 mb-12">
      <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.flowSection.title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">{t.flowSection.description}</p>
    </div>
    <div className="space-y-10 relative">
      <div className="absolute top-0 left-10 h-full w-1 bg-slate-200 dark:bg-slate-800 hidden md:block rounded-full opacity-50 transition-colors" />
      {t.flowSection.steps.map((step: FlowStep) => (
        <div key={step.id} className="flex flex-col md:flex-row gap-10 relative group">
          <div className="h-20 w-20 shrink-0 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex items-center justify-center font-black text-3xl text-slate-300 dark:text-slate-700 shadow-sm z-10 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 group-hover:border-emerald-500 dark:group-hover:border-emerald-600 transition-all">{step.id}</div>
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex-1 transition-colors"><h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">{step.label}</h4><p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{step.details}</p></div>
        </div>
      ))}
    </div>
  </div>
);

const ResourcesPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-10">
    <div className="px-2"><h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.resourcesSection.title}</h2><p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">{t.resourcesSection.description}</p></div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {RESOURCES.map((link, idx) => (
        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex flex-col p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-2xl transition-all group">
          <div className="flex items-center justify-between mb-6"><div className={`p-3 rounded-2xl ${link.type === 'github' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'}`}>{link.type === 'github' ? <ToolIcon /> : <ExternalLinkIcon />}</div><span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{link.type}</span></div>
          <h4 className="font-extrabold text-xl text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-3 tracking-tight">{link.title}</h4><p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{link.description}</p>
        </a>
      ))}
    </div>
  </div>
);

export default App;