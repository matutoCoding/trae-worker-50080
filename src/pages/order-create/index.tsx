import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { tombstoneList } from '@/data/tombstones';
import { fontList } from '@/data/fonts';
import { cemeteryList } from '@/data/installations';
import { useOrderStore } from '@/store/orders';
import { useTypesettingStore } from '@/store/typesetting';
import { FeeDetail } from '@/types';
import styles from './index.module.scss';

const PORCELAIN_OPTIONS = [
  { id: 'none', name: '不需要', price: 0 },
  { id: '3寸', name: '3寸瓷像', price: 200 },
  { id: '4寸', name: '4寸瓷像', price: 300 },
  { id: '5寸', name: '5寸瓷像', price: 400 },
  { id: '6寸', name: '6寸瓷像', price: 500 }
];

const URGENT_OPTIONS = [
  { id: 'normal', name: '正常工期（7-10天）', price: 0 },
  { id: 'urgent', name: '加急（3-5天）', price: 500 },
  { id: 'super', name: '特急（1-2天）', price: 1000 }
];

const INSTALL_OPTIONS = [
  { id: 'none', name: '不需要安装', price: 0 },
  { id: 'basic', name: '基础安装', price: 800 },
  { id: 'standard', name: '标准安装', price: 1200 },
  { id: 'premium', name: '豪华安装（含基座）', price: 2500 }
];

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

  const [tombstonePrice, setTombstonePrice] = useState<number>(
    storeTombstonePrice || 0
  );
  const finalTombstoneId = preTombstoneId || storeTombstoneId;
  const selectedTombstone = tombstoneList.find(t => t.id === finalTombstoneId);
  
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [tombstoneName, setTombstoneName] = useState<string>(
    selectedTombstone?.name || storeTombstoneName || ''
  );
  const [tombstoneImage, setTombstoneImage] = useState<string>(
    selectedTombstone?.image || storeTombstoneImage || ''
  );
  const [fontId, setFontId] = useState<string>(selectedFontId);
  const [fontName, setFontName] = useState<string>(selectedFontName);
  const [inscriptionText, setInscriptionText] = useState<string>(
    [mainText, subText].filter(Boolean).join('\n')
  );
  
  const [porcelainId, setPorcelainId] = useState<string>('none');
  const [urgentId, setUrgentId] = useState<string>('normal');
  const [installId, setInstallId] = useState<string>('none');
  const [cemetery, setCemetery] = useState<string>('');
  const [otherFee, setOtherFee] = useState<string>('0');
  const [remarks, setRemarks] = useState<string>('');

  useDidShow(() => {
    console.log('[OrderCreatePage] 页面显示，墓碑ID:', finalTombstoneId);
    if (selectedTombstone) {
      setTombstoneName(selectedTombstone.name);
      setTombstoneImage(selectedTombstone.image);
      setTombstonePrice(selectedTombstone.price);
    }
    setFontName(selectedFontName);
    setFontId(selectedFontId);
    setInscriptionText([mainText, subText].filter(Boolean).join('\n'));
  });

  const porcelain = PORCELAIN_OPTIONS.find(p => p.id === porcelainId) || PORCELAIN_OPTIONS[0];
  const urgent = URGENT_OPTIONS.find(u => u.id === urgentId) || URGENT_OPTIONS[0];
  const install = INSTALL_OPTIONS.find(i => i.id === installId) || INSTALL_OPTIONS[0];
  const font = fontList.find(f => f.id === fontId || f.name === fontName);
  const fontPrice = font?.price || 0;
  const otherFeeNum = Number(otherFee) || 0;

  const feeDetails: FeeDetail[] = useMemo(() => {
    const details: FeeDetail[] = [];
    if (tombstonePrice > 0) {
      details.push({ name: '墓碑费用', amount: tombstonePrice, remark: tombstoneName });
    }
    if (fontPrice > 0) {
      details.push({ name: '字体费用', amount: fontPrice, remark: fontName });
    }
    if (porcelain.price > 0) {
      details.push({ name: '瓷像费用', amount: porcelain.price, remark: porcelain.name });
    }
    if (urgent.price > 0) {
      details.push({ name: '加急费用', amount: urgent.price, remark: urgent.name });
    }
    if (install.price > 0) {
      details.push({ name: '安装服务', amount: install.price, remark: install.name + (cemetery ? `（${cemetery}）` : '') });
    }
    if (otherFeeNum > 0) {
      details.push({ name: '其他费用', amount: otherFeeNum });
    }
    return details;
  }, [tombstonePrice, tombstoneName, fontPrice, fontName, porcelain, urgent, install, cemetery, otherFeeNum]);

  const totalAmount = useMemo(() => {
    return tombstonePrice + fontPrice + porcelain.price + urgent.price + install.price + otherFeeNum;
  }, [tombstonePrice, fontPrice, porcelain.price, urgent.price, install.price, otherFeeNum]);

  const validateForm = (): string | null => {
    if (!customerName.trim()) return '请输入客户姓名';
    if (!customerPhone.trim()) return '请输入联系电话';
    if (!/^1[3-9]\d{9}$/.test(customerPhone) && customerPhone.length < 7) {
      return '请输入有效的联系电话';
    }
    if (!tombstoneName.trim()) return '请选择碑型';
    if (!fontName.trim()) return '请选择字体';
    if (!inscriptionText.trim()) return '请输入碑文内容';
    if (totalAmount <= 0) return '订单金额必须大于0';
    if (installId !== 'none' && !cemetery) return '请选择安装墓园';
    return null;
  };

  const handleSelectTombstone = () => {
    console.log('[OrderCreatePage] 选择碑型');
    Taro.showActionSheet({
      itemList: tombstoneList.map(t => `${t.name} - ¥${t.price.toLocaleString()}`),
      success: (res) => {
        const tomb = tombstoneList[res.tapIndex];
        setTombstoneName(tomb.name);
        setTombstoneImage(tomb.image);
        setTombstonePrice(tomb.price);
      }
    });
  };

  const handleSelectFont = () => {
    console.log('[OrderCreatePage] 选择字体');
    Taro.showActionSheet({
      itemList: fontList.map(f => `${f.name}${f.price > 0 ? ` (+¥${f.price})` : ' (免费)'}`),
      success: (res) => {
        const f = fontList[res.tapIndex];
        setFontId(f.id);
        setFontName(f.name);
      }
    });
  };

  const handleSelectPorcelain = () => {
    Taro.showActionSheet({
      itemList: PORCELAIN_OPTIONS.map(p => p.price > 0 ? `${p.name} (+¥${p.price})` : p.name),
      success: (res) => {
        setPorcelainId(PORCELAIN_OPTIONS[res.tapIndex].id);
      }
    });
  };

  const handleSelectUrgent = () => {
    Taro.showActionSheet({
      itemList: URGENT_OPTIONS.map(u => u.price > 0 ? `${u.name} (+¥${u.price})` : u.name),
      success: (res) => {
        setUrgentId(URGENT_OPTIONS[res.tapIndex].id);
      }
    });
  };

  const handleSelectInstall = () => {
    Taro.showActionSheet({
      itemList: INSTALL_OPTIONS.map(i => i.price > 0 ? `${i.name} (+¥${i.price})` : i.name),
      success: (res) => {
        setInstallId(INSTALL_OPTIONS[res.tapIndex].id);
      }
    });
  };

  const handleSelectCemetery = () => {
    Taro.showActionSheet({
      itemList: cemeteryList.map(c => c.name),
      success: (res) => {
        setCemetery(cemeteryList[res.tapIndex].name);
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

    const porcelainPhoto = porcelainId !== 'none';

    const newOrder = addOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      tombstoneName: tombstoneName.trim(),
      tombstoneImage: tombstoneImage,
      fontName: fontName.trim(),
      inscriptionText: inscriptionText.trim(),
      amount: totalAmount,
      feeDetails,
      porcelainPhoto,
      porcelainPhotoSize: porcelainPhoto ? porcelain.name : undefined,
      urgent: urgentId !== 'normal',
      installService: installId !== 'none',
      cemetery: installId !== 'none' ? cemetery : undefined,
      remarks: remarks.trim() || undefined
    });

    console.log('[OrderCreatePage] 订单创建成功:', newOrder.orderNo, '金额:', totalAmount);
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
                  <Text className={styles.tombstoneDesc}>¥{tombstonePrice.toLocaleString()} · 点击更换</Text>
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
                <Text className={styles.formValue}>
                  {fontName}{fontPrice > 0 ? ` (+¥${fontPrice})` : ' (免费)'}
                </Text>
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
        <Text className={styles.sectionTitle}>增值服务</Text>
        <View className={styles.formCard}>
          <View className={styles.formItem} onClick={handleSelectPorcelain}>
            <Text className={styles.formLabel}>照片瓷像</Text>
            <View className={styles.formInputWrap}>
              <Text className={styles.formValue}>
                {porcelain.name}{porcelain.price > 0 ? ` (+¥${porcelain.price})` : ''}
              </Text>
              <Text className={styles.formArrow}>›</Text>
            </View>
          </View>
          <View className={styles.formItem} onClick={handleSelectUrgent}>
            <Text className={styles.formLabel}>工期选择</Text>
            <View className={styles.formInputWrap}>
              <Text className={styles.formValue}>
                {urgent.name}{urgent.price > 0 ? ` (+¥${urgent.price})` : ''}
              </Text>
              <Text className={styles.formArrow}>›</Text>
            </View>
          </View>
          <View className={styles.formItem} onClick={handleSelectInstall}>
            <Text className={styles.formLabel}>安装服务</Text>
            <View className={styles.formInputWrap}>
              <Text className={styles.formValue}>
                {install.name}{install.price > 0 ? ` (+¥${install.price})` : ''}
              </Text>
              <Text className={styles.formArrow}>›</Text>
            </View>
          </View>
          {installId !== 'none' && (
            <View className={styles.formItem} onClick={handleSelectCemetery}>
              <Text className={styles.formLabel}>
                <Text className={styles.formRequired}>*</Text>安装墓园
              </Text>
              <View className={styles.formInputWrap}>
                {cemetery ? (
                  <Text className={styles.formValue}>{cemetery}</Text>
                ) : (
                  <Text className={styles.formPlaceholder}>请选择墓园</Text>
                )}
                <Text className={styles.formArrow}>›</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>费用明细</Text>
        <View className={styles.summaryCard}>
          {feeDetails.length === 0 ? (
            <View className={styles.summaryEmpty}>
              <Text>请选择碑型和服务以查看费用明细</Text>
            </View>
          ) : (
            feeDetails.map((item, idx) => (
              <View key={idx} className={styles.summaryRow}>
                <View className={styles.summaryLabelWrap}>
                  <Text className={styles.summaryLabel}>{item.name}</Text>
                  {item.remark && <Text className={styles.summaryRemark}>{item.remark}</Text>}
                </View>
                <Text className={styles.summaryValue}>¥{item.amount.toLocaleString()}</Text>
              </View>
            ))
          )}
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>其他费用（可编辑）</Text>
            <View className={styles.otherFeeInput}>
              <Text style={{ fontSize: 24, color: '#999' }}>¥</Text>
              <Input
                type='digit'
                value={otherFee}
                onInput={(e) => setOtherFee(e.detail.value)}
                className={styles.amountInput}
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
          <Text>创建订单 ¥{totalAmount.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderCreatePage;
