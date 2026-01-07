import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, LANGUAGES, LanguageCode, RESOURCES } from './constants';
import { CpuIcon, LayersIcon, ExternalLinkIcon, ToolIcon } from './components/Icons';
import { PDKOption, Tool, FlowStep } from './types';

type Page = 'home' | 'pdk' | 'tools' | 'flow' | 'resources';

const App: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('pt');
  const [page, setPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const NavItem: React.FC<{ target: Page; icon: React.ReactNode; label: string }> = ({ target, icon, label }) => (
    <button
      onClick={() => { setPage(target); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
        page === target 
          ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <span className={page === target ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  );

  const renderContent = () => {
    switch (page) {
      case 'home': return <LandingPage t={t} setPage={setPage} />;
      case 'pdk': return <PDKPage t={t} />;
      case 'tools': return <ToolsPage t={t} />;
      case 'flow': return <FlowPage t={t} />;
      case 'resources': return <ResourcesPage t={t} />;
      default: return <LandingPage t={t} setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f4f5f7]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-slate-200 z-50">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="brazil-gradient p-1.5 rounded-lg text-white shadow-sm">
            <CpuIcon />
          </div>
          <span className="font-bold text-lg text-emerald-900">OpenIC <span className="text-emerald-500">Hub</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Workspace</div>
          <NavItem target="home" icon={<LayersIcon />} label={t.nav.home} />
          <NavItem target="pdk" icon={<CpuIcon />} label={t.nav.pdk} />
          <NavItem target="tools" icon={<ToolIcon />} label={t.nav.tools} />
          <NavItem target="flow" icon={<LayersIcon />} label={t.nav.flow} />
          <NavItem target="resources" icon={<ExternalLinkIcon />} label={t.nav.resources} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg w-full">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                  lang === l.code ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="brazil-gradient p-1 rounded-md text-white">
            <CpuIcon />
          </div>
          <span className="font-bold text-emerald-900">OpenIC Hub</span>
        </div>
        <div className="flex gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2 py-1 text-[10px] font-bold rounded ${lang === l.code ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden technical-grid">
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {/* Breadcrumbs for structured feel */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 px-1">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-slate-600 font-medium capitalize">{page === 'home' ? 'Overview' : page}</span>
          </div>
          <div className="animate-in">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-8 px-8 bg-white border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
            <p>&copy; {new Date().getFullYear()} OpenSource IC. {t.footer.rights}</p>
            <div className="flex gap-6">
              <a href="https://github.com/IHP-GmbH/IHP-Open-PDK" target="_blank" className="hover:text-emerald-600">GitHub</a>
              <a href="https://www.ufrgs.br/cadmicro/ciaberto/" target="_blank" className="hover:text-emerald-600">CI Aberto</a>
            </div>
            <p className="hidden md:block">Contact: info@openpdk-brasil.com.br</p>
          </div>
        </footer>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
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
  <button 
    onClick={onClick} 
    className={`p-2 rounded-xl transition-colors ${active ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}
  >
    {icon}
  </button>
);

const LandingPage: React.FC<{ t: any; setPage: (p: Page) => void }> = ({ t, setPage }) => (
  <div className="space-y-8">
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-full -z-0 opacity-50" />
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
          {t.hero.title}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          {t.hero.description}
        </p>
        <div className="flex gap-3">
          <button 
            onClick={() => setPage('flow')}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-md active:scale-95"
          >
            {t.hero.cta}
          </button>
          <button 
            onClick={() => setPage('pdk')}
            className="px-6 py-3 bg-white text-slate-700 font-bold rounded-lg border border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
          >
            View PDKs
          </button>
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Core Principles</h3>
        <ul className="space-y-4">
          {t.intro.bullets.map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-emerald-900 p-8 rounded-xl shadow-lg flex flex-col justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 organic-pattern opacity-10" />
        <h3 className="text-xl font-bold mb-4 relative z-10">{t.pdkSection.title}</h3>
        <p className="text-emerald-100/70 text-sm mb-6 relative z-10">{t.pdkSection.description}</p>
        <button onClick={() => setPage('pdk')} className="self-start text-amber-400 font-bold text-sm hover:underline relative z-10">
          Explore technical data →
        </button>
      </div>
    </div>
  </div>
);

const PDKPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-6">
    <div className="flex items-end justify-between px-1">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{t.pdkSection.title}</h2>
        <p className="text-sm text-slate-500">Industry-qualified process design kits available for open hardware designs.</p>
      </div>
    </div>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest w-1/4">Process Node</th>
            <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Summary</th>
            <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest w-40 text-right">Links</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {t.pdkSection.options.map((pdk: PDKOption) => (
            <tr key={pdk.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-6 align-top">
                <div className="font-bold text-slate-900 mb-1">{pdk.name}</div>
                <div className="text-[10px] mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded inline-block">NODE_ID: {pdk.id.toUpperCase()}</div>
              </td>
              <td className="px-6 py-6 align-top">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{pdk.techSummary}</p>
                <div className="flex flex-wrap gap-2">
                  {pdk.useCases.slice(0, 3).map((uc, i) => (
                    <span key={i} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {uc}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-6 align-top text-right space-y-2">
                <a href={pdk.docsLink} target="_blank" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-full justify-center">
                  Docs <ExternalLinkIcon />
                </a>
                <a href={pdk.mpwLink} target="_blank" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-full justify-center">
                  MPW <ExternalLinkIcon />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ToolsPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-8">
    <div className="px-1">
      <h2 className="text-2xl font-bold text-slate-900">{t.toolsSection.title}</h2>
      <p className="text-sm text-slate-500">{t.toolsSection.description}</p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {t.toolsSection.tools.map((tool: Tool) => (
        <div key={tool.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
          <div className="flex justify-between items-start mb-4">
            <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{tool.name}</div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{tool.category}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">{tool.description}</p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Setup Tip:</span>
            <p className="text-[11px] text-slate-500 font-medium leading-normal">{tool.installTip}</p>
          </div>
          <a href={tool.website} target="_blank" className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:underline">
            {t.toolsSection.visitSite} <ExternalLinkIcon />
          </a>
        </div>
      ))}
    </div>
  </div>
);

const FlowPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-6">
    <div className="px-1 mb-8">
      <h2 className="text-2xl font-bold text-slate-900">{t.flowSection.title}</h2>
      <p className="text-sm text-slate-500">{t.flowSection.description}</p>
    </div>
    <div className="relative">
      <div className="absolute top-0 left-8 h-full w-0.5 bg-slate-200 hidden md:block" />
      <div className="space-y-8">
        {t.flowSection.steps.map((step: FlowStep) => (
          <div key={step.id} className="flex gap-6 relative group">
            <div className="h-16 w-16 shrink-0 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-400 shadow-sm z-10 group-hover:border-emerald-500 group-hover:text-emerald-600 transition-all">
              {step.id}
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
              <h4 className="text-lg font-bold text-slate-900 mb-2">{step.label}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{step.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ResourcesPage: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-8">
    <div className="px-1">
      <h2 className="text-2xl font-bold text-slate-900">{t.resourcesSection.title}</h2>
      <p className="text-sm text-slate-500">{t.resourcesSection.description}</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {RESOURCES.map((link, idx) => (
        <a 
          key={idx} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${link.type === 'github' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {link.type === 'github' ? <ToolIcon /> : <ExternalLinkIcon />}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{link.type}</span>
          </div>
          <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">{link.title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{link.description}</p>
        </a>
      ))}
    </div>
  </div>
);

export default App;