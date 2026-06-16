import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import OrderCard from '@/components/OrderCard';
import { Order } from '@/types';
import { useOrderStore } from '@/store/orders';
import styles from './index.module.scss';

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认' },
  { key: 'confirmed', label: '已确认' },
  { key: 'engraving', label: '刻制中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
];

const OrdersPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const orders = useOrderStore((s) => s.orders);

  useDidShow(() => {
    console.log('[OrdersPage] 页面显示，订单数:', orders.length);
  });

  const filteredOrders = useMemo<Order[]>(() => {
    let result = [...orders];
    
    if (activeStatus !== 'all') {
      result = result.filter(item => item.status === activeStatus);
    }
    
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(item => 
        item.orderNo.toLowerCase().includes(keyword) ||
        item.customerName.toLowerCase().includes(keyword) ||
        item.tombstoneName.toLowerCase().includes(keyword)
      );
    }
    
    return result.sort((a, b) => 
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
  }, [activeStatus, searchKeyword, orders]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      engraving: orders.filter(o => o.status === 'engraving').length,
      completed: orders.filter(o => o.status === 'completed' || o.status === 'delivered').length
    };
  }, [orders]);

  const handleStatusClick = (status: string) => {
    setActiveStatus(status);
  };

  const goToSchedule = () => {
    Taro.navigateTo({ url: '/pages/schedule/index' });
  };

  const goToAddOrder = () => {
    console.log('[OrdersPage] 新增订单');
    Taro.navigateTo({ url: '/pages/order-create/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.searchRow}>
          <View className={styles.searchBar}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.searchInput}
              placeholder="搜索订单号、客户名..."
              placeholderClass={styles.searchPlaceholder}
              value={searchKeyword}
              onInput={(e) => setSearchKeyword(e.detail.value)}
            />
          </View>
          <View className={styles.addBtn} onClick={goToAddOrder}>
            <Text>+</Text>
          </View>
        </View>
        
        <ScrollView scrollX enhanced showScrollbar={false}>
          <View className={styles.statusTabs}>
            {statusTabs.map((tab) => (
              <View
                key={tab.key}
                className={`${styles.statusTab} ${activeStatus === tab.key ? styles.active : ''}`}
                onClick={() => handleStatusClick(tab.key)}
              >
                <Text>{tab.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{stats.total}</Text>
          <Text className={styles.statLabel}>全部订单</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{stats.pending}</Text>
          <Text className={styles.statLabel}>待确认</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{stats.engraving}</Text>
          <Text className={styles.statLabel}>刻制中</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{stats.completed}</Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
      </View>

      <View className={styles.scheduleEntry} onClick={goToSchedule}>
        <View className={styles.scheduleEntryInfo}>
          <Text className={styles.scheduleEntryTitle}>刻制排期</Text>
          <Text className={styles.scheduleEntryDesc}>查看刻字机和人工刻制排期安排</Text>
        </View>
        <Text className={styles.scheduleEntryArrow}>→</Text>
      </View>

      <View className={styles.orderList}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} data={order} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无相关订单</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default OrdersPage;
