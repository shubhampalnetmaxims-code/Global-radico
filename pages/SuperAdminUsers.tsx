import React, { useState, useEffect } from 'react';
import { useCart } from '../components/CartContext';
import { User } from '../types/ecommerce';
import UserDetailsModal from '../components/UserDetailsModal';

const SuperAdminUsers: React.FC = () => {
  const { allData } = useCart();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const indiaUsers = allData.India.users || [];
    const germanyUsers = allData.Germany.users || [];
    const users = [...indiaUsers, ...germanyUsers];
    setAllUsers(users);
    setFilteredUsers(users);
  }, [allData]);

  useEffect(() => {
    if (countryFilter === 'All') {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(allUsers.filter(u => u.countryCode === countryFilter));
    }
  }, [countryFilter, allUsers]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const getUserData = (userId: string, countryCode: string) => {
    // Map country code to CountryData key
    const countryKey = countryCode === 'India' ? 'India' : 'Germany';
    const countryData = allData[countryKey];
    
    if (!countryData) return { orders: [], addresses: [] };

    const orders = countryData.orders?.filter(o => o.userId === userId) || [];
    const addresses = countryData.addresses?.filter(a => a.userId === userId) || [];
    return { orders, addresses };
  };

  return (
    <div className="p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">All Registered Users</h1>
        <div>
          <select 
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Countries</option>
            <option value="India">India</option>
            <option value="Germany">Germany</option>
          </select>
        </div>
      </header>

      <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-[10px] sm:text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">User ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Mobile</th>
              <th scope="col" className="px-6 py-3">Country</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr 
                key={user.id} 
                className="bg-white border-b hover:bg-slate-50 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{user.id}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.mobile}</td>
                <td className="px-6 py-4">{user.countryCode}</td>
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

      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          orders={getUserData(selectedUser.id, selectedUser.countryCode).orders}
          addresses={getUserData(selectedUser.id, selectedUser.countryCode).addresses}
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default SuperAdminUsers;
