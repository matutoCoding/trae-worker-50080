import React, { useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { tombstones } from '@/data/tombstones';
import { fontList } from '@/data/fonts';
import { cemeteryList } from '@/data/installations';
import { useOrderStore } from '@/store/orders';
import { useTypesettingStore } from '@/store/typesetting';
import styles from './index.module.scss';

const OrderCreatePage: React.FC = () => {
  const router = useRouter();
  const preTombstoneId = router.params.tombstoneId || '';
  
  const addOrder = useOrderStore((s) => s.addOrder);
  const { 
    selectedFontId, 
    selectedFontName, 
    mainText, 
    subText,
    tombstoneId: storeTombstoneId,
    tombstoneName: storeTombstoneName,
    tombstonePrice: storeTombstonePrice,
    tombstoneImage: storeTombstoneImage
  } = useTypesettingStore();

  const finalTombstoneId = preTombstoneId || storeTombstoneId;
  const selectedTombstone = tombstones.find(t => t.id === finalTombstoneId);
  
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [tombstoneName, setTombstoneName] = useState<string>(
    selectedTombstone?.name || storeTombstoneName || ''
  );
  const [tombstoneImage, setTombstoneImage] = useState<string>(
    selectedTombstone?.image || storeTombstoneImage || ''
  );
  const [fontName, setFontName] = useState<string>(selectedFontName);
  const [inscriptionText, setInscriptionText] = useState<string>(
    [mainText, subText].filter(Boolean).join('\n')
  );
  const [amount, setAmount] = useState<string>(
    String(selectedTombstone?.price || storeTombstonePrice || 0)
  );
  const [remarks, setRemarks] = useState<string>('');

  useDidShow(() => {
    console.log('[OrderCreatePage] 页面显示，墓碑ID:', finalTombstoneId);
    if (selectedTombstone) {
      setTombstoneName(selectedTombstone.name);
      setTombstoneImage(selectedTombstone.image);
      setAmount(String(selectedTombstone.price));
    }
    setFontName(selectedFontName);
    setInscriptionText([mainText, subText].filter(Boolean).join('\n'));
  });

  const validateForm = (): string | null => {
    if (!customerName.trim()) return '请输入客户姓名';
    if (!customerPhone.trim()) return '请输入联系电话';
    if (!/^1[3-9]\d{9}$/.test(customerPhone) && customerPhone.length < 7) {
      return '请输入有效的联系电话';
    }
    if (!tombstoneName.trim()) return '请选择碑型';
    if (!fontName.trim()) return '请选择字体';
    if (!inscriptionText.trim()) return '请输入碑文内容';
    const amountNum = Number(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) return '请输入有效的订单金额';
    return null;
  };

  const handleSelectTombstone = () => {
    console.log('[OrderCreatePage] 选择碑型');
    Taro.showActionSheet({
      itemList: tombstones.map(t => `${t.name} - ¥${t.price}`),
      success: (res) => {
        const tomb = tombstones[res.tapIndex];
        setTombstoneName(tomb.name);
        setTombstoneImage(tomb.image);
        setAmount(String(tomb.price));
      }
    });
  };

  const handleSelectFont = () => {
    console.log('[OrderCreatePage] 选择字体');
    Taro.showActionSheet({
      itemList: fontList.map(f => `${f.name}${f.price > 0 ? ` (+¥${f.price})` : ' (免费)'}`),
      success: (res) => {
        const font = fontList[res.tapIndex];
        setFontName(font.name);
      }
    });
  };

  const handleSubmit = () => {
    console.log('[OrderCreatePage] 提交订单');
    const error = validateForm();
    if (error) {
      Taro.showToast({ title: error, icon: 'none' });
      return;
    }

    const newOrder = addOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      tombstoneName: tombstoneName.trim(),
      tombstoneImage: tombstoneImage,
      fontName: fontName.trim(),
      inscriptionText: inscriptionText.trim(),
      amount: Number(amount),
      remarks: remarks.trim() || undefined
    });

    console.log('[OrderCreatePage] 订单创建成功:', newOrder.orderNo);
    Taro.showToast({ title: '订单创建成功', icon: 'success' });
    setTimeout(() => {
      Taro.redirectTo({
        url: `/pages/order-detail/index?id=${newOrder.id}`
      });
    }, 1200);
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  const tombstonePrice = selectedTombstone?.price || storeTombstonePrice || Number(amount) || 0;
  const font = fontList.find(f => f.name === fontName);
  const fontPrice = font?.price || 0;
  const totalAmount = tombstonePrice + fontPrice;

  return (
    <View className={styles.page}>
      <View className={styles.headerBanner}>
        <Text className={styles.bannerTitle}>新建订单</Text>
        <Text className={styles.bannerDesc}>填写客户信息与碑刻内容</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>客户信息</Text>
        <View className={styles.formCard}>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.formRequired}>*</Text>客户姓名
            </Text>
            <View className={styles.formInputWrap}>
              <Input
                className={styles.formInput}
                placeholder='请输入客户姓名'
                value={customerName}
                onInput={(e) => setCustomerName(e.detail.value)}
              />
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.formRequired}>*</Text>联系电话
            </Text>
            <View className={styles.formInputWrap}>
              <Input
                className={styles.formInput}
                type='number'
                placeholder='请输入联系电话'
                value={customerPhone}
                onInput={(e) => setCustomerPhone(e.detail.value)}
                maxlength={11}
              />
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>碑刻信息</Text>
        <View className={styles.formCard}>
          <View className={styles.formItem} onClick={handleSelectTombstone}>
            <Text className={styles.formLabel}>
              <Text className={styles.formRequired}>*</Text>墓碑款式
            </Text>
            {tombstoneName ? (
              <View className={styles.tombstonePreview} style={{ justifyContent: 'flex-end', padding: 0 }}>
                <View className={styles.tombstoneInfo} style={{ flex: 'none', textAlign: 'right' }}>
                  <Text className={styles.tombstoneName}>{tombstoneName}</Text>
                  <Text className={styles.tombstoneDesc}>点击更换</Text>
                </View>
                <View className={styles.tombstoneIcon}>🪦</View>
                <Text className={styles.formArrow}>›</Text>
              </View>
            ) : (
              <View className={styles.formInputWrap}>
                <Text className={styles.formPlaceholder}>请选择碑型</Text>
                <Text className={styles.formArrow}>›</Text>
              </View>
            )}
          </View>
          <View className={styles.formItem} onClick={handleSelectFont}>
            <Text className={styles.formLabel}>
              <Text className={styles.formRequired}>*</Text>字体选择
            </Text>
            <View className={styles.formInputWrap}>
              {fontName ? (
                <Text className={styles.formValue}>{fontName}</Text>
              ) : (
                <Text className={styles.formPlaceholder}>请选择字体</Text>
              )}
              <Text className={styles.formArrow}>›</Text>
            </View>
          </View>
          <View className={styles.textareaItem}>
            <Text className={styles.textareaLabel}>
              <Text className={styles.formRequired}>*</Text>碑文内容
            </Text>
            <Textarea
              className={styles.textarea}
              placeholder='请输入碑文内容，包括主碑文和生卒日期等'
              value={inscriptionText}
              onInput={(e) => setInscriptionText(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>费用信息</Text>
        <View className={styles.summaryCard}>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>墓碑费用</Text>
            <Text className={styles.summaryValue}>¥{tombstonePrice.toLocaleString()}</Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>字体费用</Text>
            <Text className={styles.summaryValue}>{fontPrice > 0 ? `¥${fontPrice}` : '免费'}</Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>其他费用</Text>
            <View style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 24, color: '#999' }}>¥</Text>
              <Input
                type='digit'
                value={amount}
                onInput={(e) => setAmount(e.detail.value)}
                style={{ 
                  width: 120, 
                  fontSize: 28, 
                  color: '#2c3e50',
                  textAlign: 'right',
                  fontWeight: 500
                }}
              />
            </View>
          </View>
          <View className={styles.summaryTotal}>
            <Text className={styles.summaryTotalLabel}>订单总额</Text>
            <Text className={styles.summaryTotalValue}>
              ¥{totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>备注信息</Text>
        <View className={styles.formCard}>
          <View className={styles.textareaItem}>
            <Textarea
              className={styles.textarea}
              placeholder='选填：客户特殊要求、安装说明等...'
              value={remarks}
              onInput={(e) => setRemarks(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>
      </View>

      <View className={styles.actionBar}>
        <View className={`${styles.btn} ${styles.outline}`} onClick={handleCancel}>
          <Text>取消</Text>
        </View>
        <View className={`${styles.btn} ${styles.primary}`} onClick={handleSubmit}>
          <Text>创建订单</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderCreatePage;
