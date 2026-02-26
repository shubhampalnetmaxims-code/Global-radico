import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import SiteHeader from '../components/SiteHeader';
import { motion, AnimatePresence } from 'motion/react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, addresses, orders, deleteAddress, language, country, setLanguage } = useCart();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  const t = {
    EN: {
      title: 'My Account',
      subtitle: 'Manage your profile, orders, and addresses.',
      profile: 'My Profile',
      orders: 'My Orders',
      addresses: 'Addresses',
      logout: 'Logout',
      personalInfo: 'Profile Settings',
      personalSubtitle: 'Manage your personal information.',
      name: 'Full Name',
      mobile: 'Mobile Number',
      country: 'Country',
      orderHistory: 'Order History',
      orderSubtitle: 'View and track your past orders.',
      noOrders: 'No orders found yet.',
      shopNow: 'Shop Now',
      savedAddresses: 'Saved Addresses',
      addressSubtitle: 'Manage your delivery locations.',
      noAddresses: 'No addresses saved.',
      addNew: '+ Add New',
      viewInvoice: 'Invoice',
      viewDetails: 'View Details',
      status: 'Status',
      date: 'Date',
      total: 'Total',
      edit: 'Edit Profile'
    },
    DE: {
      title: 'Mein Konto',
      subtitle: 'Verwalten Sie Ihr Profil, Ihre Bestellungen und Adressen.',
      profile: 'Mein Profil',
      orders: 'Meine Bestellungen',
      addresses: 'Adressen',
      logout: 'Abmelden',
      personalInfo: 'Profileinstellungen',
      personalSubtitle: 'Verwalten Sie Ihre persönlichen Informationen.',
      name: 'Vollständiger Name',
      mobile: 'Handynummer',
      country: 'Land',
      orderHistory: 'Bestellverlauf',
      orderSubtitle: 'Anzeigen und Verfolgen Ihrer vergangenen Bestellungen.',
      noOrders: 'Noch keine Bestellungen gefunden.',
      shopNow: 'Jetzt einkaufen',
      savedAddresses: 'Gespeicherte Adressen',
      addressSubtitle: 'Verwalten Sie Ihre Lieferorte.',
      noAddresses: 'Keine Adressen gespeichert.',
      addNew: '+ Neu hinzufügen',
      viewInvoice: 'Rechnung',
      viewDetails: 'Details anzeigen',
      status: 'Status',
      date: 'Datum',
      total: 'Gesamt',
      edit: 'Profil bearbeiten'
    }
  }[language];

  const basePath = country === 'India' ? 'website-india' : 'website-germany';

  useEffect(() => {
    if (!user) {
      navigate(`/${basePath}/login`);
    }
  }, [user, navigate, basePath]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate(`/${basePath}/dev`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader lang={language} setLang={setLanguage} showLanguageToggle={country === 'Germany'} country={country} />
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto border-4 border-white shadow-lg">
                {user.name?.[0] || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{user.mobile}</p>
              </div>
            </div>

            <nav className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-2">
              {[
                { id: 'profile', label: t.profile, icon: '👤' },
                { id: 'orders', label: t.orders, icon: '📦' },
                { id: 'addresses', label: t.addresses, icon: '📍' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              <div className="h-px bg-slate-100 mx-4 my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
              >
                <span className="text-xl">🚪</span>
                {t.logout}
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-10"
                >
                  <header>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.personalInfo}</h2>
                    <p className="text-slate-500 font-medium">{t.personalSubtitle}</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.name}</label>
                      <p className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900">{user.name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.mobile}</label>
                      <p className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900">{user.mobile}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.country}</label>
                      <p className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900">{user.countryCode === '+49' ? 'Germany' : 'India'}</p>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all">
                    {t.edit}
                  </button>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <header>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.orderHistory}</h2>
                    <p className="text-slate-500 font-medium">{t.orderSubtitle}</p>
                  </header>

                  {orders.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-xl">
                      <p className="text-slate-400 font-bold">{t.noOrders}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-black text-slate-900">{order.id}</span>
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full">{order.status}</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{new Date(order.date).toLocaleDateString()} • {order.items.length} Items</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-slate-900">{order.total.toFixed(2)} {order.currency}</p>
                            <button 
                              onClick={() => navigate(`/${basePath}/order-success?orderId=${order.id}`)}
                              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline mt-1"
                            >
                              {t.viewDetails}
                            </button>
                            <span className="text-slate-200 mx-2">•</span>
                            <button 
                              onClick={() => navigate(`/${basePath}/invoice?orderId=${order.id}`)}
                              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors mt-1"
                            >
                              {t.viewInvoice}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div 
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <header className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.savedAddresses}</h2>
                      <p className="text-slate-500 font-medium">{t.addressSubtitle}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/${basePath}/address?redirect=/${basePath}/profile`)}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all"
                    >
                      {t.addNew}
                    </button>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-black text-slate-900">{addr.fullName}</p>
                            {addr.isDefault && <span className="text-[8px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded uppercase tracking-widest">Default</span>}
                          </div>
                          <div className="flex gap-2">
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors">✏️</button>
                            <button 
                              onClick={() => deleteAddress(addr.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                        </p>
                        <p className="text-xs text-slate-400 font-bold">{addr.mobile}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
