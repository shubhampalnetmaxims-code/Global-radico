import React from 'react';
import { User, Order, Address } from '../types/ecommerce';

interface UserDetailsModalProps {
  user: User;
  orders: Order[];
  addresses: Address[];
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, orders = [], addresses = [], onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <h3 className="font-black text-slate-900 text-xl">User Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          {/* Profile Section */}
          <section>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Profile Information</h4>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-2xl">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg">{user.name}</p>
                  <p className="text-slate-500 font-medium">ID: {user.id}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Mobile:</span>
                  <span className="font-bold text-slate-900">{user.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-bold text-slate-900">{user.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Country:</span>
                  <span className="font-bold text-slate-900">{user.countryCode}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Addresses Section */}
          <section>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Saved Addresses</h4>
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-200 transition-colors relative group">
                    {addr.isDefault && (
                      <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                        Default
                      </span>
                    )}
                    <p className="font-bold text-slate-900 mb-1">{addr.fullName}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {addr.addressLine1}<br />
                      {addr.addressLine2 && <>{addr.addressLine2}<br /></>}
                      {addr.city}, {addr.state} {addr.postalCode}<br />
                      {addr.country}
                    </p>
                    <p className="text-slate-400 text-xs mt-2 font-mono">Mobile: {addr.mobile}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100 border-dashed">
                <p className="text-slate-400 font-medium">No saved addresses found.</p>
              </div>
            )}
          </section>

          {/* Order History Section */}
          <section>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Order History</h4>
            {orders.length > 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{order.id}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                            order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-600' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                          {order.currency} {order.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100 border-dashed">
                <p className="text-slate-400 font-medium">No orders found.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
