import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actionText, onAction }) => {
  return (
    <View className={styles.header}>
      <View className={styles.titleRow}>
        <View className={styles.titleBar} />
        <Text className={styles.title}>{title}</Text>
      </View>
      {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      {actionText && (
        <View className={styles.action} onClick={onAction}>
          <Text className={styles.actionText}>{actionText}</Text>
        </View>
      )}
    </View>
  );
};

export default SectionHeader;
