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

  // Normalise both formats: new array format and old single-match format
  const matchedAnimals =
    result?.matched_animals ??
    (result?.matched_animal ? [result.matched_animal] : []);
  const totalMatches = result?.total_matches ?? matchedAnimals.length;
  const scanScore    = result?.scan_score ?? 0;
  const predictedId  = result?.predicted_cattle_id ?? '—';
  const apiError     = result?.error;

  // ── No match screen ────────────────────────────────────────────────────────
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
          {predictedId !== '—' && (
            <View style={styles.noMatchMeta}>
              <MaterialIcons name="fingerprint" size={15} color="#888" />
              <Text style={styles.noMatchMetaText}>Detected ID: {predictedId}</Text>
            </View>
          )}
          <ScanAgainBtn navigation={navigation} />
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

        {/* ── Summary bar ────────────────────────────────────────────────── */}
        <View style={styles.summaryBar}>
          <SummaryItem icon="check-circle" iconColor="#2e7d32" label="Matches Found" value={String(totalMatches)} />
          <View style={styles.summaryDivider} />
          <SummaryItem icon="stars" iconColor={color.Secondry} label="Scan Score" value={`${(scanScore * 100).toFixed(2)}%`} />
          <View style={styles.summaryDivider} />
          <SummaryItem icon="fingerprint" iconColor="#555" label="Cattle ID" value={predictedId} />
        </View>

        {/* ── Animal cards ────────────────────────────────────────────────── */}
        {matchedAnimals.map((animal, index) => (
          <AnimalDetailCard
            key={animal.animal_id ?? index}
            animal={animal}
            index={index}
            totalMatches={totalMatches}
            isGuest={isGuest}
            topPredictedId={predictedId}
          />
        ))}

        <ScanAgainBtn navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Full detail card (matches second image style) ────────────────────────────
