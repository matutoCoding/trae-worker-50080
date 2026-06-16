import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Order, ORDER_STATUS_MAP } from '@/types';
import StatusTag from '@/components/StatusTag';
import styles from './index.module.scss';

interface OrderCardProps {
  data: Order;
  onClick?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ data, onClick }) => {
  const statusInfo = ORDER_STATUS_MAP[data.status];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/order-detail/index?id=${data.id}`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Text className={styles.orderNo}>{data.orderNo}</Text>
        <StatusTag text={statusInfo.label} color={statusInfo.color} size="sm" />
      </View>
      
      <View className={styles.body}>
        <Image className={styles.image} src={data.tombstoneImage} mode="aspectFill" />
        <View className={styles.info}>
          <Text className={styles.tombstoneName}>{data.tombstoneName}</Text>
          <Text className={styles.customer}>客户：{data.customerName}</Text>
          <Text className={styles.font}>字体：{data.fontName}</Text>
          <View className={styles.inscriptionRow}>
            <Text className={styles.inscriptionLabel}>碑文：</Text>
            <Text className={styles.inscriptionText}>{data.inscriptionText}</Text>
          </View>
        </View>
      </View>
      
      <View className={styles.footer}>
        <Text className={styles.createTime}>{data.createTime}</Text>
        <View className={styles.amount}>
          <Text className={styles.amountLabel}>订单金额</Text>
          <Text className={styles.amountValue}>¥{data.amount}</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderCard;
