import React, { useState } from 'react';
import { useCart } from '../components/CartContext';
import { User } from '../types/ecommerce';
import UserDetailsModal from '../components/UserDetailsModal';

const DistributorUsers: React.FC = () => {
  const { allData } = useCart();
  // Safely access Germany users, defaulting to empty array if data structure is incomplete
  const germanyUsers = allData?.Germany?.users || [];
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const getUserData = (userId: string) => {
    const orders = allData?.Germany?.orders?.filter(o => o.userId === userId) || [];
    const addresses = allData?.Germany?.addresses?.filter(a => a.userId === userId) || [];
    return { orders, addresses };
  };

  return (
    <div className="p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Germany Registered Users</h1>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm">
          Total Users: {germanyUsers.length}
        </div>
      </header>

      <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {germanyUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-[10px] sm:text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-black tracking-widest">User ID</th>
                  <th scope="col" className="px-6 py-4 font-black tracking-widest">Name</th>
                  <th scope="col" className="px-6 py-4 font-black tracking-widest">Mobile</th>
                  <th scope="col" className="px-6 py-4 font-black tracking-widest">Country</th>
                  <th scope="col" className="px-6 py-4 font-black tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {germanyUsers.map(user => (
                  <tr 
                    key={user.id} 
                    className="bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{user.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-slate-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{user.mobile}</td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                        {user.countryCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="text-indigo-600 hover:text-indigo-800 font-bold text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Users Found</h3>
            <p className="text-slate-500">There are currently no registered users from Germany.</p>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          orders={getUserData(selectedUser.id).orders}
          addresses={getUserData(selectedUser.id).addresses}
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default DistributorUsers;
