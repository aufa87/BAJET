
import React, { useState } from 'react';
import { CategoryType, MonthData } from '../types';

interface SummaryDashboardProps {
  data: MonthData;
  monthName: string;
  onClearMonth: () => void;
  onCopyFromPrevious: () => void;
  canCopyFromPrevious: boolean;
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ data, monthName, onClearMonth, onCopyFromPrevious, canCopyFromPrevious }) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isConfirmingCopy, setIsConfirmingCopy] = useState(false);
  
  if (!data) return null;

  const categories = [CategoryType.FIXED, CategoryType.SAVING, CategoryType.LOAN, CategoryType.MISC];
  
  let totalBudget = 0;
  let totalPaid = 0;

  categories.forEach(cat => {
    const items = data[cat] || [];
    totalBudget += items.reduce((sum, item) => sum + item.amount, 0);
    totalPaid += items.reduce((sum, item) => sum + item.paid, 0);
  });

  const remaining = totalBudget - totalPaid;

  const handleResetClick = () => {
    if (isConfirmingReset) {
      onClearMonth();
      setIsConfirmingReset(false);
    } else {
      setIsConfirmingReset(true);
      setTimeout(() => setIsConfirmingReset(false), 3000);
    }
  };

  const handleCopyClick = () => {
    if (isConfirmingCopy) {
      onCopyFromPrevious();
      setIsConfirmingCopy(false);
    } else {
      setIsConfirmingCopy(true);
      setTimeout(() => setIsConfirmingCopy(false), 3000);
    }
  };

  return (
    <div className="mb-12">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-10">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase">
                {monthName} <span className="text-indigo-600">2026</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                  Status: {totalBudget > 0 && totalPaid >= totalBudget ? 'Settled' : 'Active Plan'}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Monthly Audit</span>
              </div>
            </div>
            
            <div className="flex gap-2">
                {canCopyFromPrevious && (
                  <button 
                    onClick={handleCopyClick}
                    className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${
                      isConfirmingCopy 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20'
                    }`}
                  >
                    {isConfirmingCopy ? 'Confirm Copy?' : 'Sync Previous'}
                  </button>
                )}
                <button 
                  onClick={handleResetClick}
                  className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${
                    isConfirmingReset 
                      ? 'bg-rose-500 text-white shadow-rose-500/30' 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  {isConfirmingReset ? 'Confirm Reset?' : 'Reset Sheet'}
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 transition-all">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-3 block">Planned Budget</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">RM {totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            
            <div className="bg-emerald-500/5 dark:bg-emerald-400/5 p-6 rounded-[2rem] border border-emerald-500/20 dark:border-emerald-400/10 transition-all">
              <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-3 block">Total Settled</span>
              <div className="text-3xl font-black text-emerald-600">RM {totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>

            <div className="bg-rose-500/5 dark:bg-rose-400/5 p-6 rounded-[2rem] border border-rose-500/20 dark:border-rose-400/10 transition-all">
              <span className="text-[9px] text-rose-600 font-black uppercase tracking-widest mb-3 block">Remaining Balance</span>
              <div className="text-3xl font-black text-rose-600">RM {remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
