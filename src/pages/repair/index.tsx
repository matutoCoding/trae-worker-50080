import React, { useState } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';

const RepairPage: React.FC = () => {
  const [remark, setRemark] = useState<string>('');

  useDidShow(() => {
    console.log('[RepairPage] 页面显示');
  });

  const services = [
    { icon: '🔧', name: '碑文补刻', desc: '新增文字、补刻遗漏' },
    { icon: '🎨', name: '描金翻新', desc: '字迹重新描金上漆' },
    { icon: '💎', name: '石材抛光', desc: '表面抛光提亮增光' },
    { icon: '🧹', name: '清洁保养', desc: '深度清洁污渍去除' },
    { icon: '🪨', name: '裂缝修补', desc: '石材裂缝修复处理' },
    { icon: '⚒️', name: '底座加固', desc: '基础加固防倒处理' }
  ];

  const cases = [
    { title: '传统碑描金翻新', type: '描金翻新', price: 380, before: '🪨', after: '✨' },
    { title: '花岗岩碑抛光', type: '石材抛光', price: 280, before: '🪨', after: '💎' },
    { title: '家族墓碑文补刻', type: '碑文补刻', price: 580, before: '📜', after: '📝' }
  ];

  const handleServiceClick = (service: any) => {
    console.log('[RepairPage] 选择服务:', service.name);
    Taro.showToast({ title: `选择：${service.name}`, icon: 'none' });
  };

  const handleFormItemClick = (label: string) => {
    console.log('[RepairPage] 点击表单项:', label);
    Taro.showToast({ title: `选择${label}`, icon: 'none' });
  };

  const handleSubmit = () => {
    console.log('[RepairPage] 提交预约');
    if (!remark) {
      Taro.showToast({ title: '请描述损坏情况', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '提交成功', icon: 'success' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.banner}>
        <Text className={styles.bannerTitle}>墓碑修补翻新</Text>
        <Text className={styles.bannerDesc}>专业修复，焕然如新</Text>
      </View>

      <View className={styles.serviceGrid}>
        {services.map((service, index) => (
          <View 
            key={index}
            className={styles.serviceCard}
            onClick={() => handleServiceClick(service)}
          >
            <View className={styles.serviceIcon}>
              <Text>{service.icon}</Text>
            </View>
            <Text className={styles.serviceName}>{service.name}</Text>
            <Text className={styles.serviceDesc}>{service.desc}</Text>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>修复案例</Text>
        <View className={styles.caseList}>
          {cases.map((item, index) => (
            <View key={index} className={styles.caseCard}>
              <View className={styles.caseImages}>
                <View className={`${styles.caseImage} ${styles.before}`}>
                  <Text>{item.before}</Text>
                </View>
                <View className={`${styles.caseImage} ${styles.after}`}>
                  <Text>{item.after}</Text>
                </View>
              </View>
              <View className={styles.caseContent}>
                <Text className={styles.caseTitle}>{item.title}</Text>
                <View className={styles.caseInfo}>
                  <Text className={styles.caseType}>{item.type}</Text>
                  <Text className={styles.casePrice}>¥{item.price}起</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预约维修</Text>
        <View className={styles.formCard}>
          <View className={styles.formItem} onClick={() => handleFormItemClick('服务类型')}>
            <Text className={styles.formLabel}>服务类型</Text>
            <Text className={styles.formPlaceholder}>请选择服务类型</Text>
            <Text className={styles.formArrow}>›</Text>
          </View>
          <View className={styles.formItem} onClick={() => handleFormItemClick('墓园位置')}>
            <Text className={styles.formLabel}>墓园位置</Text>
            <Text className={styles.formPlaceholder}>请选择墓园</Text>
            <Text className={styles.formArrow}>›</Text>
          </View>
          <View className={styles.formItem} onClick={() => handleFormItemClick('预约日期')}>
            <Text className={styles.formLabel}>预约日期</Text>
            <Text className={styles.formPlaceholder}>请选择日期</Text>
            <Text className={styles.formArrow}>›</Text>
          </View>
          <View className={styles.formItem} onClick={() => handleFormItemClick('联系人')}>
            <Text className={styles.formLabel}>联系人</Text>
            <Text className={styles.formPlaceholder}>请填写联系人</Text>
            <Text className={styles.formArrow}>›</Text>
          </View>
          <View className={styles.formItem} onClick={() => handleFormItemClick('联系电话')}>
            <Text className={styles.formLabel}>联系电话</Text>
            <Text className={styles.formPlaceholder}>请填写电话</Text>
            <Text className={styles.formArrow}>›</Text>
          </View>
          <View className={styles.textareaItem}>
            <Text className={styles.textareaLabel}>损坏描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder='请详细描述墓碑损坏情况...'
              value={remark}
              onInput={(e) => setRemark(e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.submitBtn} onClick={handleSubmit}>
        <Text>提交预约</Text>
      </View>
    </View>
  );
};

export default RepairPage;
