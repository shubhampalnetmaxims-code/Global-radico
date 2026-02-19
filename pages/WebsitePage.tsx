
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteHeader, { Language, categoryNameTranslations } from '../components/SiteHeader';
import BannerCarousel from '../components/BannerCarousel';
import { CountryCode, Category } from '../types/category';
import { getBanners } from '../data/mockBanners';
import { getCategories } from '../data/mockCategories';
import { Banner } from '../types/banner';

interface WebsitePageProps {
  siteTitle: string;
  initialLanguage?: Language;
  isGermany?: boolean;
}

const contentTranslations = {
  EN: {
    mainWeb: 'Main Website',
    indiaWeb: 'India Store',
    germanyWeb: 'Germany Store',
    subtitle: 'Pure Certified Organic Hair Care',
    featured: 'Featured Categories',
    shopNow: 'Explore Now',
    explore: 'Explore our latest collections formulated for natural results.',
    footerTag: 'Dedicated to bringing you the purest certified organic hair care.'
  },
  DE: {
    mainWeb: 'Haupt-Webseite',
    indiaWeb: 'Indien Shop',
    germanyWeb: 'Deutschland Shop',
    subtitle: 'Rein zertifizierte Bio-Haarpflege',
    featured: 'Ausgewählte Kategorien',
    shopNow: 'Jetzt Entdecken',
    explore: 'Entdecken Sie unsere neuesten Kollektionen für natürliche Ergebnisse.',
    footerTag: 'Wir widmen uns der Bereitstellung reinster zertifizierter Bio-Haarpflege.'
  },
};

const WebsitePage: React.FC<WebsitePageProps> = ({ 
  siteTitle, 
  initialLanguage = 'EN', 
  isGermany = false 
}) => {
  const navigate = useNavigate();
  const getInitialLang = () => (isGermany ? 'DE' : 'EN');
  
  const [lang, setLang] = useState<Language>(getInitialLang());
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const currentCountry: CountryCode = isGermany ? 'Germany' : 'India';
  const t = contentTranslations[lang];

  useEffect(() => {
    setLang(getInitialLang());
  }, [isGermany]);

  useEffect(() => {
    setBanners(getBanners());
    const allCats = getCategories();
    setCategories(allCats.filter(c => c.status === 'Active' && c.countries.includes(currentCountry)));
  }, [currentCountry]);

  const handleCategoryClick = (catId: string) => {
    const basePath = isGermany ? 'website-germany' : 'website-india';
    navigate(`/${basePath}/category/${catId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SiteHeader 
        lang={lang}
        setLang={setLang}
        showLanguageToggle={isGermany} 
        country={currentCountry}
      />
      
      <BannerCarousel 
        banners={banners} 
        placement="Top" 
        country={currentCountry} 
        lang={lang}
      />

      <main className="flex-grow py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          <section className="space-y-12">
            <header className="text-center space-y-4">
              <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                {t.subtitle}
              </div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">{t.featured}</h2>
              <p className="text-slate-500 font-medium max-w-xl mx-auto">{t.explore}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map(cat => {
                const displayName = lang === 'DE' ? (cat.name_de || cat.name) : cat.name;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="group relative h-96 rounded-[3.5rem] overflow-hidden bg-slate-900 shadow-2xl transition-all duration-500 hover:-translate-y-3"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-10 text-center space-y-6">
                      <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-3xl shadow-2xl border border-white/20 transform group-hover:rotate-12 transition-transform duration-500">
                        🌿
                      </div>
                      <h3 className="text-3xl font-black text-white leading-tight">{displayName}</h3>
                      <div className="bg-white text-slate-900 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                        {t.shopNow}
                      </div>
                    </div>
                    {/* Simulated background color for variety */}
                    <div className={`absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-700 ${
                      cat.id === '1' ? 'bg-emerald-900' : cat.id === '2' ? 'bg-indigo-900' : 'bg-amber-900'
                    }`} />
                  </button>
                );
              })}
            </div>
          </section>

          <BannerCarousel 
            banners={banners} 
            placement="Middle" 
            country={currentCountry} 
            lang={lang}
          />
        </div>
      </main>

      <footer className="bg-slate-900 py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
           <div className="text-white font-black text-3xl tracking-tighter">RADICO GLOBAL</div>
           <p className="text-slate-400 max-w-md mx-auto text-sm font-medium leading-relaxed">
             {t.footerTag}
           </p>
           <div className="h-px bg-slate-800 w-24 mx-auto"></div>
           <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
             &copy; {new Date().getFullYear()} Radico Global Storefront Hub
           </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsitePage;
