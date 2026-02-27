import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import SiteHeader from '../components/SiteHeader';
import { Address } from '../types/ecommerce';

const AddressManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addAddress, user, language, country, setLanguage } = useCart();
  const [formData, setFormData] = useState<Partial<Address>>({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    country: user?.countryCode || country || 'India',
    isDefault: true
  });

  const t = {
    EN: {
      title: 'Add New Address',
      subtitle: 'Where should we deliver your order?',
      fullName: 'Full Name',
      mobile: 'Mobile Number',
      country: 'Country',
      address1: 'Address Line 1',
      city: 'City',
      state: 'State',
      postal: 'Postal Code',
      default: 'Set as default address',
      save: 'Save Address'
    },
    DE: {
      title: 'Neue Adresse hinzufügen',
      subtitle: 'Wohin sollen wir Ihre Bestellung liefern?',
      fullName: 'Vollständiger Name',
      mobile: 'Handynummer',
      country: 'Land',
      address1: 'Adresszeile 1',
      city: 'Stadt',
      state: 'Bundesland',
      postal: 'Postleitzahl',
      default: 'Als Standardadresse festlegen',
      save: 'Adresse speichern'
    }
  }[language];

  const basePath = country === 'India' ? 'website-india' : 'website-germany';
  const redirect = searchParams.get('redirect') || `/${basePath}/checkout`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      ...formData as Address,
      id: Math.random().toString(36).substr(2, 9)
    };
    addAddress(newAddress);
    navigate(redirect);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader lang={language} setLang={setLanguage} showLanguageToggle={country === 'Germany'} country={country} />
      
      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-12">
        <div 
          className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 space-y-10"
        >
          <header className="text-center">
            <div className="text-4xl mb-4">📍</div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-slate-500 font-medium">{t.subtitle}</p>
          </header>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.fullName}</label>
              <input 
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.mobile}</label>
              <input 
                required
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.country}</label>
              <select 
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="India">India</option>
                <option value="Germany">Germany</option>
                <option value="USA">USA</option>
                <option value="UAE">UAE</option>
                <option value="UK">UK</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.address1}</label>
              <input 
                required
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.city}</label>
              <input 
                required
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.state}</label>
              <input 
                required
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.postal}</label>
              <input 
                required
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3 py-2">
              <input 
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isDefault" className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t.default}</label>
            </div>
            <button 
              type="submit"
              className="md:col-span-2 w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl"
            >
              {t.save}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddressManagementPage;
