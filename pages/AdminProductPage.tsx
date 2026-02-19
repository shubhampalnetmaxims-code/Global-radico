
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product, ProductPrice, ProductStatus } from '../types/product';
import { Category, AVAILABLE_COUNTRIES, CountryCode } from '../types/category';
import { getCategories } from '../data/mockCategories';
import { getProducts, saveProducts } from '../data/mockProducts';

type ViewMode = 'LIST' | 'WIZARD';
type WizardStep = 1 | 2 | 3 | 4;

const AdminProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMarket, setFilterMarket] = useState<CountryCode | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<ProductStatus | 'All'>('All');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    name_de: '',
    description: '',
    description_de: '',
    categoryId: '',
    status: 'Active',
    images: [],
    countries: [],
    prices: [],
    howToUse: '',
    howToUse_de: '',
    whatsInside: '',
    whatsInside_de: '',
    ingredients: '',
    ingredients_de: '',
    benefits: '',
    benefits_de: '',
    stock: 0
  });

  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  const persistProducts = (updated: Product[]) => {
    setProducts(updated);
    saveProducts(updated);
  };

  const startWizard = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ 
        name: '', 
        name_de: '',
        description: '', 
        description_de: '',
        categoryId: categories[0]?.id || '', 
        status: 'Active', 
        images: [], 
        countries: [], 
        prices: [],
        howToUse: '',
        howToUse_de: '',
        whatsInside: '',
        whatsInside_de: '',
        ingredients: '',
        ingredients_de: '',
        benefits: '',
        benefits_de: '',
        stock: 0
      });
    }
    setCurrentStep(1);
    setViewMode('WIZARD');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const toggleCountryVisibility = (country: CountryCode) => {
    const currentCountries = formData.countries || [];
    const currentPrices = formData.prices || [];
    
    if (currentCountries.includes(country)) {
      setFormData({
        ...formData,
        countries: currentCountries.filter(c => c !== country),
        prices: currentPrices.filter(p => p.country !== country)
      });
    } else {
      const currency = country === 'India' ? 'INR' : 'EUR';
      setFormData({
        ...formData,
        countries: [...currentCountries, country],
        prices: [...currentPrices, { country, amount: 0, currency }]
      });
    }
  };

  const updatePriceAmount = (country: CountryCode, amount: number) => {
    setFormData({
      ...formData,
      prices: (formData.prices || []).map(p => 
        p.country === country ? { ...p, amount } : p
      )
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.categoryId || (formData.countries?.length === 0)) {
      alert("Please ensure Name, Category and Store Visibility are set.");
      setCurrentStep(1);
      return;
    }

    let updated: Product[];
    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p);
    } else {
      const newProduct: Product = {
        ...formData,
        id: 'prod_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0],
      } as Product;
      updated = [newProduct, ...products];
    }
    
    persistProducts(updated);
    setViewMode('LIST');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.name_de?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || p.categoryId === filterCategory;
      const matchesMarket = filterMarket === 'All' || p.countries.includes(filterMarket as CountryCode);
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesMarket && matchesStatus;
    });
  }, [products, searchQuery, filterCategory, filterMarket, filterStatus]);

  if (viewMode === 'WIZARD') {
    return (
      <div className="min-h-full space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 pb-20">
        <header className="flex justify-between items-center border-b border-slate-100 pb-8">
          <div>
            <button onClick={() => setViewMode('LIST')} className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 mb-2 hover:translate-x-[-4px] transition-transform">
              ← Back to Catalog
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {editingProduct ? 'Update Product' : 'Create New Product'}
            </h1>
          </div>
          <div className="flex gap-4">
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(prev => (prev - 1) as WizardStep)} className="px-8 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button onClick={() => setCurrentStep(prev => (prev + 1) as WizardStep)} className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">
                Next Step
              </button>
            ) : (
              <button onClick={handleSave} className="px-12 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all animate-pulse">
                Publish Product
              </button>
            )}
          </div>
        </header>

        {/* Stepper Indicator */}
        <div className="flex items-center gap-6 max-w-4xl">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex-1 flex items-center gap-4 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                currentStep === step ? 'bg-slate-900 text-white shadow-xl scale-110' : 
                currentStep > step ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {currentStep > step ? '✓' : step}
              </div>
              <div className="hidden md:block">
                <p className={`text-[9px] font-black uppercase tracking-widest leading-none ${currentStep === step ? 'text-slate-900' : 'text-slate-300'}`}>
                  Step {step}
                </p>
                <p className={`text-[11px] font-bold mt-1 ${currentStep === step ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step === 1 ? 'Identity' : step === 2 ? 'Pricing' : step === 3 ? 'FAQ Details' : 'Finalize'}
                </p>
              </div>
              {step < 4 && <div className="flex-grow h-px bg-slate-100"></div>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
          {/* STEP 1: IDENTITY & VISIBILITY */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900">General Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name (EN)</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Organic Serum" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name (DE)</label>
                      <input type="text" value={formData.name_de} onChange={(e) => setFormData({...formData, name_de: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500" placeholder="z.B. Bio-Serum" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Category Placement</h3>
                  <select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 appearance-none">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Market Visibility</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">Select which regional storefronts this product will appear in.</p>
                  <div className="flex gap-4">
                    {AVAILABLE_COUNTRIES.map(country => {
                      const isActive = formData.countries?.includes(country);
                      return (
                        <button
                          key={country}
                          onClick={() => toggleCountryVisibility(country)}
                          className={`flex-1 p-6 rounded-[2.5rem] border-2 transition-all text-left space-y-3 ${
                            isActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                        >
                          <span className="text-3xl block">{country === 'India' ? '🇮🇳' : '🇩🇪'}</span>
                          <div>
                            <p className="text-sm font-black text-slate-900">{country} Store</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isActive ? 'VISIBLE' : 'HIDDEN'}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PRICING, STOCK & CONTENT */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
              <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-900">Market Pricing & Inventory</h3>
                <div className="space-y-6">
                  {/* Stock Level - Added Global Stock Input */}
                  <div className="p-8 bg-indigo-900 text-white rounded-[2.5rem] shadow-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest opacity-60">Inventory Control</p>
                      <h4 className="text-xl font-black">Stock Level</h4>
                    </div>
                    <div className="flex items-center gap-4">
                       <input 
                        type="number" 
                        value={formData.stock} 
                        onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                        className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-center font-black text-white focus:ring-2 focus:ring-white focus:outline-none"
                      />
                      <span className="font-bold text-xs">Units</span>
                    </div>
                  </div>

                  {formData.countries?.length ? formData.prices?.map(p => (
                    <div key={p.country} className="p-6 bg-slate-50 rounded-[2rem] flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-slate-900">{p.country} Price ({p.currency})</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Local Store Rate</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="number" 
                          value={p.amount} 
                          onChange={(e) => updatePriceAmount(p.country, parseFloat(e.target.value))} 
                          className="w-32 px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-indigo-600 focus:ring-2 focus:ring-indigo-500 text-right" 
                        />
                        <span className="font-bold text-slate-400 text-xs">{p.currency}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                      <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Please select visibility in Step 1</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-900">Main Marketing Copy</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Description (EN)</label>
                    <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-3xl font-medium focus:ring-2 focus:ring-indigo-500" placeholder="Describe the product in English..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Description (DE)</label>
                    <textarea rows={4} value={formData.description_de} onChange={(e) => setFormData({...formData, description_de: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-3xl font-medium focus:ring-2 focus:ring-indigo-500" placeholder="Produktbeschreibung auf Deutsch..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FAQ & DETAILS */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">💧</span>
                  How to Use
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <textarea placeholder="Instruction in English" value={formData.howToUse} onChange={(e) => setFormData({...formData, howToUse: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs border-none" rows={3} />
                  <textarea placeholder="Anleitung auf Deutsch" value={formData.howToUse_de} onChange={(e) => setFormData({...formData, howToUse_de: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs border-none" rows={3} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">📦</span>
                  What's Inside
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <textarea placeholder="Package contents (EN)" value={formData.whatsInside} onChange={(e) => setFormData({...formData, whatsInside: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs border-none" rows={3} />
                  <textarea placeholder="Packungsinhalt (DE)" value={formData.whatsInside_de} onChange={(e) => setFormData({...formData, whatsInside_de: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs border-none" rows={3} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">🌿</span>
                  Ingredients
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <textarea placeholder="Ingredients list (EN)" value={formData.ingredients} onChange={(e) => setFormData({...formData, ingredients: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs border-none" rows={3} />
                  <textarea placeholder="Inhaltsstoffe (DE)" value={formData.ingredients_de} onChange={(e) => setFormData({...formData, ingredients_de: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs border-none" rows={3} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">✨</span>
                  Benefits
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <textarea placeholder="Key benefits (EN)" value={formData.benefits} onChange={(e) => setFormData({...formData, benefits: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs border-none" rows={3} />
                  <textarea placeholder="Vorteile (DE)" value={formData.benefits_de} onChange={(e) => setFormData({...formData, benefits_de: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs border-none" rows={3} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MEDIA & FINALIZE */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
              <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-900">Product Media</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-indigo-400 hover:text-indigo-400 transition-all bg-slate-50">
                    <span className="text-3xl">+</span>
                    <span className="text-[10px] font-black uppercase mt-1 tracking-widest">Upload</span>
                  </button>
                  {formData.images?.map((img, i) => (
                    <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-slate-100 relative group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-black uppercase tracking-widest">
                        Remove
                      </button>
                    </div>
                  ))}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple className="hidden" />
                </div>
              </div>
              <div className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                <h3 className="text-xl font-black text-slate-900">Review Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name (EN)</span>
                    <span className="text-sm font-bold text-slate-900">{formData.name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</span>
                    <span className="text-sm font-bold text-slate-900">{formData.stock} Units</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</span>
                    <span className="text-sm font-bold text-slate-900">{formData.countries?.join(', ') || 'None'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Status</span>
                    <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-inner border border-slate-200">
                      <button onClick={() => setFormData({...formData, status: 'Active'})} className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${formData.status === 'Active' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}>ACTIVE</button>
                      <button onClick={() => setFormData({...formData, status: 'Inactive'})} className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${formData.status === 'Inactive' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>INACTIVE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Global Products</h1>
          <p className="text-slate-500">Managing a catalog of {products.length} organic formulations.</p>
        </div>
        <button 
          onClick={() => startWizard()}
          className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all active:scale-95"
        >
          + Add New Product
        </button>
      </header>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search catalog..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-sm" 
          />
          <svg className="absolute left-4 top-3 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl font-bold text-xs appearance-none">
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterMarket} onChange={(e) => setFilterMarket(e.target.value as any)} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl font-bold text-xs appearance-none">
          <option value="All">All Markets</option>
          <option value="India">🇮🇳 India Store</option>
          <option value="Germany">🇩🇪 Germany Store</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl font-bold text-xs appearance-none">
          <option value="All">All Status</option>
          <option value="Active">Active Only</option>
          <option value="Inactive">Inactive Only</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Formulation</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">In Stock</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Presence</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lifecycle</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                        {prod.images?.[0] ? (
                          <img src={prod.images[0]} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xl">🌿</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-slate-900 truncate max-w-[200px]">{prod.name}</div>
                        <div className="text-[9px] text-indigo-600 font-black uppercase tracking-widest mt-0.5">{prod.name_de || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 uppercase tracking-tight">
                      {categories.find(c => c.id === prod.categoryId)?.name || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-xs font-black ${prod.stock <= 5 ? 'text-red-500' : 'text-slate-900'}`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2 flex-wrap">
                      {prod.countries?.map(c => (
                        <div key={c} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm group/market">
                          <span className="text-xs group-hover/market:scale-125 transition-transform">{c === 'India' ? '🇮🇳' : '🇩🇪'}</span>
                          <span className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{c}</span>
                        </div>
                      ))}
                      {prod.countries.length === 0 && <span className="text-[9px] font-black text-slate-300 italic uppercase">Not Assigned</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      prod.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startWizard(prod)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => setShowDeleteConfirm(prod.id)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-32 text-center bg-slate-50/50">
               <span className="text-5xl block mb-4 opacity-50">🔍</span>
               <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No products match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-[3rem] p-12 text-center space-y-8 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto shadow-inner">🗑️</div>
            <div>
              <h3 className="text-3xl font-black text-slate-900">Delete Formulation?</h3>
              <p className="text-sm font-medium text-slate-400 mt-2 leading-relaxed">This action cannot be undone. All regional variants will be removed.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
              <button onClick={() => { persistProducts(products.filter(p => p.id !== showDeleteConfirm)); setShowDeleteConfirm(null); }} className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default AdminProductPage;
