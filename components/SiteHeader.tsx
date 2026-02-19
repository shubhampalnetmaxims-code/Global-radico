
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../data/mockCategories';
import { CountryCode, Category } from '../types/category';
import PortalSwitcher from './PortalSwitcher';

export type Language = 'EN' | 'DE';

interface SiteHeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  showLanguageToggle?: boolean;
  country?: CountryCode;
}

export const headerTranslations = {
  EN: {
    home: 'Home',
    categories: 'Categories',
    ourStory: 'Our Story',
    contact: 'Contact Us',
    search: 'Search...',
    account: 'Account',
    cart: 'Cart',
    shopByRegion: 'Shop by Region',
    viewAll: 'View All Categories',
    noCategories: 'No active categories for this region.',
    currentStore: 'Current Store'
  },
  DE: {
    home: 'Startseite',
    categories: 'Kategorien',
    ourStory: 'Unsere Geschichte',
    contact: 'Kontakt',
    search: 'Suchen...',
    account: 'Konto',
    cart: 'Warenkorb',
    shopByRegion: 'Region wählen',
    viewAll: 'Alle Kategorien anzeigen',
    noCategories: 'Keine aktiven Kategorien für diese Region.',
    currentStore: 'Aktueller Shop'
  },
};

export const categoryNameTranslations: Record<string, Record<Language, string>> = {
  'Organic Hair Colour': { 
    EN: 'Organic Hair Colour', 
    DE: 'Bio-Haarfarbe' 
  },
  'Hair Treatment': { 
    EN: 'Hair Treatment', 
    DE: 'Haarpflege & Kuren' 
  },
  'Sunab Organic Hair Colour': { 
    EN: 'Sunab Organic Hair Colour', 
    DE: 'Sunab Bio-Haarfarbe' 
  },
};

const SiteHeader: React.FC<SiteHeaderProps> = ({ 
  lang,
  setLang,
  showLanguageToggle = false,
  country = 'India'
}) => {
  const navigate = useNavigate();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const t = headerTranslations[lang];

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const filteredCategories = categories.filter(cat => 
    cat.status === 'Active' && 
    cat.countries.includes(country)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (catId: string) => {
    const basePath = country === 'India' ? 'website-india' : 'website-germany';
    navigate(`/${basePath}/category/${catId}`);
    setIsCategoriesOpen(false);
  };

  const handleHomeClick = () => {
    const basePath = country === 'India' ? 'website-india' : 'website-germany';
    navigate(`/${basePath}/dev`);
  };

  return (
    <header className="bg-white border-b border-slate-100 w-full relative z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 font-black text-2xl text-slate-900 tracking-tighter cursor-pointer group"
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors">
                R
              </div>
              <span className="hidden xs:block">RADICO</span>
            </div>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button onClick={handleHomeClick} className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">{t.home}</button>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`text-sm font-bold transition-colors flex items-center gap-1 ${isCategoriesOpen ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {t.categories}
                <svg className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoriesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">
                      {t.currentStore}: {country === 'India' ? 'Indien' : 'Deutschland'}
                    </p>
                    <div className="space-y-1">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map(cat => {
                          const displayName = categoryNameTranslations[cat.name]?.[lang] || cat.name;
                          return (
                            <button 
                              key={cat.id}
                              onClick={() => handleCategoryClick(cat.id)}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-2xl transition-all group flex items-center justify-between"
                            >
                              <span className="font-bold text-slate-700 group-hover:text-indigo-600">{displayName}</span>
                              <span className="text-slate-300 group-hover:text-indigo-300">→</span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-xs text-slate-400 italic">{t.noCategories}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a href="#" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">{t.ourStory}</a>
            <a href="#" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">{t.contact}</a>
          </nav>

          {/* Right: Tools & Portal Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <PortalSwitcher lang={lang} />
              
              <div className="h-8 w-px bg-slate-100 mx-1"></div>

              {showLanguageToggle && (
                <div className="bg-slate-100 rounded-2xl p-1 flex gap-1 border border-slate-200 shadow-inner relative overflow-hidden">
                  <div 
                    className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out ${lang === 'EN' ? 'translate-x-0' : 'translate-x-full'}`}
                  ></div>
                  
                  <button onClick={() => setLang('EN')} className={`relative z-10 px-4 py-2 text-[10px] font-black rounded-xl transition-all duration-300 ${lang === 'EN' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>EN</button>
                  <button onClick={() => setLang('DE')} className={`relative z-10 px-4 py-2 text-[10px] font-black rounded-xl transition-all duration-300 ${lang === 'DE' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>DE</button>
                </div>
              )}
              
              <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all" title={t.account}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all relative" title={t.cart}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-indigo-600 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
