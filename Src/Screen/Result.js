import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {color} from '../Color';
import {resolveImageUrl} from '../Utils/imageHelper';

export default function ResultScreen({navigation, route}) {
  const {result} = route.params ?? {};
  const matched = result?.matched_animal;
  const scanScore = result?.scan_score ?? 0;
  const predictedId = result?.predicted_cattle_id ?? '—';

  const apiError = result?.error;

  // ─── No match ─────────────────────────────────────────────────────────────
  if (!matched) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={color.Secondry} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Result</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.noMatchWrap}>
          <View style={styles.noMatchIconWrap}>
            <FontAwesome6 name="cow" size={56} color={color.Secondry} />
          </View>
          <Text style={styles.noMatchTitle}>No Animal Found</Text>
          <Text style={styles.noMatchHint}>
            {apiError || 'The nose scan did not match any registered animal.'}
          </Text>
          {result?.predicted_cattle_id && (
            <View style={styles.noMatchMeta}>
              <MaterialIcons name="fingerprint" size={15} color="#888" />
              <Text style={styles.noMatchMetaText}>
                Detected ID: {result.predicted_cattle_id}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.scanAgainBtn}
            onPress={() => navigation.goBack()}>
            <MaterialIcons name="qr-code-scanner" size={18} color="#fff" />
            <Text style={styles.scanAgainBtnText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const animalImg = matched.image ? {uri: resolveImageUrl(matched.image)} : null;
  const noseScanImg = matched.best_scan?.scan_image
    ? {uri: resolveImageUrl(matched.best_scan.scan_image)}
    : null;
  const scorePercent = (scanScore * 100).toFixed(2);
  const scanDate = matched.best_scan?.scan_date
    ? new Date(matched.best_scan.scan_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Result</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Identified badge */}
        <View style={styles.identifiedBadge}>
          <MaterialIcons name="check-circle" size={16} color="#2e7d32" />
          <Text style={styles.identifiedText}>Animal Identified</Text>
        </View>

        {/* Animal image */}
        <View style={styles.animalImgWrap}>
          {animalImg ? (
            <Image source={animalImg} style={styles.animalImg} />
          ) : (
            <View style={styles.animalImgPlaceholder}>
              <FontAwesome6 name="cow" size={50} color="#fff" />
            </View>
          )}
        </View>

        {/* Animal name */}
        <Text style={styles.animalName}>{matched.animal_name}</Text>

        {/* Badges row */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{matched.category}</Text>
          </View>
          <View style={[styles.badge, styles.badgeBlue]}>
            <Text style={styles.badgeText}>{matched.gender}</Text>
          </View>
          {matched.is_sold && (
            <View style={[styles.badge, styles.badgeRed]}>
              <Text style={styles.badgeText}>Sold</Text>
            </View>
          )}
        </View>

        {/* Animal details card */}
        <SectionTitle title="Animal Details" />
        <View style={styles.card}>
          <InfoRow
            icon="straighten"
            label="Breed"
            value={matched.breed || '—'}
          />
          <Divider />
          <InfoRow
            icon="access-time"
            label="Age"
            value={`${matched.age} months`}
          />
          <Divider />
          <InfoRow
            icon="calendar-today"
            label="Registered"
            value={matched.registration_date}
          />
          <Divider />
          <InfoRow
            icon="label"
            label="Animal ID"
            value={`#${matched.animal_id}`}
          />
        </View>

        {/* Scan analysis card */}
        <SectionTitle title="Scan Analysis" />
        <View style={styles.card}>
          {/* <InfoRow
            icon="stars"
            label="Match Score"
            value={`${scorePercent}%`}
            highlight
          /> */}
          <Divider />
          <InfoRow
            icon="fingerprint"
            label="Predicted ID"
            value={predictedId}
          />
          {/* {matched.best_scan?.predicted_cattle_id && (
            <>
              <Divider />
              <InfoRow
                icon="assessment"
                label="Confidence"
                value={matched.best_scan.predicted_cattle_id}
              />
            </>
          )} */}
          <Divider />
          <InfoRow icon="event" label="Scan Date" value={scanDate} />
        </View>

        {/* Nose scan image */}
        {noseScanImg && (
          <>
            <SectionTitle title="Nose Scan Image" />
            <View style={styles.noseScanWrap}>
              <Image
                source={noseScanImg}
                style={styles.noseScanImg}
                resizeMode="cover"
              />
            </View>
          </>
        )}

        {/* Scan again button */}
        <TouchableOpacity
          style={styles.scanAgainBtn}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="qr-code-scanner" size={18} color="#fff" />
          <Text style={styles.scanAgainBtnText}>Scan Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────────

function SectionTitle({title}) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function InfoRow({icon, label, value, highlight}) {
  return (
    <View style={styles.infoRow}>
      <MaterialIcons
        name={icon}
        size={20}
        color={color.Secondry}
        style={styles.infoIcon}
      />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text
        style={[styles.infoValue, highlight && styles.infoValueHighlight]}
        numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0'},

  header: {
    height: 60,
    backgroundColor: color.Secondry,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSpacer: {width: 26},

  scroll: {padding: 16, paddingBottom: 40},

  // ── Identified badge ────────────────────────────────────────────────────────
  identifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    marginBottom: 20,
  },
  identifiedText: {color: '#2e7d32', fontWeight: '700', fontSize: 13},

  // ── Animal image ────────────────────────────────────────────────────────────
  animalImgWrap: {
    alignSelf: 'center',
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    marginBottom: 14,
  },
  animalImg: {width: '100%', height: '100%'},
  animalImgPlaceholder: {
    flex: 1,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
  },

  animalName: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textTransform: 'capitalize',
  },

  // ── Badges ──────────────────────────────────────────────────────────────────
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 22,
  },
  badge: {
    backgroundColor: color.Secondry,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  badgeBlue: {backgroundColor: '#1565c0'},
  badgeRed: {backgroundColor: '#c62828'},
  badgeText: {color: '#fff', fontSize: 12, fontWeight: '700'},

  // ── Section title ───────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
    textTransform: 'uppercase',
  },

  // ── Info card ───────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  infoIcon: {marginRight: 12},
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  infoValueHighlight: {color: color.Secondry, fontSize: 16},
  divider: {height: 1, backgroundColor: '#f0f0f0'},

  // ── Nose scan image ─────────────────────────────────────────────────────────
  noseScanWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 22,
    height: 220,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  noseScanImg: {width: '100%', height: '100%'},

  // ── No match ────────────────────────────────────────────────────────────────
  noMatchWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  noMatchIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    marginBottom: 20,
  },
  noMatchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  noMatchHint: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  noMatchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 28,
  },
  noMatchMetaText: {fontSize: 13, color: '#666', fontWeight: '600'},

  // ── Scan again button ───────────────────────────────────────────────────────
  scanAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Secondry,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    marginTop: 4,
  },
  scanAgainBtnText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
