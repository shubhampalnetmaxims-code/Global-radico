
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import { CountryCode } from '../types/category';
import { Language } from './SiteHeader';

interface ProductGridProps {
  products: Product[];
  country: CountryCode;
  lang: Language;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, country, lang }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'none'>('none');

  const t = {
    EN: {
      search: 'Search products...',
      sortBy: 'Sort by price',
      lowToHigh: 'Price: Low to High',
      highToLow: 'Price: High to Low',
      noProducts: 'No products found matching your filters.',
      results: 'results',
      localMarket: 'Local Market',
      quickAdd: 'Add',
      viewDetails: 'View Product'
    },
    DE: {
      search: 'Produkte suchen...',
      sortBy: 'Nach Preis sortieren',
      lowToHigh: 'Preis: Gering zu Hoch',
      highToLow: 'Preis: Hoch zu Gering',
      noProducts: 'Keine passenden Produkte gefunden.',
      results: 'Ergebnisse',
      localMarket: 'Lokaler Preis',
      quickAdd: 'Hinzufügen',
      viewDetails: 'Details ansehen'
    }
  }[lang];

  const handleProductClick = (productId: string) => {
    const basePath = country === 'India' ? 'website-india' : 'website-germany';
    navigate(`/${basePath}/product/${productId}`);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const name = lang === 'DE' ? (p.name_de || p.name) : p.name;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        if (priceSort === 'none') return 0;
        const priceA = a.prices.find(pr => pr.country === country)?.amount || 0;
        const priceB = b.prices.find(pr => pr.country === country)?.amount || 0;
        return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
      });
  }, [products, searchQuery, priceSort, country, lang]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
          />
          <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as any)}
            className="flex-grow md:flex-none px-5 py-3 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="none">{t.sortBy}</option>
            <option value="asc">{t.lowToHigh}</option>
            <option value="desc">{t.highToLow}</option>
          </select>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
            {filteredProducts.length} {t.results}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const price = product.prices.find(p => p.country === country);
            const name = lang === 'DE' ? (product.name_de || product.name) : product.name;
            const desc = lang === 'DE' ? (product.description_de || product.description) : product.description;
            
            return (
              <div 
                key={product.id} 
                onClick={() => handleProductClick(product.id)}
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full cursor-pointer relative"
              >
                <div className="aspect-[4/5] overflow-hidden bg-slate-50 relative">
                  <img
                    src={product.images[0]}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                     <span className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                       {t.viewDetails}
                     </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow text-center">
                  <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{name}</h3>
                  <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-6 flex-grow">{desc}</p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{t.localMarket}</p>
                      <p className="text-lg font-black text-indigo-600 leading-none">
                        {price ? `${price.amount} ${price.currency}` : 'N/A'}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); alert('Added to cart!'); }}
                      className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg active:scale-90" 
                      title={t.quickAdd}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="text-5xl mb-4">🍂</div>
          <p className="text-lg font-bold text-slate-400 uppercase tracking-widest text-xs">{t.noProducts}</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
