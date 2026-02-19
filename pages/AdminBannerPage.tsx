
import React, { useState, useRef, useEffect } from 'react';
import { Banner, BannerPlacement, BannerStatus } from '../types/banner';
import { AVAILABLE_COUNTRIES, CountryCode } from '../types/category';
import { getBanners, saveBanners } from '../data/mockBanners';

const BannerImagePreview: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-300">
        <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-[8px] font-black uppercase tracking-tighter">Broken</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover" 
      onError={() => setError(true)}
    />
  );
};

const AdminBannerPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBanners(getBanners());
  }, []);

  const persistBanners = (updated: Banner[]) => {
    setBanners(updated);
    saveBanners(updated);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '',
    placement: 'Top',
    countries: [],
    status: 'Active',
    isDefault: false
  });

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData(banner);
    } else {
      setEditingBanner(null);
      setFormData({ 
        title: '', 
        subtitle: '', 
        imageUrl: '', 
        link: '', 
        placement: 'Top', 
        countries: [], 
        status: 'Active', 
        isDefault: false 
      });
    }
    setIsModalOpen(true);
    setIsCountryDropdownOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.imageUrl || (formData.countries?.length === 0 && !formData.isDefault)) {
      alert("Please fill in Name, Upload an Image, and select a Target Region (or Set as Default).");
      return;
    }

    let updatedBanners: Banner[];
    if (editingBanner) {
      updatedBanners = banners.map(b => b.id === editingBanner.id ? { ...b, ...formData } as Banner : b);
    } else {
      const newBanner: Banner = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0],
      } as Banner;
      updatedBanners = [newBanner, ...banners];
    }
    
    persistBanners(updatedBanners);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = banners.filter(b => b.id !== id);
    persistBanners(updated);
    setShowDeleteConfirm(null);
  };

  const toggleCountry = (country: CountryCode) => {
    const current = formData.countries || [];
    if (current.includes(country)) {
      setFormData({ ...formData, countries: current.filter(c => c !== country) });
    } else {
      setFormData({ ...formData, countries: [...current, country] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Banners</h1>
          <p className="text-slate-500">Manage promotional banners for India and Germany.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#0f172a] hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="text-xl">+</span> Add New Banner
        </button>
      </header>

      {/* Simplified List View */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Banner Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Placement</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Region</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {banners.map((banner) => (
                <tr key={banner.id} className={`hover:bg-slate-50/50 transition-colors ${banner.status === 'Inactive' ? 'opacity-60 bg-slate-50/20' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                        <BannerImagePreview src={banner.imageUrl} alt={banner.title} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate max-w-[200px]">{banner.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase truncate">
                          {banner.isDefault ? '⭐ Global Default' : 'Campaign Banner'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      {banner.placement} Section
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {banner.countries.length > 0 ? banner.countries.map(c => (
                        <span key={c} className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 uppercase">
                          {c}
                        </span>
                      )) : <span className="text-[9px] font-black text-slate-300 italic uppercase">All Regions</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      banner.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {banner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openModal(banner)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => setShowDeleteConfirm(banner.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-semibold italic">
                    No banners created yet. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Direct Upload & New Labels */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 space-y-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <header>
              <h2 className="text-3xl font-black text-slate-900">{editingBanner ? 'Update Banner' : 'New Banner'}</h2>
              <p className="text-sm font-semibold text-slate-400">Regional updates are reflected instantly on the website.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Banner Name */}
              <div className="space-y-2 col-span-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name of the Banner</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                  placeholder="e.g. India Diwali Sale"
                />
              </div>

              {/* Upload Image */}
              <div className="space-y-2 col-span-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Images for the Banner</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full aspect-[21/9] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group ${
                    formData.imageUrl ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Image File</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Placement */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Placement</label>
                <div className="relative">
                  <select 
                    value={formData.placement}
                    onChange={(e) => setFormData({...formData, placement: e.target.value as BannerPlacement})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="Top">Top Section</option>
                    <option value="Middle">Middle Section</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Redirect Link */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Redirect Link when I click on that Image</label>
                <input 
                  type="text" 
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                  placeholder="e.g. /category/organic-hair-colour"
                />
              </div>

              {/* Target Region */}
              <div className="space-y-2 col-span-full" ref={countryDropdownRef}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Region</label>
                <div className="relative">
                  <button 
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-left focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                  >
                    <span className="font-bold text-slate-700">
                      {formData.countries && formData.countries.length > 0 
                        ? formData.countries.join(', ') 
                        : 'Choose Regions...'}
                    </span>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-10 animate-in fade-in zoom-in-95">
                      {AVAILABLE_COUNTRIES.map(country => (
                        <button
                          key={country}
                          onClick={() => toggleCountry(country)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            formData.countries?.includes(country) 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                           <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${formData.countries?.includes(country) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                             {formData.countries?.includes(country) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                           </div>
                           <span className="font-bold text-sm">{country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Active/Inactive */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active / Inactive</label>
                <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-100 shadow-inner">
                   <button 
                     onClick={() => setFormData({...formData, status: 'Active'})} 
                     className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${formData.status === 'Active' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}
                   >
                     ACTIVE
                   </button>
                   <button 
                     onClick={() => setFormData({...formData, status: 'Inactive'})} 
                     className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${formData.status === 'Inactive' ? 'bg-white shadow-sm text-slate-600' : 'text-slate-400'}`}
                   >
                     INACTIVE
                   </button>
                </div>
              </div>

              {/* Set Default */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Set Default</label>
                <button 
                  onClick={() => setFormData({...formData, isDefault: !formData.isDefault})}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-2 ${
                    formData.isDefault 
                    ? 'bg-[#0f172a] border-[#0f172a] text-white shadow-lg' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {formData.isDefault && <span>⭐</span>}
                  {formData.isDefault ? 'Global Default Enabled' : 'Enable as Global Default'}
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-50 transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={handleSave}
                className="flex-[1.5] py-5 bg-[#0f172a] hover:bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl transition-all active:scale-[0.98]"
              >
                {editingBanner ? 'Update Banner' : 'Publish Banner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-inner">🗑️</div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Delete Banner?</h3>
              <p className="text-sm font-semibold text-slate-400 mt-2">This will remove the banner from all selected region storefronts immediately.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px] hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-4 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default AdminBannerPage;
