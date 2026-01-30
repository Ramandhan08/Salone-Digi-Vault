
import { StyleSheet, View, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { NativeCard } from '@/components/ui/NativeCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useState } from 'react';

export default function ProfileScreen() {
  // Mock User Data - In a real app, this would come from an Auth Context or API
  const [user] = useState({
    name: "Mohamed", // Dynamic username
    id: "SLx7...9AB2",
    avatar: "https://i.pravatar.cc/100?img=12"
  });

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ThemedText type="title" style={styles.headerTitle}>My Profile</ThemedText>

        {/* Profile Card */}
        <NativeCard style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <ThemedText type="subtitle">{user.name}</ThemedText>
              <View style={styles.addressContainer}>
                <ThemedText style={styles.addressText}>{user.id}</ThemedText>
                <TouchableOpacity>
                  <IconSymbol name="doc.on.doc" size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </NativeCard>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem icon="doc.on.doc" title="Copy Address" />
          <MenuItem icon="checkmark.shield.fill" title="KYC Verification" />
          <MenuItem icon="lock.shield.fill" title="Security Settings" />
          
          {/* Settings Section */}
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Settings</ThemedText>
          <MenuItem icon="hand.raised.fill" title="Privacy Policy" onPress={() => {}} />
          <MenuItem icon="info.circle.fill" title="About Us" onPress={() => {}} />
          <MenuItem icon="questionmark.circle.fill" title="FAQ" onPress={() => {}} />

          {/* Theme Switch */}
          <NativeCard style={styles.menuItemCard}>
             <View style={styles.menuItemRow}>
              <View style={styles.menuIconBg}>
                <IconSymbol name="sun.max.fill" size={20} color="#FBBF24" />
              </View>
              <ThemedText style={styles.menuText}>Theme: Light</ThemedText>
              <Switch value={false} trackColor={{ false: '#767577', true: '#6C63FF' }} />
            </View>
          </NativeCard>

          <PrimaryButton 
            title="Log Out" 
            onPress={() => {}} 
            style={styles.logoutBtn}
            textStyle={{ color: '#fff' }}
          />
        </View>

      </ScrollView>
    </GradientBackground>
  );
}

function MenuItem({ icon, title, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <NativeCard style={styles.menuItemCard}>
        <View style={styles.menuItemRow}>
          <View style={styles.menuIconBg}>
            <IconSymbol name={icon} size={20} color="#fff" />
          </View>
          <ThemedText style={styles.menuText}>{title}</ThemedText>
          <IconSymbol name="chevron.right" size={20} color="#94A3B8" />
        </View>
      </NativeCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
    color: '#94A3B8',
  },
  profileCard: {
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  profileInfo: {
    flex: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'monospace',
  },
  menuContainer: {
    gap: 12,
  },
  menuItemCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutBtn: {
    marginTop: 24,
    backgroundColor: '#EF4444', // Red for logout or gradient
  },
});
