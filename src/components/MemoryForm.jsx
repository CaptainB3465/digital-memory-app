import React, { useState } from 'react';
import { Camera, MapPin, Tag, Calendar, X, Save, Eraser, Trash2, Sparkles, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const MemoryForm = ({ onSubmit, onCancel, initialData, collections }) => {
  const [formData, setFormData] = useState(initialData ? {
    ...initialData,
    images: initialData.images.map(url => ({ file: null, preview: url, isExisting: true }))
  } : {
    title: '',
    description: '',
    story: '',
    date: new Date().toISOString().split('T')[0],
    images: [],
    tags: [],
    location: '',
    collectionId: 'default',
    favorite: false
  });

  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file), // local blob preview
      isExisting: false
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
     setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;
    
    setUploading(true);
    try {
      // Upload new images to Firebase Storage
      const uploadedUrls = await Promise.all(
        formData.images.map(async (img) => {
          if (img.isExisting) return img.preview;
          
          const fileRef = ref(storage, `memories/${Date.now()}_${img.file.name.replace(/[^a-zA-Z0-9.]/g, '')}`);
          const snapshot = await uploadBytes(fileRef, img.file);
          return await getDownloadURL(snapshot.ref);
        })
      );

      // Pass the cleaned data to the parent (useMemories hook)
      onSubmit({
        ...formData,
        images: uploadedUrls
      });
    } catch (error) {
      console.error("Error uploading images", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950/50 backdrop-blur-xl">
      <header className="px-12 py-10 bg-white dark:bg-slate-900/80 backdrop-blur-md border-b border-white dark:border-slate-800/40 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <Camera size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              {initialData ? 'Refine the Moment' : 'Preserve a Moment'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Creating a Legacy</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="p-3 bg-white dark:bg-slate-900/50 hover:bg-white dark:bg-slate-900 hover:shadow-md transition-all rounded-2xl text-slate-400 hover:text-indigo-600 border border-white dark:border-slate-800/60 group"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </header>

      <div className="flex-1 px-12 py-12 overflow-y-auto custom-scrollbar">
        <form className="space-y-12">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1 group-focus-within:text-indigo-600 transition-colors">Title of the Story</label>
                <input
                  type="text"
                  placeholder="Capture the essence..."
                  className="w-full bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl px-6 py-5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none font-bold text-slate-800 dark:text-slate-100 text-lg placeholder:text-slate-300 shadow-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1 group-focus-within:text-indigo-600 transition-colors">When?</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type="date"
                      className="w-full bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl pl-14 pr-6 py-4.5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 outline-none font-bold text-slate-700 dark:text-slate-200 shadow-sm"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1 group-focus-within:text-indigo-600 transition-colors">Collection</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl px-6 py-4.5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 outline-none font-bold text-slate-700 dark:text-slate-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236366f1%22%20stroke-width%3D%222.5%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[right_1.5rem_center] bg-no-repeat shadow-sm"
                      value={formData.collectionId}
                      onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                    >
                      {collections.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1 group-focus-within:text-indigo-600 transition-colors">Where was this?</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-all duration-300" />
                  <input
                    type="text"
                    placeholder="Search location..."
                    className="w-full bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl pl-14 pr-8 py-4.5 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 outline-none font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 shadow-sm"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1 group-focus-within:text-indigo-600 transition-colors">Metadata & Tags</label>
                <div className="flex flex-wrap gap-3 p-5 bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl min-h-[72px] shadow-sm transition-all focus-within:ring-4 focus-within:ring-indigo-600/5 focus-within:border-indigo-600/20">
                  <AnimatePresence mode="popLayout">
                    {formData.tags.map(tag => (
                      <motion.span 
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        key={tag} 
                        className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border border-indigo-100/50 shadow-sm"
                      >
                        {tag} <X size={12} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => removeTag(tag)} />
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  <input
                    type="text"
                    placeholder="+ Add tag..."
                    className="flex-1 min-w-[140px] outline-none text-sm font-bold text-slate-700 dark:text-slate-200 bg-transparent placeholder:text-slate-300"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={addTag}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Story & Visuals */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1 group-focus-within:text-indigo-600 transition-colors">The Narrative</label>
                <textarea
                  placeholder="Every detail brings the moment back to life..."
                  className="w-full bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl px-7 py-6 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 outline-none font-semibold text-slate-700 dark:text-slate-200 h-[320px] resize-none leading-relaxed placeholder:text-slate-300 shadow-sm text-lg"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Visual Reminders</label>
                   <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-black px-3 py-1 rounded-full">{formData.images.length} Captured</span>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <AnimatePresence mode="popLayout">
                    {formData.images.map((img, i) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        key={i} 
                        className="relative h-40 rounded-3xl overflow-hidden group border-2 border-white dark:border-slate-800 shadow-xl group"
                      >
                        <img src={img.preview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Memory" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => removeImage(i)}
                            className="p-3 bg-white dark:bg-slate-900 text-rose-500 rounded-2xl shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-rose-50"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <label className="h-40 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-600/50 hover:bg-indigo-50/30 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all group shadow-sm bg-white dark:bg-slate-900/40">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-500">
                      <Plus size={24} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">Add Visual</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <footer className="px-12 py-10 bg-white dark:bg-slate-900/80 backdrop-blur-md border-t border-white dark:border-slate-800/40 flex items-center justify-end gap-6 sticky bottom-0 z-20 shadow-[0_-4px_30px_rgba(0,0,0,0.03)]">
        <button
          onClick={onCancel}
          className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-600 dark:text-slate-300 transition-colors"
        >
          Discard Entry
        </button>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="px-10 py-5 btn-gradient rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {uploading ? (
             <div className="w-5 h-5 border-2 border-white dark:border-slate-800/30 border-t-white rounded-full animate-spin" />
          ) : (
             <Sparkles size={20} className="group-hover:scale-125 transition-transform duration-500" />
          )}
          {uploading ? 'Processing...' : (initialData ? 'Refine the Moment' : 'Preserve Forever')}
        </button>
      </footer>
    </div>

  );
};

export default MemoryForm;
