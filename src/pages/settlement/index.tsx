import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useSettlementStore } from '@/store/settlements';
import { SettlementItem } from '@/types';
import styles from './index.module.scss';

const SettlementPage: React.FC = () => {
  const [activeType, setActiveType] = useState<string>('all');
  const settlements = useSettlementStore((s) => s.settlements);
  const getSummary = useSettlementStore((s) => s.getSummary);
  const completeSettlement = useSettlementStore((s) => s.completeSettlement);

  useDidShow(() => {
    console.log('[SettlementPage] 页面显示');
  });

  const summary = useMemo(() => getSummary(), [settlements, getSummary]);

  const filteredRecords = useMemo<SettlementItem[]>(() => {
    let result = [...settlements];
    
    if (activeType !== 'all') {
      result = result.filter(item => item.type === activeType);
    }
    
    return result.sort((a, b) => 
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
  }, [activeType, settlements]);

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

  const handleComplete = (e: React.MouseEvent, item: SettlementItem) => {
    e.stopPropagation();
    if (item.status === 'completed') return;
    Taro.showModal({
      title: '确认结算',
      content: `确定将「${item.customerName} - ¥${item.amount}」标记为已完成？`,
      success: (res) => {
        if (res.confirm) {
          completeSettlement(item.id);
          Taro.showToast({ title: '结算完成', icon: 'success' });
        }
      }
    });
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
        {summary.pendingCount > 0 && (
          <View className={styles.pendingTip}>
            <Text className={styles.pendingTipText}>
              还有 {summary.pendingCount} 笔待结算，金额 ¥{summary.pendingIncome.toLocaleString()}
            </Text>
          </View>
        )}
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
              
              <View className={styles.recordFooter}>
                <Text className={styles.recordTime}>{item.createTime}</Text>
                {item.status !== 'completed' && (
                  <View 
                    className={styles.settleBtn}
                    onClick={(e) => handleComplete(e, item)}
                  >
                    <Text>完成结算</Text>
                  </View>
                )}
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
