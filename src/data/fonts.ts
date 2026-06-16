import { Font } from '@/types';

export const fontCategories = [
  { id: 'all', name: '全部' },
  { id: 'kaishu', name: '楷书' },
  { id: 'lishu', name: '隶书' },
  { id: 'zhuanshu', name: '篆书' },
  { id: 'xingshu', name: '行书' },
  { id: 'caoshu', name: '草书' }
];

export const fontList: Font[] = [
  {
    id: '1',
    name: '欧体楷书',
    category: 'kaishu',
    preview: 'https://picsum.photos/id/1062/400/200',
    description: '欧阳询字体，严谨工整，结构端庄，是最常用的碑刻字体之一。',
    price: 0
  },
  {
    id: '2',
    name: '颜体楷书',
    category: 'kaishu',
    preview: 'https://picsum.photos/id/106/400/200',
    description: '颜真卿字体，雄浑大气，笔力遒劲，庄严肃穆。',
    price: 200
  },
  {
    id: '3',
    name: '柳体楷书',
    category: 'kaishu',
    preview: 'https://picsum.photos/id/180/400/200',
    description: '柳公权字体，骨力遒健，结构紧劲，清秀挺拔。',
    price: 200
  },
  {
    id: '4',
    name: '曹全碑隶书',
    category: 'lishu',
    preview: 'https://picsum.photos/id/200/400/200',
    description: '汉代隶书经典，秀美圆润，飘逸灵动，古典雅致。',
    price: 300
  },
  {
    id: '5',
    name: '乙瑛碑隶书',
    category: 'lishu',
    preview: 'https://picsum.photos/id/201/400/200',
    description: '汉代隶书代表，方正古朴，端庄厚重，气势雄健。',
    price: 300
  },
  {
    id: '6',
    name: '小篆',
    category: 'zhuanshu',
    preview: 'https://picsum.photos/id/219/400/200',
    description: '秦代小篆，线条圆润，结构对称，古朴典雅，极具装饰性。',
    price: 500
  },
  {
    id: '7',
    name: '大篆',
    category: 'zhuanshu',
    preview: 'https://picsum.photos/id/225/400/200',
    description: '先秦大篆，苍劲古朴，气势磅礴，历史厚重感强。',
    price: 600
  },
  {
    id: '8',
    name: '王羲之行书',
    category: 'xingshu',
    preview: 'https://picsum.photos/id/237/400/200',
    description: '书圣王羲之字体，飘逸自然，行云流水，气韵生动。',
    price: 800
  },
  {
    id: '9',
    name: '苏轼行书',
    category: 'xingshu',
    preview: 'https://picsum.photos/id/250/400/200',
    description: '苏东坡字体，丰腴跌宕，天真烂漫，意趣横生。',
    price: 700
  },
  {
    id: '10',
    name: '张旭草书',
    category: 'caoshu',
    preview: 'https://picsum.photos/id/292/400/200',
    description: '草圣张旭字体，奔放洒脱，气势磅礴，极具艺术感染力。',
    price: 1000
  },
  {
    id: '11',
    name: '怀素草书',
    category: 'caoshu',
    preview: 'https://picsum.photos/id/312/400/200',
    description: '怀素狂草，笔走龙蛇，灵动飞扬，艺术价值极高。',
    price: 1000
  },
  {
    id: '12',
    name: '赵孟頫楷书',
    category: 'kaishu',
    preview: 'https://picsum.photos/id/326/400/200',
    description: '赵孟頫字体，圆润清秀，端正严谨，又不失行书之飘逸。',
    price: 400
  }
];

export const getFontById = (id: string): Font | undefined => {
  return fontList.find(item => item.id === id);
};

export const getFontsByCategory = (category: string): Font[] => {
  if (category === 'all') return fontList;
  return fontList.filter(item => item.category === category);
};
