import { create } from 'zustand';
import { Installation, InstallStatus } from '@/types';
import { installationList as initialInstallations } from '@/data/installations';

interface InstallationStore {
  installations: Installation[];
  
  addInstallation: (data: Omit<Installation, 'id'>) => Installation;
  getInstallationById: (id: string) => Installation | undefined;
  getInstallationsByStatus: (status: string) => Installation[];
  getInstallationsByOrderId: (orderId: string) => Installation[];
  updateInstallationStatus: (id: string, status: InstallStatus) => Installation | undefined;
  completeInstallation: (id: string) => Installation | undefined;
}

export const useInstallationStore = create<InstallationStore>((set, get) => ({
  installations: [...initialInstallations],

  addInstallation: (data) => {
    const newInst: Installation = {
      id: String(Date.now()),
      ...data
    };
    set((state) => ({ installations: [newInst, ...state.installations] }));
    return newInst;
  },

  getInstallationById: (id) => get().installations.find(i => i.id === id),

  getInstallationsByStatus: (status) => {
    if (status === 'all') return get().installations;
    return get().installations.filter(i => i.status === status);
  },

  getInstallationsByOrderId: (orderId) => {
    return get().installations.filter(i => i.orderId === orderId);
  },

  updateInstallationStatus: (id, status) => {
    let updated: Installation | undefined;
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).replace(/\//g, '-');
    const updates: Partial<Installation> = { status };
    if (status === 'installing') {
      updates.installDate = now;
    }
    if (status === 'completed') {
      updates.completeDate = now;
    }
    set((state) => ({
      installations: state.installations.map(i => {
        if (i.id === id) {
          updated = { ...i, ...updates };
          return updated;
        }
        return i;
      })
    }));
    return updated;
  },

  completeInstallation: (id) => {
    return get().updateInstallationStatus(id, 'completed');
  }
}));
