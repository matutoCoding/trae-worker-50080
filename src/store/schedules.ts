import { create } from 'zustand';
import { ScheduleItem } from '@/types';
import { scheduleList as initialSchedules } from '@/data/orders';
import { useOrderStore } from './orders';

type ScheduleStatus = 'waiting' | 'processing' | 'completed';

interface OperatorLoad {
  operator: string;
  type: 'machine' | 'manual' | 'both';
  total: number;
  busySlots: Array<{ startTime: string; endTime: string; orderNo: string }>;
}

interface ScheduleStore {
  schedules: ScheduleItem[];
  
  addSchedule: (data: Omit<ScheduleItem, 'id'>) => ScheduleItem;
  getSchedulesByDate: (date: string) => ScheduleItem[];
  getSchedulesByOrderId: (orderId: string) => ScheduleItem[];
  getScheduleById: (id: string) => ScheduleItem | undefined;
  updateScheduleStatus: (id: string, status: ScheduleStatus) => ScheduleItem | undefined;
  completeSchedule: (id: string) => ScheduleItem | undefined;
  checkConflict: (date: string, operator: string, startTime: string, endTime: string, excludeId?: string) => ScheduleItem | null;
  getOperatorLoadByDate: (date: string) => OperatorLoad[];
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [...initialSchedules],

  addSchedule: (data) => {
    const newSchedule: ScheduleItem = {
      id: String(Date.now()),
      ...data
    };
    set((state) => ({ schedules: [newSchedule, ...state.schedules] }));
    return newSchedule;
  },

  getSchedulesByDate: (date) => {
    return get().schedules.filter(s => s.date === date);
  },

  getSchedulesByOrderId: (orderId) => {
    return get().schedules.filter(s => s.orderId === orderId);
  },

  getScheduleById: (id) => {
    return get().schedules.find(s => s.id === id);
  },

  checkConflict: (date, operator, startTime, endTime, excludeId) => {
    const daySchedules = get().getSchedulesByDate(date);
    for (const s of daySchedules) {
      if (excludeId && s.id === excludeId) continue;
      if (s.status === 'completed') continue;
      if (s.operator !== operator) continue;
      const conflict = !(endTime <= s.startTime || startTime >= s.endTime);
      if (conflict) return s;
    }
    return null;
  },

  getOperatorLoadByDate: (date) => {
    const daySchedules = get().getSchedulesByDate(date).filter(s => s.status !== 'completed');
    const loadMap = new Map<string, OperatorLoad>();
    const MACHINE_OPERATORS = ['刻字机A', '刻字机B', '刻字机C'];
    const MANUAL_OPERATORS = ['李师傅', '王师傅', '张师傅', '赵师傅', '孙师傅', '刘师傅'];
    MACHINE_OPERATORS.forEach(op => {
      loadMap.set(op, { operator: op, type: 'machine', total: 0, busySlots: [] });
    });
    MANUAL_OPERATORS.forEach(op => {
      loadMap.set(op, { operator: op, type: 'manual', total: 0, busySlots: [] });
    });
    daySchedules.forEach(s => {
      if (!loadMap.has(s.operator)) {
        loadMap.set(s.operator, { operator: s.operator, type: 'both', total: 0, busySlots: [] });
      }
      const entry = loadMap.get(s.operator)!;
      entry.total += 1;
      entry.busySlots.push({ startTime: s.startTime, endTime: s.endTime, orderNo: s.orderNo });
    });
    return Array.from(loadMap.values()).sort((a, b) => b.total - a.total);
  },

  updateScheduleStatus: (id, status) => {
    let updated: ScheduleItem | undefined;
    let orderIdToRefresh: string | undefined;
    set((state) => ({
      schedules: state.schedules.map(s => {
        if (s.id === id) {
          updated = { ...s, status };
          orderIdToRefresh = s.orderId;
          return updated;
        }
        return s;
      })
    }));
    if (status === 'completed' && orderIdToRefresh) {
      useOrderStore.getState().refreshOrderStatusBySchedule(orderIdToRefresh);
    }
    return updated;
  },

  completeSchedule: (id) => {
    return get().updateScheduleStatus(id, 'completed');
  }
}));
