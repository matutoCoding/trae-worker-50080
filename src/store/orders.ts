import { create } from 'zustand';
import { Order, OrderStatus } from '@/types';
import { orderList as initialOrders } from '@/data/orders';

interface OrderStore {
  orders: Order[];
  
  addOrder: (order: Omit<Order, 'id' | 'orderNo' | 'createTime' | 'status'> & { status?: OrderStatus }) => Order;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: string) => Order[];
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [...initialOrders],

  addOrder: (orderData) => {
    const newOrder: Order = {
      id: String(Date.now()),
      orderNo: `BK${Date.now()}`,
      status: orderData.status || 'pending',
      createTime: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      ...orderData
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));
    return newOrder;
  },

  getOrderById: (id) => get().orders.find(o => o.id === id),
  getOrdersByStatus: (status) => {
    if (status === 'all') return get().orders;
    return get().orders.filter(o => o.status === status);
  }
}));
