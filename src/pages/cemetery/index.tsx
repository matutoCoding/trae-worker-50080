import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { cemeteryList } from '@/data/installations';
import { Cemetery } from '@/types';
import styles from './index.module.scss';

const CemeteryPage: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');

  useDidShow(() => {
    console.log('[CemeteryPage] 页面显示');
  });

  const filteredCemeteries = useMemo<Cemetery[]>(() => {
    if (!keyword) return cemeteryList;
    return cemeteryList.filter(c => 
      c.name.includes(keyword) || c.address.includes(keyword)
    );
  }, [keyword]);

  const stats = useMemo(() => {
    return {
      total: cemeteryList.length,
      active: cemeteryList.filter(c => c.status === 'active').length,
      orders: cemeteryList.reduce((sum, c) => sum + c.orderCount, 0),
      income: cemeteryList.reduce((sum, c) => sum + c.totalIncome, 0)
    };
  }, []);

  const handleSearch = () => {
    console.log('[CemeteryPage] 搜索');
    Taro.showToast({ title: '搜索功能', icon: 'none' });
  };

  const handleContact = (cemetery: Cemetery) => {
    console.log('[CemeteryPage] 联系墓园:', cemetery.name);
    Taro.showToast({ title: `联系${cemetery.name}`, icon: 'none' });
  };

  const handleCardClick = (cemetery: Cemetery) => {
    console.log('[CemeteryPage] 查看墓园详情:', cemetery.name);
  };

  return (
    <View className={styles.page}>
      <View className={styles.searchBar}>
        <View className={styles.searchInput} onClick={handleSearch}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchText}>搜索墓园名称/地址</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.total}</Text>
          <Text className={styles.statLabel}>合作墓园</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.active}</Text>
          <Text className={styles.statLabel}>在合作</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.orders}</Text>
          <Text className={styles.statLabel}>累计订单</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{Math.floor(stats.income / 1000)}k</Text>
          <Text className={styles.statLabel}>累计收入</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>合作墓园</Text>
        
        {filteredCemeteries.length > 0 ? (
          <View className={styles.cemeteryList}>
            {filteredCemeteries.map((cemetery) => (
              <View 
                key={cemetery.id}
                className={styles.cemeteryCard}
                onClick={() => handleCardClick(cemetery)}
              >
                <View className={styles.cemeteryHeader}>
                  <Text className={styles.cemeteryName}>{cemetery.name}</Text>
                  <View className={`${styles.cooperationTag} ${styles[cemetery.status]}`}>
                    <Text>{cemetery.status === 'active' ? '合作中' : '待合作'}</Text>
                  </View>
                </View>
                
                <View className={styles.cemeteryInfo}>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoIcon}>📍</Text>
                    <Text className={styles.infoText}>{cemetery.address}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoIcon}>👤</Text>
                    <Text className={styles.infoText}>
                      联系人：{cemetery.contactPerson} {cemetery.contactPhone}
                    </Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoIcon}>💰</Text>
                    <Text className={styles.infoText}>
                      结算周期：{cemetery.settlementCycle}
                    </Text>
                  </View>
                </View>
                
                <View className={styles.cemeteryFooter}>
                  <View className={styles.cemeteryStats}>
                    <View className={styles.statItem}>
                      <Text className={styles.statValue}>{cemetery.orderCount}</Text>
                      <Text className={styles.statName}>订单数</Text>
                    </View>
                    <View className={styles.statItem}>
                      <Text className={styles.statValue}>¥{cemetery.totalIncome.toLocaleString()}</Text>
                      <Text className={styles.statName}>总收入</Text>
                    </View>
                  </View>
                  <View 
                    className={styles.contactBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContact(cemetery);
                    }}
                  >
                    <Text>联系对接</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🏛️</Text>
            <Text className={styles.emptyText}>暂无墓园信息</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CemeteryPage;
