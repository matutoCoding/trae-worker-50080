import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { useInstallationStore } from '@/store/installations';
import { useOrderStore } from '@/store/orders';
import { Installation } from '@/types';
import { INSTALL_STATUS_MAP } from '@/types';
import styles from './index.module.scss';

const InstallDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '1';
  const getInstallationById = useInstallationStore((s) => s.getInstallationById);
  const completeInstallation = useInstallationStore((s) => s.completeInstallation);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  
  const [installation, setInstallation] = useState<Installation | null>(null);

  useDidShow(() => {
    console.log('[InstallDetailPage] 页面显示，id:', id);
    const data = getInstallationById(String(id));
    setInstallation(data);
  });

  if (!installation) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  const statusInfo = INSTALL_STATUS_MAP[installation.status];

  const getTimelineData = () => {
    const timeline = [
      { title: '订单确认', time: installation.createTime, desc: '客户下单，订单已确认', active: true },
      { title: '刻制完成', time: installation.scheduledDate, desc: '墓碑刻制完成，等待安装', active: false },
      { title: '安装中', time: installation.installDate || '', desc: '安装工人正在现场施工', active: false },
      { title: '安装完成', time: installation.completeDate || '', desc: '安装完成，客户验收，订单已交付', active: false }
    ];

    const statusIndex = {
      pending: 0,
      scheduled: 1,
      installing: 2,
      completed: 3
    };

    const currentIndex = statusIndex[installation.status] ?? 0;
    return timeline.map((item, index) => ({
      ...item,
      active: index <= currentIndex
    }));
  };

  const handleContact = () => {
    console.log('[InstallDetailPage] 联系客户');
    Taro.showToast({ title: '联系客户', icon: 'none' });
  };

  const handleAction = () => {
    console.log('[InstallDetailPage] 主操作按钮');
    if (installation.status === 'scheduled') {
      const updated = { ...installation, status: 'installing' as const, installDate: new Date().toISOString().split('T')[0] };
      setInstallation(updated);
      Taro.showToast({ title: '安装已开始', icon: 'success' });
    } else if (installation.status === 'installing') {
      Taro.showModal({
        title: '完成安装',
        content: '确认安装完成并交付给客户？订单将同步标记为已交付，自动进入待结算。',
        success: (res) => {
          if (res.confirm) {
            completeInstallation(installation.id);
            if (installation.orderId) {
              updateOrderStatus(installation.orderId, 'delivered');
            }
            const finalInst = getInstallationById(installation.id);
            setInstallation(finalInst);
            Taro.showToast({ title: '安装完成，已交付', icon: 'success' });
          }
        }
      });
    } else if (installation.status === 'pending') {
      if (installation.orderId) {
        Taro.navigateTo({ url: `/pages/order-detail/index?id=${installation.orderId}` });
      }
    }
  };

  const getActionText = () => {
    const map: Record<string, string> = {
      pending: '去订单详情预约',
      scheduled: '开始安装',
      installing: '完成安装',
      completed: '安装已完成'
    };
    return map[installation.status] || '操作';
  };

  return (
    <View className={styles.page}>
      <View className={styles.statusHeader}>
        <View className={styles.statusBadge}>
          <Text>{statusInfo.label}</Text>
        </View>
        <Text className={styles.statusText}>{installation.tombstoneName}</Text>
        <Text className={styles.statusDesc}>
          安装位置：{installation.cemetery} {installation.location}
        </Text>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>客户信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>客户姓名</Text>
          <Text className={styles.infoValue}>{installation.customerName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>联系电话</Text>
          <Text className={styles.infoValue}>{installation.customerPhone}</Text>
        </View>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>安装信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>墓园名称</Text>
          <Text className={styles.infoValue}>{installation.cemetery}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>安装位置</Text>
          <Text className={styles.infoValue}>{installation.location}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>预约日期</Text>
          <Text className={styles.infoValue}>{installation.scheduledDate}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>安装工人</Text>
          <Text className={styles.infoValue}>{installation.worker}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>安装费用</Text>
          <Text className={styles.infoValue}>¥{installation.installFee.toLocaleString()}</Text>
        </View>
        {installation.remarks && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>备注</Text>
            <Text className={styles.infoValue}>{installation.remarks}</Text>
          </View>
        )}
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>安装进度</Text>
        <View className={styles.timeline}>
          {getTimelineData().map((item, index) => (
            <View key={index} className={styles.timelineItem}>
              <View className={`${styles.timelineDot} ${item.active ? styles.active : ''}`} />
              {index < getTimelineData().length - 1 && <View className={styles.timelineLine} />}
              <View className={styles.timelineContent}>
                <Text className={`${styles.timelineTitle} ${item.active ? styles.active : ''}`}>
                  {item.title}
                </Text>
                {item.time && <Text className={styles.timelineTime}>{item.time}</Text>}
                {item.desc && <Text className={styles.timelineDesc}>{item.desc}</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>

      {installation.status === 'completed' && (
        <View className={styles.card}>
          <Text className={styles.cardTitle}>现场照片</Text>
          <View className={styles.photoGrid}>
            <View className={styles.photoItem}>📷</View>
            <View className={styles.photoItem}>📷</View>
            <View className={styles.photoItem}>📷</View>
          </View>
        </View>
      )}

      <View className={styles.actionBar}>
        <View className={`${styles.btn} ${styles.outline}`} onClick={handleContact}>
          <Text>联系客户</Text>
        </View>
        {installation.status !== 'completed' && (
          <View className={`${styles.btn} ${styles.primary}`} onClick={handleAction}>
            <Text>{getActionText()}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default InstallDetailPage;
