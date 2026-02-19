
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language } from './SiteHeader';

const portalTranslations = {
  EN: {
    admin: 'Admin Panel',
    distributor: 'Distributor Portal',
    india: 'India Store',
    germany: 'Germany Store',
    navTitle: 'Global Navigation',
    jump: 'Jump to workspace',
    returnHub: 'Return to Main Hub',
    switch: 'Switch Portal'
  },
  DE: {
    admin: 'Admin-Bereich',
    distributor: 'Händler-Portal',
    india: 'Shop Indien',
    germany: 'Shop Deutschland',
    navTitle: 'Globale Navigation',
    jump: 'Zum Bereich wechseln',
    returnHub: 'Zum Hauptmenü zurück',
    switch: 'Portal wechseln'
  }
};

const portals = [
  { id: 'admin', key: 'admin', path: '/admin/categories', icon: '🛡️', color: 'text-indigo-600' },
  { id: 'distributor', key: 'distributor', path: '/distributor/dev', icon: '🤝', color: 'text-slate-600' },
  { id: 'india', key: 'india', path: '/website-india/dev', icon: '🇮🇳', color: 'text-orange-600' },
  { id: 'germany', key: 'germany', path: '/website-germany/dev', icon: '🇩🇪', color: 'text-red-600' },
];

const PortalSwitcher: React.FC<{ lang?: Language }> = ({ lang = 'EN' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = portalTranslations[lang];
  const currentPortal = portals.find(p => location.pathname.startsWith(p.path.split('/')[1])) || portals[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200 group"
      >
        <span className="text-lg">{currentPortal.icon}</span>
        <span className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900">
          {t.switch}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[999] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-slate-50 mb-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.navTitle}</p>
          </div>
          <div className="space-y-1">
            {portals.map((portal) => {
              const isActive = location.pathname.includes(portal.path.split('/')[1]);
              return (
                <button
                  key={portal.id}
                  onClick={() => {
                    navigate(portal.path);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-xl">{portal.icon}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">{t[portal.key as keyof typeof t]}</span>
                    <span className="text-[10px] font-medium text-slate-400">{t.jump}</span>
                  </div>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
                </button>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-50">
            <button
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
            >
              🏠 {t.returnHub}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalSwitcher;
