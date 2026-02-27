import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import SiteHeader from '../components/SiteHeader';

const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orders, language, country, setLanguage } = useCart();
  const orderId = searchParams.get('orderId');
  const order = orders.find(o => o.id === orderId);

  const t = {
    EN: {
      title: 'Order Placed!',
      subtitle: 'Your organic goodness is on its way.',
      orderId: 'Order ID',
      date: 'Date',
      payment: 'Payment',
      deliverTo: 'Deliver To',
      viewInvoice: 'View Invoice',
      myOrders: 'My Orders',
      continue: 'Continue Shopping'
    },
    DE: {
      title: 'Bestellung aufgegeben!',
      subtitle: 'Ihre Bio-Produkte sind auf dem Weg.',
      orderId: 'Bestellnummer',
      date: 'Datum',
      payment: 'Zahlung',
      deliverTo: 'Liefern an',
      viewInvoice: 'Rechnung anzeigen',
      myOrders: 'Meine Bestellungen',
      continue: 'Weiter einkaufen'
    }
  }[language];

  const basePath = country === 'India' ? 'website-india' : 'website-germany';

  useEffect(() => {
    if (!order) {
      navigate(`/${basePath}`);
    }
  }, [order, navigate, basePath]);

  if (!order) {
    return null;
  }

  const handleDownloadInvoice = () => {
    alert(`Downloading Invoice for ${orderId}... (Simulation)`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader lang={language} setLang={setLanguage} showLanguageToggle={country === 'Germany'} country={country} />
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <div 
          className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 p-16 text-center space-y-12"
        >
          <div className="space-y-6">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-xl shadow-emerald-100/50 animate-bounce">
              ✅
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{t.title}</h1>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              {t.subtitle} <span className="text-indigo-600 font-black">{orderId}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.orderId}</h3>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="font-bold text-slate-700">{language === 'DE' ? (item.product.name_de || item.product.name) : item.product.name} x {item.quantity}</span>
                    <span className="font-black text-slate-900">{(item.price * item.quantity).toFixed(2)} {item.currency}</span>
                  </div>
                ))}
                <div className="h-px bg-slate-200" />
                <div className="flex justify-between text-lg">
                  <span className="font-black text-slate-900">Total</span>
                  <span className="font-black text-indigo-600">{order.total.toFixed(2)} {order.currency}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.deliverTo}</h3>
              <div className="space-y-2">
                <p className="font-black text-slate-900">{order.address.fullName}</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {order.address.addressLine1}, {order.address.city}, {order.address.state} - {order.address.postalCode}, {order.address.country}
                </p>
                <p className="text-xs text-slate-400 font-bold mt-2">{order.address.mobile}</p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.payment}</p>
                <p className="font-bold text-sm text-slate-900">{order.paymentMethod} Gateway</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
            <button 
              onClick={() => navigate(`/${basePath}/invoice?orderId=${orderId}`)}
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              📄 {t.viewInvoice}
            </button>
            <button 
              onClick={() => navigate(`/${basePath}/profile`)}
              className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              📦 {t.myOrders}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccessPage;
