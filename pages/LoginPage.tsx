
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Field {
  name: string;
  label: string;
  type: string;
}

interface LoginPageProps {
  title: string;
  fields: Field[];
  redirectPath: string;
  validUser?: string;
  validPass?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ title, fields, redirectPath, validUser, validPass }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error when typing
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation logic
    const inputUser = formData[fields[0].name];
    const inputPass = formData[fields[1].name];

    if (validUser && validPass) {
      if (inputUser === validUser && inputPass === validPass) {
        navigate(redirectPath);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } else {
      // If no creds defined, just proceed (e.g. for development mode)
      navigate(redirectPath);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-8 md:p-14">
            <header className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
              <p className="text-slate-500 mt-3 text-sm">Enter your credentials below to proceed.</p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl flex items-center gap-3 animate-shake">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    required
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    onChange={handleInputChange}
                    placeholder={`Your ${field.label.toLowerCase()}...`}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 focus:outline-none flex items-center justify-center gap-3"
              >
                Sign In
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
            </form>

            {(validUser || validPass) && (
              <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Demo Credentials</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">User:</span>
                    <span className="font-mono text-slate-900 font-bold">{validUser}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Pass:</span>
                    <span className="font-mono text-slate-900 font-bold">{validPass}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
    </div>
  );
};

export default LoginPage;
