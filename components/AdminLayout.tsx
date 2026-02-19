
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PortalSwitcher from './PortalSwitcher';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/admin/dev' },
    { label: 'Category', icon: '📁', path: '/admin/categories' },
    { label: 'Products', icon: '📦', path: '/admin/products' },
    { label: 'Banners', icon: '🖼️', path: '/admin/banners' },
    { label: 'Orders', icon: '🛒', path: '#' },
    { label: 'Users', icon: '👥', path: '#' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">RM</div>
          <span className="font-black tracking-tight text-xl uppercase">Admin Hub</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">System</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-semibold text-sm"
          >
            <span>🚪</span>
            Exit Hub
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
              Workspace / <span className="text-slate-900">{menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
            <PortalSwitcher />
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden md:block">
                <p className="text-xs font-black text-slate-900 leading-none">Admin User</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black border-2 border-white shadow-sm">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-grow overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
