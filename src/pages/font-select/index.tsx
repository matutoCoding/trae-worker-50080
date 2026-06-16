import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { fontCategories, fontList } from '@/data/fonts';
import { Font } from '@/types';
import styles from './index.module.scss';

const FontSelectPage: React.FC = () => {
  const router = useRouter();
  const isSelectMode = router.params.select === '1';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedFontId, setSelectedFontId] = useState<string>('1');

  useDidShow(() => {
    console.log('[FontSelectPage] 页面显示，选择模式:', isSelectMode);
  });

  const filteredFonts = useMemo<Font[]>(() => {
    if (activeCategory === 'all') return fontList;
    return fontList.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
  };

  const handleFontSelect = (font: Font) => {
    if (isSelectMode) {
      setSelectedFontId(font.id);
      Taro.showToast({ title: `已选择${font.name}`, icon: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return '免费';
    return `¥${price}`;
  };

  const getCategoryName = (catId: string) => {
    const cat = fontCategories.find(c => c.id === catId);
    return cat ? cat.name : '';
  };

  return (
    <View className={styles.page}>
      <View className={styles.categoryNav}>
        <ScrollView scrollX enhanced showScrollbar={false}>
          <View className={styles.categoryList}>
            {fontCategories.map((cat) => (
              <View
                key={cat.id}
                className={`${styles.categoryItem} ${activeCategory === cat.id ? styles.active : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <Text>{cat.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.fontList}>
        {filteredFonts.length > 0 ? (
          filteredFonts.map((font) => (
            <View 
              key={font.id} 
              className={`${styles.fontCard} ${selectedFontId === font.id ? styles.selected : ''}`}
              onClick={() => handleFontSelect(font)}
            >
              <View className={styles.fontHeader}>
                <Text className={styles.fontName}>{font.name}</Text>
                <View className={styles.fontCategory}>
                  <Text>{getCategoryName(font.category)}</Text>
                </View>
              </View>

              <View className={styles.fontPreview}>
                <Text className={styles.previewText}>
                  {font.name} · 碑文示例
                </Text>
              </View>

              <Text className={styles.fontDesc}>{font.description}</Text>

              <View className={styles.fontFooter}>
                <View className={styles.fontPrice}>
                  {font.price === 0 ? (
                    <Text className={styles.freeText}>免费</Text>
                  ) : (
                    <>
                      <Text className={styles.priceLabel}>加价</Text>
                      <Text className={styles.priceValue}>{formatPrice(font.price)}</Text>
                    </>
                  )}
                </View>
                {isSelectMode && (
                  <View 
                    className={`${styles.selectBtn} ${selectedFontId === font.id ? styles.selected : ''}`}
                  >
                    <Text>{selectedFontId === font.id ? '已选择' : '选择'}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📜</Text>
            <Text className={styles.emptyText}>暂无相关字体</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FontSelectPage;
