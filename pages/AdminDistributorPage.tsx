
import React, { useState, useEffect } from 'react';
import { Distributor, DistributorPermissions } from '../types/distributor';
import { getDistributors, saveDistributors } from '../data/mockDistributors';
import { useNavigate } from 'react-router-dom';

const AdminDistributorPage: React.FC = () => {
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState<Distributor[]>(getDistributors());

  useEffect(() => {
    // Sync if needed, though getDistributors() should be enough for initial render
    setDistributors(getDistributors());
  }, []);

  const persistDistributors = (updated: Distributor[]) => {
    setDistributors(updated);
    saveDistributors(updated);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('All');
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    fullAddress: '',
    state: '',
    country: '',
    pincode: '',
    password: '',
    sendCredentials: true,
    assignedCountry: 'India',
    permissions: {
      canManageCategories: false,
      canManageProducts: true,
      canSetPrices: true
    } as DistributorPermissions
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'sendCredentials') {
      setFormData(prev => ({ ...prev, sendCredentials: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: { ...prev.permissions, [name]: checked }
      }));
    }
  };

  const handleSave = () => {
    let updated: Distributor[];
    if (isEditing && editingId) {
      updated = distributors.map(d => d.id === editingId ? {
        ...d,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          fullAddress: formData.fullAddress,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode
        },
        assignedCountry: formData.assignedCountry,
        password: formData.password,
        permissions: formData.permissions,
      } : d);
    } else {
      const newDistributor: Distributor = {
        id: `dist-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          fullAddress: formData.fullAddress,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode
        },
        assignedCountry: formData.assignedCountry,
        password: formData.password || `pass_${Math.random().toString(36).slice(-4)}`,
        permissions: formData.permissions,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      updated = [newDistributor, ...distributors];
    }

    persistDistributors(updated);
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (dist: Distributor) => {
    setFormData({
      name: dist.name,
      phone: dist.phone,
      email: dist.email,
      fullAddress: dist.address.fullAddress,
      state: dist.address.state,
      country: dist.address.country,
      pincode: dist.address.pincode,
      password: dist.password,
      sendCredentials: false,
      assignedCountry: dist.assignedCountry,
      permissions: { ...dist.permissions }
    });
    setEditingId(dist.id);
    setIsEditing(true);
    setIsModalOpen(true);
    setStep(1);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this distributor?')) {
      const updated = distributors.filter(d => d.id !== id);
      persistDistributors(updated);
      if (selectedDistributor?.id === id) setSelectedDistributor(null);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = distributors.map(d => {
      if (d.id === id) {
        const newStatus = d.status === 'active' ? 'blocked' : 'active';
        return { ...d, status: newStatus };
      }
      return d;
    });
    persistDistributors(updated);
  };

  const handleSwitchToPortal = (dist: Distributor) => {
    // Set session and navigate
    localStorage.setItem('distributor_session', JSON.stringify({
      email: dist.email,
      country: dist.assignedCountry
    }));
    navigate(`/distributor/${dist.assignedCountry.toLowerCase()}/overview`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      fullAddress: '',
      state: '',
      country: '',
      pincode: '',
      password: '',
      sendCredentials: true,
      assignedCountry: 'India',
      permissions: {
        canManageCategories: false,
        canManageProducts: true,
        canSetPrices: true
      }
    });
    setStep(1);
  };

  const filteredDistributors = distributors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === 'All' || d.assignedCountry === filterCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Distributors</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your global distribution network</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <span>➕</span> Add Distributor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="flex-grow relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
        >
          <option value="All">All Countries</option>
          <option value="India">India</option>
          <option value="Germany">Germany</option>
        </select>
      </div>

      {/* List View */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Distributor</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned To</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDistributors.map((dist) => (
              <tr 
                key={dist.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setSelectedDistributor(dist)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-xs">
                      {dist.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{dist.name}</p>
                      <p className="text-xs text-slate-500">{dist.address.state}, {dist.address.country}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-700">{dist.email}</p>
                  <p className="text-xs text-slate-400">{dist.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    dist.assignedCountry === 'India' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {dist.assignedCountry} Website
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-bold ${
                    dist.status === 'active' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      dist.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                    }`}></span>
                    {dist.status === 'active' ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleSwitchToPortal(dist)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Switch to Portal"
                    >
                      <span>🚀</span>
                    </button>
                    <button 
                      onClick={() => handleEdit(dist)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <span>✏️</span>
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(dist.id)}
                      className={`p-2 rounded-lg transition-all ${
                        dist.status === 'active' 
                        ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' 
                        : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                      }`}
                      title={dist.status === 'active' ? 'Block' : 'Unblock'}
                    >
                      <span>🚫</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(dist.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <span>🗑️</span>
                    </button>
                    <button 
                      onClick={() => setSelectedDistributor(dist)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <span>👁️</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Distributor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-black text-slate-900">{isEditing ? 'Edit Distributor' : 'Add New Distributor'}</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Step {step} of 2</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setIsEditing(false); setEditingId(null); resetForm(); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="text-2xl">✕</span>
              </button>
            </div>

            <div className="p-8">
              {step === 1 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Country (Base)</label>
                      <select 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        <option value="Germany">Germany</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Address</label>
                    <textarea 
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                      placeholder="Street, Building, Area..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pincode / ZIP</label>
                      <input 
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                        placeholder="123456"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Password</label>
                      <input 
                        name="password"
                        type="text"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                        placeholder="Set password..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <input 
                      type="checkbox" 
                      id="sendCreds"
                      name="sendCredentials"
                      checked={formData.sendCredentials}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                    />
                    <label htmlFor="sendCreds" className="text-sm font-bold text-indigo-900">
                      Send login credentials to distributor's email automatically
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">1. Website Assignment</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['India', 'Germany'].map((country) => (
                        <button
                          key={country}
                          onClick={() => setFormData(prev => ({ ...prev, assignedCountry: country }))}
                          className={`p-4 rounded-2xl border-2 transition-all text-left ${
                            formData.assignedCountry === country 
                            ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-500/10' 
                            : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-2xl">{country === 'India' ? '🇮🇳' : '🇩🇪'}</span>
                            {formData.assignedCountry === country && <span className="text-indigo-600">✓</span>}
                          </div>
                          <p className="font-black text-slate-900 text-sm">{country} Website</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assign to this region</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">2. Permissions Control</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'canManageCategories', label: 'CRUD Categories', desc: 'Allow adding/editing categories for assigned country' },
                        { id: 'canManageProducts', label: 'CRUD Products', desc: 'Allow adding/editing products for assigned country' },
                        { id: 'canSetPrices', label: 'Set New Prices', desc: 'Allow setting custom prices for products' },
                      ].map((perm) => (
                        <div key={perm.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                          <div className="pt-1">
                            <input 
                              type="checkbox" 
                              id={perm.id}
                              name={perm.id}
                              checked={(formData.permissions as any)[perm.id]}
                              onChange={handleCheckboxChange}
                              className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                            />
                          </div>
                          <label htmlFor={perm.id} className="cursor-pointer">
                            <p className="font-bold text-slate-900 text-sm">{perm.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{perm.desc}</p>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between">
              <button 
                onClick={() => step === 1 ? (isEditing ? (setIsModalOpen(false), setIsEditing(false), setEditingId(null), resetForm()) : setIsModalOpen(false)) : setStep(1)}
                className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button 
                onClick={() => step === 1 ? setStep(2) : handleSave()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all"
              >
                {step === 1 ? 'Next Step' : (isEditing ? 'Update Distributor' : 'Save Distributor')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedDistributor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-200">
                  {selectedDistributor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedDistributor.name}</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                    Distributor ID: {selectedDistributor.id}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedDistributor(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="text-2xl">✕</span>
              </button>
            </div>

            <div className="flex-grow overflow-auto p-8">
              <div className="grid grid-cols-3 gap-8">
                {/* Left Column: Info */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-400">📧</span>
                        <span className="font-semibold text-slate-700">{selectedDistributor.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-400">📞</span>
                        <span className="font-semibold text-slate-700">{selectedDistributor.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Credentials</h3>
                    <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-indigo-400 font-bold uppercase tracking-widest">Login ID</span>
                        <span className="font-mono text-indigo-900 font-black">{selectedDistributor.email}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-indigo-400 font-bold uppercase tracking-widest">Password</span>
                        <span className="font-mono text-indigo-900 font-black">{selectedDistributor.password}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedDistributor.address.fullAddress}<br />
                      {selectedDistributor.address.state}, {selectedDistributor.address.country}<br />
                      PIN: {selectedDistributor.address.pincode}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permissions</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedDistributor.permissions).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-bold uppercase tracking-wider">{key.replace('can', '')}</span>
                          <span className={`font-black ${val ? 'text-emerald-600' : 'text-red-400'}`}>
                            {val ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Activity & Products (Simulated) */}
                <div className="col-span-2 space-y-8">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Assigned Products ({selectedDistributor.assignedCountry})</h3>
                      <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-1 rounded uppercase tracking-widest">Live Sync</span>
                    </div>
                    
                    <div className="space-y-3">
                      {/* In a real app, we would fetch these from a database. For now, we show products from localStorage */}
                      {(() => {
                        const savedPrices = localStorage.getItem(`dist_prices_${selectedDistributor.assignedCountry}`);
                        const distPrices = savedPrices ? JSON.parse(savedPrices) : [];
                        
                        // Get products added by this distributor
                        const allProducts = JSON.parse(localStorage.getItem('radico_products') || '[]');
                        const addedByDist = allProducts.filter((p: any) => p.addedBy === selectedDistributor.id);
                        
                        // Combine with some default products that have custom prices
                        const displayItems = [...addedByDist];
                        if (displayItems.length < 3) {
                          // Add some placeholders if empty
                          return [1, 2, 3].map((i) => {
                            const customPrice = distPrices.find((p: any) => p.productId === `p${i}`);
                            return (
                              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">IMG</div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">Premium Radio Model X{i}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Price: {selectedDistributor.assignedCountry === 'India' ? '₹350.00' : '€14.00'}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black text-indigo-600">Distributor Price</p>
                                  <p className="text-sm font-black text-slate-900">
                                    {customPrice ? `${customPrice.currency} ${customPrice.newPrice.toFixed(2)}` : (selectedDistributor.assignedCountry === 'India' ? '₹350.00' : '€14.00')}
                                  </p>
                                </div>
                              </div>
                            );
                          });
                        }

                        return displayItems.map((product: any) => {
                          const customPrice = distPrices.find((p: any) => p.productId === product.id);
                          const basePrice = product.prices.find((p: any) => p.country === selectedDistributor.assignedCountry);
                          return (
                            <div key={product.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-3">
                                <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{product.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Added by Distributor</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-black text-indigo-600">Price</p>
                                <p className="text-sm font-black text-slate-900">
                                  {customPrice ? `${customPrice.currency} ${customPrice.newPrice.toFixed(2)}` : `${basePrice?.currency} ${basePrice?.amount.toFixed(2)}`}
                                </p>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Activity & Contributions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Categories Added</p>
                        <p className="text-2xl font-black text-slate-900">
                          {JSON.parse(localStorage.getItem('radico_categories') || '[]').filter((c: any) => c.addedBy === selectedDistributor.id).length}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Products Added</p>
                        <p className="text-2xl font-black text-slate-900">
                          {JSON.parse(localStorage.getItem('radico_products') || '[]').filter((p: any) => p.addedBy === selectedDistributor.id).length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recently Priced Products</h4>
                      <div className="space-y-2">
                        {(() => {
                          const savedPrices = localStorage.getItem(`dist_prices_${selectedDistributor.assignedCountry}`);
                          const distPrices = savedPrices ? JSON.parse(savedPrices) : [];
                          if (distPrices.length === 0) return <p className="text-xs text-slate-400 italic">No custom prices set yet.</p>;
                          
                          return distPrices.slice(-3).reverse().map((price: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-xs p-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <span className="font-bold text-slate-700">Product ID: {price.productId}</span>
                              <span className="font-black text-indigo-600">{price.currency} {price.newPrice.toFixed(2)}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDistributorPage;
