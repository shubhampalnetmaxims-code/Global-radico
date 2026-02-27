import React, { useState, useEffect, Fragment } from 'react';
import { useCart } from '../components/CartContext';
import { Order } from '../types/ecommerce';
import { CountryCode } from '../types/category';

const SuperAdminOrders: React.FC = () => {
  const { allData } = useCart();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [countryFilter, setCountryFilter] = useState<CountryCode | 'All'>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const ordersFromAllCountries = Object.values(allData).flatMap(countryData => (countryData as { orders: Order[] }).orders);
    setAllOrders(ordersFromAllCountries);
    setFilteredOrders(ordersFromAllCountries);
  }, [allData]);

  useEffect(() => {
    if (countryFilter === 'All') {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(order => order.address.country === countryFilter));
    }
  }, [countryFilter, allOrders]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log(`Order ${orderId} status changed to ${newStatus}`);
    setFilteredOrders(filteredOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="p-4 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">All Customer Orders</h1>
        <div>
          <label className="text-xs sm:text-sm font-bold text-slate-600 mr-2">Filter by Country:</label>
          <select 
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value as any)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All</option>
            <option value="India">India</option>
            <option value="Germany">Germany</option>
          </select>
        </div>
      </header>

      <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-[10px] sm:text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3">Order ID</th>
              <th scope="col" className="px-6 py-3">Customer</th>
              <th scope="col" className="px-6 py-3">Country</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <Fragment key={order.id}>
                <tr className="bg-white border-b hover:bg-slate-50 cursor-pointer" onClick={() => toggleOrderDetails(order.id)}>
                  <td className="px-6 py-4">
                    <div style={{ transform: expandedOrderId === order.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      ▶
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{order.address.fullName}</div>
                    <div className="text-xs text-slate-400">{order.address.mobile}</div>
                  </td>
                  <td className="px-6 py-4">{order.address.country}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{order.total.toFixed(2)} {order.currency}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full whitespace-nowrap ${order.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order.id, e.target.value)
                      }}
                      onClick={(e) => e.stopPropagation()} // Prevent row click when changing status
                      className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option>Paid</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
                  {expandedOrderId === order.id && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="bg-slate-50/70 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-4">
                            <h4 className="text-xs font-bold uppercase text-slate-500">Products</h4>
                            <div className="space-y-2">
                              {order.items.map(item => (
                                <div key={item.productId} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                  <div>
                                    <p className="font-bold text-slate-800">{item.product.name}</p>
                                    <p className="text-xs text-slate-400">QTY: {item.quantity}</p>
                                  </div>
                                  <p className="font-bold text-sm text-slate-600">{(item.price * item.quantity).toFixed(2)} {order.currency}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase text-slate-500">Shipping Address</h4>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-xs text-slate-600 leading-relaxed">
                              <p className="font-bold text-slate-800">{order.address.fullName}</p>
                              <p>{order.address.addressLine1}</p>
                              <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                              <p>{order.address.country}</p>
                              <p className="mt-2 font-bold">{order.address.mobile}</p>
                            </div>
                            <h4 className="text-xs font-bold uppercase text-slate-500 mt-4">Payment</h4>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-xs text-slate-600">
                              <p>Method: <span className="font-bold">{order.paymentMethod}</span></p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminOrders;
