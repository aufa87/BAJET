
import React, { useState, useEffect } from 'react';
import { SyncSettings } from '../types';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SyncSettings;
  onSaveSettings: (settings: SyncSettings) => void;
  onPush: () => Promise<void>;
  onPull: () => Promise<void>;
  isSyncing: boolean;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, settings, onSaveSettings, onPush, onPull, isSyncing }) => {
  const [url, setUrl] = useState(settings.scriptUrl);
  const [autoSync, setAutoSync] = useState(settings.autoSync);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    if (isOpen) {
      setUrl(settings.scriptUrl);
      setAutoSync(settings.autoSync);
      setTestStatus('idle');
    }
  }, [isOpen, settings]);

  const handleTestConnection = async () => {
    if (!url || !url.startsWith('http')) {
      setTestStatus('failed');
      return;
    }
    setTestStatus('testing');
    try {
      const resp = await fetch(`${url}?action=PING`);
      if (resp.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('failed');
      }
    } catch (e) {
      // GAS might return opaque response or CORS error for PING if not configured,
      // but if it's a fetch error, it's usually failed.
      setTestStatus('failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        <div className="px-10 py-8 border-b border-slate-100 dark:border-white/5 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 flex justify-between items-center">
          <div>
            <h3 className="font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tight">Cloud Ecosystem</h3>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1">Global Data Synchronization</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-10 space-y-10">
          
          <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <label className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Script API Endpoint</label>
              </div>
              
              <button 
                onClick={handleTestConnection}
                className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${
                  testStatus === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                  testStatus === 'failed' ? 'bg-rose-100 text-rose-600' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-400'
                }`}
              >
                {testStatus === 'testing' ? 'Testing...' : testStatus === 'success' ? 'Link Valid' : testStatus === 'failed' ? 'Link Error' : 'Test Link'}
              </button>
            </div>
            
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your Google Script URL here..."
              className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-slate-600 dark:text-slate-400"
            />
            <p className="mt-4 text-[9px] text-slate-400 leading-relaxed uppercase tracking-wider font-bold">
              Tip: In GAS Editor, use <span className="text-indigo-500">Deploy > New Deployment > Web App > Access: Anyone</span>.
            </p>
          </div>

          <div className="flex items-center justify-between bg-indigo-600/5 dark:bg-indigo-500/10 px-8 py-6 rounded-[2rem] border border-indigo-200/50 dark:border-indigo-500/20">
            <div className="flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${autoSync ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
               <div>
                  <span className="block text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Real-time Auto-Sync</span>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Sync changes every 5s</span>
               </div>
            </div>
            <button 
              onClick={() => setAutoSync(!autoSync)}
              className={`w-14 h-8 rounded-full transition-all relative ${autoSync ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${autoSync ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={onPull}
              disabled={isSyncing || !url}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50 border border-slate-200 dark:border-white/10 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className={`w-6 h-6 text-indigo-500 ${isSyncing ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
              </div>
              Retrieve Data
            </button>
            <button 
              onClick={onPush}
              disabled={isSyncing || !url}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className={`w-6 h-6 text-white ${isSyncing ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              Upload Data
            </button>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => onSaveSettings({ ...settings, scriptUrl: url, autoSync: autoSync })}
              className="w-full py-5 rounded-[1.5rem] bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              Save Configuration
            </button>
          </div>

          {settings.lastSynced && (
            <div className="flex flex-col items-center gap-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Last Secure Sync: {new Date(settings.lastSynced).toLocaleString()}
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncModal;
