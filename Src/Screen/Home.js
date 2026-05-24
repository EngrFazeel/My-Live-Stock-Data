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
  const {list: animals, loading, error} = useSelector(s => s.animals);
  const {user} = useSelector(s => s.auth);

  const animation = useRef(new Animated.Value(-width * 0.6)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ─── Fetch animals on first mount and every time the screen gets focus ────
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      dispatch(fetchAnimals());
    });
    dispatch(fetchAnimals());
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
      toValue: drawerOpen ? -width * 0.6 : 0,
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
        {/* Left: animal photo */}
        <View style={styles.cardImgWrap}>
          {imgSrc ? (
            <Image source={imgSrc} style={styles.cardImg} />
          ) : (
            <View style={styles.cardImgPlaceholder}>
              <FontAwesome6 name="cow" size={30} color="#fff" />
            </View>
          )}
        </View>

        {/* Right: details */}
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.animal_name}
          </Text>

          <View style={styles.cardTagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {item.category_display || item.category}
              </Text>
            </View>
            <View
              style={[
                styles.tag,
                {
                  backgroundColor:
                    item.gender === 'male' ? '#1565c0' : '#ad1457',
                },
              ]}>
              <Text style={styles.tagText}>
                {item.gender_display || item.gender}
              </Text>
            </View>
          </View>

          <Text style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>Breed: </Text>
            {item.breed}
          </Text>
          <Text style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>Age: </Text>
            {item.age} months
          </Text>
          <Text style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>Date: </Text>
            {item.registration_date}
          </Text>
          {item.owner_name ? (
            <Text style={styles.cardDetail} numberOfLines={1}>
              <Text style={styles.cardDetailLabel}>Owner: </Text>
              {item.owner_name}
            </Text>
          ) : null}

          {/* Edit / Delete buttons */}
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => handleEdit(item)}>
              <MaterialIcons name="edit" size={15} color="#fff" />
              <Text style={styles.actionBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}>
              <MaterialIcons name="delete" size={15} color="#fff" />
              <Text style={styles.actionBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
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
        <TouchableOpacity onPress={() => dispatch(fetchAnimals())}>
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
          refreshing={loading}
          onRefresh={() => dispatch(fetchAnimals())}
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
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  cardImgWrap: {
    width: 100,
    height: '100%',
    minHeight: 150,
  },
  cardImg: {width: 100, height: '100%', minHeight: 150},
  cardImgPlaceholder: {
    width: 100,
    minHeight: 150,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardBody: {flex: 1, padding: 12},

  cardName: {fontSize: 17, fontWeight: 'bold', color: '#222', marginBottom: 6},

  cardTagRow: {flexDirection: 'row', gap: 6, marginBottom: 6},
  tag: {
    backgroundColor: color.Secondry,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {color: '#fff', fontSize: 11, fontWeight: '700'},

  cardDetail: {fontSize: 13, color: '#555', marginBottom: 2},
  cardDetailLabel: {fontWeight: '700', color: '#333'},

  cardActions: {flexDirection: 'row', marginTop: 10, gap: 8},
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.Secondry,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {color: '#fff', fontWeight: '700', fontSize: 13},

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
});
