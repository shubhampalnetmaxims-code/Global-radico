
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../components/SiteHeader';

interface UnderDevelopmentProps {
  title: string;
  subtitle: string;
  lang?: Language;
}

const translations = {
  EN: {
    phase: 'Phase 1 Deployment',
    homeBtn: 'Home Dashboard',
    underDev: 'Under Development',
  },
  DE: {
    phase: 'Phase 1 Bereitstellung',
    homeBtn: 'Startseite Dashboard',
    underDev: 'In Entwicklung',
  },
};

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ title, subtitle, lang = 'EN' }) => {
  const navigate = useNavigate();
  const t = translations[lang];

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center bg-white p-12 md:p-20 rounded-[3rem] shadow-2xl border border-slate-100 space-y-10 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="flex justify-center">
          <div className="w-28 h-28 bg-amber-50 rounded-[2.5rem] flex items-center justify-center animate-bounce shadow-inner">
            <span className="text-6xl">🚧</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-widest">
            {t.phase}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => navigate('/')}
            className="group px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto transform hover:-translate-y-1 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t.homeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
