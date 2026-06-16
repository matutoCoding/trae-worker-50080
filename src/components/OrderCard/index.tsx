import React, { useState, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Order, ORDER_STATUS_MAP, FeeDetail } from '@/types';
import StatusTag from '@/components/StatusTag';
import { fontList } from '@/data/fonts';
import styles from './index.module.scss';

interface OrderCardProps {
  data: Order;
  onClick?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ data, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = ORDER_STATUS_MAP[data.status];

  const handleClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/order-detail/index?id=${data.id}`
      });
    }
  };

  const feeDetails = useMemo<FeeDetail[]>(() => {
    if (data.feeDetails && data.feeDetails.length > 0) {
      return data.feeDetails;
    }
    const details: FeeDetail[] = [];
    const font = fontList.find(f => f.name === data.fontName);
    const fontPrice = font?.price || 0;
    const tombPrice = Math.max(0, data.amount - fontPrice);
    if (tombPrice > 0) {
      details.push({ name: '墓碑费用', amount: tombPrice, remark: data.tombstoneName });
    }
    if (fontPrice > 0) {
      details.push({ name: '字体费用', amount: fontPrice, remark: data.fontName });
    }
    return details;
  }, [data]);

  return (
    <View className={styles.card} onClick={handleCardClick}>
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
          {data.urgent && (
            <Text className={styles.urgentTag}>🔥 加急</Text>
          )}
        </View>
      </View>
      
      {expanded && (
        <View className={styles.feeSection}>
          <View className={styles.feeDivider} />
          <View className={styles.feeTitle}>
            <Text>费用明细</Text>
          </View>
          {feeDetails.map((f, idx) => (
            <View key={idx} className={styles.feeRow}>
              <View className={styles.feeLabelWrap}>
                <Text className={styles.feeLabel}>{f.name}</Text>
                {f.remark && <Text className={styles.feeRemark}>{f.remark}</Text>}
              </View>
              <Text className={styles.feeAmount}>¥{f.amount.toLocaleString()}</Text>
            </View>
          ))}
          <View className={styles.feeTotalRow}>
            <Text className={styles.feeTotalLabel}>订单总额</Text>
            <Text className={styles.feeTotalAmount}>¥{data.amount.toLocaleString()}</Text>
          </View>
        </View>
      )}
      
      <View className={styles.footer}>
        <View className={styles.footerLeft}>
          <Text className={styles.createTime}>{data.createTime}</Text>
        </View>
        <View className={styles.footerRight}>
          <View className={styles.expandBtn} onClick={handleClick}>
            <Text className={styles.expandText}>{expanded ? '收起明细' : '查看明细'}</Text>
            <Text className={styles.expandArrow}>{expanded ? '▲' : '▼'}</Text>
          </View>
          <View className={styles.amount}>
            <Text className={styles.amountLabel}>金额</Text>
            <Text className={styles.amountValue}>¥{data.amount.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderCard;
