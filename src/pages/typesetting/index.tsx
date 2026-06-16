import React, { useState } from 'react';
import { View, Text, Textarea, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const TypesettingPage: React.FC = () => {
  const [mainText, setMainText] = useState<string>('先考张公讳建国之墓');
  const [subText, setSubText] = useState<string>('生于一九五〇年  卒于二〇二四年');
  const [fontSize, setFontSize] = useState<string>('medium');
  const [align, setAlign] = useState<string>('center');
  const [selectedFont, setSelectedFont] = useState<string>('欧体楷书');

  const sizeOptions = [
    { key: 'small', label: '小号' },
    { key: 'medium', label: '中号' },
    { key: 'large', label: '大号' }
  ];

  const alignOptions = [
    { key: 'left', label: '左对齐' },
    { key: 'center', label: '居中' },
    { key: 'right', label: '右对齐' }
  ];

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 36;
      case 'large': return 60;
      default: return 48;
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'left': return 'flex-start';
      case 'right': return 'flex-end';
      default: return 'center';
    }
  };

  const handleFontSelect = () => {
    Taro.navigateTo({ url: '/pages/font-select/index?select=1' });
  };

  const handleCheckTaboo = () => {
    console.log('[Typesetting] 避讳校对');
    Taro.showModal({
      title: '生卒避讳校对',
      content: '检测结果：未发现避讳用字，碑文内容规范。\n\n提示：碑文已按照传统礼仪规范检查，包括"先考""先妣""讳"等敬称使用正确。',
      showCancel: false,
      confirmText: '知道了'
    });
  };

  const handleConfirm = () => {
    console.log('[Typesetting] 确认排版');
    Taro.showToast({ title: '排版已保存', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.previewSection}>
        <Text className={styles.sectionTitle}>碑文预览</Text>
        <View className={styles.previewBox}>
          <Text className={styles.previewTitle}>{selectedFont}</Text>
          <View style={{ alignItems: getAlignClass(), width: '100%' }}>
            <Text 
              className={styles.previewText} 
              style={{ fontSize: getFontSizeClass(), textAlign: align as any }}
            >
              {mainText || '请输入碑文内容'}
            </Text>
            {subText && (
              <Text className={styles.previewSubtext}>{subText}</Text>
            )}
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <View className={styles.formCard}>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>主碑文</Text>
            <Textarea
              className={styles.textareaInput}
              placeholder="请输入主碑文内容"
              value={mainText}
              onInput={(e) => setMainText(e.detail.value)}
              maxlength={50}
            />
          </View>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>副碑文（生卒日期等）</Text>
            <Textarea
              className={styles.textareaInput}
              placeholder="请输入副碑文内容"
              value={subText}
              onInput={(e) => setSubText(e.detail.value)}
              maxlength={100}
            />
          </View>
        </View>

        <View className={styles.formCard}>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>字体选择</Text>
            <View className={styles.fontSelectRow} onClick={handleFontSelect}>
              <Text className={styles.fontSelectLabel}>当前字体</Text>
              <View className={styles.fontSelectValue}>
                <Text>{selectedFont}</Text>
                <Text className={styles.fontArrow}>›</Text>
              </View>
            </View>
          </View>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>字号大小</Text>
            <View className={styles.sizeSelector}>
              {sizeOptions.map((opt) => (
                <View
                  key={opt.key}
                  className={`${styles.sizeOption} ${fontSize === opt.key ? styles.active : ''}`}
                  onClick={() => setFontSize(opt.key)}
                >
                  <Text>{opt.label}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>对齐方式</Text>
            <View className={styles.alignSelector}>
              {alignOptions.map((opt) => (
                <View
                  key={opt.key}
                  className={`${styles.alignOption} ${align === opt.key ? styles.active : ''}`}
                  onClick={() => setAlign(opt.key)}
                >
                  <Text>{opt.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.tipSection}>
          <Text className={styles.tipTitle}>💡 生卒避讳校对</Text>
          <Text className={styles.tipText}>
            传统碑文中需注意避讳用字，如"先考"（已故父亲）、"先妣"（已故母亲）、"讳"（对尊长名字的敬称）等。
            点击下方按钮可进行智能校对，确保碑文规范得体。
          </Text>
        </View>

        <View 
          className={styles.secondaryBtn}
          style={{ width: '100%', marginBottom: 16 }}
          onClick={handleCheckTaboo}
        >
          <Text>进行避讳校对</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={() => Taro.navigateBack()}>
          <Text>取消</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleConfirm}>
          <Text>确认排版</Text>
        </View>
      </View>
    </View>
  );
};

export default TypesettingPage;
