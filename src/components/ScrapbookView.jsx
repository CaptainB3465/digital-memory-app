import React from 'react';
import MemoryCard from './MemoryCard';
import { motion, AnimatePresence } from 'framer-motion';

const ScrapbookView = ({ memories, collections, onEdit, onDelete, onToggleFavorite }) => {
  if (memories.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <p className="text-slate-400 font-display italic text-lg">A blank canvas for your story...</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
      <AnimatePresence mode="popLayout">
        {memories.map((memory, index) => {
          const collection = collections.find(c => c.id === memory.collectionId);
          
          return (
            <motion.div
              key={memory.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-2xl">
                <MemoryCard
                  memory={memory}
                  collectionName={collection?.name}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ScrapbookView;
