import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import SiteHeader from '../components/SiteHeader';
import { motion, AnimatePresence } from 'motion/react';

const UserLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, language, country, setLanguage } = useCart();
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  
  const getInitialCountryCode = () => {
    if (country === 'Germany') return '+49';
    if (country === 'India') return '+91';
    return '+91';
  };

  const [countryCode, setCountryCode] = useState(getInitialCountryCode());

  const t = {
    EN: {
      welcome: 'Welcome',
      mobileSub: 'Enter your mobile to continue.',
      mobileLabel: 'Mobile Number',
      sendOtp: 'Send OTP',
      verifyOtp: 'Verify OTP',
      otpSub: 'Sent to',
      otpLabel: 'Enter 6-digit Code',
      verifyBtn: 'Verify & Login',
      changeNum: 'Change Number'
    },
    DE: {
      welcome: 'Willkommen',
      mobileSub: 'Geben Sie Ihre Handynummer ein, um fortzufahren.',
      mobileLabel: 'Handynummer',
      sendOtp: 'OTP senden',
      verifyOtp: 'OTP verifizieren',
      otpSub: 'Gesendet an',
      otpLabel: 'Geben Sie den 6-stelligen Code ein',
      verifyBtn: 'Verifizieren & Anmelden',
      changeNum: 'Nummer ändern'
    }
  }[language];

  const basePath = country === 'India' ? 'website-india' : 'website-germany';
  const redirect = searchParams.get('redirect') || `/${basePath}/dev`;

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456' || otp.length === 6) { // Simulate success
      login({
        id: Math.random().toString(36).substr(2, 9),
        mobile: `${countryCode}${mobile}`,
        countryCode: countryCode === '+49' ? 'Germany' : 'India',
        name: 'John Doe' // Default name for demo
      });
      navigate(redirect);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader lang={language} setLang={setLanguage} showLanguageToggle={country === 'Germany'} country={country} />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12"
        >
          <AnimatePresence mode="wait">
            {step === 'mobile' ? (
              <motion.div 
                key="mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <header className="text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.welcome}</h1>
                  <p className="text-slate-500 font-medium">{t.mobileSub}</p>
                </header>

                <form onSubmit={handleMobileSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.mobileLabel}</label>
                    <div className="flex gap-3">
                      <select 
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-24 px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+1">🇺🇸 +1</option>
                      </select>
                      <input 
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        className="flex-grow px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl"
                  >
                    {t.sendOtp}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <header className="text-center">
                  <div className="text-4xl mb-4">🔐</div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.verifyOtp}</h1>
                  <p className="text-slate-500 font-medium">{t.otpSub} {countryCode} {mobile}</p>
                </header>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">{t.otpLabel}</label>
                    <input 
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-black text-center text-2xl tracking-[0.5em] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl"
                  >
                    {t.verifyBtn}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep('mobile')}
                    className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                  >
                    {t.changeNum}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default UserLoginPage;
