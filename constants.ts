
import { CategoryType, FullYearData, BudgetItem } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to create a default month structure
const createDefaultMonth = (): BudgetItem[] => [
  // FIXED
  { id: generateId(), category: CategoryType.FIXED, item: 'SEWA', name: 'RUMAH', amount: 400, paid: 0, dueDate: '2026-11-01', datePaid: '2026-10-31', method: 'M2U', notes: 'BAYAR KE AKAUN MAYBANK' },
  { id: generateId(), category: CategoryType.FIXED, item: 'YURAN', name: 'KAFA', amount: 0, paid: 0, dueDate: '', datePaid: '', method: 'CASH', notes: 'BAYAR ADV FULL 2026' },
  { id: generateId(), category: CategoryType.FIXED, item: 'YURAN', name: 'KARATE', amount: 70, paid: 0, dueDate: '2026-11-05', datePaid: '2026-10-31', method: 'M2U', notes: 'FEE GRADING BIRU-UNGU' },
  { id: generateId(), category: CategoryType.FIXED, item: 'BIL', name: 'TNB', amount: 217, paid: 0, dueDate: '2026-11-10', datePaid: '2026-10-31', method: 'CC', notes: '' },
  { id: generateId(), category: CategoryType.FIXED, item: 'BIL', name: 'U MOBILE ABI', amount: 14.5, paid: 0, dueDate: '2026-11-12', datePaid: '2026-10-31', method: 'M2U', notes: '' },
  { id: generateId(), category: CategoryType.FIXED, item: 'BIL', name: 'CELCOM AMI', amount: 400, paid: 0, dueDate: '2026-11-14', datePaid: '', method: 'AUTO CC', notes: 'AUTO CC 14HB' },
  { id: generateId(), category: CategoryType.FIXED, item: 'BIL', name: 'DATA ONEXOX', amount: 40, paid: 0, dueDate: '2026-11-30', datePaid: '', method: 'AUTO CC', notes: 'ACTIVE AUTO 30.1.2026' },
  { id: generateId(), category: CategoryType.FIXED, item: 'BIL', name: 'SYABAS', amount: 60, paid: 0, dueDate: '2026-11-15', datePaid: '', method: 'M2U', notes: '' },
  { id: generateId(), category: CategoryType.FIXED, item: 'BIL', name: 'UNIFI', amount: 105, paid: 0, dueDate: '2026-11-20', datePaid: '', method: 'M2U', notes: 'JAN/JUN/NOV' },
  
  // SAVING
  { id: generateId(), category: CategoryType.SAVING, item: 'INFAQ', name: 'MKSA', amount: 50, paid: 0, dueDate: '', datePaid: '', method: 'M2U', notes: 'INFAQ ARWAH UMMI' },
  { id: generateId(), category: CategoryType.SAVING, item: 'HIBAH ABI', name: 'HIBAH TAKAFUL', amount: 56.6, paid: 0, dueDate: '2026-11-08', datePaid: '', method: 'AUTO CC', notes: 'AUTO DEBIT- 08HB' },
  { id: generateId(), category: CategoryType.SAVING, item: 'HIBAH AMI', name: 'HIBAH TAKAFUL', amount: 42.4, paid: 0, dueDate: '2026-11-08', datePaid: '', method: 'AUTO CC', notes: 'AUTO DEBIT- 08HB' },
  { id: generateId(), category: CategoryType.SAVING, item: 'SSPN-i', name: 'ATHIYYAH', amount: 50, paid: 0, dueDate: '2026-11-10', datePaid: '', method: 'M2U', notes: 'AUTO DEBIT- 10 HB' },
  
  // LOAN
  { id: generateId(), category: CategoryType.LOAN, item: 'AEON PL', name: '3500', amount: 97.2, paid: 0, dueDate: '2026-11-18', datePaid: '', method: 'M2U', notes: 'DUE-18HB' },
  { id: generateId(), category: CategoryType.LOAN, item: 'AEON CC 1', name: '2500', amount: 90.2, paid: 90.2, dueDate: '2026-11-30', datePaid: '2026-10-31', method: 'AEON APP', notes: 'DUE-30HB' },
  { id: generateId(), category: CategoryType.LOAN, item: 'AEON CC 2', name: '3049', amount: 700, paid: 700, dueDate: '2026-11-30', datePaid: '2026-10-15', method: 'AEON APP', notes: 'DUE-30HB' },
  { id: generateId(), category: CategoryType.LOAN, item: 'SLOAN', name: '1900', amount: 134.06, paid: 0, dueDate: '2026-11-10', datePaid: '', method: 'M2U', notes: 'DUE 10HB' },
  { id: generateId(), category: CategoryType.LOAN, item: 'SPLATER', name: '607.36', amount: 607.36, paid: 607.36, dueDate: '2026-11-01', datePaid: '2026-10-31', method: 'CC', notes: 'DUE 1HB' },
];

export const INITIAL_DATA: FullYearData = {};

// Initialize all 12 months with default data
for (let i = 0; i < 12; i++) {
  const items = createDefaultMonth();
  INITIAL_DATA[i] = {
    [CategoryType.FIXED]: items.filter(i => i.category === CategoryType.FIXED),
    [CategoryType.SAVING]: items.filter(i => i.category === CategoryType.SAVING),
    [CategoryType.LOAN]: items.filter(i => i.category === CategoryType.LOAN),
    [CategoryType.MISC]: items.filter(i => i.category === CategoryType.MISC),
  };
}