
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GradientBackgroundProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function GradientBackground({ children, style }: GradientBackgroundProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Default to dark gradient if in dark mode or if light mode doesn't have one defined yet
  const gradientColors = colorScheme === 'dark' && 'backgroundGradient' in colors
    ? colors.backgroundGradient 
    : ['#FFFFFF', '#F0F2F5']; // Light mode fallback

  return (
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
