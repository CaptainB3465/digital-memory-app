import React from 'react';
import MemoryCard from './MemoryCard';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { CalendarDays } from 'lucide-react';

const Timeline = ({ memories, collections, onEdit, onDelete, onToggleFavorite }) => {
  if (memories.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 px-6 text-center"
      >
        <div className="w-20 h-20 bg-lavender-50 rounded-3xl flex items-center justify-center text-lavender-300 mb-6 drop-shadow-sm">
           <CalendarDays size={40} />
        </div>
        <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">A blank page in your journey</h3>
        <p className="text-slate-500 max-w-sm font-medium">Every great story starts with a single moment. Click 'Preserve a Moment' to begin your digital legacy.</p>
      </motion.div>
    );
  }

  // Grouping logic
  const sortedMemories = [...memories].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const groups = sortedMemories.reduce((acc, memory) => {
    const month = format(parseISO(memory.date), 'MMMM yyyy');
    if (!acc[month]) acc[month] = [];
    acc[month].push(memory);
    return acc;
  }, {});

  return (
    <div className="space-y-24 relative">
      {Object.entries(groups).map(([month, monthMemories], groupIndex) => (
        <div key={month} className="relative">
          {/* Month Header */}
          <div className="flex items-center gap-8 mb-16 sticky top-24 z-10 bg-[#f8fafc]/60 backdrop-blur-md -mx-6 px-6 py-4 rounded-3xl border border-white dark:border-slate-800/40 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Time Capsule</span>
              <h4 className="text-xl font-display font-black text-slate-900 dark:text-white">{month}</h4>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 via-indigo-100 to-transparent"></div>
            <div className="flex bg-white dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-white dark:border-slate-800 text-[10px] font-bold text-slate-500 shadow-sm">
              {monthMemories.length} {monthMemories.length === 1 ? 'Moment' : 'Moments'}
            </div>
          </div>

          {/* Group Content */}
          <div className="space-y-16 pl-8 md:pl-12 border-l-2 border-indigo-100/50 relative ml-4 md:ml-6">
            <AnimatePresence mode="popLayout">
              {monthMemories.map((memory, i) => {
                const collection = collections.find(c => c.id === memory.collectionId);
                return (
                  <div key={memory.id} className="relative">
                    {/* Circle Marker */}
                    <div className="absolute -left-[2.5rem] md:-left-[3.5rem] top-12 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-600 shadow-xl shadow-indigo-600/20 z-10" />
                    
                    <MemoryCard
                      memory={memory}
                      collectionName={collection?.name}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleFavorite={onToggleFavorite}
                    />
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
      
      {/* End of Journey Marker */}
      <div className="flex flex-col items-center justify-center py-12 opacity-30">
        <div className="w-1.5 h-12 bg-gradient-to-b from-indigo-100 to-transparent rounded-full mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">The Beginning</p>
      </div>
    </div>

  );
};

export default Timeline;
