import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import SiteHeader from '../components/SiteHeader';
import { motion } from 'motion/react';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, user, language, country, setLanguage } = useCart();
  const navigate = useNavigate();

  const t = {
    EN: {
      title: 'Your Cart',
      subtitle: 'Review your items before checkout.',
      empty: 'Your cart is empty',
      emptySub: "Looks like you haven't added anything yet.",
      startShopping: 'Start Shopping',
      summary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      remove: 'Remove'
    },
    DE: {
      title: 'Ihr Warenkorb',
      subtitle: 'Überprüfen Sie Ihre Artikel vor dem Bezahlen.',
      empty: 'Ihr Warenkorb ist leer',
      emptySub: 'Es sieht so aus, als hätten Sie noch nichts hinzugefügt.',
      startShopping: 'Jetzt einkaufen',
      summary: 'Bestellübersicht',
      subtotal: 'Zwischensumme',
      shipping: 'Versand',
      free: 'Kostenlos',
      total: 'Gesamt',
      checkout: 'Zur Kasse gehen',
      remove: 'Entfernen'
    }
  }[language];

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const currency = cart[0]?.currency || (country === 'India' ? 'INR' : 'EUR');
  const basePath = country === 'India' ? 'website-india' : 'website-germany';

  const handleCheckout = () => {
    if (!user) {
      navigate(`/${basePath}/login?redirect=/${basePath}/checkout`);
    } else {
      navigate(`/${basePath}/checkout`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader lang={language} setLang={setLanguage} showLanguageToggle={country === 'Germany'} country={country} />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <header>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-slate-500 font-medium">{t.subtitle}</p>
          </header>

          {cart.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-xl">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.empty}</h2>
              <p className="text-slate-500 mb-8">{t.emptySub}</p>
              <button 
                onClick={() => navigate(`/${basePath}/dev`)}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-900">{language === 'DE' ? (item.product.name_de || item.product.name) : item.product.name}</h3>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{item.product.categoryId}</p>
                      <p className="text-indigo-600 font-black mt-1">{item.price.toFixed(2)} {item.currency}</p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-900 font-black shadow-sm"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-900 font-black shadow-sm"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                      >
                        {t.remove}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                  <h3 className="text-xl font-black tracking-tight">{t.summary}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-400 font-medium">
                      <span>{t.subtotal}</span>
                      <span className="text-white">{subtotal.toFixed(2)} {currency}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-medium">
                      <span>{t.shipping}</span>
                      <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">{t.free}</span>
                    </div>
                    <div className="h-px bg-slate-800" />
                    <div className="flex justify-between items-end">
                      <span className="text-slate-400 font-medium">{t.total}</span>
                      <span className="text-3xl font-black">{subtotal.toFixed(2)} {currency}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-400 hover:text-white transition-all shadow-xl"
                  >
                    {t.checkout}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CartPage;
