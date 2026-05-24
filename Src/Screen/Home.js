import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {color} from '../Color';
import {
  fetchAnimals,
  deleteAnimal,
  clearAnimalMessages,
} from '../Redux/Slices/animalSlice';
import {logoutUser} from '../Redux/Slices/authSlice';
import {showAlert} from '../Utils/SweetAlert';
import {resolveImageUrl} from '../Utils/imageHelper';

const {width} = Dimensions.get('window');

export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const {list: animals, loading, error, page, totalPages} = useSelector(
    s => s.animals,
  );
  const {user} = useSelector(s => s.auth);

  const animation = useRef(new Animated.Value(-width * 0.72)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Fetch animals on first mount and every time the screen gets focus ────
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      setCurrentPage(1);
      dispatch(fetchAnimals(1));
    });
    dispatch(fetchAnimals(1));
    return unsub;
  }, [navigation, dispatch]);

  // ─── Show fetch error once ────────────────────────────────────────────────
  useEffect(() => {
    if (!error) {
      return;
    }
    showAlert({
      title: 'Error',
      message: typeof error === 'string' ? error : 'Could not load animals.',
      type: 'error',
      confirmText: 'OK',
      onConfirm: () => dispatch(clearAnimalMessages()),
    });
  }, [error, dispatch]);

  // ─── Drawer helpers ───────────────────────────────────────────────────────
  const toggleDrawer = () => {
    Animated.timing(animation, {
      toValue: drawerOpen ? -width * 0.72 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setDrawerOpen(prev => !prev);
  };

  const navigateTo = screen => {
    toggleDrawer();
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    toggleDrawer();
    showAlert({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      type: 'confirm',
      confirmText: 'Yes, Logout',
      cancelText: 'Cancel',
      onConfirm: () => dispatch(logoutUser()),
    });
  };

  // ─── Pagination helpers ───────────────────────────────────────────────────
  const goToPage = pg => {
    setCurrentPage(pg);
    dispatch(fetchAnimals(pg));
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

  // ─── Delete with confirmation ─────────────────────────────────────────────
  const handleDelete = item => {
    showAlert({
      title: 'Delete Animal',
      message: `Are you sure you want to delete "${item.animal_name}"? This cannot be undone.`,
      type: 'confirm',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        dispatch(deleteAnimal(item.id));
      },
    });
  };

  // ─── Edit: navigate to Addanimal with the full animal object ─────────────
  const handleEdit = item => {
    navigation.navigate('Addanimal', {animal: item});
  };

  // ─── Single animal card ───────────────────────────────────────────────────
  const renderCard = ({item}) => {
    const imgSrc = item.image ? {uri: resolveImageUrl(item.image)} : null;

    return (
      <View style={styles.card}>

        {/* Left — circular photo / icon */}
        <View style={styles.cardLeft}>
          <View style={styles.iconCircle}>
            {imgSrc ? (
              <Image source={imgSrc} style={styles.circleImg} />
            ) : (
              <FontAwesome6 name="cow" size={28} color="#fff" />
            )}
          </View>
        </View>

        {/* Right — pill-box info rows */}
        <View style={styles.cardRight}>

          {/* Row 1: animal name | registration date */}
          <View style={styles.infoRow}>
            <View style={styles.boxLarge}>
              <Text style={styles.boxText} numberOfLines={1}>
                {item.animal_name}
              </Text>
            </View>
            <View style={styles.boxSmall}>
              <Text style={styles.boxText} numberOfLines={1}>
                {item.registration_date}
              </Text>
            </View>
          </View>

          {/* Row 2: owner name | category */}
          <View style={styles.infoRow}>
            <View style={styles.boxLarge}>
              <Text style={styles.boxText} numberOfLines={1}>
                {item.owner_name || '—'}
              </Text>
            </View>
            <View style={styles.boxSmall}>
              <Text style={styles.boxText} numberOfLines={1}>
                {item.category_display || item.category}
              </Text>
            </View>
          </View>

          {/* Row 3: gender | age */}
          <View style={styles.infoRow}>
            <View style={styles.boxLarge}>
              <Text style={styles.boxText} numberOfLines={1}>
                {item.gender_display || item.gender}
              </Text>
            </View>
            <View style={styles.boxSmall}>
              <Text style={styles.boxText} numberOfLines={1}>
                {item.age} months
              </Text>
            </View>
          </View>

          {/* Edit / Delete */}
          <View style={styles.cardBtnRow}>
            <TouchableOpacity
              style={styles.cardEditBtn}
              onPress={() => handleEdit(item)}>
              <MaterialIcons name="edit" size={13} color={color.Secondry} />
              <Text style={[styles.cardBtnText, {color: color.Secondry}]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cardDeleteBtn}
              onPress={() => handleDelete(item)}>
              <MaterialIcons name="delete" size={13} color="#fff" />
              <Text style={styles.cardBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  };

  // ─── Pagination controls ──────────────────────────────────────────────────
  const renderPagination = () => {
    if (totalPages <= 1 || animals.length === 0) {
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

  // ─── Empty state ──────────────────────────────────────────────────────────
  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyWrap}>
        <FontAwesome6
          name="cow"
          size={60}
          color={color.Secondry}
          style={{opacity: 0.4}}
        />
        <Text style={styles.emptyText}>No animals added yet.</Text>
        <Text style={styles.emptyHint}>
          Tap the + button to add your first animal.
        </Text>
      </View>
    );
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer}>
          <MaterialIcons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Animals</Text>
        <TouchableOpacity onPress={() => goToPage(1)}>
          <Ionicons name="refresh" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Full-screen loader on first fetch */}
      {loading && animals.length === 0 ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={color.Secondry} />
          <Text style={{color: color.Secondry, marginTop: 10}}>
            Loading animals…
          </Text>
        </View>
      ) : (
        <FlatList
          data={animals}
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

      {/* Floating Add button */}
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => navigation.navigate('Addanimal')}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Overlay to close drawer */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Side Drawer */}
      <Animated.View style={[styles.drawer, {left: animation}]}>
        {/* Drawer header with user info */}
        <View style={styles.drawerHeader}>
          <View style={styles.drawerAvatar}>
            <MaterialIcons name="person" size={32} color="#fff" />
          </View>
          <Text style={styles.drawerUsername} numberOfLines={1}>
            {user?.full_name || 'User'}
          </Text>
          <Text style={styles.drawerEmail} numberOfLines={1}>
            {user?.email || ''}
          </Text>
        </View>

        <TouchableOpacity style={styles.drawerItem} onPress={toggleDrawer}>
          <Entypo name="home" size={22} color={color.Secondry} />
          <Text style={styles.drawerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateTo('Profile')}>
          <MaterialIcons name="person" size={22} color={color.Secondry} />
          <Text style={styles.drawerText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateTo('Editprofile')}>
          <MaterialIcons name="edit" size={22} color={color.Secondry} />
          <Text style={styles.drawerText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateTo('Sale')}>
          <MaterialIcons name="sell" size={22} color={color.Secondry} />
          <Text style={styles.drawerText}>Sale Animal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateTo('AppInfo')}>
          <MaterialIcons name="info" size={22} color={color.Secondry} />
          <Text style={styles.drawerText}>App Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateTo('Contactus')}>
          <MaterialIcons
            name="contact-phone"
            size={22}
            color={color.Secondry}
          />
          <Text style={styles.drawerText}>Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateTo('PrivacyPolicy')}>
          <MaterialIcons name="privacy-tip" size={22} color={color.Secondry} />
          <Text style={styles.drawerText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateTo('TermsCondition')}>
          <MaterialIcons name="description" size={22} color={color.Secondry} />
          <Text style={styles.drawerText}>Terms & Conditions</Text>
        </TouchableOpacity>

        <View style={styles.drawerDivider} />

        <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
          <AntDesign name="logout" size={22} color="red" />
          <Text style={[styles.drawerText, {color: 'red'}]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
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
    paddingHorizontal: 20,
  },
  headerTitle: {fontSize: 22, color: '#fff', fontWeight: 'bold'},

  loaderWrap: {flex: 1, justifyContent: 'center', alignItems: 'center'},

  listContent: {padding: 12, paddingBottom: 90},

  // ── Animal card ────────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    backgroundColor: color.Secondry,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    alignItems: 'center',
  },
  cardLeft: {
    width: '22%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleImg: {width: 62, height: 62, borderRadius: 31},
  cardRight: {flex: 1, gap: 6},
  infoRow: {flexDirection: 'row', gap: 6},
  boxLarge: {
    flex: 1.8,
    height: 32,
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  boxSmall: {
    flex: 1,
    height: 32,
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  boxText: {color: '#fff', fontWeight: '700', fontSize: 11},
  cardBtnRow: {flexDirection: 'row', gap: 6, marginTop: 2},
  cardEditBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    gap: 4,
  },
  cardDeleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    backgroundColor: '#e53935',
    borderRadius: 20,
    gap: 4,
  },
  cardBtnText: {color: '#fff', fontWeight: '700', fontSize: 12},

  // ── Empty state ────────────────────────────────────────────────────────────
  emptyWrap: {alignItems: 'center', marginTop: 80},
  emptyText: {fontSize: 18, fontWeight: '700', color: '#888', marginTop: 16},
  emptyHint: {fontSize: 14, color: '#bbb', marginTop: 6},

  // ── Floating button ────────────────────────────────────────────────────────
  floatingBtn: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },

  // ── Overlay ────────────────────────────────────────────────────────────────
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 5,
  },

  // ── Drawer ─────────────────────────────────────────────────────────────────
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.72,
    backgroundColor: '#fff',
    elevation: 10,
    zIndex: 10,
  },
  drawerHeader: {
    backgroundColor: color.Secondry,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  drawerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  drawerUsername: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  drawerEmail: {color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2},

  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  drawerText: {marginLeft: 16, fontSize: 15, color: '#333'},
  drawerDivider: {height: 1, backgroundColor: '#eee', marginVertical: 4},

  // ── Pagination ─────────────────────────────────────────────────────────────
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
