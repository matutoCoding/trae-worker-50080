import { Installation, Cemetery, SettlementItem } from '@/types';

export const installationList: Installation[] = [
  {
    id: '1',
    orderNo: 'BK20240601001',
    customerName: '张建国',
    customerPhone: '138****5678',
    tombstoneName: '传统双穴碑',
    cemetery: '永安陵园',
    location: 'A区12排3号',
    address: '北京市昌平区永安路88号',
    scheduledDate: '2024-06-08',
    installDate: '2024-06-08',
    status: 'scheduled',
    worker: '王师傅、李师傅',
    installFee: 1500,
    remarks: '需要提前与陵园管理处沟通',
    createTime: '2024-06-01 10:30'
  },
  {
    id: '2',
    orderNo: 'BK20240602002',
    customerName: '李美玲',
    customerPhone: '139****2345',
    tombstoneName: '现代艺术碑',
    cemetery: '万安公墓',
    location: 'B区8排5号',
    address: '北京市海淀区香山路万安公墓',
    scheduledDate: '2024-06-10',
    status: 'pending',
    worker: '张师傅',
    installFee: 1200,
    remarks: '客户希望安排在上午',
    createTime: '2024-06-02 14:20'
  },
  {
    id: '3',
    orderNo: 'BK20240528004',
    customerName: '陈秀英',
    customerPhone: '136****7890',
    tombstoneName: '豪华家族墓',
    cemetery: '天寿陵园',
    location: 'C区3排1号',
    address: '北京市昌平区天寿路88号',
    scheduledDate: '2024-06-02',
    installDate: '2024-06-02',
    completeDate: '2024-06-02',
    status: 'completed',
    worker: '张师傅、刘师傅',
    installFee: 3000,
    remarks: '双穴合葬碑，安装较重',
    createTime: '2024-05-28 09:15'
  },
  {
    id: '4',
    orderNo: 'BK20240525005',
    customerName: '刘振华',
    customerPhone: '137****3456',
    tombstoneName: '艺术造型碑',
    cemetery: '福田公墓',
    location: 'D区5排2号',
    address: '北京市石景山区福田寺村',
    scheduledDate: '2024-05-30',
    installDate: '2024-05-30',
    completeDate: '2024-05-30',
    status: 'completed',
    worker: '王师傅、赵师傅',
    installFee: 1800,
    remarks: '艺术碑型，安装需要小心',
    createTime: '2024-05-25 16:40'
  },
  {
    id: '5',
    orderNo: 'BK20240605007',
    customerName: '孙丽华',
    customerPhone: '135****6789',
    tombstoneName: '童婴纪念碑',
    cemetery: '长安园',
    location: 'E区10排8号',
    address: '北京市海淀区台头村',
    scheduledDate: '2024-06-12',
    installDate: '2024-06-12',
    status: 'scheduled',
    worker: '李师傅、张师傅',
    installFee: 1000,
    remarks: '童婴碑，客户情绪需要安抚',
    createTime: '2024-06-05 11:00'
  },
  {
    id: '6',
    orderNo: 'BK20240604006',
    customerName: '赵文博',
    customerPhone: '133****4567',
    tombstoneName: '大型家族墓',
    cemetery: '中华永久陵园',
    location: '家族墓区A座',
    address: '河北省张家口市怀来县',
    scheduledDate: '2024-06-15',
    status: 'pending',
    worker: '王师傅、李师傅、张师傅',
    installFee: 5000,
    remarks: '大型家族墓，需要提前安排运输',
    createTime: '2024-06-04 10:25'
  }
];

