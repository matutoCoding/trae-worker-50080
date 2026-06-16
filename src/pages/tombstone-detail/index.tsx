import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { getTombstoneById } from '@/data/tombstones';
import { Tombstone } from '@/types';
import styles from './index.module.scss';

const TombstoneDetailPage: React.FC = () => {
  const router = useRouter();
  const [tombstone, setTombstone] = useState<Tombstone | null>(null);

  useEffect(() => {
    const id = router.params.id;
    console.log('[TombstoneDetail] 碑型ID:', id);
    if (id) {
      const data = getTombstoneById(id as string);
      if (data) {
        setTombstone(data);
      }
    }
  }, [router.params.id]);

  const handleTypesetting = () => {
    Taro.navigateTo({ url: '/pages/typesetting/index' });
  };

  const handleOrder = () => {
    console.log('[TombstoneDetail] 立即下单');
    Taro.showToast({ title: '下单功能开发中', icon: 'none' });
  };

  if (!tombstone) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.imageSection}>
        <Image 
          className={styles.mainImage} 
          src={tombstone.image} 
          mode="aspectFill" 
        />
      </View>

      <View className={styles.infoCard}>
        <View className={styles.nameRow}>
          <Text className={styles.name}>{tombstone.name}</Text>
          <View className={styles.materialTag}>
            <Text className={styles.materialText}>{tombstone.material}</Text>
          </View>
        </View>

        <View className={styles.priceRow}>
          <Text className={styles.priceLabel}>参考价格</Text>
          <Text className={styles.priceSymbol}>¥</Text>
          <Text className={styles.priceValue}>{tombstone.price}</Text>
        </View>

        <View className={styles.specsSection}>
          <Text className={styles.sectionTitle}>规格参数</Text>
          <View className={styles.specsList}>
            {tombstone.specs.map((spec, index) => (
              <View key={index} className={styles.specItem}>
                <Text className={styles.specText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.descSection}>
          <Text className={styles.sectionTitle}>产品介绍</Text>
          <Text className={styles.descText}>{tombstone.description}</Text>
        </View>

        <View className={styles.featuresSection}>
          <Text className={styles.sectionTitle}>产品特点</Text>
          <View className={styles.featuresGrid}>
            {tombstone.features.map((feature, index) => (
              <View key={index} className={styles.featureItem}>
                <Text className={styles.featureIcon}>✓</Text>
                <Text className={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={handleTypesetting}>
          <Text>文字排版</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleOrder}>
          <Text>立即下单</Text>
        </View>
      </View>
    </View>
  );
};

export default TombstoneDetailPage;
