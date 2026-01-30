
// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Add your SF Symbols to Material Icons mappings here.
const MAPPING = {
  // Existing
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',

  // Added for Mockup
  'bell.fill': 'notifications',
  'tray.and.arrow.down.fill': 'file-download', // or 'move-to-inbox'
  'arrow.2.squarepath': 'compare-arrows',
  'creditcard.fill': 'credit-card',
  'arrow.down.left': 'call-received', // approximations for diagonal
  'arrow.up.right': 'call-made',
  'building.columns.fill': 'account-balance',
  'bitcoinsign.circle.fill': 'monetization-on', // MaterialIcons might not have specific bitcoin, usually font-awesome does
  'person.fill': 'person',
  'doc.on.doc': 'content-copy',
  'checkmark.shield.fill': 'verified-user',
  'lock.shield.fill': 'admin-panel-settings',
  'sun.max.fill': 'wb-sunny',
  'shield.fill': 'security',
  'lock.fill': 'lock',
} as Partial<Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
