import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';

const quotes = [
  { text: "Sometimes you have to let go to see if there was anything worth holding on to.", author: "Unknown" }
];

const ForgotPasswordView = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    const result = await resetPassword(email);
    if (result.success) {
      setStatus({ type: 'success', message: result.message });
      setEmail(''); // Clear form on success
    } else {
      setStatus({ type: 'error', message: result.error });
    }
  };

  return (
    <AuthLayout quotes={quotes} currentQuoteIndex={0}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full"
      >
        <button 
          onClick={() => onNavigate('login')}
          className="mb-8 w-10 h-10 rounded-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white dark:bg-slate-900 hover:shadow-md transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="mb-10">
          <h2 className="text-3xl font-display font-black text-slate-800 dark:text-slate-100 tracking-tight">Reset Password</h2>
          <p className="text-slate-500 mt-2 font-medium">Enter your email and we'll send a recovery link.</p>
        </div>

        <AnimatePresence>
          {status.message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              className={`mb-6 p-5 rounded-2xl text-sm font-bold border flex items-start gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}
            >
              <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 group-focus-within:text-indigo-600 transition-colors">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-5 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || status.type === 'success'}
            className="w-full py-4 mt-8 btn-gradient rounded-2xl text-sm font-bold flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white dark:border-slate-800/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Send Reset Link
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPasswordView;
