
export enum CategoryType {
  FIXED = 'PERBELANJAAN TETAP',
  SAVING = 'SAVING',
  LOAN = 'LOAN',
  MISC = 'LAIN-LAIN'
}

export interface BudgetItem {
  id: string;
  category: CategoryType;
  item: string; 
  name: string; 
  amount: number; 
  paid: number; 
  dueDate: string; 
  datePaid: string; 
  method: string; 
  notes: string; 
}

export type MonthData = {
  [key in CategoryType]: BudgetItem[];
};

export type FullYearData = {
  [monthIndex: number]: MonthData; 
};

export const MONTH_NAMES = [
  "JAN", "FEB", "MAC", "APR", "MEI", "JUN", 
  "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"
];

export interface SyncSettings {
  scriptUrl: string;
  lastSynced: string | null;
  autoSync: boolean;
}

export interface ImageGenSettings {
  aspectRatio: "1:1" | "16:9" | "9:16";
  size: "1K" | "2K" | "4K";
}