import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';

// Google SVG Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// Apple SVG Icon
const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M16.36 12.36c0-2.8 2.28-4.14 2.39-4.2-1.3-1.9-3.32-2.18-4.03-2.21-1.7-.17-3.32 1-4.2 1-.86 0-2.18-.98-3.57-.96-1.8.03-3.46 1.05-4.38 2.65-1.87 3.24-.48 8.04 1.35 10.68.89 1.28 1.95 2.7 3.32 2.65 1.33-.06 1.83-.87 3.42-.87 1.6 0 2.12.87 3.46.85 1.4-.03 2.33-1.3 3.19-2.55.99-1.45 1.4-2.86 1.42-2.93-.03-.02-2.37-.91-2.37-3.61zM14.88 4.41c.73-.89 1.23-2.12 1.1-3.36-1.07.04-2.35.71-3.1 1.6-.6.7-.19 1.96 1.05 3.19 1.13-.08 2.15-.75 2.87-1.63z" />
  </svg>
);

const LoginView = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loading } = useAuth();

  const handleSubmt = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const result = await login(email, password, rememberMe);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <AuthLayout quotes={[]} currentQuoteIndex={0}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full"
      >
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-display font-black text-slate-800 tracking-tight">Welcome Back 👋</h2>
          <p className="text-slate-500 mt-3 font-medium text-base">Continue your journey through your memories.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button type="button" className="flex-1 py-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:shadow-sm transition-all text-sm font-bold text-slate-700">
            <GoogleIcon /> Google
          </button>
          <button type="button" className="flex-1 py-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:shadow-sm transition-all text-sm font-bold text-slate-700">
            <AppleIcon /> Apple
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80 px-2 lg:bg-transparent">Or log in with email</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <form onSubmit={handleSubmt} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 group-focus-within:text-indigo-600 transition-colors">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl pl-12 pr-5 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <div className="flex items-center justify-between pr-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 group-focus-within:text-indigo-600 transition-colors">Password</label>
              <button 
                type="button" 
                onClick={() => onNavigate('forgot-password')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl pl-12 pr-12 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 shadow-sm font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-1 pt-2">
            <button
               type="button"
               onClick={() => setRememberMe(!rememberMe)}
               className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}
            >
              {rememberMe && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></motion.svg>}
            </button>
            <span className="text-sm font-bold text-slate-600 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>Remember Me</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 btn-gradient rounded-2xl text-sm font-bold flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Log In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm font-bold text-slate-500 flex items-center justify-center gap-2">
            Don't have an account? 
            <button onClick={() => onNavigate('signup')} className="text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-all">
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginView;
