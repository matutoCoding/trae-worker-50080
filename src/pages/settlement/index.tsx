import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { settlementList, getSettlementSummary } from '@/data/installations';
import { SettlementItem } from '@/types';
import styles from './index.module.scss';

const SettlementPage: React.FC = () => {
  const [activeType, setActiveType] = useState<string>('all');

  useDidShow(() => {
    console.log('[SettlementPage] 页面显示');
  });

  const summary = useMemo(() => getSettlementSummary(), []);

  const filteredRecords = useMemo<SettlementItem[]>(() => {
    let result = [...settlementList];
    
    if (activeType !== 'all') {
      result = result.filter(item => item.type === activeType);
    }
    
    return result.sort((a, b) => 
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
  }, [activeType]);

  const getStatusLabel = (status: string) => {
    return status === 'completed' ? '已完成' : '待结算';
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}¥${amount.toLocaleString()}`;
  };

  const handleRecordClick = (item: SettlementItem) => {
    console.log('[SettlementPage] 点击记录:', item.id);
  };

  return (
    <View className={styles.page}>
      <View className={styles.summarySection}>
        <Text className={styles.summaryTitle}>营业概览</Text>
        <View className={styles.summaryGrid}>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryValue}>¥{summary.totalIncome.toLocaleString()}</Text>
            <Text className={styles.summaryLabel}>总收入</Text>
          </View>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryValue}>¥{summary.totalExpense.toLocaleString()}</Text>
            <Text className={styles.summaryLabel}>总支出</Text>
          </View>
          <View className={`${styles.summaryCard} ${styles.profit}`}>
            <Text className={styles.summaryValue}>¥{summary.netProfit.toLocaleString()}</Text>
            <Text className={styles.summaryLabel}>净利润</Text>
          </View>
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterTabs}>
          <View 
            className={`${styles.filterTab} ${activeType === 'all' ? styles.active : ''}`}
            onClick={() => setActiveType('all')}
          >
            <Text>全部</Text>
          </View>
          <View 
            className={`${styles.filterTab} ${activeType === 'income' ? styles.active : ''}`}
            onClick={() => setActiveType('income')}
          >
            <Text>收入</Text>
          </View>
          <View 
            className={`${styles.filterTab} ${activeType === 'expense' ? styles.active : ''}`}
            onClick={() => setActiveType('expense')}
          >
            <Text>支出</Text>
          </View>
        </View>
      </View>

      <View className={styles.listSection}>
        <Text className={styles.sectionTitle}>结算明细</Text>
        
        {filteredRecords.length > 0 ? (
          filteredRecords.map((item) => (
            <View 
              key={item.id} 
              className={styles.recordCard}
              onClick={() => handleRecordClick(item)}
            >
              <View className={styles.recordHeader}>
                <Text className={styles.recordTitle}>{item.customerName}</Text>
                <Text className={`${styles.recordAmount} ${styles[item.type]}`}>
                  {formatAmount(item.amount, item.type)}
                </Text>
              </View>
              
              <View className={styles.recordMeta}>
                <Text className={styles.recordCategory}>{item.category}</Text>
                <View className={`${styles.statusTag} ${styles[item.status]}`}>
                  <Text>{getStatusLabel(item.status)}</Text>
                </View>
              </View>
              
              {item.orderNo && (
                <Text className={styles.recordOrder}>关联订单：{item.orderNo}</Text>
              )}
              
              {item.remarks && (
                <Text className={styles.recordRemarks}>{item.remarks}</Text>
              )}
              
              <View style={{ marginTop: 12, textAlign: 'right' }}>
                <Text className={styles.recordTime}>{item.createTime}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>💰</Text>
            <Text className={styles.emptyText}>暂无结算记录</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SettlementPage;
