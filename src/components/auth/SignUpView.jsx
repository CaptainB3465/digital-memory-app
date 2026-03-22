import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';

const quotes = [
  { text: "We do not remember days, we remember moments.", author: "Cesare Pavese" },
  { text: "A memory is a photograph taken by the heart to make a special moment last forever.", author: "Unknown" },
];

const SignUpView = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4
  
  const { signup, loading } = useAuth();

  // Simple password strength calculator
  useEffect(() => {
    let strength = 0;
    const p = formData.password;
    if (p.length > 0) strength = 1;
    if (p.length >= 8) strength += 1;
    if (p.match(/[A-Z]/) && p.match(/[a-z]/)) strength += 1;
    if (p.match(/[0-9!@#$%^&*]/)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (passwordStrength < 3) {
      setError('Please choose a stronger password.');
      return;
    }

    const result = await signup({ name: formData.name, email: formData.email, password: formData.password });
    if (!result.success) {
      setError(result.error);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-slate-200';
    if (passwordStrength === 1) return 'bg-red-400';
    if (passwordStrength === 2) return 'bg-amber-400';
    if (passwordStrength === 3) return 'bg-indigo-400';
    return 'bg-emerald-400';
  };

  return (
    <AuthLayout quotes={quotes} currentQuoteIndex={0}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="w-full"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-display font-black text-slate-800 tracking-tight">Create your legacy</h2>
          <p className="text-slate-500 mt-2 font-medium">Start preserving moments that matter.</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2 overflow-hidden">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 group-focus-within:text-indigo-600 transition-colors">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl pl-12 pr-5 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 group-focus-within:text-indigo-600 transition-colors">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl pl-12 pr-5 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 group-focus-within:text-indigo-600 transition-colors">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl pl-12 pr-12 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 shadow-sm font-mono"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            
            {/* Password Strength Meter */}
            <div className="px-1 pt-1 space-y-1.5 flex flex-col">
               <div className="flex gap-1 h-1">
                 {[1, 2, 3, 4].map(idx => (
                   <div key={idx} className={`flex-1 rounded-full bg-slate-200 transition-colors duration-500 overflow-hidden`}>
                     <div className={`h-full w-full ${idx <= passwordStrength ? getStrengthColor() : 'bg-transparent'}`} />
                   </div>
                 ))}
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                 <span>{passwordStrength < 3 ? 'Weak' : 'Strong'}</span>
                 {passwordStrength === 4 && <ShieldCheck size={12} className="text-emerald-500" />}
               </div>
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 group-focus-within:text-indigo-600 transition-colors">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl pl-12 pr-12 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none font-bold text-slate-700 shadow-sm font-mono"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || passwordStrength < 3}
            className="w-full py-4 mt-8 btn-gradient rounded-2xl text-sm font-bold flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-bold text-slate-500 flex items-center justify-center gap-2">
            Already have an account? 
            <button onClick={() => onNavigate('login')} className="text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-all">
              Log in
            </button>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default SignUpView;
