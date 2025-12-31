
import React, { useState, useEffect } from 'react';
import { BudgetItem, CategoryType } from '../types';

interface BudgetRowProps {
  item: BudgetItem;
  category: CategoryType;
  onUpdate: (updatedItem: BudgetItem) => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  sectionColorClass: string;
}

const BudgetRow: React.FC<BudgetRowProps> = ({ item, category, onUpdate, onEdit, onDuplicate, onDelete, sectionColorClass }) => {
  const [localItem, setLocalItem] = useState(item);

  useEffect(() => {
    setLocalItem(item);
  }, [item]);

  const handleChange = (field: keyof BudgetItem, value: string | number) => {
    let updated = { ...localItem, [field]: value };
    
    // Auto-populate date logic
    if (field === 'paid' || field === 'amount') {
      const paidVal = field === 'paid' ? (typeof value === 'string' ? parseFloat(value) || 0 : value as number) : localItem.paid;
      const amountVal = field === 'amount' ? (typeof value === 'string' ? parseFloat(value) || 0 : value as number) : localItem.amount;
      
      if (paidVal >= amountVal && amountVal > 0) {
        if (!localItem.datePaid) {
          updated.datePaid = new Date().toISOString().split('T')[0];
        }
      }
    }

    setLocalItem(updated);
    onUpdate(updated);
  };

  const formatPaymentDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch (e) {
      return '';
    }
  };

  const isPaid = localItem.paid >= localItem.amount && localItem.amount > 0;
  const percentage = localItem.amount > 0 ? Math.min((localItem.paid / localItem.amount) * 100, 100) : 0;
  
  const getProgressGradient = () => {
    if (isPaid) return 'bg-gradient-to-r from-emerald-400 to-emerald-600';
    
    switch(category) {
      case CategoryType.FIXED:
        return 'bg-gradient-to-r from-indigo-400 to-violet-600';
      case CategoryType.SAVING:
        return 'bg-gradient-to-r from-emerald-300 to-teal-500';
      case CategoryType.LOAN:
        return 'bg-gradient-to-r from-rose-400 to-pink-600';
      default:
        return 'bg-gradient-to-r from-slate-400 to-slate-600';
    }
  };

  return (
    <div className="relative group px-8 py-5 border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all items-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
        
        <div className="md:col-span-4">
          <div className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight text-base">
            <span className="truncate" title={localItem.item}>{localItem.item}</span>
            {isPaid && (
              <div className="w-4 h-4 flex-shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
                <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1 truncate">{localItem.name}</div>
        </div>

        <div className="md:col-span-3">
          <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 text-[10px] font-black pointer-events-none uppercase">RM</span>
              <input 
                  type="number" 
                  value={localItem.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 pl-10 py-3 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-all font-mono font-black text-base text-slate-700 dark:text-slate-300"
              />
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="relative flex items-center gap-3">
              <div className="relative flex-1">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black pointer-events-none transition-colors ${isPaid ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-600'}`}>RM</span>
                <input 
                    type="number" 
                    value={localItem.paid}
                    onChange={(e) => handleChange('paid', parseFloat(e.target.value) || 0)}
                    className={`w-full border rounded-xl px-4 pl-10 py-3 focus:ring-1 focus:outline-none transition-all font-mono font-black text-base ${isPaid ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 focus:ring-emerald-500/20' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:ring-indigo-500/30'}`}
                />
              </div>
              
              {localItem.datePaid && (
                <div className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all ${isPaid ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                  <span className={`text-[10px] font-black whitespace-nowrap uppercase ${isPaid ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {formatPaymentDate(localItem.datePaid)}
                  </span>
                </div>
              )}
          </div>
        </div>

        <div className="md:col-span-1">
          <select 
              value={localItem.method}
              onChange={(e) => handleChange('method', e.target.value)}
              className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl px-1 py-3 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-black focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer appearance-none text-center"
          >
              <option value="M2U">M2U</option>
              <option value="CASH">CASH</option>
              <option value="CC">CC</option>
              <option value="AUTO">AUTO</option>
          </select>
        </div>

        <div className="md:col-span-1 flex justify-end gap-1">
          <button 
            onClick={onDuplicate}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100"
            title="Duplicate Record"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </button>
          <button 
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-500 transition-all opacity-0 group-hover:opacity-100"
            title="Edit Record"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={onDelete}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
            title="Delete Record"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-slate-100 dark:bg-slate-800/40">
        <div 
          className={`h-full transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(0,0,0,0.1)] ${getProgressGradient()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default BudgetRow;
