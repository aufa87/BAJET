
import React, { useState } from 'react';
import { BudgetItem, CategoryType } from '../types';
import BudgetRow from './BudgetRow';
import RecordModal from './RecordModal';

interface BudgetSectionProps {
  title: string;
  category: CategoryType;
  items: BudgetItem[];
  onUpdateItem: (item: BudgetItem) => void;
  onAddItem: (item: Partial<BudgetItem>) => void;
  onDuplicateItem: (item: BudgetItem) => void;
  onDeleteItem: (id: string, category: CategoryType) => void;
  onClearAllAmounts: () => void;
}

const BudgetSection: React.FC<BudgetSectionProps> = ({ 
  title, 
  category, 
  items, 
  onUpdateItem, 
  onAddItem,
  onDuplicateItem,
  onDeleteItem,
  onClearAllAmounts
}) => {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | undefined>(undefined);

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = items.reduce((sum, item) => sum + item.paid, 0);
  const balance = totalAmount - totalPaid;

  const handleClearClick = () => {
    if (isConfirmingClear) {
      onClearAllAmounts();
      setIsConfirmingClear(false);
    } else {
      setIsConfirmingClear(true);
      setTimeout(() => setIsConfirmingClear(false), 3000);
    }
  };

  const openAddModal = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (item: BudgetItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveRecord = (item: Partial<BudgetItem>) => {
    if (editingItem) {
      onUpdateItem({ ...editingItem, ...item } as BudgetItem);
    } else {
      onAddItem({ ...item, category });
    }
  };

  const getEmptyStateContent = () => {
    switch(category) {
      case CategoryType.FIXED: 
        return {
          message: "Secure Your Foundation",
          desc: "Add your rent, bills, and essential living costs to build a solid financial baseline.",
          icon: (
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )
        };
      case CategoryType.SAVING: 
        return {
          message: "Plant Your Future Seeds",
          desc: "Start tracking your savings and investments. Every Ringgit saved is a step toward freedom.",
          icon: (
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case CategoryType.LOAN: 
        return {
          message: "Road to Debt-Free Living",
          desc: "List your commitments and track your settlements to witness your progress toward zero debt.",
          icon: (
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        };
      default: 
        return {
          message: "Organize Your Finances",
          desc: "Keep everything in order by adding miscellaneous records and notes.",
          icon: (
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2" />
            </svg>
          )
        };
    }
  };

  const getColors = () => {
    switch(category) {
      case CategoryType.FIXED:
        return {
          headerBg: 'bg-slate-50 dark:bg-slate-900/50',
          accent: 'bg-indigo-500',
          button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20',
          text: 'text-indigo-600 dark:text-indigo-400',
          emptyIcon: 'text-indigo-200 dark:text-indigo-900/30'
        };
      case CategoryType.SAVING:
        return {
          headerBg: 'bg-slate-50 dark:bg-slate-900/50',
          accent: 'bg-emerald-500',
          button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20',
          text: 'text-emerald-600 dark:text-emerald-400',
          emptyIcon: 'text-emerald-200 dark:text-emerald-900/30'
        };
      case CategoryType.LOAN:
        return {
          headerBg: 'bg-slate-50 dark:bg-slate-900/50',
          accent: 'bg-rose-500',
          button: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20',
          text: 'text-rose-600 dark:text-rose-400',
          emptyIcon: 'text-rose-200 dark:text-rose-900/30'
        };
      default:
        return {
          headerBg: 'bg-slate-50 dark:bg-slate-900/50',
          accent: 'bg-slate-500',
          button: 'bg-slate-600 hover:bg-slate-500 shadow-slate-600/20',
          text: 'text-slate-600 dark:text-slate-400',
          emptyIcon: 'text-slate-200 dark:text-slate-800'
        };
    }
  };

  const colors = getColors();
  const emptyContent = getEmptyStateContent();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden mb-12 transition-all">
      <div className={`px-8 py-8 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors duration-700 ${colors.headerBg}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className={`p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 transition-all ${isMinimized ? '-rotate-90' : 'rotate-0'}`}
                title={isMinimized ? "Expand Section" : "Minimize Section"}
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
             </button>
             <div className="space-y-1">
                <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 uppercase tracking-[0.2em]">{title}</h3>
                <div className={`h-1.5 w-12 rounded-full ${colors.accent}`}></div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Target Total</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-200">RM {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                  onClick={openAddModal}
                  className={`px-5 py-3 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all ${colors.button}`}
                >
                  Add Entry
                </button>

                {items.length > 0 && (
                    <button 
                      onClick={handleClearClick}
                      className={`px-5 py-3 rounded-xl transition-all border text-xs font-black uppercase tracking-widest ${
                        isConfirmingClear 
                          ? 'bg-rose-500 text-white border-transparent' 
                          : 'bg-white dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {isConfirmingClear ? 'Reset?' : 'Clear'}
                    </button>
                )}
            </div>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 dark:bg-black/10 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
            <div className="col-span-4 flex items-center gap-2">Record Item</div>
            <div className="col-span-3">BUDGETED</div>
            <div className="col-span-3">PAID</div>
            <div className="col-span-1">Via</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {items.length > 0 ? (
              items.map(item => (
                <BudgetRow 
                  key={item.id} 
                  item={item} 
                  category={category}
                  onUpdate={onUpdateItem} 
                  onEdit={() => openEditModal(item)}
                  onDuplicate={() => onDuplicateItem(item)}
                  onDelete={() => onDeleteItem(item.id, category)}
                  sectionColorClass={colors.headerBg} 
                />
              ))
            ) : (
              <div className="px-8 py-24 flex flex-col items-center text-center relative overflow-hidden group">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-10 transition-colors duration-700 ${colors.accent}`}></div>
                <div className={`mb-8 transition-transform duration-500 group-hover:scale-110 ${colors.emptyIcon}`}>
                  {emptyContent.icon}
                </div>
                <h4 className="text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-4 max-w-md">
                  {emptyContent.message}
                </h4>
                <p className="text-slate-400 dark:text-slate-500 text-base mb-10 max-w-sm font-medium leading-relaxed">
                  {emptyContent.desc}
                </p>
                <button 
                  onClick={openAddModal}
                  className={`group flex items-center gap-3 px-10 py-5 rounded-2xl text-white text-sm font-black uppercase tracking-widest transition-all transform hover:-translate-y-1 ${colors.button}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  Add First Record
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-50/30 dark:bg-black/5 px-8 py-8 border-t border-slate-100 dark:border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="w-full md:w-80">
                  <span className="font-black text-slate-400 text-xs uppercase tracking-widest block mb-3">Category Completion</span>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${colors.accent}`}
                        style={{ width: `${totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0}%` }}
                      ></div>
                  </div>
                </div>
                
                <div className="flex gap-12">
                  <div className="text-right">
                    <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">BUDGETED</span>
                    <span className="font-mono font-black text-xl text-slate-900 dark:text-white">RM {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">PAID</span>
                    <span className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400">RM {totalPaid.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-black text-rose-500 uppercase tracking-widest mb-1">Balance</span>
                    <span className={`font-mono font-black text-xl ${balance > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                      RM {balance.toFixed(2)}
                    </span>
                  </div>
                </div>
            </div>
          </div>
        </>
      )}

      <RecordModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
        initialData={editingItem}
        category={category}
      />
    </div>
  );
};

export default BudgetSection;
