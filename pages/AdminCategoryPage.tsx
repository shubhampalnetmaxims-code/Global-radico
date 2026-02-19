
import React, { useState, useRef, useEffect } from 'react';
import { Category, AVAILABLE_COUNTRIES, CountryCode } from '../types/category';
import { getCategories, saveCategories } from '../data/mockCategories';

const AdminCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      saveCategories(categories);
    }
  }, [categories]);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    countries: [],
    status: 'Active'
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData(cat);
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', countries: [], status: 'Active' });
    }
    setIsModalOpen(true);
    setIsCountryDropdownOpen(false);
  };

  const handleSave = () => {
    if (!formData.name || (formData.countries?.length === 0)) {
      alert("Name and at least one country are required.");
      return;
    }

    let updated: Category[];
    if (editingCategory) {
      updated = categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } as Category : c);
    } else {
      const newCat: Category = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0],
      } as Category;
      updated = [...categories, newCat];
    }
    setCategories(updated);
    saveCategories(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveCategories(updated);
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

  const selectAllCountries = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (formData.countries?.length === AVAILABLE_COUNTRIES.length) {
      setFormData({ ...formData, countries: [] });
    } else {
      setFormData({ ...formData, countries: [...AVAILABLE_COUNTRIES] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Category Management</h1>
          <p className="text-slate-500">Organize and manage global product categories.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add Category
        </button>
      </header>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Countries</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.map((cat) => (
              <tr key={cat.id} className={`hover:bg-slate-50/30 transition-colors ${cat.status === 'Inactive' ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">📁</div>
                    <div>
                      <div className="font-bold text-slate-900">{cat.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[200px]">{cat.description || 'No description'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {cat.countries.map(country => (
                      <span key={country} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-tight border border-slate-200">
                        {country === 'India' ? '🇮🇳 IN' : '🇩🇪 DE'}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cat.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {cat.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{cat.createdAt}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openModal(cat)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => setShowDeleteConfirm(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200">
            <header>
              <h2 className="text-2xl font-black text-slate-900">{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
              <p className="text-sm text-slate-400">Fill in the details for your new product group.</p>
            </header>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="e.g. Smart Electronics"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="Tell us about this category..."
                />
              </div>

              {/* Multi-select Country Dropdown */}
              <div className="space-y-1" ref={countryDropdownRef}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visible In Countries</label>
                  <button onClick={selectAllCountries} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">
                    {formData.countries?.length === AVAILABLE_COUNTRIES.length ? 'DESELECT ALL' : 'SELECT ALL'}
                  </button>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-left focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <span className="font-medium text-slate-800 truncate">
                      {formData.countries && formData.countries.length > 0 
                        ? formData.countries.join(', ') 
                        : 'Select Countries...'}
                    </span>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-10 animate-in fade-in zoom-in-95 duration-150">
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
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            formData.countries?.includes(country) 
                            ? 'bg-indigo-600 border-indigo-600' 
                            : 'border-slate-300 bg-white'
                          }`}>
                            {formData.countries?.includes(country) && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-semibold text-sm">
                            {country === 'India' ? '🇮🇳 India' : '🇩🇪 Germany'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                <div className="relative">
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-sm w-full rounded-[2rem] p-8 shadow-2xl border border-slate-100 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto">⚠️</div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Are you sure?</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">This will permanently delete the category and remove its association with products.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-all">No, Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryPage;
