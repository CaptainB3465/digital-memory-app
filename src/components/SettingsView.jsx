import React, { useState } from 'react';
import { 
  User, Palette, Shield, Cloud, Settings2, Bell, Database, Cpu, Globe, Zap, HelpCircle, 
  X, ChevronRight, LogOut, Trash2, ShieldCheck, Heart, Moon, Sun, Monitor, Download, Upload, Clock, Lock,
  LayoutGrid, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase';
import { updateProfile } from 'firebase/auth';

const SettingsView = ({ settings, updateSection, onBack }) => {
  const [activeTab, setActiveTab] = useState('account');
  const { user, logout, updateLocalUser } = useAuth();
  const fileInputRef = React.useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileRef = ref(storage, `avatars/${user.id}_${Date.now()}.${fileExt}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      await updateProfile(auth.currentUser, { photoURL: url });
      updateLocalUser({ avatar: url });
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!user || uploadingAvatar) return;
    setUploadingAvatar(true);
    try {
      await updateProfile(auth.currentUser, { photoURL: "" });
      updateLocalUser({ avatar: null });
    } catch (error) {
      console.error("Avatar removal failed:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account & Profile', icon: User, color: 'text-blue-500' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'text-purple-500' },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield, color: 'text-green-500' },
    { id: 'backup', label: 'Backup & Sync', icon: Cloud, color: 'text-sky-500' },
    { id: 'preferences', label: 'Memory Preferences', icon: Settings2, color: 'text-indigo-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-amber-500' },
    { id: 'storage', label: 'Storage', icon: Database, color: 'text-rose-500' },
    { id: 'ai', label: 'AI Features', icon: Cpu, color: 'text-violet-500' },
    { id: 'localization', label: 'Language & Region', icon: Globe, color: 'text-teal-500' },
    { id: 'advanced', label: 'Advanced', icon: Zap, color: 'text-orange-500' },
    { id: 'legacy', label: 'Legacy Mode', icon: Heart, color: 'text-pink-500' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, color: 'text-slate-500' },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'account':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-lavender-50/50 rounded-3xl border border-lavender-100/50">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full border-2 border-white dark:border-slate-800 shadow-lg flex items-center justify-center relative group overflow-hidden">
                     {uploadingAvatar ? (
                        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                     ) : user?.avatar ? (
                       <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="Profile" />
                     ) : (
                       <User size={32} className="text-slate-300" />
                     )}
                     <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] uppercase font-bold tracking-widest backdrop-blur-sm">
                       {user?.avatar ? 'Change' : 'Upload'}
                     </button>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </div>
                  {user?.avatar && (
                    <button onClick={handleAvatarRemove} disabled={uploadingAvatar} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:bg-red-50 px-2 flex items-center gap-1 py-1 rounded-md transition-colors disabled:opacity-50">
                      Remove
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">{user?.name || settings.account.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">@{user?.email?.split('@')[0] || settings.account.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Display Name</label>
                  <input 
                    type="text" 
                    value={user?.name || settings.account.name}
                    onChange={(e) => updateSection('account', { name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-slate-700 dark:text-slate-200" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address (Read Only)</label>
                  <input 
                    type="email" 
                    readOnly
                    value={user?.email || settings.account.email}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 outline-none font-medium text-slate-500 cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">About You (Bio)</label>
                <textarea 
                  value={settings.account.bio}
                  onChange={(e) => updateSection('account', { bio: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-slate-700 dark:text-slate-200 h-24 resize-none" 
                />
              </div>
            </section>

            <section className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
               <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Dangerous Waters</h4>
               <div className="flex gap-4">
                  <button onClick={logout} className="px-6 py-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                  <button className="px-6 py-3 border border-red-100 text-red-400 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors flex items-center gap-2">
                    <Trash2 size={16} /> Delete Account
                  </button>
               </div>
            </section>
          </div>
        );
      
      case 'appearance':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-6">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Monitor size={18} className="text-primary" /> Display Theme
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {['light', 'dark', 'system'].map(t => (
                  <button 
                    key={t}
                    onClick={() => updateSection('appearance', { theme: t })}
                    className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${settings.appearance.theme === t ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-white dark:bg-slate-900 hover:border-slate-200 dark:border-slate-700'}`}
                  >
                    {t === 'light' && <Sun size={24} className={settings.appearance.theme === t ? 'text-primary' : 'text-slate-400'} />}
                    {t === 'dark' && <Moon size={24} className={settings.appearance.theme === t ? 'text-primary' : 'text-slate-400'} />}
                    {t === 'system' && <Monitor size={24} className={settings.appearance.theme === t ? 'text-primary' : 'text-slate-400'} />}
                    <span className="text-xs font-bold uppercase tracking-widest">{t}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <LayoutGrid size={18} className="text-primary" /> Default Layout
              </h4>
              <div className="flex gap-4">
                 {['timeline', 'grid', 'card'].map(l => (
                  <button 
                    key={l}
                    onClick={() => updateSection('appearance', { layout: l })}
                    className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${settings.appearance.layout === l ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {l}
                  </button>
                 ))}
              </div>
            </section>

            <section className="space-y-6">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Zap size={18} className="text-primary" /> Accent Palette
              </h4>
              <div className="flex gap-4">
                {['#8b5cf6', '#ec4899', '#f43f5e', '#06b6d4', '#10b981'].map(c => (
                  <button 
                    key={c}
                    onClick={() => updateSection('appearance', { accentColor: c })}
                    className={`w-10 h-10 rounded-full border-4 transition-all scale-100 hover:scale-110 ${settings.appearance.accentColor === c ? 'border-white dark:border-slate-800 shadow-xl ring-2 ring-primary ring-offset-2' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </section>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-6 bg-green-50/50 border border-green-100 rounded-3xl flex items-center gap-4">
               <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl text-green-500 shadow-sm">
                 <ShieldCheck size={24} />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Your memories are end-to-end encrypted</h4>
                 <p className="text-[xs] text-green-600 font-medium opacity-80">Only you can access the stories stored in your digital legacy.</p>
               </div>
             </div>

             <section className="space-y-4">
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-950 rounded-2xl transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Lock size={18} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Require PIN/Biometrics</h5>
                      <p className="text-xs text-slate-500">Add an extra layer of protection to open the app.</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.privacy.lockMemories ? 'bg-primary' : 'bg-slate-200'}`} onClick={() => updateSection('privacy', { lockMemories: !settings.privacy.lockMemories })}>
                    <div className={`w-4 h-4 bg-white dark:bg-slate-900 rounded-full transition-transform ${settings.privacy.lockMemories ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-950 rounded-2xl transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Shield size={18} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Two-Factor Authentication</h5>
                      <p className="text-xs text-slate-500">Secure your account with a mobile auth code.</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
             </section>

             <section className="space-y-4">
               <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Active Sessions</h4>
               <div className="space-y-3">
                 {settings.privacy.sessions.map(s => (
                   <div key={s.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${s.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{s.device}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{s.location}</p>
                        </div>
                      </div>
                      <button className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest">Revoke</button>
                   </div>
                 ))}
               </div>
             </section>
          </div>
        );

      case 'legacy':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-8 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-[2.5rem] relative overflow-hidden">
               <Heart size={80} className="absolute -right-6 -bottom-6 text-pink-200/40 rotate-12" />
               <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-display font-bold text-rose-900 leading-tight">Your story is a legacy that <br/>deserves to be shared.</h3>
                  <p className="text-sm text-pink-700/80 font-medium max-w-md">Legacy Mode allows you to define who can access your digital journal in the future, ensuring your memories live on for those you love.</p>
                  
                  <button 
                    onClick={() => updateSection('legacy', { enabled: !settings.legacy.enabled })}
                    className={`mt-4 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all ${settings.legacy.enabled ? 'bg-white dark:bg-slate-900 text-rose-500' : 'bg-rose-500 text-white shadow-rose-200'}`}
                  >
                    {settings.legacy.enabled ? 'Disable Legacy Mode' : 'Setup Inheritance'}
                  </button>
               </div>
             </div>

             {settings.legacy.enabled && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Beneficiary Contact (Email)</label>
                    <input 
                      type="email" 
                      placeholder="e.g., family@legacy.io"
                      value={settings.legacy.beneficiary}
                      onChange={(e) => updateSection('legacy', { beneficiary: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-rose-500/10 outline-none font-medium text-slate-700 dark:text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Release Trigger</label>
                      <select 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none font-medium text-slate-700 dark:text-slate-200 appearance-none"
                        value={settings.legacy.sharingTrigger}
                        onChange={(e) => updateSection('legacy', { sharingTrigger: e.target.value })}
                      >
                        <option value="inactivity">After 6 months inactivity</option>
                        <option value="manual">Manual Request (Requires Approval)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Archive Visibility</label>
                      <select 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none font-medium text-slate-700 dark:text-slate-200 appearance-none"
                        value={settings.legacy.archiveMode}
                        onChange={(e) => updateSection('legacy', { archiveMode: e.target.value })}
                      >
                        <option value="family-only">Family/Close Friends Only</option>
                        <option value="public">Make Public Archive</option>
                      </select>
                    </div>
                  </div>
               </motion.div>
             )}
          </div>
        );

      case 'help':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <section className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                  <Settings2 size={24} className="text-slate-400 mb-4 group-hover:text-primary transition-colors" />
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Tutorials</h5>
                  <p className="text-xs text-slate-500 mt-1">Learn how to make the most of your journal.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                  <MessageSquare size={24} className="text-slate-400 mb-4 group-hover:text-primary transition-colors" />
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Support Chat</h5>
                  <p className="text-xs text-slate-500 mt-1">Talk to our team about any issues.</p>
                </div>
             </section>

             <section className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 pl-1">Frequently Asked</h4>
                <div className="space-y-2">
                  {['How is my data secured?', 'Can I export all my images?', 'What is Legacy Mode?'].map(q => (
                    <div key={q} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-primary/20 transition-colors">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{q}</span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  ))}
                </div>
             </section>

             <div className="text-center pt-8 border-t border-slate-100 dark:border-slate-800">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Digital Memory v5.2.0-Alpha</p>
               <p className="text-[10px] text-slate-400 mt-1 italic">Designed with empathy for every life story.</p>
             </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-4">
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-950 rounded-2xl transition-colors cursor-pointer" onClick={() => updateSection('backup', { autoBackup: !settings.backup.autoBackup })}>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Automatic Local Backups</h5>
                  <p className="text-xs text-slate-500">Save a copy of your memories locally every day.</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.backup.autoBackup ? 'bg-primary' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white dark:bg-slate-900 rounded-full transition-transform ${settings.backup.autoBackup ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-950 rounded-2xl transition-colors cursor-pointer" onClick={() => updateSection('backup', { cloudSync: !settings.backup.cloudSync })}>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Cloud Sync Active</h5>
                  <p className="text-xs text-slate-500">Keep memories synchronized across your devices.</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.backup.cloudSync ? 'bg-primary' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white dark:bg-slate-900 rounded-full transition-transform ${settings.backup.cloudSync ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            </section>
            
            <section className="p-6 bg-sky-50 rounded-3xl border border-sky-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Last Backup</h4>
                <p className="text-xs font-medium text-sky-600 mt-1">{new Date(settings.backup.lastBackup).toLocaleString()}</p>
              </div>
              <button className="px-5 py-2.5 bg-white dark:bg-slate-900 text-sky-600 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">Back Up Now</button>
            </section>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="space-y-4">
               <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Memory Defaults</h4>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-2">Default Type</label>
                    <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none font-medium text-slate-700 dark:text-slate-200" value={settings.preferences.defaultType} onChange={(e) => updateSection('preferences', { defaultType: e.target.value })}>
                      <option value="photo">Photo Journal</option>
                      <option value="text">Text Entry</option>
                    </select>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-2">Sorting Order</label>
                    <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none font-medium text-slate-700 dark:text-slate-200" value={settings.preferences.sorting} onChange={(e) => updateSection('preferences', { sorting: e.target.value })}>
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                    </select>
                 </div>
               </div>
             </div>
             <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-950 rounded-2xl transition-colors cursor-pointer" onClick={() => updateSection('preferences', { autoTagging: !settings.preferences.autoTagging })}>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Smart Auto-Tagging</h5>
                  <p className="text-xs text-slate-500">Automatically suggest tags based on entry content.</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.preferences.autoTagging ? 'bg-primary' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white dark:bg-slate-900 rounded-full transition-transform ${settings.preferences.autoTagging ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
             </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {['reminders', 'anniversaries', 'emailPrefs'].map(key => (
              <div key={key} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-950 rounded-2xl transition-colors cursor-pointer" onClick={() => updateSection('notifications', { [key]: !settings.notifications[key] })}>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                  <p className="text-xs text-slate-500">Enable or disable these alerts.</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.notifications[key] ? 'bg-primary' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white dark:bg-slate-900 rounded-full transition-transform ${settings.notifications[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            ))}
          </div>
        );

      case 'storage':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-end mb-4">
                 <div>
                   <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Storage Used</h4>
                   <p className="text-2xl font-display font-black text-slate-900 dark:text-white mt-1">{settings.storage.used} <span className="text-sm text-slate-400">GB</span></p>
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{settings.storage.total} GB Total</p>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(settings.storage.used / settings.storage.total) * 100}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-950 rounded-2xl transition-colors cursor-pointer" onClick={() => updateSection('storage', { mediaOptimization: !settings.storage.mediaOptimization })}>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Media Optimization</h5>
                  <p className="text-xs text-slate-500">Compress photos slightly to save cloud storage space.</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.storage.mediaOptimization ? 'bg-primary' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white dark:bg-slate-900 rounded-full transition-transform ${settings.storage.mediaOptimization ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.keys(settings.ai).map(key => (
              <div key={key} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-950 rounded-2xl transition-colors cursor-pointer" onClick={() => updateSection('ai', { [key]: !settings.ai[key] })}>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                  <p className="text-xs text-slate-500">Leverage AI to enhance this functionality.</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.ai[key] ? 'bg-primary' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white dark:bg-slate-900 rounded-full transition-transform ${settings.ai[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            ))}
          </div>
        );

      case 'localization':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-2">Display Language</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none font-medium text-slate-700 dark:text-slate-200" value={settings.localization.language} onChange={(e) => updateSection('localization', { language: e.target.value })}>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="ja-JP">Japanese</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-2">Timezone</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none font-medium text-slate-700 dark:text-slate-200" value={settings.localization.timezone} onChange={(e) => updateSection('localization', { timezone: e.target.value })}>
                  <option value="UTC-8">Pacific Time (US &amp; Canada)</option>
                  <option value="UTC-7">Mountain Time (US &amp; Canada)</option>
                  <option value="UTC-6">Central Time (US &amp; Canada)</option>
                  <option value="UTC-5">Eastern Time (US &amp; Canada)</option>
                  <option value="UTC+0">London, Dublin</option>
                  <option value="UTC+1">Paris, Berlin, Rome</option>
                </select>
             </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {['beta', 'debug'].map(key => (
              <div key={key} className="flex items-center justify-between p-4 bg-orange-50/50 hover:bg-orange-50 rounded-2xl border border-orange-100/50 transition-colors cursor-pointer" onClick={() => updateSection('advanced', { [key]: !settings.advanced[key] })}>
                <div>
                  <h5 className="text-sm font-bold text-orange-800 capitalize">{key} Features</h5>
                  <p className="text-xs text-orange-600/80">Developer options. May cause instability.</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.advanced[key] ? 'bg-orange-500' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white dark:bg-slate-900 rounded-full transition-transform ${settings.advanced[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 lg:rounded-l-[3rem] overflow-hidden shadow-2xl">
      <header className="px-10 py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-lavender-50 text-primary rounded-2xl flex items-center justify-center">
            <Settings2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">App Settings</h2>
            <div className="flex items-center gap-2 mt-0.5">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Cloud Sync Active</p>
            </div>
          </div>
        </div>
        <button onClick={onBack} className="p-3 hover:bg-slate-100 dark:bg-slate-800 rounded-full transition-colors text-slate-400 group">
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-80 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-6 overflow-y-auto custom-scrollbar">
          <nav className="space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3.5 p-4 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800' : 'text-slate-500 hover:bg-white dark:bg-slate-900/60 hover:text-slate-900 dark:text-white'}`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-primary/5 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary font-bold'}`}>
                  <tab.icon size={18} />
                </div>
                <span className={`text-sm font-bold transition-all ${activeTab === tab.id ? 'translate-x-1' : ''}`}>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="settingActive" className="ml-auto w-1 h-3 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl">
             <header className="mb-10">
                <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                <h4 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Manage your digital heritage</h4>
             </header>
             
             {renderContent()}
          </div>
        </main>
      </div>

      <footer className="px-10 py-6 border-t border-slate-50 flex justify-between items-center bg-slate-50 dark:bg-slate-950/30">
        <div className="flex gap-4">
           <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
             <Download size={14} /> Export Data
           </button>
           <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
             <Upload size={14} /> Import Memory
           </button>
        </div>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest cursor-default select-none">Encrypted Secure Session</p>
      </footer>
    </div>
  );
};

export default SettingsView;
