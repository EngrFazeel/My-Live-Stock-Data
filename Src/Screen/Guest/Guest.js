import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {color} from '../../Color';

const FEATURES = [
  {
    icon: 'search',
    title: 'Instant Identification',
    desc: 'Scan any animal\'s nose to find it across the entire platform instantly.',
  },
  {
    icon: 'groups',
    title: 'Platform-Wide Search',
    desc: 'Guest mode searches all registered animals — not just one account.',
  },
  {
    icon: 'no-accounts',
    title: 'No Login Required',
    desc: 'Identify animals without creating an account or signing in.',
  },
];

export default function GuestHomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guest Mode</Text>
        <View style={styles.headerBadge}>
          <MaterialIcons name="visibility" size={14} color="#fff" />
          <Text style={styles.headerBadgeText}>Read Only</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <FontAwesome6 name="cow" size={64} color={color.Secondry} />
          </View>
          <Text style={styles.heroTitle}>Identify Any Animal</Text>
          <Text style={styles.heroSub}>
            Scan the nose pattern of any animal to instantly find its details
            across our entire livestock registry.
          </Text>
        </View>

        {/* How to use */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>How It Works</Text>
          <Step num="1" text="Tap the Scan tab at the bottom" />
          <Step num="2" text="Take a photo or upload from gallery" />
          <Step num="3" text="Tap Identify to search the registry" />
          <Step num="4" text="View matched animals and their details" />
        </View>

        {/* Feature list */}
        {FEATURES.map(f => (
          <View key={f.title} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <MaterialIcons name={f.icon} size={22} color="#fff" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}

        {/* CTA — scan now */}
        <TouchableOpacity
          style={styles.scanCta}
          onPress={() => navigation.navigate('Scan')}>
          <MaterialIcons name="qr-code-scanner" size={22} color="#fff" />
          <Text style={styles.scanCtaText}>Scan Animal Now</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Login prompt */}
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>
            Want to manage your own animals?
          </Text>
          <View style={styles.loginBtnRow}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}>
              <MaterialIcons name="login" size={18} color="#fff" />
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.loginBtn, styles.signupBtn]}
              onPress={() => navigation.navigate('Signup')}>
              <MaterialIcons name="person-add" size={18} color={color.Secondry} />
              <Text style={[styles.loginBtnText, {color: color.Secondry}]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function Step({num, text}) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{num}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0'},

  header: {
    height: 60,
    backgroundColor: color.Secondry,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {fontSize: 22, color: '#fff', fontWeight: 'bold'},
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  headerBadgeText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  scroll: {padding: 18, paddingBottom: 36},

  // ── Hero ────────────────────────────────────────────────────────────────────
  heroWrap: {alignItems: 'center', marginBottom: 24},
  heroCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  // ── Steps card ──────────────────────────────────────────────────────────────
  stepsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  stepsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 14,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {color: '#fff', fontWeight: '700', fontSize: 13},
  stepText: {flex: 1, fontSize: 14, color: '#555'},

  // ── Feature rows ────────────────────────────────────────────────────────────
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 1},
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  featureText: {flex: 1},
  featureTitle: {fontSize: 14, fontWeight: '700', color: '#222', marginBottom: 3},
  featureDesc: {fontSize: 12, color: '#888', lineHeight: 18},

  // ── Scan CTA ────────────────────────────────────────────────────────────────
  scanCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Secondry,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  scanCtaText: {color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center'},

  // ── Login prompt ────────────────────────────────────────────────────────────
  loginPrompt: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    elevation: 1,
  },
  loginPromptText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 14,
    textAlign: 'center',
  },
  loginBtnRow: {flexDirection: 'row', gap: 12, width: '100%'},
  loginBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Secondry,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  signupBtn: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: color.Secondry,
  },
  loginBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},
});
