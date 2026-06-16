import { create } from 'zustand';

interface TypesettingState {
  selectedFontId: string;
  selectedFontName: string;
  mainText: string;
  subText: string;
  fontSize: string;
  align: string;
  tombstoneId: string;
  tombstoneName: string;
  tombstonePrice: number;
  tombstoneImage: string;
  
  setFont: (id: string, name: string) => void;
  setMainText: (text: string) => void;
  setSubText: (text: string) => void;
  setFontSize: (size: string) => void;
  setAlign: (align: string) => void;
  setTombstone: (id: string, name: string, price: number, image: string) => void;
  resetTypesetting: () => void;
}

export const useTypesettingStore = create<TypesettingState>((set) => ({
  selectedFontId: '1',
  selectedFontName: '欧体楷书',
  mainText: '先考张公讳建国之墓',
  subText: '生于一九五〇年  卒于二〇二四年',
  fontSize: 'medium',
  align: 'center',
  tombstoneId: '',
  tombstoneName: '',
  tombstonePrice: 0,
  tombstoneImage: '',

  setFont: (id, name) => set({ selectedFontId: id, selectedFontName: name }),
  setMainText: (text) => set({ mainText: text }),
  setSubText: (text) => set({ subText: text }),
  setFontSize: (size) => set({ fontSize: size }),
  setAlign: (align) => set({ align }),
  setTombstone: (id, name, price, image) => set({ 
    tombstoneId: id, 
    tombstoneName: name, 
    tombstonePrice: price,
    tombstoneImage: image 
  }),
  resetTypesetting: () => set({
    selectedFontId: '1',
    selectedFontName: '欧体楷书',
    mainText: '先考张公讳建国之墓',
    subText: '生于一九五〇年  卒于二〇二四年',
    fontSize: 'medium',
    align: 'center'
  })
}));
