import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, MapPin, Heart } from 'lucide-react';

const AuthLayout = ({ children, quotes, currentQuoteIndex }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row overflow-hidden font-sans text-slate-800 dark:text-slate-100">
      
      {/* Left Side: Emotional Visual & Brand */}
      <div className="lg:w-[45%] w-full min-h-[300px] lg:min-h-screen bg-gradient-to-br from-indigo-900 via-violet-900 to-indigo-950 text-white flex flex-col justify-between p-10 lg:p-16 relative overflow-hidden shrink-0">
        
        {/* Soft Memory Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-500 blur-[120px]" />
          <div className="absolute top-[40%] right-[-20%] w-[50%] h-[50%] rounded-full bg-violet-500 blur-[100px]" />
        </div>

        {/* Floating Elements / Memories */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[15%] bg-white dark:bg-slate-900/10 backdrop-blur-md p-3 rounded-2xl border border-white dark:border-slate-800/20 shadow-2xl flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-indigo-500/30 rounded-full flex items-center justify-center"><Calendar size={18} className="text-indigo-200" /></div>
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Date preserved</p>
              <p className="text-sm font-bold text-white">Oct 24, 2024</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[35%] left-[10%] bg-white dark:bg-slate-900/10 backdrop-blur-md p-4 rounded-3xl border border-white dark:border-slate-800/20 shadow-2xl w-48"
          >
            <div className="w-full h-24 bg-gradient-to-tr from-pink-500/20 to-violet-500/20 rounded-2xl mb-3 border border-white dark:border-slate-800/10" />
            <div className="h-2 w-2/3 bg-white dark:bg-slate-900/20 rounded-full mb-2" />
            <div className="h-2 w-1/2 bg-white dark:bg-slate-900/20 rounded-full" />
          </motion.div>
          
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[45%] right-[25%]"
          >
            <Heart size={24} className="text-pink-400/50" fill="currentColor" />
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-slate-900/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white dark:border-slate-800/20 shadow-xl">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Digital Memory</h1>
          </div>

          <div className="mt-12 lg:mb-12">
            <AnimatePresence mode="wait">
              {quotes?.length > 0 ? (
                <motion.div
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="w-12 h-1 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full" />
                  <h2 className="text-4xl font-display font-black leading-tight tracking-tight">
                    "{quotes[currentQuoteIndex].text}"
                  </h2>
                  <p className="text-indigo-200 font-medium tracking-wide uppercase text-sm">
                    — {quotes[currentQuoteIndex].author}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="w-12 h-1 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full" />
                  <h2 className="text-5xl font-display font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-violet-200">
                    Your life,<br />your story,<br />always and forever...
                  </h2>
                  <p className="text-indigo-200/80 font-medium tracking-wide text-lg">
                    A secure, elegant space for your personal moments.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Side: Authentication Forms */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] relative overflow-y-auto">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/90 backdrop-blur-3xl z-0" />
        
        <div className="w-full max-w-md relative z-10 my-auto py-8">
          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
