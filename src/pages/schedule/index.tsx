import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { scheduleList } from '@/data/orders';
import { ScheduleItem } from '@/types';
import styles from './index.module.scss';

const SchedulePage: React.FC = () => {
  const [activeType, setActiveType] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState<string>('2024-06-03');

  useDidShow(() => {
    console.log('[SchedulePage] 页面显示');
  });

  const filteredSchedules = useMemo<ScheduleItem[]>(() => {
    let result = scheduleList.filter(item => item.date === currentDate);
    
    if (activeType !== 'all') {
      result = result.filter(item => item.type === activeType);
    }
    
    return result.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  }, [activeType, currentDate]);

  const stats = useMemo(() => {
    const todaySchedules = scheduleList.filter(s => s.date === currentDate);
    return {
      total: todaySchedules.length,
      processing: todaySchedules.filter(s => s.status === 'processing').length,
      completed: todaySchedules.filter(s => s.status === 'completed').length
    };
  }, [currentDate]);

  const handleDateChange = (offset: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + offset);
    const newDate = date.toISOString().split('T')[0];
    setCurrentDate(newDate);
  };

  const getTypeLabel = (type: string) => {
    return type === 'machine' ? '机刻' : '手刻';
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      waiting: '等待中',
      processing: '进行中',
      completed: '已完成'
    };
    return map[status] || status;
  };

  const handleScheduleClick = (item: ScheduleItem) => {
    console.log('[SchedulePage] 点击排期:', item.id);
    Taro.showToast({ title: item.content, icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.dateSelector}>
        <View className={styles.dateRow}>
          <View className={styles.dateNav} onClick={() => handleDateChange(-1)}>
            <Text>‹</Text>
          </View>
          <Text className={styles.currentDate}>{currentDate}</Text>
          <View className={styles.dateNav} onClick={() => handleDateChange(1)}>
            <Text>›</Text>
          </View>
        </View>
        
        <View className={styles.typeTabs}>
          <View 
            className={`${styles.typeTab} ${activeType === 'all' ? styles.active : ''}`}
            onClick={() => setActiveType('all')}
          >
            <Text>全部</Text>
          </View>
          <View 
            className={`${styles.typeTab} ${activeType === 'machine' ? styles.active : ''}`}
            onClick={() => setActiveType('machine')}
          >
            <Text>机刻</Text>
          </View>
          <View 
            className={`${styles.typeTab} ${activeType === 'manual' ? styles.active : ''}`}
            onClick={() => setActiveType('manual')}
          >
            <Text>手刻</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.total}</Text>
          <Text className={styles.statLabel}>今日任务</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.processing}</Text>
          <Text className={styles.statLabel}>进行中</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.completed}</Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
      </View>

      <View className={styles.scheduleList}>
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((item) => (
            <View 
              key={item.id} 
              className={styles.scheduleCard}
              onClick={() => handleScheduleClick(item)}
            >
              <View className={styles.scheduleHeader}>
                <Text className={styles.orderNo}>{item.orderNo}</Text>
                <View className={`${styles.typeTag} ${styles[item.type]}`}>
                  <Text>{getTypeLabel(item.type)}</Text>
                </View>
              </View>
              
              <Text className={styles.scheduleContent}>{item.content}</Text>
              
              <View className={styles.scheduleInfo}>
                <View className={styles.infoItem}>
                  <Text className={styles.infoIcon}>📅</Text>
                  <Text className={styles.infoText}>{item.date}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoIcon}>⏰</Text>
                  <Text className={styles.infoText}>{item.startTime} - {item.endTime}</Text>
                </View>
              </View>
              
              <View className={styles.statusBar}>
                <Text className={styles.operator}>操作：{item.operator}</Text>
                <View className={`${styles.statusTag} ${styles[item.status]}`}>
                  <Text>{getStatusLabel(item.status)}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📅</Text>
            <Text className={styles.emptyText}>暂无排期任务</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SchedulePage;
