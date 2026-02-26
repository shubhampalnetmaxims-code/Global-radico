import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import SiteHeader from '../components/SiteHeader';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types/ecommerce';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, user, addresses, addOrder, language, country, setLanguage } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses.find(a => a.isDefault)?.id || addresses[0]?.id);

  const t = {
    EN: {
      title: 'Checkout',
      subtitle: 'Complete your purchase securely.',
      address: 'Delivery Address',
      addNew: '+ Add New',
      orderItems: 'Order Items',
      summary: 'Payment Summary',
      subtotal: 'Subtotal',
      tax: 'Tax (18%)',
      shipping: 'Shipping',
      free: 'Free',
      total: 'Total Payable',
      method: 'Payment Method',
      gateway: 'Gateway',
      processing: 'Processing...',
      pay: 'Pay'
    },
    DE: {
      title: 'Kasse',
      subtitle: 'Schließen Sie Ihren Kauf sicher ab.',
      address: 'Lieferadresse',
      addNew: '+ Neu hinzufügen',
      orderItems: 'Bestellartikel',
      summary: 'Zahlungsübersicht',
      subtotal: 'Zwischensumme',
      tax: 'Steuer (18%)',
      shipping: 'Versand',
      free: 'Kostenlos',
      total: 'Gesamtbetrag',
      method: 'Zahlungsart',
      gateway: 'Gateway',
      processing: 'Wird verarbeitet...',
      pay: 'Bezahlen'
    }
  }[language];

  const basePath = country === 'India' ? 'website-india' : 'website-germany';

  React.useEffect(() => {
    if (cart.length === 0) {
      navigate(`/${basePath}/cart`);
    } else if (!user) {
      navigate(`/${basePath}/login?redirect=/${basePath}/checkout`);
    } else if (addresses.length === 0) {
      navigate(`/${basePath}/address?redirect=/${basePath}/checkout`);
    }
  }, [cart.length, user, addresses.length, navigate, basePath]);

  if (cart.length === 0 || !user || addresses.length === 0) {
    return null;
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const currency = cart[0]?.currency || (country === 'India' ? 'INR' : 'EUR');
  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const getPaymentGateway = (country: string) => {
    switch (country) {
      case 'India': return 'Razorpay';
      case 'USA': return 'Stripe';
      case 'UAE': return 'Telr';
      case 'UK': return 'Stripe';
      case 'Germany': return 'Stripe';
      default: return 'Stripe';
    }
  };

  const gateway = getPaymentGateway(selectedAddress.country);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        userId: user.id,
        items: [...cart],
        subtotal,
        tax: subtotal * 0.18, // 18% tax simulation
        total: subtotal * 1.18,
        currency,
        address: selectedAddress,
        paymentMethod: gateway,
        status: 'Paid',
        date: new Date().toISOString()
      };
      addOrder(newOrder);
      setIsProcessing(false);
      navigate(`/${basePath}/order-success?orderId=${newOrder.id}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader lang={language} setLang={setLanguage} showLanguageToggle={country === 'Germany'} country={country} />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-10 space-y-8"
            >
              <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.address}</h2>
                <button 
                  onClick={() => navigate(`/${basePath}/address?redirect=/${basePath}/checkout`)}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                >
                  {t.addNew}
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <button 
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`text-left p-6 rounded-3xl border-2 transition-all ${
                      selectedAddressId === addr.id 
                        ? 'border-indigo-600 bg-indigo-50/50' 
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-black text-slate-900">{addr.fullName}</p>
                      {addr.isDefault && <span className="text-[8px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded uppercase tracking-widest">Default</span>}
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                    </p>
                    <p className="text-xs text-slate-400 font-bold mt-2">{addr.mobile}</p>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-10 space-y-8"
            >
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.orderItems}</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-900 text-sm">{language === 'DE' ? (item.product.name_de || item.product.name) : item.product.name}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-slate-900">{(item.price * item.quantity).toFixed(2)} {item.currency}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 sticky top-8"
            >
              <h3 className="text-xl font-black tracking-tight">{t.summary}</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>{t.subtotal}</span>
                  <span className="text-white">{subtotal.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>{t.tax}</span>
                  <span className="text-white">{(subtotal * 0.18).toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>{t.shipping}</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">{t.free}</span>
                </div>
                <div className="h-px bg-slate-800" />
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 font-medium">{t.total}</span>
                  <span className="text-4xl font-black">{(subtotal * 1.18).toFixed(2)} {currency}</span>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.method}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xl">💳</div>
                  <p className="font-bold text-sm">{gateway} {t.gateway}</p>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.processing}
                  </>
                ) : (
                  <>{t.pay} {(subtotal * 1.18).toFixed(2)} {currency}</>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