export const settlementList: SettlementItem[] = [
  {
    id: '1',
    orderNo: 'BK20240525005',
    customerName: '刘振华',
    amount: 13800,
    type: 'income',
    category: '碑刻费用',
    createTime: '2024-05-28 15:30',
    status: 'completed'
  },
  {
    id: '2',
    orderNo: 'BK20240528004',
    customerName: '陈秀英',
    amount: 14500,
    type: 'income',
    category: '碑刻费用',
    createTime: '2024-06-01 10:00',
    status: 'completed'
  },
  {
    id: '3',
    orderNo: 'BK20240601001',
    customerName: '张建国',
    amount: 3000,
    type: 'income',
    category: '定金',
    createTime: '2024-06-01 11:00',
    status: 'completed',
    remarks: '已收定金，尾款安装后结清'
  },
  {
    id: '4',
    orderNo: '',
    customerName: '石材供应商',
    amount: 25000,
    type: 'expense',
    category: '石材采购',
    createTime: '2024-06-02 09:00',
    status: 'completed'
  },
  {
    id: '5',
    orderNo: 'BK20240602002',
    customerName: '李美玲',
    amount: 5000,
    type: 'income',
    category: '定金',
    createTime: '2024-06-02 15:00',
    status: 'completed'
  },
  {
    id: '6',
    orderNo: '',
    customerName: '李师傅',
    amount: 3500,
    type: 'expense',
    category: '人工费用',
    createTime: '2024-06-03 17:00',
    status: 'completed',
    remarks: '5月份工资'
  },
  {
    id: '7',
    orderNo: '',
    customerName: '陵园管理处',
    amount: 2000,
    type: 'expense',
    category: '安装进场费',
    createTime: '2024-06-02 14:00',
    status: 'completed'
  },
  {
    id: '8',
    orderNo: 'BK20240604006',
    customerName: '赵文博',
    amount: 8000,
    type: 'income',
    category: '定金',
    createTime: '2024-06-04 09:30',
    status: 'completed',
    remarks: '家族墓定金，测量后确认总价'
  },
  {
    id: '9',
    orderNo: 'BK20240603003',
    customerName: '王志强',
    amount: 5400,
    type: 'income',
    category: '碑刻费用',
    createTime: '2024-06-03 10:00',
    status: 'pending',
    remarks: '待确认订单后收款'
  },
  {
    id: '10',
    orderNo: 'BK20240605007',
    customerName: '孙丽华',
    amount: 4000,
    type: 'income',
    category: '定金',
    createTime: '2024-06-05 16:00',
    status: 'completed'
  }
];

export const cemeteryList: Cemetery[] = [
  { 
    id: '1', 
    name: '永安陵园', 
    address: '北京市昌平区永安路88号', 
    contactPerson: '张主任', 
    contactPhone: '010-8888****',
    status: 'active',
    orderCount: 28,
    totalIncome: 156800,
    settlementCycle: '月结',
    level: 'AAA级'
  },
  { 
    id: '2', 
    name: '万安公墓', 
    address: '北京市海淀区香山路万安公墓', 
    contactPerson: '李主任', 
    contactPhone: '010-6666****',
    status: 'active',
    orderCount: 35,
    totalIncome: 198500,
    settlementCycle: '半月结',
    level: 'AAAA级'
  },
  { 
    id: '3', 
    name: '天寿陵园', 
    address: '北京市昌平区天寿路88号', 
    contactPerson: '王主任', 
    contactPhone: '010-7777****',
    status: 'active',
    orderCount: 42,
    totalIncome: 267300,
    settlementCycle: '月结',
    level: 'AAAAA级'
  },
  { 
    id: '4', 
    name: '福田公墓', 
    address: '北京市石景山区福田寺村', 
    contactPerson: '赵主任', 
    contactPhone: '010-5555****',
    status: 'active',
    orderCount: 19,
    totalIncome: 87600,
    settlementCycle: '月结',
    level: 'AA级'
  },
  { 
    id: '5', 
    name: '长安园', 
    address: '北京市海淀区台头村', 
    contactPerson: '刘主任', 
    contactPhone: '010-9999****',
    status: 'pending',
    orderCount: 8,
    totalIncome: 32400,
    settlementCycle: '周结',
    level: 'A级'
  },
  { 
    id: '6', 
    name: '中华永久陵园', 
    address: '河北省张家口市怀来县', 
    contactPerson: '孙主任', 
    contactPhone: '0313-3333****',
    status: 'active',
    orderCount: 15,
    totalIncome: 112500,
    settlementCycle: '季结',
    level: 'AAA级'
  }
];

export const getInstallationById = (id: string): Installation | undefined => {
  return installationList.find(item => item.id === id);
};

export const getInstallationsByStatus = (status: string): Installation[] => {
  if (status === 'all') return installationList;
  return installationList.filter(item => item.status === status);
};

export const getSettlementSummary = () => {
  const completed = settlementList.filter(item => item.status === 'completed');
  const income = completed.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expense = completed.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  return {
    totalIncome: income,
    totalExpense: expense,
    netProfit: income - expense,
    pendingCount: settlementList.filter(item => item.status === 'pending').length
  };
};
