import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, MapPin, Tag, ChevronLeft, ChevronRight, Quote, Heart, MoreHorizontal, Share2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const MemoryCard = ({ memory, onEdit, onDelete, onToggleFavorite, collectionName }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  let formattedDate = 'Unknown Date';
  try {
    if (memory.date) {
      formattedDate = format(parseISO(memory.date), 'MMMM do, yyyy');
    }
  } catch (e) {
    console.error('Date parsing error:', e);
  }

  const nextImg = () => {
    if (memory.images?.length > 0) {
      setCurrentImg((prev) => (prev + 1) % memory.images.length);
    }
  };

  const prevImg = () => {
     if (memory.images?.length > 0) {
      setCurrentImg((prev) => (prev - 1 + memory.images.length) % memory.images.length);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.98 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className="glass-card flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] group border border-white/50"
    >
      {/* Media Section */}
      <div className="md:w-5/12 relative h-72 md:h-auto bg-slate-50 overflow-hidden">
        {memory.images && memory.images.length > 0 ? (
          <div className="h-full w-full relative">
            <img 
              src={memory.images[currentImg]} 
              alt={memory.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            {memory.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-black/30 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 shadow-2xl">
                <button onClick={prevImg} className="text-white/80 hover:text-white transition-all hover:scale-125"><ChevronLeft size={18} /></button>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-white/60 font-black uppercase tracking-widest leading-none mb-1">Moment</span>
                  <span className="text-[11px] text-white font-bold leading-none">{currentImg + 1} / {memory.images.length}</span>
                </div>
                <button onClick={nextImg} className="text-white/80 hover:text-white transition-all hover:scale-125"><ChevronRight size={18} /></button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-indigo-50/30 text-indigo-200 gap-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm">
               <Quote size={32} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Story Only</span>
          </div>
        )}

        <button 
          onClick={() => onToggleFavorite(memory.id)}
          className={`absolute top-8 right-8 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl transition-all duration-300 shadow-2xl border border-white/30 ${memory.favorite ? 'bg-white text-rose-500 scale-110' : 'bg-black/20 text-white hover:bg-white hover:text-rose-500'}`}
        >
          <Heart size={22} fill={memory.favorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content Section */}
      <div className="md:w-7/12 p-10 md:p-14 flex flex-col relative bg-white/40">
        <AnimatePresence>
          {showConfirm && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex items-center justify-center p-12 text-center"
            >
              <div className="space-y-8">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                   <Trash2 size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-display font-black text-slate-900 leading-tight">Discard this memory?</h4>
                  <p className="text-slate-500 mt-2 font-medium">This entry will be lost to time forever.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setShowConfirm(false)} className="px-8 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Keep it</button>
                  <button onClick={() => onDelete(memory.id)} className="px-8 py-3.5 rounded-2xl bg-rose-500 text-white text-sm font-bold shadow-xl shadow-rose-500/25 hover:bg-rose-600 transition-all">Erase Forever</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-indigo-100/50">
              <Calendar size={13} className="opacity-70" />
              {formattedDate}
            </div>
            {memory.location && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200/50">
                <MapPin size={13} className="opacity-70" />
                {memory.location}
              </div>
            )}
            {collectionName && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50/50 text-pink-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-pink-100/50">
                {collectionName}
              </div>
            )}
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button 
              onClick={() => onEdit(memory)}
              className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => setShowConfirm(true)}
              className="p-2.5 bg-white text-slate-400 hover:text-rose-500 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h3 className="text-3xl font-display font-black text-slate-900 mb-6 leading-[1.15] tracking-tight">
          {memory.title}
        </h3>

        <p className="text-slate-600 font-medium leading-relaxed mb-10 flex-1 line-clamp-5 text-lg">
          {memory.story}
        </p>

        <div className="mt-auto flex flex-wrap gap-3 pt-8 border-t border-slate-100">
          {memory.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-slate-50 hover:border-indigo-100 hover:text-indigo-600 transition-all cursor-pointer shadow-sm">
              #{tag.toLowerCase()}
            </span>
          ))}
        </div>
      </div>
    </motion.div>

  );
};

export default MemoryCard;
