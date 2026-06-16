export interface Tombstone {
  id: string;
  name: string;
  category: string;
  material: string;
  price: number;
  image: string;
  description: string;
  specs: string[];
  features: string[];
}

export interface Font {
  id: string;
  name: string;
  category: string;
  preview: string;
  description: string;
  price: number;
}

export interface FeeDetail {
  name: string;
  amount: number;
  remark?: string;
}

export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  tombstoneName: string;
  tombstoneImage: string;
  fontName: string;
  inscriptionText: string;
  status: OrderStatus;
  amount: number;
  feeDetails?: FeeDetail[];
  porcelainPhoto?: boolean;
  porcelainPhotoSize?: string;
  urgent?: boolean;
  installService?: boolean;
  cemetery?: string;
  createTime: string;
  scheduleTime?: string;
  engravingStartTime?: string;
  engravingCompleteTime?: string;
  installScheduleTime?: string;
  installCompleteTime?: string;
  installId?: string;
  settlementId?: string;
  remarks?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'engraving' 
  | 'completed' 
  | 'delivered'
  | 'cancelled';

export interface Installation {
  id: string;
  orderId: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  tombstoneName: string;
  cemetery: string;
  location: string;
  address?: string;
  scheduledDate: string;
  installDate?: string;
  completeDate?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  status: InstallStatus;
  worker: string;
  installFee: number;
  installer?: string;
  remarks?: string;
  createTime?: string;
}

export interface Cemetery {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  status: 'active' | 'pending';
  orderCount: number;
  totalIncome: number;
  settlementCycle: string;
  level?: string;
}

export type InstallStatus = 
  | 'pending' 
  | 'scheduled' 
  | 'installing' 
  | 'completed'
  | 'cancelled';

export interface ScheduleItem {
  id: string;
  orderId: string;
  orderNo: string;
  type: 'machine' | 'manual';
  content: string;
  date: string;
  startTime: string;
  endTime: string;
  operator: string;
  status: 'waiting' | 'processing' | 'completed';
}

export interface SettlementItem {
  id: string;
  orderNo: string;
  customerName: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  createTime: string;
  status: 'pending' | 'completed';
  remarks?: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: '待确认', color: '#f39c12' },
  confirmed: { label: '已确认', color: '#3498db' },
  engraving: { label: '刻制中', color: '#9b59b6' },
  completed: { label: '已完成', color: '#27ae60' },
  delivered: { label: '已交付', color: '#2c3e50' },
  cancelled: { label: '已取消', color: '#95a5a6' }
};

export const INSTALL_STATUS_MAP: Record<InstallStatus, { label: string; color: string }> = {
  pending: { label: '待预约', color: '#f39c12' },
  scheduled: { label: '已预约', color: '#3498db' },
  installing: { label: '安装中', color: '#9b59b6' },
  completed: { label: '已完成', color: '#27ae60' },
  cancelled: { label: '已取消', color: '#95a5a6' }
};
