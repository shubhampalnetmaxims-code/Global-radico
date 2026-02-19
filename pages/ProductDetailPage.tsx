
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SiteHeader, { Language } from '../components/SiteHeader';
import { Product } from '../types/product';
import { getProducts } from '../data/mockProducts';
import { CountryCode } from '../types/category';

interface ProductDetailPageProps {
  country: CountryCode;
  initialLanguage: Language;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ country, initialLanguage }) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>(initialLanguage);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeFaq, setActiveFaq] = useState<string | null>('how');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const allProducts = getProducts();
    const found = allProducts.find(p => p.id === productId && p.countries.includes(country));
    if (!found) {
      navigate(country === 'India' ? '/website-india/dev' : '/website-germany/dev');
      return;
    }
    setProduct(found);
  }, [productId, country, navigate]);

  if (!product) return null;

  const t = {
    EN: {
      how: 'How to use',
      inside: "What's inside the box",
      ingredients: 'Ingredients',
      benefits: 'Benefits',
      addToCart: 'Add to Cart',
      back: 'Back to Shop',
      availability: 'Availability',
      market: 'Target Market',
      productDetails: 'Product Information',
      rights: 'All Rights Reserved',
      inStock: 'In Stock',
      lowStock: 'Only a few left!',
      outOfStock: 'Out of Stock',
      units: 'units',
      quantity: 'Quantity'
    },
    DE: {
      how: 'Anwendung',
      inside: 'Was ist in der Box',
      ingredients: 'Inhaltsstoffe',
      benefits: 'Vorteile des Produkts',
      addToCart: 'In den Warenkorb',
      back: 'Zurück zum Shop',
      availability: 'Verfügbarkeit',
      market: 'Zielmarkt',
      productDetails: 'Produktinformationen',
      rights: 'Alle Rechte vorbehalten',
      inStock: 'Auf Lager',
      lowStock: 'Nur noch wenige verfügbar!',
      outOfStock: 'Ausverkauft',
      units: 'Einheiten',
      quantity: 'Menge'
    }
  }[lang];

  const name = lang === 'DE' ? (product.name_de || product.name) : product.name;
  const desc = lang === 'DE' ? (product.description_de || product.description) : product.description;
  const price = product.prices.find(p => p.country === country);

  const faqItems = [
    { id: 'how', label: t.how, content: lang === 'DE' ? product.howToUse_de : product.howToUse },
    { id: 'inside', label: t.inside, content: lang === 'DE' ? product.whatsInside_de : product.whatsInside },
    { id: 'ingredients', label: t.ingredients, content: lang === 'DE' ? product.ingredients_de : product.ingredients },
    { id: 'benefits', label: t.benefits, content: lang === 'DE' ? product.benefits_de : product.benefits },
  ];

  const stockStatus = product.stock > 10 ? t.inStock : product.stock > 0 ? t.lowStock : t.outOfStock;
  const stockColor = product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

  const handleAddToCart = () => {
    alert(`Added ${quantity} units of ${name} to your cart!`);
  };

  const incrementQty = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader 
        lang={lang} 
        setLang={setLang} 
        showLanguageToggle={country === 'Germany'} 
        country={country} 
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left: Product Images */}
          <div className="lg:w-1/2 space-y-6">
            <button 
              onClick={() => navigate(-1)} 
              className="group flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-4"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              {t.back}
            </button>
            <div className="aspect-[1/1] rounded-[3.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl relative">
              <img src={product.images[0]} alt={name} className="w-full h-full object-cover" />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                   <span className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl rotate-[-5deg]">
                     {t.outOfStock}
                   </span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.slice(1).map((img, i) => (
                  <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 cursor-pointer hover:border-indigo-500 transition-all">
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="lg:w-1/2 space-y-10 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${stockColor}`}>
                  {stockStatus} ({product.stock} {t.units})
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.market}: {country}</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{name}</h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">{desc}</p>
              <div className="pt-4 flex items-center justify-between border-b border-slate-100 pb-8">
                 <p className="text-4xl font-black text-indigo-600 leading-none">
                  {price ? `${price.amount} ${price.currency}` : 'N/A'}
                 </p>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Organic Standard</p>
              </div>
            </div>

            {/* Quantity Selector & Action */}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.quantity}</label>
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                    <button 
                      onClick={decrementQty}
                      disabled={product.stock === 0}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-900 font-black border border-slate-100 shadow-sm active:scale-90 transition-all disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-14 text-center font-black text-slate-900">{quantity}</span>
                    <button 
                      onClick={incrementQty}
                      disabled={product.stock === 0 || quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-900 font-black border border-slate-100 shadow-sm active:scale-90 transition-all disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  {product.stock > 0 && (
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      Max: {product.stock} {t.units}
                    </p>
                  )}
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full md:w-auto px-16 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                  product.stock === 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-indigo-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {t.addToCart}
              </button>
            </div>

            {/* FAQ Style Accordion */}
            <div className="pt-12 border-t border-slate-100 space-y-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6">{t.productDetails}</h3>
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div key={item.id} className="border-b border-slate-50 last:border-none pb-4">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === item.id ? null : item.id)}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <span className={`text-sm font-black uppercase tracking-widest transition-colors ${activeFaq === item.id ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-900'}`}>
                        {item.label}
                      </span>
                      <svg className={`w-5 h-5 transition-transform duration-300 ${activeFaq === item.id ? 'rotate-180 text-indigo-600' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeFaq === item.id && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line font-medium">
                          {item.content || '...'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-slate-900 font-black text-xl mb-4">RADICO</div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Radico Global • {t.rights}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;
