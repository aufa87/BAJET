import React, { useState, useEffect } from 'react';
import { BudgetItem, CategoryType } from '../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<BudgetItem>) => void;
  initialData?: BudgetItem;
  category: CategoryType;
}

const RecordModal: React.FC<RecordModalProps> = ({ isOpen, onClose, onSave, initialData, category }) => {
  const [formData, setFormData] = useState<Partial<BudgetItem>>({
    item: '',
    name: '',
    amount: 0,
    paid: 0,
    dueDate: '',
    datePaid: '',
    method: 'M2U',
    notes: '',
    category: category
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        item: '',
        name: '',
        amount: 0,
        paid: 0,
        dueDate: '',
        datePaid: '',
        method: 'M2U',
        notes: '',
        category: category
      });
    }
  }, [initialData, category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handlePaidChange = (val: number) => {
    const newPaid = val;
    let newDatePaid = formData.datePaid;
    
    // Auto Today logic if marking as fully paid
    if (newPaid >= (formData.amount || 0) && (formData.amount || 0) > 0 && !newDatePaid) {
      newDatePaid = new Date().toISOString().split('T')[0];
    }
    
    setFormData({ ...formData, paid: newPaid, datePaid: newDatePaid });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              {initialData ? 'Edit Record' : 'Add New Record'}
            </h3>
            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1">{category}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Perkara (Item)</label>
              <input 
                required
                type="text" 
                value={formData.item}
                onChange={e => setFormData({...formData, item: e.target.value})}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                placeholder="e.g. RUMAH"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Penama (Name)</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                placeholder="e.g. SEWA"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Allocation (RM)</label>
              <input 
                required
                type="number" 
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-mono font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Settlement (RM)</label>
              <input 
                type="number" 
                value={formData.paid}
                onChange={e => handlePaidChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-mono font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Paid Date (Auto Today)</label>
              <input 
                type="date" 
                value={formData.datePaid}
                onChange={e => setFormData({...formData, datePaid: e.target.value})}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Channel (Status)</label>
              <select 
                value={formData.method}
                onChange={e => setFormData({...formData, method: e.target.value})}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              >
                <option value="M2U">M2U</option>
                <option value="CASH">CASH</option>
                <option value="CC">CC</option>
                <option value="AUTO">AUTO CC</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordModal;