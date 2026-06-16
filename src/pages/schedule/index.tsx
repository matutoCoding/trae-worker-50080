import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useScheduleStore } from '@/store/schedules';
import { useOrderStore } from '@/store/orders';
import { ScheduleItem } from '@/types';
import styles from './index.module.scss';

interface OperatorLoad {
  operator: string;
  type: 'machine' | 'manual' | 'both';
  total: number;
  busySlots: Array<{ startTime: string; endTime: string; orderNo: string }>;
}

const SchedulePage: React.FC = () => {
  const [activeType, setActiveType] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState<string>('2024-06-03');
  const [showLoadView, setShowLoadView] = useState<boolean>(false);
  const schedules = useScheduleStore((s) => s.schedules);
  const completeSchedule = useScheduleStore((s) => s.completeSchedule);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const getOperatorLoadByDate = useScheduleStore((s) => s.getOperatorLoadByDate);

  useDidShow(() => {
    console.log('[SchedulePage] 页面显示，排期数量:', schedules.length);
  });

  const operatorLoads: OperatorLoad[] = useMemo(() => {
    return getOperatorLoadByDate(currentDate);
  }, [currentDate, schedules, getOperatorLoadByDate]);

  const machineLoads = useMemo(() => operatorLoads.filter(l => l.type === 'machine' || l.type === 'both'), [operatorLoads]);
  const manualLoads = useMemo(() => operatorLoads.filter(l => l.type === 'manual' || l.type === 'both'), [operatorLoads]);

  const filteredSchedules = useMemo<ScheduleItem[]>(() => {
    let result = schedules.filter(item => item.date === currentDate);
    
    if (activeType !== 'all') {
      result = result.filter(item => item.type === activeType);
    }
    
    return result.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  }, [activeType, currentDate, schedules]);

  const stats = useMemo(() => {
    return {
      total: filteredSchedules.length,
      processing: filteredSchedules.filter(s => s.status === 'processing').length,
      completed: filteredSchedules.filter(s => s.status === 'completed').length
    };
  }, [filteredSchedules]);

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
    console.log('[SchedulePage] 点击排期:', item.id, 'orderId:', item.orderId);
    Taro.navigateTo({
      url: `/pages/order-detail/index?id=${item.orderId}`
    });
  };

  const handleComplete = (e: React.MouseEvent, item: ScheduleItem) => {
    e.stopPropagation();
    if (item.status === 'completed') return;
    
    Taro.showModal({
      title: '确认完成',
      content: `确定要将「${item.content}」标记为完成吗？订单状态将同步更新。`,
      success: (res) => {
        if (res.confirm) {
          completeSchedule(item.id);
          const order = getOrderById(item.orderId);
          if (order) {
            const allSchedules = useScheduleStore.getState().getSchedulesByOrderId(item.orderId);
            const allCompleted = allSchedules.every(s => s.status === 'completed');
            if (allCompleted && (order.status === 'engraving' || order.status === 'confirmed')) {
              updateOrderStatus(item.orderId, 'completed');
              Taro.showToast({ title: '刻制完成，可安排安装', icon: 'success' });
            } else {
              Taro.showToast({ title: '任务已完成', icon: 'success' });
            }
          } else {
            Taro.showToast({ title: '任务已完成', icon: 'success' });
          }
        }
      }
    });
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
          <View 
            className={`${styles.typeTab} ${showLoadView ? styles.active : ''}`}
            onClick={() => setShowLoadView(!showLoadView)}
            style={{ marginLeft: 'auto' }}
          >
            <Text>{showLoadView ? '任务列表' : '工作负载'}</Text>
          </View>
        </View>
      </View>

      {showLoadView ? (
        <View className={styles.loadSection}>
          <View className={styles.loadBlock}>
            <Text className={styles.loadBlockTitle}>🤖 刻字机负载</Text>
            {machineLoads.map((load) => (
              <View key={load.operator} className={styles.loadCard}>
                <View className={styles.loadCardHeader}>
                  <Text className={styles.loadOperator}>{load.operator}</Text>
                  <View 
                    className={`${styles.loadBadge} ${
                      load.total >= 2 ? styles.loadBadgeDanger : 
                      load.total >= 1 ? styles.loadBadgeWarning : styles.loadBadgeSafe
                    }`}
                  >
                    <Text>{load.total}单</Text>
                  </View>
                </View>
                {load.busySlots.length > 0 ? (
                  <View className={styles.loadSlots}>
                    {load.busySlots.map((slot, idx) => (
                      <View key={idx} className={styles.loadSlot}>
                        <Text className={styles.loadSlotTime}>{slot.startTime}-{slot.endTime}</Text>
                        <Text className={styles.loadSlotOrder}>{slot.orderNo}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text className={styles.loadEmpty}>空闲可用</Text>
                )}
              </View>
            ))}
          </View>

          <View className={styles.loadBlock}>
            <Text className={styles.loadBlockTitle}>👷 师傅负载</Text>
            {manualLoads.map((load) => (
              <View key={load.operator} className={styles.loadCard}>
                <View className={styles.loadCardHeader}>
                  <Text className={styles.loadOperator}>{load.operator}</Text>
                  <View 
                    className={`${styles.loadBadge} ${
                      load.total >= 2 ? styles.loadBadgeDanger : 
                      load.total >= 1 ? styles.loadBadgeWarning : styles.loadBadgeSafe
                    }`}
                  >
                    <Text>{load.total}单</Text>
                  </View>
                </View>
                {load.busySlots.length > 0 ? (
                  <View className={styles.loadSlots}>
                    {load.busySlots.map((slot, idx) => (
                      <View key={idx} className={styles.loadSlot}>
                        <Text className={styles.loadSlotTime}>{slot.startTime}-{slot.endTime}</Text>
                        <Text className={styles.loadSlotOrder}>{slot.orderNo}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text className={styles.loadEmpty}>空闲可用</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      ) : (
        <>
          <View className={styles.statsRow}>
            <View className={styles.statCard}>
              <Text className={styles.statNum}>{stats.total}</Text>
              <Text className={styles.statLabel}>当前任务</Text>
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
                    <View className={styles.statusActions}>
                      {item.status !== 'completed' && (
                        <View 
                          className={styles.completeBtn}
                          onClick={(e) => handleComplete(e, item)}
                        >
                          <Text>完成</Text>
                        </View>
                      )}
                      <View className={`${styles.statusTag} ${styles[item.status]}`}>
                        <Text>{getStatusLabel(item.status)}</Text>
                      </View>
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
        </>
      )}
    </View>
  );
};

export default SchedulePage;
