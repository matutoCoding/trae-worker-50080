import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';

const PorcelainPhotoPage: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string>('4寸');
  const [selectedShape, setSelectedShape] = useState<string>('oval');
  const [selectedColor, setSelectedColor] = useState<string>('color');

  useDidShow(() => {
    console.log('[PorcelainPhotoPage] 页面显示');
  });

  const sizes = [
    { name: '3寸', spec: '7.5×5.5cm', price: 180, icon: '📷' },
    { name: '4寸', spec: '10×7.5cm', price: 280, icon: '📷' },
    { name: '5寸', spec: '12.5×9cm', price: 380, icon: '📷' },
    { name: '6寸', spec: '15×11cm', price: 480, icon: '📷' },
    { name: '7寸', spec: '17.5×13cm', price: 580, icon: '📷' },
    { name: '8寸', spec: '20×15cm', price: 680, icon: '📷' }
  ];

  const shapes = [
    { key: 'oval', name: '椭圆形', icon: '⭕' },
    { key: 'square', name: '长方形', icon: '⬜' }
  ];

  const colors = [
    { key: 'color', name: '彩色' },
    { key: 'black', name: '黑白' }
  ];

  const getCurrentPrice = () => {
    const size = sizes.find(s => s.name === selectedSize);
    return size ? size.price : 0;
  };

  const handleUpload = () => {
    console.log('[PorcelainPhotoPage] 上传照片');
    Taro.showToast({ title: '选择照片', icon: 'none' });
  };

  const handleSubmit = () => {
    console.log('[PorcelainPhotoPage] 提交定制');
    Taro.showToast({ title: '提交成功', icon: 'success' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.banner}>
        <Text className={styles.bannerTitle}>照片瓷像定制</Text>
        <Text className={styles.bannerDesc}>高温烧制，永久保存</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>上传照片</Text>
        <View className={styles.uploadArea} onClick={handleUpload}>
          <Text className={styles.uploadIcon}>📸</Text>
          <Text className={styles.uploadText}>点击上传照片</Text>
          <Text className={styles.uploadHint}>支持JPG、PNG格式，建议清晰度高的正面照</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>选择尺寸</Text>
        <View className={styles.sizeGrid}>
          {sizes.map((size) => (
            <View 
              key={size.name}
              className={`${styles.sizeCard} ${selectedSize === size.name ? styles.active : ''}`}
              onClick={() => setSelectedSize(size.name)}
            >
              <View className={styles.sizeIcon}>
                <Text>{size.icon}</Text>
              </View>
              <Text className={styles.sizeName}>{size.name}</Text>
              <Text className={styles.sizeSpec}>{size.spec}</Text>
              <Text className={styles.sizePrice}>¥{size.price}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>瓷像形状</Text>
        <View className={styles.shapeRow}>
          {shapes.map((shape) => (
            <View 
              key={shape.key}
              className={`${styles.shapeItem} ${selectedShape === shape.key ? styles.active : ''}`}
              onClick={() => setSelectedShape(shape.key)}
            >
              <View className={`${styles.shapeIcon} ${styles[shape.key]}`}>
                <Text>{shape.icon}</Text>
              </View>
              <Text className={styles.shapeName}>{shape.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>瓷像颜色</Text>
        <View className={styles.colorRow}>
          {colors.map((color) => (
            <View 
              key={color.key}
              className={`${styles.colorItem} ${selectedColor === color.key ? styles.active : ''}`}
              onClick={() => setSelectedColor(color.key)}
            >
              <View className={`${styles.colorPreview} ${styles[color.key]}`} />
              <Text className={styles.colorName}>{color.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>价格明细</Text>
        <View className={styles.infoCard}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>瓷像尺寸</Text>
            <Text className={styles.infoValue}>{selectedSize}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>瓷像形状</Text>
            <Text className={styles.infoValue}>{selectedShape === 'oval' ? '椭圆形' : '长方形'}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>瓷像颜色</Text>
            <Text className={styles.infoValue}>{selectedColor === 'color' ? '彩色' : '黑白'}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>制作周期</Text>
            <Text className={styles.infoValue}>7-10个工作日</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>合计金额</Text>
            <Text className={styles.totalPrice}>¥{getCurrentPrice()}</Text>
          </View>
        </View>
      </View>

      <View className={styles.actionBar}>
        <View className={styles.priceInfo}>
          <Text className={styles.priceLabel}>定制费用</Text>
          <Text className={styles.priceValue}>¥{getCurrentPrice()}</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text>提交定制</Text>
        </View>
      </View>
    </View>
  );
};

export default PorcelainPhotoPage;
