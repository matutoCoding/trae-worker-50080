import { Order, ScheduleItem } from '@/types';

export const orderList: Order[] = [
  {
    id: '1',
    orderNo: 'BK20240601001',
    customerName: '张建国',
    customerPhone: '138****5678',
    tombstoneName: '福寿康宁碑',
    tombstoneImage: 'https://picsum.photos/id/1015/200/200',
    fontName: '欧体楷书',
    inscriptionText: '先考张公讳建国之墓',
    status: 'engraving',
    amount: 7200,
    createTime: '2024-06-01 10:30',
    scheduleTime: '2024-06-03 09:00',
    remarks: '加急处理，客户希望尽快完成'
  },
  {
    id: '2',
    orderNo: 'BK20240602002',
    customerName: '李美玲',
    customerPhone: '139****1234',
    tombstoneName: '德高望重碑',
    tombstoneImage: 'https://picsum.photos/id/1018/200/200',
    fontName: '颜体楷书',
    inscriptionText: '先妣李母王氏太君之墓',
    status: 'confirmed',
    amount: 9800,
    createTime: '2024-06-02 14:20',
    remarks: '需要添加莲花底座纹饰'
  },
  {
    id: '3',
    orderNo: 'BK20240603003',
    customerName: '王志强',
    customerPhone: '137****9876',
    tombstoneName: '简约现代碑',
    tombstoneImage: 'https://picsum.photos/id/1036/200/200',
    fontName: '柳体楷书',
    inscriptionText: '王公讳志强之墓',
    status: 'pending',
    amount: 5400,
    createTime: '2024-06-03 09:15'
  },
  {
    id: '4',
    orderNo: 'BK20240528004',
    customerName: '陈秀英',
    customerPhone: '136****5432',
    tombstoneName: '双穴合葬碑',
    tombstoneImage: 'https://picsum.photos/id/225/200/200',
    fontName: '曹全碑隶书',
    inscriptionText: '先考陈公讳明德 先妣陈母张氏',
    status: 'completed',
    amount: 14500,
    createTime: '2024-05-28 16:45',
    scheduleTime: '2024-05-30 08:00'
  },
  {
    id: '5',
    orderNo: 'BK20240525005',
    customerName: '刘振华',
    customerPhone: '135****7890',
    tombstoneName: '艺术雕花碑',
    tombstoneImage: 'https://picsum.photos/id/1039/200/200',
    fontName: '王羲之行书',
    inscriptionText: '刘公振华之墓',
    status: 'delivered',
    amount: 13800,
    createTime: '2024-05-25 11:00',
    scheduleTime: '2024-05-27 10:00'
  },
  {
    id: '6',
    orderNo: 'BK20240604006',
    customerName: '赵文博',
    customerPhone: '133****2345',
    tombstoneName: '家族合葬碑',
    tombstoneImage: 'https://picsum.photos/id/1044/200/200',
    fontName: '小篆',
    inscriptionText: '赵氏家族之墓',
    status: 'confirmed',
    amount: 19800,
    createTime: '2024-06-04 08:30',
    remarks: '大型家族墓，需要上门测量'
  },
  {
    id: '7',
    orderNo: 'BK20240605007',
    customerName: '孙丽华',
    customerPhone: '132****6789',
    tombstoneName: '天使守护碑',
    tombstoneImage: 'https://picsum.photos/id/1025/200/200',
    fontName: '赵孟頫楷书',
    inscriptionText: '爱女孙小雨之墓',
    status: 'engraving',
    amount: 10600,
    createTime: '2024-06-05 15:20',
    scheduleTime: '2024-06-06 14:00',
    remarks: '客户希望精心制作，女儿年仅8岁'
  },
  {
    id: '8',
    orderNo: 'BK20240520008',
    customerName: '周国华',
    customerPhone: '131****3456',
    tombstoneName: '山水意境碑',
    tombstoneImage: 'https://picsum.photos/id/1043/200/200',
    fontName: '苏轼行书',
    inscriptionText: '周公国华之墓',
    status: 'cancelled',
    amount: 12000,
    createTime: '2024-05-20 10:00',
    remarks: '客户取消订单，改为其他款式'
  }
];

export const scheduleList: ScheduleItem[] = [
  {
    id: '1',
    orderId: '1',
    orderNo: 'BK20240601001',
    type: 'machine',
    content: '福寿康宁碑 - 主碑刻字',
    date: '2024-06-03',
    startTime: '09:00',
    endTime: '12:00',
    operator: '刻字机A',
    status: 'processing'
  },
  {
    id: '2',
    orderId: '1',
    orderNo: 'BK20240601001',
    type: 'manual',
    content: '福寿康宁碑 - 花纹精雕',
    date: '2024-06-03',
    startTime: '14:00',
    endTime: '17:00',
    operator: '李师傅',
    status: 'waiting'
  },
  {
    id: '3',
    orderId: '7',
    orderNo: 'BK20240605007',
    type: 'machine',
    content: '天使守护碑 - 小天使雕像',
    date: '2024-06-06',
    startTime: '08:00',
    endTime: '11:30',
    operator: '刻字机B',
    status: 'waiting'
  },
  {
    id: '4',
    orderId: '2',
    orderNo: 'BK20240602002',
    type: 'machine',
    content: '德高望重碑 - 碑文刻制',
    date: '2024-06-04',
    startTime: '10:00',
    endTime: '13:00',
    operator: '刻字机A',
    status: 'waiting'
  },
  {
    id: '5',
    orderId: '2',
    orderNo: 'BK20240602002',
    type: 'manual',
    content: '德高望重碑 - 莲花底座雕刻',
    date: '2024-06-05',
    startTime: '09:00',
    endTime: '16:00',
    operator: '王师傅',
    status: 'waiting'
  },
  {
    id: '6',
    orderId: '4',
    orderNo: 'BK20240528004',
    type: 'machine',
    content: '双穴合葬碑 - 双碑刻字',
    date: '2024-05-30',
    startTime: '08:00',
    endTime: '17:00',
    operator: '刻字机A',
    status: 'completed'
  },
  {
    id: '7',
    orderId: '4',
    orderNo: 'BK20240528004',
    type: 'manual',
    content: '双穴合葬碑 - 边框雕花',
    date: '2024-05-31',
    startTime: '09:00',
    endTime: '15:00',
    operator: '张师傅',
    status: 'completed'
  }
];

export const getOrderById = (id: string): Order | undefined => {
  return orderList.find(item => item.id === id);
};

export const getOrdersByStatus = (status: string): Order[] => {
  if (status === 'all') return orderList;
  return orderList.filter(item => item.status === status);
};

export const getSchedulesByDate = (date: string): ScheduleItem[] => {
  return scheduleList.filter(item => item.date === date);
};

export const getSchedulesByOrderNo = (orderNo: string): ScheduleItem[] => {
  return scheduleList.filter(item => item.orderNo === orderNo);
};
