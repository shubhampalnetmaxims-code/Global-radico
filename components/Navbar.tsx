
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PortalSwitcher from './PortalSwitcher';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Admin', path: '/admin/login' },
    { label: 'Distributor', path: '/distributor/login' },
    { label: 'India Web', path: '/website-india/dev' },
    { label: 'Germany Web', path: '/website-germany/dev' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex-shrink-0 flex items-center gap-3 font-black text-xl text-slate-900 group"
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                R
              </div>
              <span className="hidden sm:block tracking-tighter">RADIO MALL</span>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    isActive(link.path) 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            
            <div className="h-8 w-px bg-slate-200"></div>
            
            <PortalSwitcher />

            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all" title="Account">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all relative" title="Cart">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-indigo-600 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <PortalSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-xl text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  navigate(link.path);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest ${
                  isActive(link.path) 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-100 mt-2">
              <button
                onClick={() => {
                  navigate('/');
                  setIsOpen(false);
                }}
                className="block w-full text-center px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg"
              >
                Home Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
