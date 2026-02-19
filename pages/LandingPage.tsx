
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Detect current browser language or default to EN for Landing
  const isDE = navigator.language.startsWith('de');
  
  const translations = {
    EN: {
      portal: 'Unified Portal Access',
      title: 'Radio Mall',
      desc: 'Centralized entry point for administrators, partners, and regional storefronts.',
      admin: 'Admin',
      adminDesc: 'System administration and category management',
      dist: 'Distributor',
      distDesc: 'Partner and distribution network portal',
      india: 'India Web',
      indiaDesc: 'Regional e-commerce portal for India',
      germany: 'Germany Web',
      germanyDesc: 'Regional e-commerce portal for Germany',
      access: 'Access Portal',
      footer: 'Radio Mall Global Hub'
    },
    DE: {
      portal: 'Zentraler Portal-Zugang',
      title: 'Radio Mall',
      desc: 'Zentraler Zugangspunkt für Administratoren, Partner und regionale Shops.',
      admin: 'Admin',
      adminDesc: 'Systemverwaltung und Kategorie-Management',
      dist: 'Händler',
      distDesc: 'Partner- und Vertriebsnetzwerk-Portal',
      india: 'Indien Shop',
      indiaDesc: 'Regionales E-Commerce-Portal für Indien',
      germany: 'Deutschland Shop',
      germanyDesc: 'Regionales E-Commerce-Portal für Deutschland',
      access: 'Portal betreten',
      footer: 'Radio Mall Global Hub'
    }
  };

  const t = isDE ? translations.DE : translations.EN;

  const accessOptions = [
    { 
      label: t.admin, 
      color: 'bg-indigo-600', 
      path: '/admin/login',
      desc: t.adminDesc
    },
    { 
      label: t.dist, 
      color: 'bg-slate-800', 
      path: '/distributor/login',
      desc: t.distDesc
    },
    { 
      label: t.india, 
      color: 'bg-orange-600', 
      path: '/website-india/dev',
      desc: t.indiaDesc
    },
    { 
      label: t.germany, 
      color: 'bg-red-600', 
      path: '/website-germany/dev',
      desc: t.germanyDesc
    },
  ];

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl w-full text-center space-y-16">
        <header className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase tracking-widest mb-4">
            {t.portal}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900">
            Radio <span className="text-indigo-600">Mall</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
            {t.desc}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {accessOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => navigate(option.path)}
              className="group relative flex flex-col items-start p-10 rounded-[3rem] text-left shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 focus:outline-none bg-white border border-slate-100"
            >
              <div className={`w-14 h-14 rounded-2xl ${option.color} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                 <span className="text-xl font-bold">{option.label[0]}</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{option.label}</h3>
              <p className="text-slate-500 text-base mb-10 leading-relaxed font-medium">
                {option.desc}
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:gap-4 transition-all">
                {t.access}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <footer className="pt-20 opacity-50">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {t.footer}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
