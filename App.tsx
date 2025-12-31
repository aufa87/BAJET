
import React, { useState, useEffect, useCallback, useRef } from 'react';
import MonthSelector from './components/MonthSelector';
import BudgetSection from './components/BudgetSection';
import SummaryDashboard from './components/SummaryDashboard';
import SyncModal from './components/SyncModal';
import { INITIAL_DATA } from './constants';
import { FullYearData, CategoryType, BudgetItem, MONTH_NAMES, SyncSettings } from './types';

const STORAGE_KEY = 'budget_babah_data_2026';
const SYNC_SETTINGS_KEY = 'budget_babah_sync_settings';
const VIEW_MODE_KEY = 'budget_babah_view_mode';
const DEFAULT_SCRIPT_URL = ''; // Leave blank for user to input their own

const App: React.FC = () => {
  const [yearData, setYearData] = useState<FullYearData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse yearData from storage", e);
      }
    }
    return INITIAL_DATA;
  });

  const [syncSettings, setSyncSettings] = useState<SyncSettings>(() => {
    const defaultSettings: SyncSettings = { scriptUrl: DEFAULT_SCRIPT_URL, lastSynced: null, autoSync: true };
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SYNC_SETTINGS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...defaultSettings, ...parsed };
        }
      } catch (e) {
        console.warn("Failed to parse syncSettings from storage", e);
      }
    }
    return defaultSettings;
  });

  const [viewMode, setViewMode] = useState<'pc' | 'mobile'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VIEW_MODE_KEY);
      return (saved as 'pc' | 'mobile') || 'pc';
    }
    return 'pc';
  });

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => new Date().getMonth()); 
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'cloud-syncing' | 'cloud-synced' | 'error'>('idle');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialPullDone = useRef(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const pushToCloud = useCallback(async (data: FullYearData) => {
    if (!syncSettings.scriptUrl || !syncSettings.scriptUrl.startsWith('http')) return;
    setSaveStatus('cloud-syncing');
    try {
      // POST with no-cors to avoid pre-flight issues with GAS redirects
      await fetch(syncSettings.scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PUSH', data })
      });
      
      const lastSynced = new Date().toISOString();
      setSyncSettings(prev => {
        const updated = { ...prev, lastSynced };
        localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(updated));
        return updated;
      });
      setSaveStatus('cloud-synced');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error("Cloud push failed", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [syncSettings.scriptUrl]);

  const handlePullFromCloud = useCallback(async () => {
    if (!syncSettings.scriptUrl || !syncSettings.scriptUrl.startsWith('http')) return;
    setSaveStatus('cloud-syncing');
    try {
      const response = await fetch(`${syncSettings.scriptUrl}?action=PULL`);
      if (!response.ok) throw new Error('Network response was not ok');
      const cloudData = await response.json();
      
      if (cloudData && typeof cloudData === 'object' && Object.keys(cloudData).length > 0) {
        setYearData(cloudData);
        setSaveStatus('cloud-synced');
        const lastSynced = new Date().toISOString();
        const newSettings = { ...syncSettings, lastSynced };
        setSyncSettings(newSettings);
        localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(newSettings));
      }
    } catch (error) {
      console.error("Cloud pull failed", error);
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [syncSettings]);

  useEffect(() => {
    if (!initialPullDone.current && syncSettings.scriptUrl) {
      initialPullDone.current = true;
      handlePullFromCloud();
    }
  }, [handlePullFromCloud, syncSettings.scriptUrl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(yearData));

    if (syncSettings.autoSync && syncSettings.scriptUrl && initialPullDone.current) {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        pushToCloud(yearData);
      }, 5000);
    }

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [yearData, syncSettings.autoSync, syncSettings.scriptUrl, pushToCloud]);

  const currentMonthData = yearData[selectedMonthIndex] || {
    [CategoryType.FIXED]: [],
    [CategoryType.SAVING]: [],
    [CategoryType.LOAN]: [],
    [CategoryType.MISC]: []
  };
  const monthName = MONTH_NAMES[selectedMonthIndex];

  const handleDuplicateItem = (item: BudgetItem) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9), paid: 0, datePaid: '' };
    setYearData(prev => {
      const mData = prev[selectedMonthIndex] || { [CategoryType.FIXED]: [], [CategoryType.SAVING]: [], [CategoryType.LOAN]: [], [CategoryType.MISC]: [] };
      return {
        ...prev,
        [selectedMonthIndex]: {
          ...mData,
          [item.category]: [...(mData[item.category] || []), newItem]
        }
      };
    });
  };

  const handleAddItem = (partialItem: Partial<BudgetItem>) => {
    const newItem: BudgetItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: partialItem.category || CategoryType.FIXED,
      item: partialItem.item || 'New Item',
      name: partialItem.name || '',
      amount: partialItem.amount || 0,
      paid: 0,
      dueDate: partialItem.dueDate || '',
      datePaid: '',
      method: partialItem.method || 'M2U',
      notes: ''
    };
    setYearData(prev => {
      const mData = prev[selectedMonthIndex] || { [CategoryType.FIXED]: [], [CategoryType.SAVING]: [], [CategoryType.LOAN]: [], [CategoryType.MISC]: [] };
      return {
        ...prev,
        [selectedMonthIndex]: {
          ...mData,
          [newItem.category]: [...(mData[newItem.category] || []), newItem]
        }
      };
    });
  };

  const handleUpdateItem = (updatedItem: BudgetItem) => {
    setYearData(prev => {
      const mData = prev[selectedMonthIndex];
      if (!mData) return prev;
      const updatedCategoryItems = (mData[updatedItem.category] || []).map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      return {
        ...prev,
        [selectedMonthIndex]: { ...mData, [updatedItem.category]: updatedCategoryItems }
      };
    });
  };

  const handleDeleteItem = (itemId: string, category: CategoryType) => {
    setYearData(prev => {
      const mData = prev[selectedMonthIndex];
      if (!mData) return prev;
      return {
        ...prev,
        [selectedMonthIndex]: {
          ...mData,
          [category]: (mData[category] || []).filter(i => i.id !== itemId)
        }
      };
    });
  };

  const handleClearCategoryAmounts = (category: CategoryType) => {
    setYearData(prev => {
      const mData = prev[selectedMonthIndex];
      if (!mData) return prev;
      const updatedItems = (mData[category] || []).map(item => ({ ...item, amount: 0, paid: 0, datePaid: '' }));
      return {
        ...prev,
        [selectedMonthIndex]: { ...mData, [category]: updatedItems }
      };
    });
  };

  const handleClearMonthAmounts = () => {
    setYearData(prev => {
      const mData = prev[selectedMonthIndex];
      if (!mData) return prev;
      const updatedMonth = { ...mData };
      Object.keys(updatedMonth).forEach((cat) => {
        updatedMonth[cat as CategoryType] = (updatedMonth[cat as CategoryType] || []).map(item => ({
          ...item, amount: 0, paid: 0, datePaid: ''
        }));
      });
      return { ...prev, [selectedMonthIndex]: updatedMonth };
    });
  };

  const handleCopyFromPreviousMonth = () => {
    if (selectedMonthIndex === 0) return;
    setYearData(prev => {
      const prevMonth = prev[selectedMonthIndex - 1];
      if (!prevMonth) return prev;
      const newMonthData = { ...prev[selectedMonthIndex] } as any;
      Object.keys(CategoryType).forEach((key) => {
        const cat = CategoryType[key as keyof typeof CategoryType];
        newMonthData[cat] = (prevMonth[cat] || []).map(item => ({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          paid: 0,
          datePaid: '',
        }));
      });
      return { ...prev, [selectedMonthIndex]: newMonthData };
    });
  };

  const getSyncStatusIcon = () => {
    switch(saveStatus) {
      case 'cloud-syncing': return <div className="flex items-center gap-1.5 text-amber-500 font-black text-[8px] uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div> Cloud Syncing</div>;
      case 'cloud-synced': return <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[8px] uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Cloud Synced</div>;
      case 'error': return <div className="flex items-center gap-1.5 text-rose-500 font-black text-[8px] uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div> Sync Error</div>;
      default: return syncSettings.scriptUrl ? <div className="flex items-center gap-1.5 text-indigo-400 font-black text-[8px] uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-indigo-400/50 rounded-full"></div> Cloud Connected</div> : null;
    }
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 pb-20 relative overflow-x-hidden text-slate-900 dark:text-slate-100 ${viewMode === 'mobile' ? 'flex items-center justify-center py-10' : ''}`}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className={`relative z-10 transition-all duration-700 ease-in-out ${viewMode === 'mobile' ? 'w-[430px] h-[880px] rounded-[3.5rem] border-[12px] border-slate-900 dark:border-slate-800 shadow-[0_40px_100px_rgba(0,0,0,0.5)] bg-white dark:bg-slate-950 overflow-y-auto overflow-x-hidden custom-scrollbar' : 'w-full'}`}>
        <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl border-b border-slate-200/50 dark:border-white/5 sticky top-0 z-40 transition-all shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white font-black text-2xl mr-4 shadow-xl shadow-indigo-600/30">B</div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">BudgetBabah</h1>
                    {getSyncStatusIcon()}
                  </div>
                  <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.25em] mt-2">Elite Edition • 2026 Edition</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
                  <button onClick={() => setViewMode('pc')} className={`p-2 rounded-xl transition-all ${viewMode === 'pc' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </button>
                  <button onClick={() => setViewMode('mobile')} className={`p-2 rounded-xl transition-all ${viewMode === 'mobile' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </button>
                </div>

                <button onClick={() => setIsSyncModalOpen(true)} className={`flex items-center gap-2 p-2.5 rounded-2xl transition-all border shadow-sm ${syncSettings.scriptUrl ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>
                  <svg className={`w-5 h-5 ${saveStatus === 'cloud-syncing' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                </button>

                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all border border-slate-200/60 dark:border-white/10">
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M14.5 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <MonthSelector selectedMonth={selectedMonthIndex} onSelectMonth={setSelectedMonthIndex} />
        </header>

        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 ${viewMode === 'mobile' ? '!px-6 py-6' : ''}`}>
          <SummaryDashboard 
            data={currentMonthData} 
            monthName={monthName} 
            onClearMonth={handleClearMonthAmounts}
            onCopyFromPrevious={handleCopyFromPreviousMonth}
            canCopyFromPrevious={selectedMonthIndex > 0}
          />

          <div className={`grid grid-cols-1 gap-12 ${viewMode === 'mobile' ? 'gap-8' : ''}`}>
              <BudgetSection 
                  title="Essential Expenses" 
                  category={CategoryType.FIXED} 
                  items={currentMonthData[CategoryType.FIXED] || []} 
                  onUpdateItem={handleUpdateItem} 
                  onAddItem={handleAddItem} 
                  onClearAllAmounts={() => handleClearCategoryAmounts(CategoryType.FIXED)} 
                  onDuplicateItem={handleDuplicateItem} 
                  onDeleteItem={handleDeleteItem}
              />
              <BudgetSection 
                  title="Wealth & Future" 
                  category={CategoryType.SAVING} 
                  items={currentMonthData[CategoryType.SAVING] || []} 
                  onUpdateItem={handleUpdateItem} 
                  onAddItem={handleAddItem} 
                  onClearAllAmounts={() => handleClearCategoryAmounts(CategoryType.SAVING)} 
                  onDuplicateItem={handleDuplicateItem} 
                  onDeleteItem={handleDeleteItem}
              />
              <BudgetSection 
                  title="LOAN SETTLEMENTS" 
                  category={CategoryType.LOAN} 
                  items={currentMonthData[CategoryType.LOAN] || []} 
                  onUpdateItem={handleUpdateItem} 
                  onAddItem={handleAddItem} 
                  onClearAllAmounts={() => handleClearCategoryAmounts(CategoryType.LOAN)} 
                  onDuplicateItem={handleDuplicateItem} 
                  onDeleteItem={handleDeleteItem}
              />
          </div>
        </main>
      </div>

      <SyncModal 
        isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} settings={syncSettings}
        onSaveSettings={(s) => { setSyncSettings(s); localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(s)); setIsSyncModalOpen(false); }}
        onPush={() => pushToCloud(yearData)} onPull={handlePullFromCloud} isSyncing={saveStatus === 'cloud-syncing'}
      />
    </div>
  );
};

export default App;
