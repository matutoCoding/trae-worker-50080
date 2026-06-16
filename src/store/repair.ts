import { create } from 'zustand';

export interface RepairRecord {
  id: string;
  serviceType: string;
  cemetery: string;
  cemeteryAddress?: string;
  appointmentDate: string;
  contactName: string;
  contactPhone: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createTime: string;
}

interface RepairStore {
  records: RepairRecord[];
  
  addRecord: (record: Omit<RepairRecord, 'id' | 'createTime' | 'status'>) => RepairRecord;
}

export const useRepairStore = create<RepairStore>((set, get) => ({
  records: [
    {
      id: '1',
      serviceType: '描金翻新',
      cemetery: '永安陵园',
      cemeteryAddress: '北京市昌平区永安路88号',
      appointmentDate: '2024-06-20',
      contactName: '王建国',
      contactPhone: '138****1234',
      description: '碑文字迹褪色，需要重新描金',
      status: 'confirmed',
      createTime: '2024-06-10 10:30'
    }
  ],

  addRecord: (recordData) => {
    const newRecord: RepairRecord = {
      id: String(Date.now()),
      status: 'pending',
      createTime: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      ...recordData
    };
    set((state) => ({ records: [newRecord, ...state.records] }));
    return newRecord;
  }
}));
