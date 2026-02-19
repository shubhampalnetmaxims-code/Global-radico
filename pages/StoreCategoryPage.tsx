
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SiteHeader, { Language, categoryNameTranslations } from '../components/SiteHeader';
import ProductGrid from '../components/ProductGrid';
import { CountryCode } from '../types/category';
import { getProducts } from '../data/mockProducts';
import { getCategories } from '../data/mockCategories';
import { Product } from '../types/product';
import { Category } from '../types/category';

interface StoreCategoryPageProps {
  country: CountryCode;
  initialLanguage: Language;
}

const StoreCategoryPage: React.FC<StoreCategoryPageProps> = ({ country, initialLanguage }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>(initialLanguage);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const t = {
    EN: {
      store: 'Store',
      back: 'Back to Home',
      rights: 'All Rights Reserved'
    },
    DE: {
      store: 'Shop',
      back: 'Zurück zur Startseite',
      rights: 'Alle Rechte vorbehalten'
    }
  }[lang];

  useEffect(() => {
    const allCats = getCategories();
    const foundCat = allCats.find(c => c.id === id);
    if (!foundCat || !foundCat.countries.includes(country) || foundCat.status !== 'Active') {
      navigate(country === 'India' ? '/website-india/dev' : '/website-germany/dev');
      return;
    }
    setCategory(foundCat);

    const allProducts = getProducts();
    const filtered = allProducts.filter(p => 
      p.categoryId === id && 
      p.status === 'Active' && 
      p.countries.includes(country)
    );
    setProducts(filtered);
  }, [id, country, navigate]);

  if (!category) return null;

  const displayName = lang === 'DE' ? (category.name_de || category.name) : category.name;
  const displayDesc = lang === 'DE' ? (category.description_de || category.description) : category.description;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader 
        lang={lang} 
        setLang={setLang} 
        showLanguageToggle={country === 'Germany'} 
        country={country} 
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <header className="space-y-6 text-center animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => navigate(country === 'India' ? '/website-india/dev' : '/website-germany/dev')}
              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
            >
              ← {t.back}
            </button>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <div className="inline-block px-4 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
              {country} {t.store}
            </div>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{displayName}</h1>
          {displayDesc && (
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              {displayDesc}
            </p>
          )}
        </header>

        <ProductGrid 
          products={products} 
          country={country} 
          lang={lang} 
        />
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
        <div className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Radico Global Storefront • {t.rights}
        </div>
      </footer>
    </div>
  );
};

export default StoreCategoryPage;
