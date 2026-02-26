import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';

const InvoicePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orders, language, country, setLanguage } = useCart();
  const orderId = searchParams.get('orderId');
  const order = orders.find(o => o.id === orderId);
  const basePath = country === 'India' ? 'website-india' : 'website-germany';

  useEffect(() => {
    if (!order) {
      navigate(`/${basePath}`);
    }
  }, [order, navigate, basePath]);

  const t = {
    EN: {
      title: 'Tax Invoice',
      billTo: 'Bill To',
      orderInfo: 'Order Information',
      orderId: 'Order ID',
      date: 'Date',
      payment: 'Payment',
      item: 'Item',
      qty: 'Qty',
      price: 'Price',
      total: 'Total',
      subtotal: 'Subtotal',
      tax: 'Tax (18%)',
      grandTotal: 'Grand Total',
      print: 'Print Invoice',
      back: 'Back to Order',
      notFound: 'Order Not Found'
    },
    DE: {
      title: 'Steuerrechnung',
      billTo: 'Rechnung an',
      orderInfo: 'Bestellinformationen',
      orderId: 'Bestellnummer',
      date: 'Datum',
      payment: 'Zahlung',
      item: 'Artikel',
      qty: 'Menge',
      price: 'Preis',
      total: 'Gesamt',
      subtotal: 'Zwischensumme',
      tax: 'Steuer (18%)',
      grandTotal: 'Gesamtbetrag',
      print: 'Rechnung drucken',
      back: 'Zurück zur Bestellung',
      notFound: 'Bestellung nicht gefunden'
    }
  }[language];

  if (!order) return null;

  return (
    <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto font-sans text-slate-900">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">RADICO GLOBAL</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Certified Organic Hair Care</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{t.title}</h2>
          <p className="text-sm font-bold text-slate-500">#{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="space-y-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.billTo}</h3>
          <p className="font-black text-lg">{order.address.fullName}</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {order.address.addressLine1}<br />
            {order.address.city}, {order.address.state}<br />
            {order.address.postalCode}, {order.address.country}
          </p>
          <p className="text-sm font-bold text-slate-900 mt-2">{order.address.mobile}</p>
        </div>
        <div className="text-right space-y-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.orderInfo}</h3>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-500">{t.date}: <span className="text-slate-900">{new Date(order.date).toLocaleDateString()}</span></p>
            <p className="text-sm font-bold text-slate-500">Status: <span className="text-emerald-600 uppercase">{order.status}</span></p>
            <p className="text-sm font-bold text-slate-500">{t.payment}: <span className="text-slate-900">{order.paymentMethod}</span></p>
          </div>
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.item}</th>
            <th className="text-center py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.qty}</th>
            <th className="text-right py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.price}</th>
            <th className="text-right py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.total}</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i} className="border-b border-slate-100">
              <td className="py-6">
                <p className="font-bold text-slate-900">{language === 'DE' ? (item.product.name_de || item.product.name) : item.product.name}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{item.product.categoryId}</p>
              </td>
              <td className="text-center py-6 font-bold">{item.quantity}</td>
              <td className="text-right py-6 font-bold">{item.price.toFixed(2)} {item.currency}</td>
              <td className="text-right py-6 font-black">{(item.price * item.quantity).toFixed(2)} {item.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-4">
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>{t.subtotal}</span>
            <span>{order.subtotal.toFixed(2)} {order.currency}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>{t.tax}</span>
            <span>{order.tax.toFixed(2)} {order.currency}</span>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="flex justify-between text-xl font-black text-slate-900">
            <span>{t.total}</span>
            <span>{order.total.toFixed(2)} {order.currency}</span>
          </div>
        </div>
      </div>

      <div className="mt-24 pt-8 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Thank you for choosing Radico Global</p>
      </div>

      <div className="fixed bottom-8 right-8 flex gap-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-indigo-600 transition-all"
        >
          🖨️ {t.print}
        </button>
        <button 
          onClick={() => navigate(-1)}
          className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-slate-50 transition-all"
        >
          {t.back}
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
