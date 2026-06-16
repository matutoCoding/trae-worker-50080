import { create } from 'zustand';
import { ScheduleItem } from '@/types';
import { scheduleList as initialSchedules } from '@/data/orders';

type ScheduleStatus = 'waiting' | 'processing' | 'completed';

interface ScheduleStore {
  schedules: ScheduleItem[];
  
  addSchedule: (data: Omit<ScheduleItem, 'id'>) => ScheduleItem;
  getSchedulesByDate: (date: string) => ScheduleItem[];
  getSchedulesByOrderId: (orderId: string) => ScheduleItem[];
  getScheduleById: (id: string) => ScheduleItem | undefined;
  updateScheduleStatus: (id: string, status: ScheduleStatus) => ScheduleItem | undefined;
  completeSchedule: (id: string) => ScheduleItem | undefined;
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

  updateScheduleStatus: (id, status) => {
    let updated: ScheduleItem | undefined;
    set((state) => ({
      schedules: state.schedules.map(s => {
        if (s.id === id) {
          updated = { ...s, status };
          return updated;
        }
        return s;
      })
    }));
    return updated;
  },

  completeSchedule: (id) => {
    return get().updateScheduleStatus(id, 'completed');
  }
}));
