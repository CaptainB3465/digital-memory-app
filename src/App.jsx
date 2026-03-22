import React, { useState } from 'react';
import MemoryForm from './components/MemoryForm';
import Timeline from './components/Timeline';
import ScrapbookView from './components/ScrapbookView';
import CollectionManager from './components/CollectionManager';
import SettingsView from './components/SettingsView';
import { useMemories } from './hooks/useMemories';
import { useSettings } from './hooks/useSettings';
import { useAuth } from './hooks/useAuth';
import LoginView from './components/auth/LoginView';
import SignUpView from './components/auth/SignUpView';
import ForgotPasswordView from './components/auth/ForgotPasswordView';
import { Plus, Sparkles, Search, SlidersHorizontal, LayoutGrid, List, Heart, Settings, Bell, UserCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { user, loading, logout } = useAuth();
  const [authView, setAuthView] = useState('login');
  const { 
    memories, 
    collections, 
    addMemory, 
    updateMemory, 
    deleteMemory, 
    addCollection, 
    deleteCollection,
    toggleFavorite
  } = useMemories();

  const {
    settings,
    updateSection,
    resetToDefaults
  } = useSettings();

  const [view, setView] = useState('timeline'); // 'timeline', 'scrapbook', 'settings'
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddOrUpdate = (data) => {
    if (editingMemory) {
      updateMemory(editingMemory.id, data);
    } else {
      addMemory(data);
    }
    setIsFormOpen(false);
    setEditingMemory(null);
  };

  const handleEdit = (memory) => {
    setEditingMemory(memory);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    deleteMemory(id);
  };

  const filteredMemories = memories.filter((m) => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCollection = activeCollectionId ? m.collectionId === activeCollectionId : true;
    const matchesFavorites = showOnlyFavorites ? m.favorite : true;
    
    return matchesSearch && matchesCollection && matchesFavorites;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Sparkles size={32} className="text-indigo-600 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    if (authView === 'login') return <LoginView onNavigate={setAuthView} />;
    if (authView === 'signup') return <SignUpView onNavigate={setAuthView} />;
    if (authView === 'forgot-password') return <ForgotPasswordView onNavigate={setAuthView} />;
    return <LoginView onNavigate={setAuthView} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Top Navigation */}
      <nav className="h-20 flex items-center justify-between px-10 glass sticky top-0 z-50 border-b border-white dark:border-slate-800/20">
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => { setActiveCollectionId(null); setView('timeline'); setShowOnlyFavorites(false); }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <Sparkles size={26} className="animate-pulse" />
          </div>

          <div>
            <h1 className="text-2xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600">
              Digital Memory
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">Welcome back, {user?.name || 'Explorer'}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* View Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 backdrop-blur-sm p-1.5 rounded-2xl border border-white dark:border-slate-800/50 shadow-inner">
            <button 
              onClick={() => setView('timeline')}
              className={`px-5 py-2 rounded-xl flex items-center gap-2.5 transition-all duration-300 ${view === 'timeline' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              <List size={18} /> <span className="text-sm font-bold">Timeline</span>
            </button>
            <button 
              onClick={() => setView('scrapbook')}
              className={`px-5 py-2 rounded-xl flex items-center gap-2.5 transition-all duration-300 ${view === 'scrapbook' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              <LayoutGrid size={18} /> <span className="text-sm font-bold">Scrapbook</span>
            </button>
          </div>

          <button 
            onClick={() => { setEditingMemory(null); setIsFormOpen(true); }}
            className="flex items-center gap-2.5 px-6 py-3 btn-gradient rounded-2xl text-sm font-bold tracking-tight"
          >
            <Plus size={20} /> Preserve a Moment
          </button>

          <div className="flex items-center gap-4 border-l pl-8 border-slate-200 dark:border-slate-700/60 transition-all">
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all"><Bell size={22} /></button>
            <button 
              onClick={() => setView('settings')}
              className={`p-2.5 rounded-xl transition-all ${view === 'settings' ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
            >
              <Settings size={22} />
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="w-11 h-11 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-100 ring-offset-2">
                <UserCircle size={28} />
              </div>
              <button 
                onClick={logout} 
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
                title="Sign Out"
              >
                 <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 border-r border-white dark:border-slate-800/40 p-10 flex flex-col gap-12 overflow-y-auto hidden lg:flex bg-white dark:bg-slate-900/10 backdrop-blur-md">
          <section>
            <CollectionManager 
              collections={collections}
              activeId={activeCollectionId}
              onSelect={setActiveCollectionId}
              onAdd={addCollection}
              onDelete={deleteCollection}
            />
          </section>

          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1">Quick Filters</h3>
            <button 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${showOnlyFavorites ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:bg-slate-900/60 hover:text-indigo-600'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors ${showOnlyFavorites ? 'bg-white dark:bg-slate-900 shadow-sm' : 'bg-slate-50 dark:bg-slate-950 group-hover:bg-indigo-50'}`}>
                  <Heart size={18} fill={showOnlyFavorites ? "currentColor" : "none"} />
                </div>
                <span className="text-sm font-bold">Favorites</span>
              </div>
              {memories.filter(m => m.favorite).length > 0 && (
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-sm border transition-colors ${showOnlyFavorites ? 'bg-indigo-600 text-white border-transparent' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'}`}>
                  {memories.filter(m => m.favorite).length}
                </span>
              )}
            </button>
          </section>

          <div className="mt-auto glass-card p-8 rounded-3xl relative overflow-hidden group dark:bg-slate-800/40 dark:border-slate-700/50 transition-colors">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-indigo-50 dark:bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed font-semibold relative z-10 transition-colors">
              "We do not remember days, we remember moments."
            </p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4 tracking-wider transition-colors">— MUNYUA DEVOPS</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-transparent relative">
          <div className="max-w-6xl mx-auto px-12 py-16">
            <header className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">Your Sanctuary</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                  {showOnlyFavorites ? 'Loved Moments' : activeCollectionId ? collections.find(c => c.id === activeCollectionId)?.name : 'Memory Timeline'}
                </h2>
                <p className="text-lg text-slate-500 font-medium max-w-xl">Curate your life's most precious stories in a beautiful personal journal.</p>
              </div>

              <div className="relative group min-w-[340px]">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all duration-300" />
                <input 
                  type="text" 
                  placeholder="Find a story..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800/50 rounded-3xl py-4.5 pl-14 pr-8 focus:ring-4 focus:ring-indigo-600/5 shadow-sm border-transparent focus:border-indigo-100 outline-none font-semibold text-slate-800 dark:text-slate-100 transition-all placeholder:text-slate-400 text-sm"
                />
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={view + activeCollectionId + showOnlyFavorites + searchTerm}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                {view === 'settings' ? (
                  <SettingsView 
                    settings={settings} 
                    updateSection={updateSection} 
                    onBack={() => setView('timeline')} 
                  />
                ) : view === 'timeline' ? (
                  <Timeline 
                    memories={filteredMemories} 
                    collections={collections}
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    onToggleFavorite={toggleFavorite}
                  />
                ) : (
                  <ScrapbookView 
                    memories={filteredMemories} 
                    collections={collections}
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    onToggleFavorite={toggleFavorite}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Right Drawer Panel */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsFormOpen(false); setEditingMemory(null); }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-slate-900 shadow-3xl z-[101] overflow-y-auto"
            >
              <MemoryForm
                onSubmit={handleAddOrUpdate}
                initialData={editingMemory}
                collections={collections}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingMemory(null);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>

  );
}

export default App;
