import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { getSettlementSummary } from '@/data/installations';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const settlementSummary = useMemo(() => getSettlementSummary(), []);

  useDidShow(() => {
    console.log('[MinePage] 页面显示');
  });

  const handleMenuClick = (type: string) => {
    console.log('[MinePage] 点击菜单:', type);
    switch (type) {
      case 'settlement':
        Taro.navigateTo({ url: '/pages/settlement/index' });
        break;
      case 'porcelain':
        Taro.navigateTo({ url: '/pages/porcelain-photo/index' });
        break;
      case 'repair':
        Taro.navigateTo({ url: '/pages/repair/index' });
        break;
      case 'cemetery':
        Taro.navigateTo({ url: '/pages/cemetery/index' });
        break;
      default:
        Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  const serviceMenus = [
    { key: 'porcelain', icon: '🖼️', iconClass: 'iconGold', name: '照片瓷像定制', desc: '高温瓷像，永久保存' },
    { key: 'repair', icon: '🔧', iconClass: 'iconGreen', name: '修补翻新', desc: '墓碑修复、翻新服务' },
    { key: 'cemetery', icon: '🏛️', iconClass: 'iconBlue', name: '墓园对接', desc: '合作墓园管理' },
  ];

  const toolMenus = [
    { key: 'fonts', icon: '📜', iconClass: 'iconPurple', name: '字体管理', desc: '碑刻字体库管理' },
    { key: 'workers', icon: '👷', iconClass: 'iconRed', name: '师傅管理', desc: '刻制安装人员管理' },
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>李</Text>
          </View>
          <View className={styles.userDetail}>
            <Text className={styles.userName}>李师傅</Text>
            <Text className={styles.userRole}>碑刻作坊 · 管理员</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <Text className={styles.statsTitle}>营业概览</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>¥{settlementSummary.totalIncome.toLocaleString()}</Text>
            <Text className={styles.statLabel}>总收入</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>¥{settlementSummary.totalExpense.toLocaleString()}</Text>
            <Text className={styles.statLabel}>总支出</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>¥{settlementSummary.netProfit.toLocaleString()}</Text>
            <Text className={styles.statLabel}>净利润</Text>
          </View>
        </View>
      </View>

      <View className={styles.settlementEntry} onClick={() => handleMenuClick('settlement')}>
        <View className={styles.settlementInfo}>
          <Text className={styles.settlementTitle}>对账结算</Text>
          <Text className={styles.settlementDesc}>
            {settlementSummary.pendingCount} 笔待结算 · 查看工程结算明细
          </Text>
        </View>
        <Text className={styles.settlementArrow}>→</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>增值服务</Text>
        <View className={styles.menuCard}>
          {serviceMenus.map((item) => (
            <View 
              key={item.key} 
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.key)}
            >
              <View className={`${styles.menuIcon} ${styles[item.iconClass]}`}>
                <Text>{item.icon}</Text>
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuName}>{item.name}</Text>
                <Text className={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>工具管理</Text>
        <View className={styles.menuCard}>
          {toolMenus.map((item) => (
            <View 
              key={item.key} 
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.key)}
            >
              <View className={`${styles.menuIcon} ${styles[item.iconClass]}`}>
                <Text>{item.icon}</Text>
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuName}>{item.name}</Text>
                <Text className={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default MinePage;
