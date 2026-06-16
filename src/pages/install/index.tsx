import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { installationList } from '@/data/installations';
import StatusTag from '@/components/StatusTag';
import { Installation, INSTALL_STATUS_MAP } from '@/types';
import styles from './index.module.scss';

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待预约' },
  { key: 'scheduled', label: '已预约' },
  { key: 'completed', label: '已完成' }
];

const InstallPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<string>('all');

  useDidShow(() => {
    console.log('[InstallPage] 页面显示');
  });

  const filteredInstallations = useMemo<Installation[]>(() => {
    let result = [...installationList];
    
    if (activeStatus !== 'all') {
      result = result.filter(item => item.status === activeStatus);
    }
    
    return result.sort((a, b) => 
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );
  }, [activeStatus]);

  const stats = useMemo(() => {
    return {
      total: installationList.length,
      pending: installationList.filter(i => i.status === 'pending').length,
      scheduled: installationList.filter(i => i.status === 'scheduled').length,
      completed: installationList.filter(i => i.status === 'completed').length
    };
  }, []);

  const handleCardClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/install-detail/index?id=${id}` });
  };

  const handleReserve = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log('[InstallPage] 预约安装:', id);
    Taro.showToast({ title: '预约功能开发中', icon: 'none' });
  };

  const goToCemetery = () => {
    Taro.navigateTo({ url: '/pages/cemetery/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>安装登记</Text>
        <Text className={styles.headerDesc}>立碑安装预约与进度管理</Text>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{stats.total}</Text>
          <Text className={styles.statLabel}>全部</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{stats.pending}</Text>
          <Text className={styles.statLabel}>待预约</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{stats.scheduled}</Text>
          <Text className={styles.statLabel}>已预约</Text>
        </View>
      </View>

      <View className={styles.statusTabs}>
        {statusTabs.map((tab) => (
          <View
            key={tab.key}
            className={`${styles.statusTab} ${activeStatus === tab.key ? styles.active : ''}`}
            onClick={() => setActiveStatus(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.cemeteryEntry} onClick={goToCemetery}>
        <View className={styles.cemeteryEntryInfo}>
          <Text className={styles.cemeteryEntryTitle}>墓园对接</Text>
          <Text className={styles.cemeteryEntryDesc}>管理合作墓园信息及联系方式</Text>
        </View>
        <Text className={styles.cemeteryEntryArrow}>→</Text>
      </View>

      <View className={styles.installList}>
        {filteredInstallations.length > 0 ? (
          filteredInstallations.map((item) => {
            const statusInfo = INSTALL_STATUS_MAP[item.status];
            return (
              <View 
                key={item.id} 
                className={styles.installCard}
                onClick={() => handleCardClick(item.id)}
              >
                <View className={styles.cardHeader}>
                  <Text className={styles.orderNo}>{item.orderNo}</Text>
                  <StatusTag text={statusInfo.label} color={statusInfo.color} size="sm" />
                </View>
                
                <View className={styles.cardBody}>
                  <View className={styles.infoSection}>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>客户</Text>
                      <Text className={styles.infoValue}>{item.customerName}</Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>墓园</Text>
                      <Text className={styles.infoValue}>{item.cemetery}</Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>地址</Text>
                      <Text className={styles.infoValue}>{item.address}</Text>
                    </View>
                  </View>
                </View>
                
                <View className={styles.cardFooter}>
                  <View className={styles.dateTime}>
                    <Text className={styles.dateIcon}>📅</Text>
                    <Text className={styles.dateText}>
                      {item.status === 'pending' ? '待预约' : item.scheduledDate}
                    </Text>
                  </View>
                  {item.status === 'pending' && (
                    <View 
                      className={styles.actionBtn} 
                      onClick={(e) => handleReserve(e, item.id)}
                    >
                      <Text>立即预约</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🏗️</Text>
            <Text className={styles.emptyText}>暂无安装记录</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default InstallPage;
