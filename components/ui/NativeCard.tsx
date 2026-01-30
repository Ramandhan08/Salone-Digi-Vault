import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function NativeCard({ children, style }: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0';

  return (
    <View style={[styles.card, { backgroundColor, borderColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
