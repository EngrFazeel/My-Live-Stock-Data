import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {color} from '../../Color';
import {
  fetchTransfers,
  clearTransferMessages,
} from '../../Redux/Slices/transferSlice';
import {showAlert} from '../../Utils/SweetAlert';
import {resolveImageUrl} from '../../Utils/imageHelper';

const DRAWER_ICON = 'swap-horiz';

export default function MyTransfersScreen({navigation}) {
  const dispatch = useDispatch();
  const {transfers, loading, error, success, totalPages} = useSelector(
    s => s.transfer,
  );
  const [currentPage, setCurrentPage] = useState(1);

  // ── Load on mount and focus ───────────────────────────────────────────────
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      setCurrentPage(1);
      dispatch(fetchTransfers(1));
    });
    dispatch(fetchTransfers(1));
    return unsub;
  }, [navigation, dispatch]);

  // ── Success / error alerts ────────────────────────────────────────────────
  useEffect(() => {
    if (!success) {
      return;
    }
    showAlert({
      title: 'Done',
      message: success,
      type: 'success',
      confirmText: 'OK',
      onConfirm: () => dispatch(clearTransferMessages()),
    });
  }, [success, dispatch]);

  useEffect(() => {
    if (!error) {
      return;
    }
    showAlert({
      title: 'Error',
      message: typeof error === 'string' ? error : 'Something went wrong.',
      type: 'error',
      confirmText: 'OK',
      onConfirm: () => dispatch(clearTransferMessages()),
    });
  }, [error, dispatch]);

  // ── Pagination helpers ────────────────────────────────────────────────────
  const goToPage = pg => {
    setCurrentPage(pg);
    dispatch(fetchTransfers(pg));
  };

  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // ── Status color ──────────────────────────────────────────────────────────
  const statusColor = status => {
    switch (status) {
      case 'completed':  return '#2e7d32';
      case 'pending':    return '#e65100';
      case 'cancelled':  return '#c62828';
      default:           return '#555';
    }
  };

  // ── Single card ───────────────────────────────────────────────────────────
  const renderCard = ({item}) => {
    const tImg = item.image ? {uri: resolveImageUrl(item.image)} : null;
    const dateStr = item.transfer_date
      ? new Date(item.transfer_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '—';

    return (
      <View style={styles.card}>
        {/* Left image / icon */}
        <View style={styles.cardImgWrap}>
          {tImg ? (
            <Image source={tImg} style={styles.cardImg} resizeMode="cover" />
          ) : (
            <View style={styles.cardImgPlaceholder}>
              <MaterialIcons name={DRAWER_ICON} size={30} color="#fff" />
            </View>
          )}
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          {/* Row 1: animal name + status */}
          <View style={styles.cardTopRow}>
            <Text style={styles.cardAnimalName} numberOfLines={1}>
              {item.animal_name}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: statusColor(item.status)},
              ]}>
              <Text style={styles.statusText}>{item.status_display}</Text>
            </View>
          </View>

          {/* Row 2: from → to */}
          <View style={styles.fromToRow}>
            <MaterialIcons name="person-outline" size={14} color="#888" />
            <Text style={styles.fromToText} numberOfLines={1}>
              {item.from_user_name}
            </Text>
            <MaterialIcons name="arrow-forward" size={14} color={color.Secondry} />
            <Text style={styles.fromToText} numberOfLines={1}>
              {item.to_user_name}
            </Text>
          </View>

          {/* Row 3: phone + date */}
          <View style={styles.metaRow}>
            <MaterialIcons name="phone" size={13} color="#aaa" />
            <Text style={styles.metaText}>{item.phone_number}</Text>
            <View style={styles.metaDot} />
            <MaterialIcons name="calendar-today" size={13} color="#aaa" />
            <Text style={styles.metaText}>{dateStr}</Text>
          </View>
        </View>

      </View>
    );
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyWrap}>
        <MaterialIcons name={DRAWER_ICON} size={60} color="#ccc" />
        <Text style={styles.emptyTitle}>No Transfers Yet</Text>
        <Text style={styles.emptyHint}>
          Animals you transfer will appear here.
        </Text>
      </View>
    );
  };

  // ── Pagination ────────────────────────────────────────────────────────────
  const renderPagination = () => {
    if (totalPages <= 1 || transfers.length === 0) {
      return null;
    }
    return (
      <View style={styles.paginationWrap}>
        <TouchableOpacity
          style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
          disabled={currentPage === 1}
          onPress={() => goToPage(currentPage - 1)}>
          <MaterialIcons
            name="chevron-left"
            size={22}
            color={currentPage === 1 ? '#ccc' : color.Secondry}
          />
        </TouchableOpacity>

        {getPageNumbers().map(n => (
          <TouchableOpacity
            key={n}
            style={[styles.pageBtn, n === currentPage && styles.pageBtnActive]}
            onPress={() => goToPage(n)}>
            <Text
              style={[
                styles.pageBtnText,
                n === currentPage && styles.pageBtnTextActive,
              ]}>
              {n}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.pageBtn,
            currentPage === totalPages && styles.pageBtnDisabled,
          ]}
          disabled={currentPage === totalPages}
          onPress={() => goToPage(currentPage + 1)}>
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={currentPage === totalPages ? '#ccc' : color.Secondry}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Transfers</Text>
        <TouchableOpacity onPress={() => goToPage(1)}>
          <MaterialIcons name="refresh" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Full-screen loader */}
      {loading && transfers.length === 0 ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={color.Secondry} />
          <Text style={styles.loaderText}>Loading transfers…</Text>
        </View>
      ) : (
        <FlatList
          data={transfers}
          keyExtractor={item => String(item.id)}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderPagination}
          refreshing={loading}
          onRefresh={() => goToPage(1)}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0'},

  header: {
    height: 60,
    backgroundColor: color.Secondry,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {fontSize: 20, color: '#fff', fontWeight: 'bold'},

  loaderWrap: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loaderText: {color: color.Secondry, marginTop: 10},

  listContent: {padding: 14, paddingBottom: 30},

  // ── Card ────────────────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    alignItems: 'center',
  },
  cardImgWrap: {width: 80, height: 90},
  cardImg: {width: '100%', height: '100%'},
  cardImgPlaceholder: {
    flex: 1,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {flex: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 5},

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardAnimalName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {color: '#fff', fontSize: 11, fontWeight: '700'},

  fromToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  fromToText: {
    flex: 1,
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {fontSize: 11, color: '#999'},
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },

  // ── Empty ────────────────────────────────────────────────────────────────────
  emptyWrap: {alignItems: 'center', marginTop: 80},
  emptyTitle: {fontSize: 18, fontWeight: '700', color: '#888', marginTop: 14},
  emptyHint: {fontSize: 13, color: '#bbb', marginTop: 6, textAlign: 'center'},

  // ── Pagination ───────────────────────────────────────────────────────────────
  paginationWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  pageBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  pageBtnActive: {backgroundColor: color.Secondry},
  pageBtnDisabled: {borderColor: '#ddd', backgroundColor: '#f5f5f5'},
  pageBtnText: {color: color.Secondry, fontWeight: '700', fontSize: 14},
  pageBtnTextActive: {color: '#fff'},
});
