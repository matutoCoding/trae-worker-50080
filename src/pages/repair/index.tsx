import React, { useState, useMemo } from 'react';
import { View, Text, Textarea, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { cemeteryList } from '@/data/installations';
import { useRepairStore, RepairRecord } from '@/store/repair';
import styles from './index.module.scss';

const RepairPage: React.FC = () => {
  const { records, addRecord } = useRepairStore();
  
  const [serviceType, setServiceType] = useState<string>('');
  const [cemetery, setCemetery] = useState<string>('');
  const [cemeteryAddress, setCemeteryAddress] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [description, setDescription] = useState<string>('');

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

  const statusLabelMap: Record<string, { label: string; color: string }> = {
    pending: { label: '待确认', color: '#f39c12' },
    confirmed: { label: '已确认', color: '#3498db' },
    completed: { label: '已完成', color: '#27ae60' },
    cancelled: { label: '已取消', color: '#95a5a6' }
  };

  useDidShow(() => {
    console.log('[RepairPage] 页面显示，预约记录数:', records.length);
  });

  const validateForm = (): string | null => {
    if (!serviceType) return '请选择服务类型';
    if (!cemetery) return '请选择墓园位置';
    if (!appointmentDate) return '请选择预约日期';
    if (!contactName.trim()) return '请填写联系人姓名';
    if (!contactPhone.trim()) return '请填写联系电话';
    if (!/^1[3-9]\d{9}$/.test(contactPhone) && contactPhone.length < 7) {
      return '请输入有效的联系电话';
    }
    if (!description.trim()) return '请填写损坏情况描述';
    return null;
  };

  const resetForm = () => {
    setServiceType('');
    setCemetery('');
    setCemeteryAddress('');
    setAppointmentDate('');
    setContactName('');
    setContactPhone('');
    setDescription('');
  };

  const handleServiceClick = (service: any) => {
    console.log('[RepairPage] 选择服务:', service.name);
    setServiceType(service.name);
    Taro.showToast({ title: `已选择：${service.name}`, icon: 'none' });
  };

  const handleSelectService = () => {
    Taro.showActionSheet({
      itemList: services.map(s => s.name),
      success: (res) => {
        setServiceType(services[res.tapIndex].name);
      }
    });
  };

  const handleSelectCemetery = () => {
    Taro.showActionSheet({
      itemList: cemeteryList.map(c => c.name),
      success: (res) => {
        const selected = cemeteryList[res.tapIndex];
        setCemetery(selected.name);
        setCemeteryAddress(selected.address);
      }
    });
  };

  const handleSelectDate = () => {
    const today = new Date();
    const dates: string[] = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    Taro.showActionSheet({
      itemList: dates,
      success: (res) => {
        setAppointmentDate(dates[res.tapIndex]);
      }
    });
  };

  const handleSubmit = () => {
    console.log('[RepairPage] 提交预约');
    const error = validateForm();
    if (error) {
      Taro.showModal({
        title: '提示',
        content: error,
        showCancel: false,
        confirmText: '好的'
      });
      return;
    }

    const newRecord = addRecord({
      serviceType,
      cemetery,
      cemeteryAddress,
      appointmentDate,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      description: description.trim()
    });

    console.log('[RepairPage] 预约创建成功:', newRecord.id);
    Taro.showToast({ title: '预约提交成功', icon: 'success' });
    resetForm();
    
    setTimeout(() => {
      Taro.pageScrollTo({ scrollTop: 0, duration: 300 });
    }, 500);
  };

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => 
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
  }, [records]);

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
            className={`${styles.serviceCard} ${serviceType === service.name ? styles.serviceCardActive : ''}`}
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

      {sortedRecords.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>我的预约（{sortedRecords.length}）</Text>
          <View className={styles.recordList}>
            {sortedRecords.map((record: RepairRecord) => {
              const statusInfo = statusLabelMap[record.status];
              return (
                <View key={record.id} className={styles.recordCard}>
                  <View className={styles.recordHeader}>
                    <Text className={styles.recordService}>{record.serviceType}</Text>
                    <View 
                      className={styles.recordStatus}
                      style={{ background: `${statusInfo.color}15`, color: statusInfo.color }}
                    >
                      <Text>{statusInfo.label}</Text>
                    </View>
                  </View>
                  <View className={styles.recordBody}>
                    <View className={styles.recordInfo}>
                      <Text className={styles.recordInfoLabel}>墓园：</Text>
                      <Text className={styles.recordInfoText}>{record.cemetery}</Text>
                    </View>
                    <View className={styles.recordInfo}>
                      <Text className={styles.recordInfoLabel}>日期：</Text>
                      <Text className={styles.recordInfoText}>{record.appointmentDate}</Text>
                    </View>
                    <View className={styles.recordInfo}>
                      <Text className={styles.recordInfoLabel}>联系人：</Text>
                      <Text className={styles.recordInfoText}>
                        {record.contactName} {record.contactPhone}
                      </Text>
                    </View>
                    <View className={styles.recordInfo}>
                      <Text className={styles.recordInfoLabel}>描述：</Text>
                      <Text className={styles.recordInfoText}>{record.description}</Text>
                    </View>
                  </View>
                  <View className={styles.recordFooter}>
                    <Text className={styles.recordTime}>{record.createTime}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预约维修</Text>
        <View className={styles.formCard}>
          <View className={styles.formItem} onClick={handleSelectService}>
            <Text className={styles.formLabel}>
              <Text className={styles.formRequired}>*</Text>服务类型
            </Text>
            <View className={styles.formValueWrap}>
              {serviceType ? (
                <Text className={styles.formValue}>{serviceType}</Text>
              ) : (
                <Text className={styles.formPlaceholder}>请选择服务类型</Text>
              )}
              <Text className={styles.formArrow}>›</Text>
            </View>
          </View>
          <View className={styles.formItem} onClick={handleSelectCemetery}>
            <Text className={styles.formLabel}>
              <Text className={styles.formRequired}>*</Text>墓园位置
            </Text>
            <View className={styles.formValueWrap}>
              {cemetery ? (
                <Text className={styles.formValue}>{cemetery}</Text>
              ) : (
                <Text className={styles.formPlaceholder}>请选择墓园</Text>
              )}
              <Text className={styles.formArrow}>›</Text>
            </View>
          </View>
          <View className={styles.formItem} onClick={handleSelectDate}>
            <Text className={styles.formLabel}>
              <Text className={styles.formRequired}>*</Text>预约日期
            </Text>
            <View className={styles.formValueWrap}>
              {appointmentDate ? (
                <Text className={styles.formValue}>{appointmentDate}</Text>
              ) : (
                <Text className={styles.formPlaceholder}>请选择日期</Text>
              )}
              <Text className={styles.formArrow}>›</Text>
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.formRequired}>*</Text>联系人
            </Text>
            <View className={styles.formValueWrap}>
              <Input
                className={styles.formInput}
                placeholder='请填写联系人姓名'
                value={contactName}
                onInput={(e) => setContactName(e.detail.value)}
              />
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.formRequired}>*</Text>联系电话
            </Text>
            <View className={styles.formValueWrap}>
              <Input
                className={styles.formInput}
                type='number'
                placeholder='请填写联系电话'
                value={contactPhone}
                onInput={(e) => setContactPhone(e.detail.value)}
                maxlength={11}
              />
            </View>
          </View>
          <View className={styles.textareaItem}>
            <Text className={styles.textareaLabel}>
              <Text className={styles.formRequired}>*</Text>损坏描述
            </Text>
            <Textarea
              className={styles.textarea}
              placeholder='请详细描述墓碑损坏情况，如位置、面积、损坏类型等...'
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={500}
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
