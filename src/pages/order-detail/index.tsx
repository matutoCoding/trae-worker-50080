import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { getSchedulesByOrderNo } from '@/data/orders';
import { Order, ORDER_STATUS_MAP } from '@/types';
import StatusTag from '@/components/StatusTag';
import { useOrderStore } from '@/store/orders';
import styles from './index.module.scss';

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const getOrderById = useOrderStore((s) => s.getOrderById);

  useDidShow(() => {
    const id = router.params.id;
    console.log('[OrderDetail] 订单ID:', id);
    if (id) {
      const data = getOrderById(id as string);
      if (data) {
        setOrder(data);
        const scheds = getSchedulesByOrderNo(data.orderNo);
        setSchedules(scheds);
      } else {
        console.log('[OrderDetail] 未找到订单，id:', id);
      }
    }
  });

  const handleGoSchedule = () => {
    Taro.navigateTo({ url: '/pages/schedule/index' });
  };

  const handleConfirmOrder = () => {
    console.log('[OrderDetail] 确认订单');
    Taro.showToast({ title: '订单已确认', icon: 'success' });
  };

  const handleContact = () => {
    console.log('[OrderDetail] 联系客户');
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  if (!order) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  const statusInfo = ORDER_STATUS_MAP[order.status];

  const timelineData = [
    { title: '订单创建', time: order.createTime, active: true },
    { title: '订单确认', time: order.status !== 'pending' ? '已确认' : '待确认', active: order.status !== 'pending' },
    { title: '开始刻制', time: order.scheduleTime || '待排期', active: order.status === 'engraving' || order.status === 'completed' || order.status === 'delivered' },
    { title: '刻制完成', time: '-', active: order.status === 'completed' || order.status === 'delivered' },
    { title: '已交付', time: '-', active: order.status === 'delivered' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.statusHeader}>
        <Text className={styles.statusText}>{statusInfo.label}</Text>
        <Text className={styles.statusDesc}>订单号：{order.orderNo}</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>碑型信息</Text>
        <View className={styles.tombstoneInfo}>
          <Image className={styles.tombstoneImage} src={order.tombstoneImage} mode="aspectFill" />
          <View className={styles.tombstoneDetail}>
            <Text className={styles.tombstoneName}>{order.tombstoneName}</Text>
            <Text className={styles.tombstoneSpec}>字体：{order.fontName}</Text>
            <Text className={styles.tombstoneSpec}>碑文：{order.inscriptionText}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>客户信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>客户姓名</Text>
          <Text className={styles.infoValue}>{order.customerName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>联系电话</Text>
          <Text className={styles.infoValue}>{order.customerPhone}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>订单信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>订单金额</Text>
          <Text className={styles.infoValue} style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: 32 }}>
            ¥{order.amount}
          </Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>创建时间</Text>
          <Text className={styles.infoValue}>{order.createTime}</Text>
        </View>
        {order.remarks && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>备注</Text>
            <Text className={styles.infoValue}>{order.remarks}</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Text className={styles.sectionTitle} style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
            刻制进度
          </Text>
          <Text style={{ fontSize: 24, color: '#c9a962' }} onClick={handleGoSchedule}>查看排期 ›</Text>
        </View>
        <View className={styles.timeline}>
          {timelineData.map((item, index) => (
            <View 
              key={index} 
              className={`${styles.timelineItem} ${item.active ? styles.active : ''}`}
            >
              <View className={styles.dot} />
              <Text className={styles.timelineTitle}>{item.title}</Text>
              <Text className={styles.timelineTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={handleContact}>
          <Text>联系客户</Text>
        </View>
        {order.status === 'pending' && (
          <View className={styles.primaryBtn} onClick={handleConfirmOrder}>
            <Text>确认订单</Text>
          </View>
        )}
        {order.status !== 'pending' && order.status !== 'cancelled' && (
          <View className={styles.primaryBtn} onClick={handleGoSchedule}>
            <Text>刻制排期</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderDetailPage;