function AnimalDetailCard({animal, index, totalMatches, isGuest, topPredictedId}) {
  const imgSrc = animal.image
    ? {uri: resolveImageUrl(animal.image)}
    : null;

  const scoreGap = animal.score_difference ?? animal.animal_nose_score ?? 0;
  const scoreLabel =
    scoreGap < 0.01 ? 'Excellent' : scoreGap < 0.05 ? 'Good' : 'Fair';
  const scoreBg =
    scoreGap < 0.01 ? '#2e7d32' : scoreGap < 0.05 ? '#e65100' : '#888';

  const noseScanImg = animal.best_scan?.scan_image
    ? {uri: resolveImageUrl(animal.best_scan.scan_image)}
    : null;

  const scanDate = animal.best_scan?.scan_date
    ? new Date(animal.best_scan.scan_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  return (
    <View style={styles.detailCard}>

      {/* Index badge (only shown when multiple matches) */}
      {totalMatches > 1 && (
        <View style={styles.indexBadge}>
          <Text style={styles.indexBadgeText}>Match #{index + 1}</Text>
          <View style={[styles.qualityDot, {backgroundColor: scoreBg}]}>
            <Text style={styles.qualityText}>{scoreLabel}</Text>
          </View>
        </View>
      )}

      {/* Animal Identified badge */}
      <View style={styles.identifiedBadge}>
        <MaterialIcons name="check-circle" size={15} color="#2e7d32" />
        <Text style={styles.identifiedText}>Animal Identified</Text>
      </View>

      {/* Circular image */}
      <View style={styles.circleImgWrap}>
        {imgSrc ? (
          <Image source={imgSrc} style={styles.circleImg} />
        ) : (
          <View style={styles.circleImgPlaceholder}>
            <FontAwesome6 name="cow" size={48} color="#fff" />
          </View>
        )}
      </View>

      {/* Animal name */}
      <Text style={styles.animalName} numberOfLines={1}>
        {animal.animal_name}
      </Text>

      {/* Badges */}
      <View style={styles.badgeRow}>
        {animal.category && (
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {animal.category_display ?? animal.category}
            </Text>
          </View>
        )}
        {animal.gender && (
          <View style={[styles.pill, styles.pillBlue]}>
            <Text style={styles.pillText}>
              {animal.gender_display ?? animal.gender}
            </Text>
          </View>
        )}
        {animal.is_sold && (
          <View style={[styles.pill, styles.pillRed]}>
            <Text style={styles.pillText}>Sold</Text>
          </View>
        )}
      </View>

      {/* ── Animal Details ────────────────────────────────────────────── */}
      <SectionLabel label="Animal Details" />
      <View style={styles.infoCard}>
        {isGuest && animal.owner_name && (
          <>
            <DetailRow icon="person" label="Owner" value={animal.owner_name} />
            <RowDivider />
          </>
        )}
        {animal.breed && (
          <>
            <DetailRow icon="straighten" label="Breed" value={animal.breed} />
            <RowDivider />
          </>
        )}
        {animal.age != null && (
          <>
            <DetailRow icon="access-time" label="Age" value={`${animal.age} months`} />
            <RowDivider />
          </>
        )}
        {animal.registration_date && (
          <>
            <DetailRow icon="calendar-today" label="Registered" value={animal.registration_date} />
            <RowDivider />
          </>
        )}
        <DetailRow icon="label" label="Animal ID" value={`#${animal.animal_id}`} />
      </View>

      {/* ── Scan Analysis ────────────────────────────────────────────── */}
      <SectionLabel label="Scan Analysis" />
      <View style={styles.infoCard}>
        <DetailRow
          icon="fingerprint"
          label="Predicted ID"
          value={animal.predicted_cattle_id ?? topPredictedId ?? '—'}
        />
        {animal.best_scan?.predicted_cattle_id && (
          <>
            <RowDivider />
            <DetailRow
              icon="assessment"
              label="Confidence"
              value={animal.best_scan.predicted_cattle_id}
            />
          </>
        )}
        <RowDivider />
        <DetailRow icon="event" label="Scan Date" value={scanDate} />
        <RowDivider />
        <DetailRow
          icon="analytics"
          label="Score Diff"
          value={scoreGap.toFixed(6)}
          highlight={scoreLabel}
          highlightColor={scoreBg}
        />
      </View>

      {/* ── Nose scan image ───────────────────────────────────────────── */}
      {noseScanImg && (
        <>
          <SectionLabel label="Nose Scan Image" />
          <View style={styles.noseScanWrap}>
            <Image
              source={noseScanImg}
              style={styles.noseScanImg}
              resizeMode="cover"
            />
          </View>
        </>
      )}
    </View>
  );
}

// ─── Small shared components ──────────────────────────────────────────────────

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

function SummaryItem({icon, iconColor, label, value}) {
  return (
    <View style={styles.summaryItem}>
      <MaterialIcons name={icon} size={18} color={iconColor} />
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function SectionLabel({label}) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function RowDivider() {
  return <View style={styles.rowDivider} />;
}

function DetailRow({icon, label, value, highlight, highlightColor}) {
  return (
    <View style={styles.detailRow}>
      <MaterialIcons name={icon} size={18} color={color.Secondry} style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.detailValueWrap}>
        <Text style={styles.detailValue} numberOfLines={2}>{value}</Text>
        {highlight && (
          <View style={[styles.highlightBadge, {backgroundColor: highlightColor}]}>
            <Text style={styles.highlightText}>{highlight}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function ScanAgainBtn({navigation}) {
  return (
    <TouchableOpacity
      style={styles.scanAgainBtn}
      onPress={() => navigation.goBack()}>
      <MaterialIcons name="qr-code-scanner" size={18} color="#fff" />
      <Text style={styles.scanAgainBtnText}>Scan Again</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0'},

  // ── Header ──────────────────────────────────────────────────────────────────
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
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  summaryItem: {flex: 1, alignItems: 'center', gap: 3},
  summaryLabel: {
    fontSize: 9,
    color: '#999',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryValue: {fontSize: 12, fontWeight: '800', color: '#222'},
  summaryDivider: {width: 1, backgroundColor: '#eee'},

  // ── Detail card (main per-animal card) ──────────────────────────────────────
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    alignItems: 'center',
  },

  // ── Index + quality (multi-match only) ──────────────────────────────────────
  indexBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  indexBadgeText: {fontSize: 13, fontWeight: '700', color: '#666'},
  qualityDot: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qualityText: {color: '#fff', fontSize: 11, fontWeight: '700'},

  // ── Animal Identified badge ──────────────────────────────────────────────────
  identifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    gap: 6,
    marginBottom: 16,
  },
  identifiedText: {color: '#2e7d32', fontWeight: '700', fontSize: 13},

  // ── Circular image ───────────────────────────────────────────────────────────
  circleImgWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    marginBottom: 14,
  },
  circleImg: {width: '100%', height: '100%'},
  circleImgPlaceholder: {
    flex: 1,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Name + badges ────────────────────────────────────────────────────────────
  animalName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 18,
  },
  pill: {
    backgroundColor: color.Secondry,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  pillBlue: {backgroundColor: '#1565c0'},
  pillRed: {backgroundColor: '#c62828'},
  pillText: {color: '#fff', fontSize: 12, fontWeight: '700'},

  // ── Section label ────────────────────────────────────────────────────────────
  sectionLabel: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  // ── Info card ────────────────────────────────────────────────────────────────
  infoCard: {
    alignSelf: 'stretch',
    backgroundColor: '#f8f8f8',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  detailIcon: {marginRight: 12},
  detailLabel: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  detailValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
    textAlign: 'right',
    flexShrink: 1,
  },
  highlightBadge: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  highlightText: {color: '#fff', fontSize: 10, fontWeight: '700'},
  rowDivider: {height: 1, backgroundColor: '#eee'},

  // ── Nose scan image ──────────────────────────────────────────────────────────
  noseScanWrap: {
    alignSelf: 'stretch',
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  noseScanImg: {width: '100%', height: '100%'},

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

  // ── Scan again ───────────────────────────────────────────────────────────────
  scanAgainBtn: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Secondry,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    marginTop: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  scanAgainBtnText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
