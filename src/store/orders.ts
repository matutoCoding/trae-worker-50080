import { create } from 'zustand';
import { Order, OrderStatus, FeeDetail } from '@/types';
import { orderList as initialOrders } from '@/data/orders';
import { useScheduleStore } from './schedules';
import { useSettlementStore } from './settlements';

interface OrderStore {
  orders: Order[];
  
  addOrder: (order: Omit<Order, 'id' | 'orderNo' | 'createTime' | 'status'> & { status?: OrderStatus }) => Order;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: string) => Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => Order | undefined;
  updateOrder: (id: string, updates: Partial<Order>) => Order | undefined;
  refreshOrderStatusBySchedule: (id: string) => Order | undefined;
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

  refreshOrderStatusBySchedule: (id) => {
    const order = get().orders.find(o => o.id === id);
    if (!order) return undefined;
    const schedules = useScheduleStore.getState().getSchedulesByOrderId(id);
    if (schedules.length === 0) return order;
    const allCompleted = schedules.every(s => s.status === 'completed');
    if (allCompleted && (order.status === 'engraving' || order.status === 'confirmed')) {
      return get().updateOrderStatus(id, 'completed');
    }
    return order;
  },

  updateOrderStatus: (id, status) => {
    let updated: Order | undefined;
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).replace(/\//g, '-');
    const updates: Partial<Order> = { status };
    if (status === 'engraving') {
      updates.engravingStartTime = now;
    }
    if (status === 'completed') {
      updates.engravingCompleteTime = now;
    }
    if (status === 'delivered') {
      updates.installCompleteTime = now;
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
    if (status === 'delivered' && updated && !updated.settlementId) {
      const settlementStore = useSettlementStore.getState();
      const exist = settlementStore.settlements.find(s => s.orderNo === updated!.orderNo);
      if (!exist) {
        const newSettlement = settlementStore.addSettlement({
          orderNo: updated.orderNo,
          customerName: updated.customerName,
          amount: updated.amount,
          type: 'income',
          category: '碑刻结算',
          createTime: now,
          status: 'pending',
          remarks: '订单完成交付，待结算'
        });
        set((s) => ({
          orders: s.orders.map(o => o.id === id ? { ...o, settlementId: newSettlement.id } : o)
        }));
      }
    }
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
