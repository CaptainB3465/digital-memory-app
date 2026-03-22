import React, { useState } from 'react';
import { FolderPlus, Trash2, Hash, Plus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CollectionManager = ({ collections, onAdd, onDelete, activeId, onSelect }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCollName, setNewCollName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCollName.trim()) {
      onAdd(newCollName.trim(), '#8b5cf6');
      setNewCollName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Collections</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 ${isAdding ? 'bg-indigo-600 text-white rotate-45' : 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600 hover:bg-indigo-50 hover:shadow-md'}`}
        >
          <Plus size={18} />
        </button>
      </div>

      {isAdding && (
         <motion.form 
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit} 
            className="overflow-hidden px-1"
         >
            <div className="relative group">
              <input 
                type="text" 
                autoFocus 
                placeholder="Name your collection..." 
                value={newCollName}
                onChange={(e) => setNewCollName(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 outline-none transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors">Save</button>
            </div>
         </motion.form>
      )}

      <div className="space-y-2">
        <button 
          onClick={() => onSelect(null)}
          className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeId === null ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/25' : 'bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:bg-slate-900 hover:text-indigo-600 shadow-sm border border-transparent hover:border-indigo-100/50'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl transition-colors ${activeId === null ? 'bg-indigo-500/50' : 'bg-slate-50 dark:bg-slate-950 group-hover:bg-indigo-50'}`}>
              <Hash size={18} className={activeId === null ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
            </div>
            <span className="text-sm font-bold">All Moments</span>
          </div>
          <ChevronRight size={14} className={activeId === null ? 'opacity-50' : 'opacity-0 group-hover:opacity-50 transition-opacity'} />
        </button>

        <AnimatePresence mode="popLayout">
          {collections.map((c) => (
            <motion.div
              layout
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <button 
                onClick={() => onSelect(c.id)}
                className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeId === c.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/25' : 'bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:bg-slate-900 hover:text-indigo-600 shadow-sm border border-transparent hover:border-indigo-100/50'}`}
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`p-2 rounded-xl transition-colors ${activeId === c.id ? 'bg-indigo-500/50' : 'bg-slate-50 dark:bg-slate-950 group-hover:bg-indigo-50'}`}>
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" 
                      style={{ backgroundColor: c.color || '#ddd' }} 
                    />
                  </div>
                  <span className="text-sm font-bold truncate">{c.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {c.id !== 'default' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                      className={`p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-500`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <ChevronRight size={14} className={activeId === c.id ? 'opacity-50' : 'opacity-0 group-hover:opacity-50 transition-opacity'} />
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>

  );
};

export default CollectionManager;
