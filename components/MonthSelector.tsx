
import React from 'react';
import { MONTH_NAMES } from '../types';

interface MonthSelectorProps {
  selectedMonth: number;
  onSelectMonth: (index: number) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onSelectMonth }) => {
  return (
    <div className="w-full flex justify-center pb-6 pt-2 px-4">
      <div className="inline-flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 shadow-inner overflow-x-auto max-w-full no-scrollbar">
        {MONTH_NAMES.map((month, index) => {
          const isActive = selectedMonth === index;
          return (
            <button
              key={month}
              onClick={() => onSelectMonth(index)}
              className={`
                relative min-w-[70px] px-4 py-3.5 rounded-[1.5rem] text-[10px] font-black tracking-[0.2em] transition-all duration-500 uppercase
                ${isActive 
                  ? 'text-white bg-indigo-600 shadow-xl shadow-indigo-600/30 scale-105' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-white/10'}
              `}
            >
              <span className="relative z-10">{month}</span>
              {isActive && (
                <div className="absolute inset-0 bg-indigo-600 rounded-[1.5rem] animate-pulse opacity-20"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MonthSelector;
