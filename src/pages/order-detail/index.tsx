import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { Order, ORDER_STATUS_MAP, ScheduleItem, Installation, INSTALL_STATUS_MAP } from '@/types';
import StatusTag from '@/components/StatusTag';
import { useOrderStore } from '@/store/orders';
import { useScheduleStore } from '@/store/schedules';
import { useInstallationStore } from '@/store/installations';
import { cemeteryList } from '@/data/installations';
import styles from './index.module.scss';

const MACHINE_OPERATORS = ['刻字机A', '刻字机B', '刻字机C'];
const MANUAL_OPERATORS = ['李师傅', '王师傅', '张师傅', '赵师傅', '孙师傅', '刘师傅'];
const INSTALL_WORKERS = ['王师傅、李师傅', '张师傅、刘师傅', '王师傅、赵师傅', '李师傅、张师傅'];
const TIME_SLOTS = [
  { id: 'am1', label: '上午 08:00-11:30', start: '08:00', end: '11:30' },
  { id: 'pm1', label: '下午 13:00-17:00', start: '13:00', end: '17:00' },
  { id: 'full', label: '全天 08:00-17:00', start: '08:00', end: '17:00' }
];

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderSchedules, setOrderSchedules] = useState<ScheduleItem[]>([]);
  const [orderInstall, setOrderInstall] = useState<Installation | null>(null);
  
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const updateOrder = useOrderStore((s) => s.updateOrder);
  const schedules = useScheduleStore((s) => s.schedules);
  const addSchedule = useScheduleStore((s) => s.addSchedule);
  const getSchedulesByOrderId = useScheduleStore((s) => s.getSchedulesByOrderId);
  const checkConflict = useScheduleStore((s) => s.checkConflict);
  const getOperatorLoadByDate = useScheduleStore((s) => s.getOperatorLoadByDate);
  const addInstallation = useInstallationStore((s) => s.addInstallation);
  const getInstallationsByOrderId = useInstallationStore((s) => s.getInstallationsByOrderId);
  const completeInstallation = useInstallationStore((s) => s.completeInstallation);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleType, setScheduleType] = useState<'machine' | 'manual'>('machine');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTimeSlot, setScheduleTimeSlot] = useState<string>('');
  const [scheduleOperator, setScheduleOperator] = useState<string>('');
  const [scheduleRemark, setScheduleRemark] = useState<string>('');

  const [showInstallForm, setShowInstallForm] = useState(false);
  const [installDate, setInstallDate] = useState<string>('');
  const [installWorker, setInstallWorker] = useState<string>('');
  const [installCemetery, setInstallCemetery] = useState<string>('');
  const [installLocation, setInstallLocation] = useState<string>('');
  const [installFee, setInstallFee] = useState<string>('1200');

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
      const insts = getInstallationsByOrderId(id);
      setOrderInstall(insts.length > 0 ? insts[0] : null);
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
      Taro.showToast({ title: '刻制完成，可安排安装', icon: 'success' });
    }
  };

  const handleContact = () => {
    console.log('[OrderDetail] 联系客户');
    if (order) {
      Taro.makePhoneCall({ phoneNumber: order.customerPhone.replace(/\*/g, '0') })
        .catch(() => Taro.showToast({ title: '拨打失败', icon: 'none' }));
    }
  };

  const operatorLoadList = useMemo(() => {
    if (!scheduleDate) return [];
    return getOperatorLoadByDate(scheduleDate);
  }, [scheduleDate, getOperatorLoadByDate, schedules]);

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
    const withLoad = operators.map(op => {
      const load = operatorLoadList.find(l => l.operator === op);
      const count = load?.total || 0;
      const busyInfo = count > 0 ? ` (已排${count}单)` : '';
      return `${op}${busyInfo}`;
    });
    Taro.showActionSheet({
      itemList: withLoad,
      success: (res) => setScheduleOperator(operators[res.tapIndex])
    });
  };

  const validateSchedule = (): string | null => {
    if (!scheduleDate) return '请选择日期';
    if (!scheduleTimeSlot) return '请选择时段';
    if (!scheduleOperator) return '请选择师傅/机器';
    const timeSlot = TIME_SLOTS.find(t => t.id === scheduleTimeSlot) || TIME_SLOTS[0];
    const conflict = checkConflict(scheduleDate, scheduleOperator, timeSlot.start, timeSlot.end);
    if (conflict) {
      return `${scheduleOperator} 在 ${scheduleDate} ${timeSlot.start}-${timeSlot.end} 已被 ${conflict.orderNo} 占用`;
    }
    return null;
  };

  const handleSubmitSchedule = () => {
    if (!order) return;
    const err = validateSchedule();
    if (err) {
      Taro.showModal({
        title: '时间冲突',
        content: err,
        showCancel: false,
        confirmText: '知道了'
      });
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

  const handleOpenInstallForm = () => {
    const today = new Date();
    const target = new Date(today);
    target.setDate(target.getDate() + 2);
    setInstallDate(target.toISOString().split('T')[0]);
    setInstallWorker(INSTALL_WORKERS[0]);
    if (order?.cemetery) {
      setInstallCemetery(order.cemetery);
      const c = cemeteryList.find(ce => ce.name === order.cemetery);
      if (c) setInstallCemetery(c.name);
    }
    setInstallLocation('');
    setInstallShowFeeFromOrder();
    setShowInstallForm(true);
  };

  const setInstallShowFeeFromOrder = () => {
    if (!order) return;
    if (order.feeDetails) {
      const installFeeItem = order.feeDetails.find(f => f.name === '安装服务');
      if (installFeeItem) {
        setInstallFee(String(installFeeItem.amount));
        return;
      }
    }
    setInstallFee('1200');
  };

  const handleSelectInstallDate = () => {
    const today = new Date();
    const dates: string[] = [];
    for (let i = 2; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    Taro.showActionSheet({
      itemList: dates,
      success: (res) => setInstallDate(dates[res.tapIndex])
    });
  };

  const handleSelectInstallWorker = () => {
    Taro.showActionSheet({
      itemList: INSTALL_WORKERS,
      success: (res) => setInstallWorker(INSTALL_WORKERS[res.tapIndex])
    });
  };

  const handleSelectInstallCemetery = () => {
    Taro.showActionSheet({
      itemList: cemeteryList.map(c => c.name),
      success: (res) => setInstallCemetery(cemeteryList[res.tapIndex].name)
    });
  };

  const validateInstall = (): string | null => {
    if (!installDate) return '请选择安装日期';
    if (!installWorker) return '请选择安装工人';
    if (!installCemetery) return '请选择墓园';
    if (!installLocation.trim()) return '请填写墓穴位置';
    const feeNum = Number(installFee);
    if (!installFee || isNaN(feeNum) || feeNum < 0) return '请输入有效的安装费用';
    return null;
  };

  const handleSubmitInstall = () => {
    if (!order) return;
    const err = validateInstall();
    if (err) {
      Taro.showToast({ title: err, icon: 'none' });
      return;
    }
    const newInst = addInstallation({
      orderId: order.id,
      orderNo: order.orderNo,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      tombstoneName: order.tombstoneName,
      cemetery: installCemetery,
      location: installLocation.trim(),
      scheduledDate: installDate,
      status: 'scheduled',
      worker: installWorker,
      installFee: Number(installFee),
      createTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }).replace(/\//g, '-')
    });
    updateOrder(order.id, {
      installId: newInst.id,
      installScheduleTime: installDate,
      cemetery: installCemetery
    });
    setShowInstallForm(false);
    refreshData(order.id);
    Taro.showToast({ title: '安装已预约', icon: 'success' });
  };

  const handleCompleteInstall = () => {
    if (!orderInstall || !order) return;
    Taro.showModal({
      title: '确认完成安装',
      content: '确定要将此安装登记为完成吗？订单状态将变更为已交付并进入对账待结算。',
      success: (res) => {
        if (res.confirm) {
          completeInstallation(orderInstall.id);
          const updated = updateOrderStatus(order.id, 'delivered');
          if (updated) {
            setOrder(updated);
            refreshData(order.id);
          }
          Taro.showToast({ title: '安装完成，已交付', icon: 'success' });
        }
      }
    });
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
    if (title === '安装预约') {
      if (orderInstall) {
        if (orderInstall.status === 'completed' && orderInstall.completeDate) return orderInstall.completeDate;
        return orderInstall.scheduledDate + ' 已预约';
      }
      if (order.status === 'delivered' && order.installCompleteTime) return order.installCompleteTime;
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
    if (title === '安装预约') return !!orderInstall || order.status === 'delivered';
    if (title === '已交付') return order.status === 'delivered';
    return false;
  };

  const allEngravingDone = orderSchedules.length > 0 && orderSchedules.every(s => s.status === 'completed');
  const canShowInstallFlow = order.installService || orderInstall || (allEngravingDone && order.status === 'completed');

  const timelineData = [
    { title: '订单创建' },
    { title: '订单确认' },
    { title: '开始刻制' },
    { title: '刻制完成' },
    ...(canShowInstallFlow ? [{ title: '安装预约' }] : []),
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
            {order.urgent && <Text className={styles.tombstoneSpec} style={{ color: '#e74c3c' }}>🔥 加急处理</Text>}
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

      {canShowInstallFlow && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>安装登记</Text>
          {orderInstall ? (
            <View className={styles.installCard}>
              <View className={styles.installHeader}>
                <View className={`${styles.schStatusTag} ${styles[orderInstall.status]}`}>
                  <Text>{INSTALL_STATUS_MAP[orderInstall.status].label}</Text>
                </View>
                {orderInstall.status === 'scheduled' && (
                  <Text className={styles.installAction} onClick={handleCompleteInstall}>
                    登记完成 ›
                  </Text>
                )}
              </View>
              <View className={styles.installInfo}>
                <Text className={styles.installLabel}>安装日期</Text>
                <Text className={styles.installValue}>{orderInstall.scheduledDate}</Text>
              </View>
              <View className={styles.installInfo}>
                <Text className={styles.installLabel}>墓园位置</Text>
                <Text className={styles.installValue}>{orderInstall.cemetery} {orderInstall.location}</Text>
              </View>
              <View className={styles.installInfo}>
                <Text className={styles.installLabel}>安装师傅</Text>
                <Text className={styles.installValue}>{orderInstall.worker}</Text>
              </View>
              <View className={styles.installInfo}>
                <Text className={styles.installLabel}>安装费用</Text>
                <Text className={styles.installValue} style={{ color: '#e74c3c' }}>¥{orderInstall.installFee.toLocaleString()}</Text>
              </View>
              {orderInstall.remarks && (
                <View className={styles.installInfo}>
                  <Text className={styles.installLabel}>备注</Text>
                  <Text className={styles.installValue}>{orderInstall.remarks}</Text>
                </View>
              )}
            </View>
          ) : (
            allEngravingDone && order.status === 'completed' ? (
              <View className={styles.installEmpty} onClick={handleOpenInstallForm}>
                <Text style={{ fontSize: 28, marginBottom: 8 }}>📦</Text>
                <Text style={{ fontSize: 26, color: '#2c3e50', fontWeight: 500 }}>刻制已完成，安排安装 ›</Text>
                <Text style={{ fontSize: 22, color: '#95a5a6', marginTop: 4 }}>点击预约安装日期、师傅和墓园</Text>
              </View>
            ) : (
              orderInstall ? null : (
                <View style={{ padding: 20, textAlign: 'center', color: '#95a5a6' }}>
                  <Text>刻制完成后可预约安装</Text>
                </View>
              )
            )
          )}
        </View>
      )}

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

            {scheduleDate && operatorLoadList.length > 0 && (
              <View className={styles.loadHint}>
                <Text className={styles.loadHintTitle}>{scheduleDate} 工作负载</Text>
                <View className={styles.loadList}>
                  {operatorLoadList.slice(0, 5).map((load) => (
                    <View key={load.operator} className={styles.loadItem}>
                      <Text className={styles.loadName}>{load.operator}</Text>
                      <Text 
                        className={styles.loadCount}
                        style={{ color: load.total >= 2 ? '#e74c3c' : load.total >= 1 ? '#f39c12' : '#27ae60' }}
                      >
                        {load.total}单
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

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

      {showInstallForm && (
        <View className={styles.modalMask} onClick={() => setShowInstallForm(false)}>
          <View className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>预约安装服务</Text>

            <View className={styles.formItem} onClick={handleSelectInstallDate}>
              <Text className={styles.formLabel}>
                <Text style={{ color: '#e74c3c' }}>*</Text> 安装日期
              </Text>
              <View className={styles.formValueRow}>
                <Text className={styles.formValueText}>{installDate || '请选择'}</Text>
                <Text className={styles.formArrow}>›</Text>
              </View>
            </View>

            <View className={styles.formItem} onClick={handleSelectInstallWorker}>
              <Text className={styles.formLabel}>
                <Text style={{ color: '#e74c3c' }}>*</Text> 安装师傅
              </Text>
              <View className={styles.formValueRow}>
                <Text className={styles.formValueText}>{installWorker || '请选择'}</Text>
                <Text className={styles.formArrow}>›</Text>
              </View>
            </View>

            <View className={styles.formItem} onClick={handleSelectInstallCemetery}>
              <Text className={styles.formLabel}>
                <Text style={{ color: '#e74c3c' }}>*</Text> 墓园
              </Text>
              <View className={styles.formValueRow}>
                <Text className={styles.formValueText}>{installCemetery || '请选择'}</Text>
                <Text className={styles.formArrow}>›</Text>
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                <Text style={{ color: '#e74c3c' }}>*</Text> 墓穴位置
              </Text>
              <View className={styles.formValueRow}>
                <Input
                  className={styles.formInputInline}
                  placeholder='如：A区12排3号'
                  value={installLocation}
                  onInput={(e) => setInstallLocation(e.detail.value)}
                />
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>安装费用</Text>
              <View className={styles.formValueRow} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 24, color: '#999' }}>¥</Text>
                <Input
                  type='digit'
                  value={installFee}
                  onInput={(e) => setInstallFee(e.detail.value)}
                  style={{ fontSize: 28, color: '#2c3e50', textAlign: 'right', flex: 1, fontWeight: 500 }}
                />
              </View>
            </View>

            <View className={styles.modalActions}>
              <View className={styles.modalCancel} onClick={() => setShowInstallForm(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.modalConfirm} onClick={handleSubmitInstall}>
                <Text>确认预约</Text>
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
        {order.status === 'engraving' && orderSchedules.length > 0 && allEngravingDone && (
          <View className={styles.primaryBtn} onClick={handleComplete}>
            <Text>刻制完成</Text>
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
        {canShowInstallFlow && !orderInstall && allEngravingDone && order.status === 'completed' && (
          <View className={styles.primaryBtn} onClick={handleOpenInstallForm}>
            <Text>预约安装</Text>
          </View>
        )}
        {orderInstall && orderInstall.status === 'scheduled' && (
          <View className={styles.primaryBtn} onClick={handleCompleteInstall}>
            <Text>安装完成交付</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderDetailPage;
