import { Tombstone } from '@/types';

export const tombstoneCategories = [
  { id: 'all', name: '全部' },
  { id: 'traditional', name: '传统碑' },
  { id: 'modern', name: '现代碑' },
  { id: 'artistic', name: '艺术碑' },
  { id: 'family', name: '家族墓' },
  { id: 'children', name: '童婴碑' }
];

export const tombstoneList: Tombstone[] = [
  {
    id: '1',
    name: '福寿康宁碑',
    category: 'traditional',
    material: '花岗岩',
    price: 6800,
    image: 'https://picsum.photos/id/1015/600/800',
    description: '传统中式墓碑，雕工精细，寓意福寿康宁。采用优质花岗岩，经久耐用，色泽典雅。',
    specs: ['高120cm', '宽80cm', '厚15cm'],
    features: ['传统造型', '精雕细琢', '优质石材', '永久保存']
  },
  {
    id: '2',
    name: '德高望重碑',
    category: 'traditional',
    material: '大理石',
    price: 8600,
    image: 'https://picsum.photos/id/1018/600/800',
    description: '典雅大气的传统碑型，德高望重之意。汉白玉材质，洁白纯净，象征高洁品格。',
    specs: ['高130cm', '宽90cm', '厚18cm'],
    features: ['汉白玉材质', '大气庄重', '刻字清晰', '品质保证']
  },
  {
    id: '3',
    name: '简约现代碑',
    category: 'modern',
    material: '花岗岩',
    price: 5200,
    image: 'https://picsum.photos/id/1036/600/800',
    description: '简约现代风格，线条流畅，造型简洁大方。适合追求简约美学的家庭选择。',
    specs: ['高100cm', '宽70cm', '厚12cm'],
    features: ['现代简约', '线条流畅', '性价比高', '安装简便']
  },
  {
    id: '4',
    name: '艺术雕花碑',
    category: 'artistic',
    material: '大理石',
    price: 12800,
    image: 'https://picsum.photos/id/1039/600/800',
    description: '精美艺术雕花，匠心独运。每一处细节都经过精心雕琢，展现艺术之美。',
    specs: ['高140cm', '宽85cm', '厚20cm'],
    features: ['艺术雕花', '匠心工艺', '独一无二', '收藏价值']
  },
  {
    id: '5',
    name: '家族合葬碑',
    category: 'family',
    material: '花岗岩',
    price: 18600,
    image: 'https://picsum.photos/id/1044/600/800',
    description: '大型家族合葬墓碑，气势恢宏，可容纳多位先人。选材上乘，工艺精湛。',
    specs: ['高180cm', '宽150cm', '厚25cm'],
    features: ['家族合葬', '气势恢宏', '上乘石材', '传世之作']
  },
  {
    id: '6',
    name: '天使守护碑',
    category: 'children',
    material: '汉白玉',
    price: 9800,
    image: 'https://picsum.photos/id/1025/600/800',
    description: '专为童婴设计的墓碑，小天使守护造型。温润的汉白玉，寄托无尽的思念。',
    specs: ['高60cm', '宽45cm', '厚10cm'],
    features: ['天使造型', '汉白玉石', '精致小巧', '温馨守护']
  },
  {
    id: '7',
    name: '莲花宝座碑',
    category: 'traditional',
    material: '花岗岩',
    price: 7600,
    image: 'https://picsum.photos/id/219/600/800',
    description: '莲花底座设计，寓意清净超脱。碑身挺拔庄重，雕刻精细，品位高雅。',
    specs: ['高125cm', '宽85cm', '厚16cm'],
    features: ['莲花底座', '寓意吉祥', '工艺精湛', '庄严肃穆']
  },
  {
    id: '8',
    name: '欧风典雅碑',
    category: 'modern',
    material: '大理石',
    price: 9200,
    image: 'https://picsum.photos/id/1000/600/800',
    description: '欧式典雅风格，线条优美，气质高贵。适合追求西式审美的家庭。',
    specs: ['高110cm', '宽75cm', '厚14cm'],
    features: ['欧式风格', '典雅高贵', '独特设计', '品质上乘']
  },
  {
    id: '9',
    name: '山水意境碑',
    category: 'artistic',
    material: '花岗岩',
    price: 11200,
    image: 'https://picsum.photos/id/1043/600/800',
    description: '山水意境艺术造型，融入自然之美。独具匠心的设计，如诗如画。',
    specs: ['高135cm', '宽95cm', '厚18cm'],
    features: ['山水意境', '艺术造型', '自然之美', '独具匠心']
  },
  {
    id: '10',
    name: '双穴合葬碑',
    category: 'family',
    material: '大理石',
    price: 13800,
    image: 'https://picsum.photos/id/225/600/800',
    description: '夫妻双穴合葬墓碑，并肩相伴。造型对称和谐，象征永恒的爱情与陪伴。',
    specs: ['高120cm', '宽120cm', '厚18cm'],
    features: ['双穴合葬', '对称设计', '相伴永恒', '寓意美好']
  }
];

export const getTombstoneById = (id: string): Tombstone | undefined => {
  return tombstoneList.find(item => item.id === id);
};

export const getTombstonesByCategory = (category: string): Tombstone[] => {
  if (category === 'all') return tombstoneList;
  return tombstoneList.filter(item => item.category === category);
};
