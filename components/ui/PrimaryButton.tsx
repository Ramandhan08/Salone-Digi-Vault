
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function PrimaryButton({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  loading = false,
  variant = 'primary'
}: PrimaryButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.8}>
        <LinearGradient
          colors={['#6C63FF', '#4C1D95']} // Violet to Deep Purple
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, style]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.text, textStyle]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Fallback for other variants (simple styling for now)
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={loading}
      style={[
        styles.button, 
        { backgroundColor: variant === 'secondary' ? '#334155' : 'transparent', borderWidth: variant === 'outline' ? 1 : 0, borderColor: '#fff' },
        style
      ]}
    >
       {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
