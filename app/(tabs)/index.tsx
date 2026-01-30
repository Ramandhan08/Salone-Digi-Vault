
import { Image } from 'expo-image';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { NativeCard } from '@/components/ui/NativeCard';

export default function HomeScreen() {
  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=12' }} // Placeholder
              style={styles.avatar}
            />
            <View>
              <ThemedText style={styles.greeting}>Hello, Mohamed,</ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <IconSymbol name="bell.fill" size={24} color="#fff" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={['#6C63FF', '#2D2B55']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <View style={styles.logoContainer}>
               {/* Tiny logo placeholder */}
               <ThemedText style={styles.brandText}>S</ThemedText>
            </View>
            <ThemedText style={styles.balanceLabel}>Balance (SL)</ThemedText>
          </View>
          
          <View style={styles.balanceRow}>
             <ThemedText style={styles.currencySymbol}>SL</ThemedText>
             <ThemedText style={styles.balanceAmount}>1,250,000</ThemedText>
          </View>
          
          <View style={styles.actionRow}>
            <ActionButton icon="paperplane.fill" label="Send" />
            <ActionButton icon="tray.and.arrow.down.fill" label="Receive" />
            <ActionButton icon="arrow.2.squarepath" label="Swap" />
            <ActionButton icon="creditcard.fill" label="Pay" />
          </View>
        </LinearGradient>

        {/* Recent Activity */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Activity</ThemedText>
          
          <ActivityItem 
            icon="arrow.down.left" 
            title="Orange Money Received" 
            date="On >" 
            amount="+ 2,000"
            color="#FFA500" // Orange
          />
          <ActivityItem 
            icon="arrow.up.right" 
            title="Afrimoney Transfer" 
            date="On >" 
            amount="- 500"
            color="#4ADE80" // Green
          />
          <ActivityItem 
            icon="building.columns.fill" 
            title="Bank Transfer" 
            date="On >" 
            amount="- 10,000"
            color="#60A5FA" // Blue
          />
           <ActivityItem 
            icon="bitcoinsign.circle.fill" 
            title="Crypto Wallet" 
            date="On >" 
            amount="+ 500"
            color="#34D399" // Emerald
          />
        </View>

      </ScrollView>
    </GradientBackground>
  );
}

function ActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
      <View style={styles.actionIconBg}>
        <IconSymbol name={icon as any} size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

function ActivityItem({ icon, title, date, amount, color }: any) {
  return (
    <NativeCard style={styles.activityCard}>
      <View style={styles.activityRow}>
        <View style={[styles.activityIconBg, { backgroundColor: color + '20' }]}>
           <IconSymbol name={icon} size={20} color={color} />
        </View>
        <View style={styles.activityInfo}>
          <ThemedText style={styles.activityTitle}>{title}</ThemedText>
        </View>
        <ThemedText style={styles.activityDate}>{date}</ThemedText>
      </View>
    </NativeCard>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  balanceCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  logoContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
    gap: 4,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  activityCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.9)', // Light card for contrast on dark bg if needed, or adapt via Card component
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activityIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  activityDate: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
