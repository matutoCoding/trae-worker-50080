import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { tombstoneCategories, tombstoneList } from '@/data/tombstones';
import TombstoneCard from '@/components/TombstoneCard';
import SectionHeader from '@/components/SectionHeader';
import { Tombstone } from '@/types';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  useDidShow(() => {
    console.log('[HomePage] 页面显示');
  });

  const filteredTombstones = useMemo<Tombstone[]>(() => {
    let result = [...tombstoneList];
    
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }
    
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        item.material.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      );
    }
    
    return result;
  }, [activeCategory, searchKeyword]);

  const handleQuickNav = (type: string) => {
    console.log('[HomePage] 点击快捷入口:', type);
    switch (type) {
      case 'typesetting':
        Taro.navigateTo({ url: '/pages/typesetting/index' });
        break;
      case 'font':
        Taro.navigateTo({ url: '/pages/font-select/index' });
        break;
      case 'order':
        Taro.switchTab({ url: '/pages/orders/index' });
        break;
      case 'install':
        Taro.switchTab({ url: '/pages/install/index' });
        break;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleRefresh = () => {
    console.log('[HomePage] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.brandRow}>
          <View className={styles.brand}>
            <View className={styles.brandLogo}>
              <Text className={styles.brandLogoText}>碑</Text>
            </View>
            <View>
              <Text className={styles.brandName}>碑刻作坊</Text>
              <Text className={styles.brandSlogan}>匠心传承 · 铭刻永恒</Text>
            </View>
          </View>
        </View>
        
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索碑型、材质..."
            placeholderClass={styles.searchPlaceholder}
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.quickNav}>
        <View className={styles.quickNavGrid}>
          <View className={styles.quickNavItem} onClick={() => handleQuickNav('typesetting')}>
            <View className={`${styles.quickNavIcon} ${styles.icon1}`}>
              <Text>✍️</Text>
            </View>
            <Text className={styles.quickNavText}>文字排版</Text>
          </View>
          <View className={styles.quickNavItem} onClick={() => handleQuickNav('font')}>
            <View className={`${styles.quickNavIcon} ${styles.icon2}`}>
              <Text>📜</Text>
            </View>
            <Text className={styles.quickNavText}>字体选择</Text>
          </View>
          <View className={styles.quickNavItem} onClick={() => handleQuickNav('order')}>
            <View className={`${styles.quickNavIcon} ${styles.icon3}`}>
              <Text>📋</Text>
            </View>
            <Text className={styles.quickNavText}>订单管理</Text>
          </View>
          <View className={styles.quickNavItem} onClick={() => handleQuickNav('install')}>
            <View className={`${styles.quickNavIcon} ${styles.icon4}`}>
              <Text>🏗️</Text>
            </View>
            <Text className={styles.quickNavText}>安装登记</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.categoryNav}>
          <ScrollView scrollX enhanced showScrollbar={false}>
            <View className={styles.categoryList}>
              {tombstoneCategories.map((cat) => (
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

        <SectionHeader title="精选碑型" subtitle={`共 ${filteredTombstones.length} 款`} />

        {filteredTombstones.length > 0 ? (
          <View className={styles.tombstoneGrid}>
            {filteredTombstones.map((item) => (
              <TombstoneCard key={item.id} data={item} />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🪦</Text>
            <Text className={styles.emptyText}>暂无相关碑型</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default HomePage;
