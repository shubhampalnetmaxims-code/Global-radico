import React, { useState, useEffect } from 'react';
import { useCart } from '../components/CartContext';
import { User } from '../types/ecommerce';

const DistributorUsers: React.FC = () => {
  const { allData } = useCart();
  const [germanyUsers, setGermanyUsers] = useState<User[]>([]);

  useEffect(() => {
    const users = allData.Germany.users || [];
    setGermanyUsers(users);
  }, [allData]);

  return (
    <div className="p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Germany Registered Users</h1>
      </header>

      <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-[10px] sm:text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">User ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Mobile</th>
              <th scope="col" className="px-6 py-3">Country</th>
            </tr>
          </thead>
          <tbody>
            {germanyUsers.map(user => (
              <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{user.id}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.mobile}</td>
                <td className="px-6 py-4">{user.countryCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistributorUsers;
