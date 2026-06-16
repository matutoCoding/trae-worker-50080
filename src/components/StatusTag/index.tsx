import React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';

interface StatusTagProps {
  text: string;
  color: string;
  size?: 'sm' | 'md';
}

const StatusTag: React.FC<StatusTagProps> = ({ text, color, size = 'md' }) => {
  return (
    <View 
      className={classNames(styles.tag, styles[size])} 
      style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30` }}
    >
      <Text className={styles.text}>{text}</Text>
    </View>
  );
};

export default StatusTag;
