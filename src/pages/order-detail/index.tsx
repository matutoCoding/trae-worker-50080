import React, { useState } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { Order, ORDER_STATUS_MAP, ScheduleItem } from '@/types';
import StatusTag from '@/components/StatusTag';
import { useOrderStore } from '@/store/orders';
import { useScheduleStore } from '@/store/schedules';
import styles from './index.module.scss';

const MACHINE_OPERATORS = ['刻字机A', '刻字机B', '刻字机C'];
const MANUAL_OPERATORS = ['李师傅', '王师傅', '张师傅', '赵师傅', '孙师傅'];
const TIME_SLOTS = [
  { id: 'am1', label: '上午 08:00-11:30', start: '08:00', end: '11:30' },
  { id: 'pm1', label: '下午 13:00-17:00', start: '13:00', end: '17:00' },
  { id: 'full', label: '全天 08:00-17:00', start: '08:00', end: '17:00' },
  { id: 'custom', label: '傍晚 17:00-20:00', start: '17:00', end: '20:00' }
];

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderSchedules, setOrderSchedules] = useState<ScheduleItem[]>([]);
  
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const schedules = useScheduleStore((s) => s.schedules);
  const addSchedule = useScheduleStore((s) => s.addSchedule);
  const getSchedulesByOrderId = useScheduleStore((s) => s.getSchedulesByOrderId);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleType, setScheduleType] = useState<'machine' | 'manual'>('machine');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTimeSlot, setScheduleTimeSlot] = useState<string>('');
  const [scheduleOperator, setScheduleOperator] = useState<string>('');
  const [scheduleRemark, setScheduleRemark] = useState<string>('');

  useDidShow(() => {
    const id = router.params.id;
    console.log('[OrderDetail] 订单ID:', id);
    if (id) {
      refreshData(id as string);
    }
  });

  const refreshData = (id: string) => {
    const data = getOrderById(id);
    if (data) {
      setOrder(data);
      setOrderSchedules(getSchedulesByOrderId(id));
    } else {
      console.log('[OrderDetail] 未找到订单，id:', id);
    }
  };

  const handleGoSchedule = () => {
    Taro.navigateTo({ url: '/pages/schedule/index' });
  };

  const handleConfirmOrder = () => {
    if (!order) return;
    const updated = updateOrderStatus(order.id, 'confirmed');
    if (updated) {
      setOrder(updated);
      Taro.showToast({ title: '订单已确认', icon: 'success' });
    }
  };

  const handleStartEngraving = () => {
    if (!order) return;
    const updated = updateOrderStatus(order.id, 'engraving');
    if (updated) {
      setOrder(updated);
      Taro.showToast({ title: '已开始刻制', icon: 'success' });
    }
  };

  const handleComplete = () => {
    if (!order) return;
    const updated = updateOrderStatus(order.id, 'completed');
    if (updated) {
      setOrder(updated);
      Taro.showToast({ title: '订单已完成', icon: 'success' });
    }
  };

  const handleContact = () => {
    console.log('[OrderDetail] 联系客户');
    if (order) {
      Taro.makePhoneCall({ phoneNumber: order.customerPhone.replace(/\*/g, '0') })
        .catch(() => Taro.showToast({ title: '拨打失败', icon: 'none' }));
    }
  };

  const handleOpenScheduleForm = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduleDate(tomorrow.toISOString().split('T')[0]);
    setScheduleTimeSlot('am1');
    setScheduleOperator(scheduleType === 'machine' ? MACHINE_OPERATORS[0] : MANUAL_OPERATORS[0]);
    setScheduleRemark('');
    setShowScheduleForm(true);
  };

  const handleScheduleTypeChange = (type: 'machine' | 'manual') => {
    setScheduleType(type);
    setScheduleOperator(type === 'machine' ? MACHINE_OPERATORS[0] : MANUAL_OPERATORS[0]);
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
      success: (res) => setScheduleDate(dates[res.tapIndex])
    });
  };

  const handleSelectTimeSlot = () => {
    Taro.showActionSheet({
      itemList: TIME_SLOTS.map(t => t.label),
      success: (res) => setScheduleTimeSlot(TIME_SLOTS[res.tapIndex].id)
    });
  };

  const handleSelectOperator = () => {
    const operators = scheduleType === 'machine' ? MACHINE_OPERATORS : MANUAL_OPERATORS;
    Taro.showActionSheet({
      itemList: operators,
      success: (res) => setScheduleOperator(operators[res.tapIndex])
    });
  };

  const validateSchedule = (): string | null => {
    if (!scheduleDate) return '请选择日期';
    if (!scheduleTimeSlot) return '请选择时段';
    if (!scheduleOperator) return '请选择师傅/机器';
    return null;
  };

  const handleSubmitSchedule = () => {
    if (!order) return;
    const err = validateSchedule();
    if (err) {
      Taro.showToast({ title: err, icon: 'none' });
      return;
    }
    const timeSlot = TIME_SLOTS.find(t => t.id === scheduleTimeSlot) || TIME_SLOTS[0];
    const typeLabel = scheduleType === 'machine' ? '机刻' : '手刻';
    const defaultRemark = scheduleRemark.trim();
    const content = defaultRemark || `${order.tombstoneName} - ${typeLabel}刻制`;

    addSchedule({
      orderId: order.id,
      orderNo: order.orderNo,
      type: scheduleType,
      content,
      date: scheduleDate,
      startTime: timeSlot.start,
      endTime: timeSlot.end,
      operator: scheduleOperator,
      status: 'waiting'
    });

    if (order.status === 'pending' || order.status === 'confirmed') {
      const updated = updateOrderStatus(order.id, 'engraving');
      if (updated) setOrder(updated);
    }

    setShowScheduleForm(false);
    refreshData(order.id);
    Taro.showToast({ title: '排期已安排', icon: 'success' });
  };

  if (!order) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  const statusInfo = ORDER_STATUS_MAP[order.status];

  const getTimelineTime = (title: string): string => {
    if (title === '订单创建') return order.createTime;
    if (title === '订单确认') return order.status !== 'pending' ? '已确认' : '待确认';
    if (title === '开始刻制') {
      if (order.engravingStartTime) return order.engravingStartTime;
      return orderSchedules.length > 0 ? `${orderSchedules[0].date} ${orderSchedules[0].startTime}` : '待排期';
    }
    if (title === '刻制完成') {
      if (order.engravingCompleteTime) return order.engravingCompleteTime;
      const allDone = orderSchedules.length > 0 && orderSchedules.every(s => s.status === 'completed');
      if (allDone) return '已完成';
      return '-';
    }
    if (title === '已交付') return order.status === 'delivered' ? '已交付' : '-';
    return '-';
  };

  const getTimelineActive = (title: string): boolean => {
    if (title === '订单创建') return true;
    if (title === '订单确认') return order.status !== 'pending';
    if (title === '开始刻制') return orderSchedules.length > 0 || order.status === 'engraving' || order.status === 'completed' || order.status === 'delivered';
    if (title === '刻制完成') {
      const allDone = orderSchedules.length > 0 && orderSchedules.every(s => s.status === 'completed');
      return allDone || order.status === 'completed' || order.status === 'delivered';
    }
    if (title === '已交付') return order.status === 'delivered';
    return false;
  };

  const timelineData = [
    { title: '订单创建' },
    { title: '订单确认' },
    { title: '开始刻制' },
    { title: '刻制完成' },
    { title: '已交付' }
  ].map(t => ({ ...t, time: getTimelineTime(t.title), active: getTimelineActive(t.title) }));

  const getTypeLabel = (t: string) => t === 'machine' ? '机刻' : '手刻';
  const getStatusLabel = (s: string) => ({ waiting: '等待中', processing: '进行中', completed: '已完成' }[s] || s);

  return (
    <View className={styles.page}>
      <View className={styles.statusHeader}>
        <Text className={styles.statusText}>{statusInfo.label}</Text>
        <Text className={styles.statusDesc}>订单号：{order.orderNo}</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>碑型信息</Text>
        <View className={styles.tombstoneInfo}>
          <Image className={styles.tombstoneImage} src={order.tombstoneImage} mode="aspectFill" />
          <View className={styles.tombstoneDetail}>
            <Text className={styles.tombstoneName}>{order.tombstoneName}</Text>
            <Text className={styles.tombstoneSpec}>字体：{order.fontName}</Text>
            <Text className={styles.tombstoneSpec}>碑文：{order.inscriptionText}</Text>
            {order.porcelainPhoto && <Text className={styles.tombstoneSpec}>瓷像：{order.porcelainPhotoSize || '含瓷像'}</Text>}
            {order.urgent && <Text className={styles.tombstoneSpec} style={{ color: '#e74c3c' }}>加急处理</Text>}
            {order.installService && <Text className={styles.tombstoneSpec}>安装服务{order.cemetery ? `（${order.cemetery}）` : ''}</Text>}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>客户信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>客户姓名</Text>
          <Text className={styles.infoValue}>{order.customerName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>联系电话</Text>
          <Text className={styles.infoValue}>{order.customerPhone}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>费用明细</Text>
        {order.feeDetails && order.feeDetails.length > 0 ? (
          <View className={styles.feeCard}>
            {order.feeDetails.map((f, idx) => (
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
              <Text className={styles.feeTotalAmount}>¥{order.amount.toLocaleString()}</Text>
            </View>
          </View>
        ) : (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>订单金额</Text>
            <Text className={styles.infoValue} style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: 32 }}>
              ¥{order.amount.toLocaleString()}
            </Text>
          </View>
        )}
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>创建时间</Text>
          <Text className={styles.infoValue}>{order.createTime}</Text>
        </View>
        {order.remarks && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>备注</Text>
            <Text className={styles.infoValue}>{order.remarks}</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Text className={styles.sectionTitle} style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
            刻制进度（{orderSchedules.length}）
          </Text>
          <View style={{ display: 'flex', gap: 16 }}>
            {order.status !== 'cancelled' && orderSchedules.length > 0 && (
              <Text 
                style={{ fontSize: 24, color: '#c9a962' }} 
                onClick={handleOpenScheduleForm}
              >
                + 新增排期
              </Text>
            )}
            {order.status !== 'cancelled' && orderSchedules.length === 0 && (
              <Text 
                style={{ fontSize: 24, color: '#c9a962', fontWeight: 500 }} 
                onClick={handleOpenScheduleForm}
              >
                安排排期 ›
              </Text>
            )}
            <Text style={{ fontSize: 24, color: '#95a5a6' }} onClick={handleGoSchedule}>排期日历 ›</Text>
          </View>
        </View>
        
        <View className={styles.timeline}>
          {timelineData.map((item, index) => (
            <View 
              key={index} 
              className={`${styles.timelineItem} ${item.active ? styles.active : ''}`}
            >
              <View className={styles.dot} />
              <Text className={styles.timelineTitle}>{item.title}</Text>
              <Text className={styles.timelineTime}>{item.time}</Text>
            </View>
          ))}
        </View>

        {orderSchedules.length > 0 && (
          <View className={styles.scheduleList}>
            <Text className={styles.subTitle}>已安排的刻制任务</Text>
            {orderSchedules.map((s) => (
              <View key={s.id} className={styles.scheduleCard}>
                <View className={styles.scheduleHeader}>
                  <View className={`${styles.schTypeTag} ${styles[s.type]}`}>
                    <Text>{getTypeLabel(s.type)}</Text>
                  </View>
                  <View className={`${styles.schStatusTag} ${styles[s.status]}`}>
                    <Text>{getStatusLabel(s.status)}</Text>
                  </View>
                </View>
                <Text className={styles.schContent}>{s.content}</Text>
                <View className={styles.schInfo}>
                  <Text className={styles.schInfoText}>📅 {s.date} {s.startTime}-{s.endTime}</Text>
                </View>
                <View className={styles.schInfo}>
                  <Text className={styles.schInfoText}>👤 {s.operator}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {showScheduleForm && (
        <View className={styles.modalMask} onClick={() => setShowScheduleForm(false)}>
          <View className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>安排刻制排期</Text>
            
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>刻制类型</Text>
              <View className={styles.segmentRow}>
                <View 
                  className={`${styles.segmentItem} ${scheduleType === 'machine' ? styles.segActive : ''}`}
                  onClick={() => handleScheduleTypeChange('machine')}
                >
                  <Text>机刻</Text>
                </View>
                <View 
                  className={`${styles.segmentItem} ${scheduleType === 'manual' ? styles.segActive : ''}`}
                  onClick={() => handleScheduleTypeChange('manual')}
                >
                  <Text>手刻</Text>
                </View>
              </View>
            </View>

            <View className={styles.formItem} onClick={handleSelectDate}>
              <Text className={styles.formLabel}>排期日期</Text>
              <View className={styles.formValueRow}>
                <Text className={styles.formValueText}>{scheduleDate || '请选择'}</Text>
                <Text className={styles.formArrow}>›</Text>
              </View>
            </View>

            <View className={styles.formItem} onClick={handleSelectTimeSlot}>
              <Text className={styles.formLabel}>时间段</Text>
              <View className={styles.formValueRow}>
                <Text className={styles.formValueText}>
                  {TIME_SLOTS.find(t => t.id === scheduleTimeSlot)?.label || '请选择'}
                </Text>
                <Text className={styles.formArrow}>›</Text>
              </View>
            </View>

            <View className={styles.formItem} onClick={handleSelectOperator}>
              <Text className={styles.formLabel}>{scheduleType === 'machine' ? '刻字机' : '师傅'}</Text>
              <View className={styles.formValueRow}>
                <Text className={styles.formValueText}>{scheduleOperator || '请选择'}</Text>
                <Text className={styles.formArrow}>›</Text>
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>任务说明</Text>
              <View className={styles.formValueRow}>
                <Input
                  className={styles.formInputInline}
                  placeholder='选填：如碑文精雕、底座纹饰等'
                  value={scheduleRemark}
                  onInput={(e) => setScheduleRemark(e.detail.value)}
                />
              </View>
            </View>

            <View className={styles.modalActions}>
              <View className={styles.modalCancel} onClick={() => setShowScheduleForm(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.modalConfirm} onClick={handleSubmitSchedule}>
                <Text>确认安排</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={handleContact}>
          <Text>联系客户</Text>
        </View>
        {order.status === 'pending' && (
          <View className={styles.primaryBtn} onClick={handleConfirmOrder}>
            <Text>确认订单</Text>
          </View>
        )}
        {(order.status === 'pending' || order.status === 'confirmed') && orderSchedules.length === 0 && (
          <View className={styles.primaryBtn} onClick={handleOpenScheduleForm}>
            <Text>安排排期</Text>
          </View>
        )}
        {order.status === 'engraving' && orderSchedules.length > 0 && (
          <View className={styles.primaryBtn} onClick={handleComplete}>
            <Text>全部完成</Text>
          </View>
        )}
        {order.status === 'confirmed' && orderSchedules.length > 0 && (
          <View className={styles.primaryBtn} onClick={handleStartEngraving}>
            <Text>开始刻制</Text>
          </View>
        )}
        {orderSchedules.length > 0 && order.status !== 'pending' && order.status !== 'cancelled' && (
          <View className={styles.primaryBtn} onClick={handleOpenScheduleForm}>
            <Text>新增排期</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderDetailPage;
