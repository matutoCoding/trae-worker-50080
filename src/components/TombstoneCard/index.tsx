import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Tombstone } from '@/types';
import styles from './index.module.scss';

interface TombstoneCardProps {
  data: Tombstone;
  onClick?: () => void;
}

const TombstoneCard: React.FC<TombstoneCardProps> = ({ data, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/tombstone-detail/index?id=${data.id}`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrapper}>
        <Image 
          className={styles.image} 
          src={data.image} 
          mode="aspectFill"
          lazyLoad
        />
        <View className={styles.materialTag}>
          <Text className={styles.materialText}>{data.material}</Text>
        </View>
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{data.name}</Text>
        <View className={styles.specs}>
          {data.specs.slice(0, 2).map((spec, index) => (
            <Text key={index} className={styles.specItem}>{spec}</Text>
          ))}
        </View>
        <View className={styles.footer}>
          <View className={styles.price}>
            <Text className={styles.priceSymbol}>¥</Text>
            <Text className={styles.priceNum}>{data.price}</Text>
          </View>
          <View className={styles.more}>
            <Text className={styles.moreText}>查看详情</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TombstoneCard;
