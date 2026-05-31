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
  const {result, isGuest = false} = route.params ?? {};

  // Normalise: new format uses matched_animals[], old single-match uses matched_animal
  const matchedAnimals = result?.matched_animals
    ?? (result?.matched_animal ? [result.matched_animal] : []);
  const totalMatches  = result?.total_matches ?? matchedAnimals.length;
  const scanScore     = result?.scan_score    ?? 0;
  const predictedId   = result?.predicted_cattle_id ?? '—';
  const apiError      = result?.error;

  // ── No match / error screen ────────────────────────────────────────────────
  if (totalMatches === 0 || matchedAnimals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={color.Secondry} />
        <Header navigation={navigation} isGuest={isGuest} />
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} />
      <Header navigation={navigation} isGuest={isGuest} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* ── Scan summary ─────────────────────────────────────────────────── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <MaterialIcons name="check-circle" size={20} color="#2e7d32" />
            <Text style={styles.summaryLabel}>Matches Found</Text>
            <Text style={styles.summaryValue}>{totalMatches}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <MaterialIcons name="stars" size={20} color={color.Secondry} />
            <Text style={styles.summaryLabel}>Scan Score</Text>
            <Text style={styles.summaryValue}>
              {(scanScore * 100).toFixed(2)}%
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <MaterialIcons name="fingerprint" size={20} color="#555" />
            <Text style={styles.summaryLabel}>Cattle ID</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {predictedId}
            </Text>
          </View>
        </View>

        {/* ── Match cards ──────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>
          {totalMatches === 1 ? 'Matched Animal' : `Matched Animals (${totalMatches})`}
        </Text>

        {matchedAnimals.map((animal, index) => (
          <AnimalCard
            key={animal.animal_id ?? index}
            animal={animal}
            index={index}
            isGuest={isGuest}
          />
        ))}

        {/* ── Scan again ───────────────────────────────────────────────────── */}
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

// ─── Animal match card ─────────────────────────────────────────────────────────
function AnimalCard({animal, index, isGuest}) {
  const imgSrc = animal.image
    ? {uri: resolveImageUrl(animal.image)}
    : null;

  const scoreGap = animal.score_difference ?? animal.animal_nose_score ?? 0;
  const scoreLabel = scoreGap < 0.01
    ? 'Excellent'
    : scoreGap < 0.05
    ? 'Good'
    : 'Fair';
  const scoreBgColor = scoreGap < 0.01
    ? '#2e7d32'
    : scoreGap < 0.05
    ? '#e65100'
    : '#555';

  return (
    <View style={styles.card}>
      {/* Match index badge */}
      <View style={styles.cardIndexBadge}>
        <Text style={styles.cardIndexText}>#{index + 1}</Text>
      </View>

      {/* Animal image */}
      <View style={styles.cardImgWrap}>
        {imgSrc ? (
          <Image source={imgSrc} style={styles.cardImg} resizeMode="cover" />
        ) : (
          <View style={styles.cardImgPlaceholder}>
            <FontAwesome6 name="cow" size={32} color="#fff" />
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.cardBody}>
        {/* Name + match quality */}
        <View style={styles.cardTopRow}>
          <Text style={styles.cardName} numberOfLines={1}>
            {animal.animal_name}
          </Text>
          <View style={[styles.qualityBadge, {backgroundColor: scoreBgColor}]}>
            <Text style={styles.qualityText}>{scoreLabel}</Text>
          </View>
        </View>

        {/* Category + gender */}
        <View style={styles.badgeRow}>
          {animal.category && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{animal.category_display ?? animal.category}</Text>
            </View>
          )}
          {animal.gender && (
            <View style={[styles.pill, styles.pillBlue]}>
              <Text style={styles.pillText}>{animal.gender_display ?? animal.gender}</Text>
            </View>
          )}
          {animal.is_sold && (
            <View style={[styles.pill, styles.pillRed]}>
              <Text style={styles.pillText}>Sold</Text>
            </View>
          )}
        </View>

        {/* Owner (guest only) */}
        {isGuest && animal.owner_name && (
          <InfoLine icon="person" value={animal.owner_name} />
        )}

        {/* Animal details */}
        {animal.breed && (
          <InfoLine icon="straighten" value={`Breed: ${animal.breed}`} />
        )}
        {animal.age != null && (
          <InfoLine icon="access-time" value={`Age: ${animal.age} months`} />
        )}
        {animal.registration_date && (
          <InfoLine icon="calendar-today" value={`Reg: ${animal.registration_date}`} />
        )}

        {/* Score difference */}
        <View style={styles.scoreLine}>
          <MaterialIcons name="analytics" size={13} color="#aaa" />
          <Text style={styles.scoreText}>
            Score diff: {scoreGap.toFixed(4)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────────
function Header({navigation, isGuest}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Scan Result</Text>
      {isGuest ? (
        <View style={styles.guestBadge}>
          <Text style={styles.guestBadgeText}>Guest</Text>
        </View>
      ) : (
        <View style={{width: 50}} />
      )}
    </View>
  );
}

function InfoLine({icon, value}) {
  return (
    <View style={styles.infoLine}>
      <MaterialIcons name={icon} size={13} color="#888" />
      <Text style={styles.infoLineText} numberOfLines={1}>{value}</Text>
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
    gap: 8,
  },
  headerTitle: {flex: 1, fontSize: 20, color: '#fff', fontWeight: 'bold'},
  guestBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  guestBadgeText: {color: '#fff', fontSize: 12, fontWeight: '700'},

  scroll: {padding: 14, paddingBottom: 36},

  // ── Summary bar ─────────────────────────────────────────────────────────────
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    alignItems: 'center',
  },
  summaryItem: {flex: 1, alignItems: 'center', gap: 4},
  summaryLabel: {fontSize: 10, color: '#999', fontWeight: '600', textTransform: 'uppercase'},
  summaryValue: {fontSize: 13, fontWeight: '800', color: '#222'},
  summaryDivider: {width: 1, height: 36, backgroundColor: '#eee'},

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  // ── Animal card ─────────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  cardIndexBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: color.Secondry,
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cardIndexText: {color: '#fff', fontSize: 11, fontWeight: '800'},
  cardImgWrap: {width: 100, minHeight: 130},
  cardImg: {width: '100%', height: '100%'},
  cardImgPlaceholder: {
    flex: 1,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 130,
  },
  cardBody: {flex: 1, padding: 12, gap: 5},

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardName: {fontSize: 16, fontWeight: '800', color: '#222', flex: 1, marginRight: 6},
  qualityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  qualityText: {color: '#fff', fontSize: 10, fontWeight: '700'},

  badgeRow: {flexDirection: 'row', gap: 6, flexWrap: 'wrap'},
  pill: {
    backgroundColor: color.Secondry,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  pillBlue: {backgroundColor: '#1565c0'},
  pillRed: {backgroundColor: '#c62828'},
  pillText: {color: '#fff', fontSize: 10, fontWeight: '700'},

  infoLine: {flexDirection: 'row', alignItems: 'center', gap: 5},
  infoLineText: {fontSize: 12, color: '#666', flex: 1},

  scoreLine: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2},
  scoreText: {fontSize: 11, color: '#bbb'},

  // ── No match ─────────────────────────────────────────────────────────────────
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
  noMatchTitle: {fontSize: 20, fontWeight: 'bold', color: '#444', marginBottom: 10},
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

  // ── Scan again ───────────────────────────────────────────────────────────────
  scanAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Secondry,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  scanAgainBtnText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
