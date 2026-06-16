import { create } from 'zustand';
import { Order, OrderStatus, FeeDetail } from '@/types';
import { orderList as initialOrders } from '@/data/orders';

interface OrderStore {
  orders: Order[];
  
  addOrder: (order: Omit<Order, 'id' | 'orderNo' | 'createTime' | 'status'> & { status?: OrderStatus }) => Order;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: string) => Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => Order | undefined;
  updateOrder: (id: string, updates: Partial<Order>) => Order | undefined;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [...initialOrders],

  addOrder: (orderData) => {
    const now = new Date();
    const createTime = now.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-');
    
    const feeDetails: FeeDetail[] = orderData.feeDetails || [];
    
    const newOrder: Order = {
      id: String(Date.now()),
      orderNo: `BK${Date.now()}`,
      status: orderData.status || 'pending',
      createTime,
      feeDetails,
      ...orderData
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));
    return newOrder;
  },

  getOrderById: (id) => get().orders.find(o => o.id === id),
  
  getOrdersByStatus: (status) => {
    if (status === 'all') return get().orders;
    return get().orders.filter(o => o.status === status);
  },

  updateOrderStatus: (id, status) => {
    let updated: Order | undefined;
    const updates: Partial<Order> = { status };
    if (status === 'engraving') {
      updates.engravingStartTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }).replace(/\//g, '-');
    }
    if (status === 'completed' || status === 'delivered') {
      updates.engravingCompleteTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }).replace(/\//g, '-');
    }
    set((state) => ({
      orders: state.orders.map(o => {
        if (o.id === id) {
          updated = { ...o, ...updates };
          return updated;
        }
        return o;
      })
    }));
    return updated;
  },

  updateOrder: (id, updates) => {
    let updated: Order | undefined;
    set((state) => ({
      orders: state.orders.map(o => {
        if (o.id === id) {
          updated = { ...o, ...updates };
          return updated;
        }
        return o;
      })
    }));
    return updated;
  }
}));
