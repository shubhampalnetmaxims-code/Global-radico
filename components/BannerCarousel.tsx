
import React, { useState, useEffect, useRef } from 'react';
import { Banner, BannerPlacement } from '../types/banner';
import { CountryCode } from '../types/category';
import { Language } from './SiteHeader';

interface BannerCarouselProps {
  banners: Banner[];
  placement: BannerPlacement;
  country: CountryCode;
  lang?: Language;
}

const bannerContentTranslations: Record<string, Record<Language, { title: string; subtitle: string }>> = {
  'Shine with Rich Black': {
    EN: { title: 'Shine with Rich Black', subtitle: 'Long-lasting black hair color' },
    DE: { title: 'Glänzen mit Tiefschwarz', subtitle: 'Langanhaltende schwarze Haarfarbe' }
  },
  'Bold Burgundy Look': {
    EN: { title: 'Bold Burgundy Look', subtitle: 'Trendy burgundy shades for you' },
    DE: { title: 'Mutiger Burgund-Look', subtitle: 'Trendige Burgund-Töne für Sie' }
  },
  'Strahlendes Kastanienbraun': {
    EN: { title: 'Radiant Chestnut Brown', subtitle: 'Premium hair color for natural shine' },
    DE: { title: 'Strahlendes Kastanienbraun', subtitle: 'Premium Haarfarbe für natürlichen Glanz' }
  },
  'Platinblond Perfektion': {
    EN: { title: 'Platinum Blonde Perfection', subtitle: 'Salon quality at home' },
    DE: { title: 'Platinblond Perfektion', subtitle: 'Salon-Qualität für zuhause' }
  },
  'Discover Your Perfect Hair Color': {
    EN: { title: 'Discover Your Perfect Hair Color', subtitle: 'Professional hair color range' },
    DE: { title: 'Entdecke Deine perfekte Haarfarbe', subtitle: 'Professionelles Haarfärbe-Sortiment' }
  }
};

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, placement, country, lang = 'EN' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const activeBanners = banners.filter(b => b.status === 'Active' && b.placement === placement);
  let displayedBanners = activeBanners.filter(b => b.countries.includes(country));
  
  if (displayedBanners.length === 0) {
    displayedBanners = activeBanners.filter(b => b.isDefault);
  }

  const resetTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (displayedBanners.length > 1) {
      timeoutRef.current = window.setTimeout(
        () => setCurrentIndex((prevIndex) => (prevIndex === displayedBanners.length - 1 ? 0 : prevIndex + 1)),
        5000
      );
    }
    return () => resetTimeout();
  }, [currentIndex, displayedBanners]);

  if (displayedBanners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden group">
      <div 
        className="flex transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayedBanners.map((banner) => {
          const trans = bannerContentTranslations[banner.title]?.[lang] || { title: banner.title, subtitle: banner.subtitle };
          return (
            <div key={banner.id} className="w-full shrink-0 relative aspect-[21/9] sm:aspect-[3/1] bg-slate-200">
              <img 
                src={banner.imageUrl} 
                alt={trans.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center px-6 sm:px-12 md:px-20">
                <div className="max-w-xl text-white space-y-2 sm:space-y-4 animate-in fade-in slide-in-from-left-8 duration-700">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
                    {trans.title}
                  </h2>
                  {trans.subtitle && (
                    <p className="text-sm sm:text-lg md:text-xl text-slate-200 font-medium">
                      {trans.subtitle}
                    </p>
                  )}
                  {banner.link && (
                    <div className="pt-2 sm:pt-4">
                      <button className="px-6 py-2 sm:px-8 sm:py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors text-sm sm:text-base shadow-xl">
                        {lang === 'EN' ? 'Explore Now' : 'Jetzt Entdecken'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayedBanners.length > 1 && (
        <>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {displayedBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={() => setCurrentIndex(prev => prev === 0 ? displayedBanners.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => setCurrentIndex(prev => prev === displayedBanners.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;
