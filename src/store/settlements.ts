import { create } from 'zustand';
import { SettlementItem } from '@/types';
import { settlementList as initialSettlements } from '@/data/installations';

interface SettlementStore {
  settlements: SettlementItem[];
  
  addSettlement: (data: Omit<SettlementItem, 'id'>) => SettlementItem;
  getSettlementsByStatus: (status: string) => SettlementItem[];
  completeSettlement: (id: string) => SettlementItem | undefined;
  getSummary: () => { totalIncome: number; totalExpense: number; netProfit: number; pendingCount: number; pendingIncome: number };
}

export const useSettlementStore = create<SettlementStore>((set, get) => ({
  settlements: [...initialSettlements],

  addSettlement: (data) => {
    const newItem: SettlementItem = {
      id: String(Date.now()),
      ...data
    };
    set((state) => ({ settlements: [newItem, ...state.settlements] }));
    return newItem;
  },

  getSettlementsByStatus: (status) => {
    if (status === 'all') return get().settlements;
    return get().settlements.filter(s => s.status === status);
  },

  completeSettlement: (id) => {
    let updated: SettlementItem | undefined;
    set((state) => ({
      settlements: state.settlements.map(s => {
        if (s.id === id) {
          updated = { ...s, status: 'completed' as const };
          return updated;
        }
        return s;
      })
    }));
    return updated;
  },

  getSummary: () => {
    const items = get().settlements;
    const completed = items.filter(i => i.status === 'completed');
    const pending = items.filter(i => i.status === 'pending');
    const income = completed.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0);
    const expense = completed.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0);
    const pendingIncome = pending.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      netProfit: income - expense,
      pendingCount: pending.length,
      pendingIncome
    };
  }
}));
